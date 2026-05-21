import { v4 as uuidv4 } from 'uuid'
import type { QueryEventsOptions, StatsResult, TrimlyEvent, TrimlyEventInsert, TrimlySession } from '../../types/events.js'
import { CREATE_TABLES_SQL, ENABLE_WAL_SQL } from '../schema.js'
import type { TrimlyStorage } from '../types.js'

/** node:sqlite is only available in Node 22.5+. */
type NodeSqliteDb = {
  exec(sql: string): void
  prepare(sql: string): {
    run(...args: unknown[]): { lastInsertRowid: unknown; changes: number }
    get(...args: unknown[]): Record<string, unknown> | undefined
    all(...args: unknown[]): Record<string, unknown>[]
  }
  close(): void
}

function rowToEvent(row: Record<string, unknown>): TrimlyEvent {
  return {
    id: String(row['id']),
    session_id: String(row['session_id'] ?? ''),
    timestamp: Number(row['timestamp']),
    source: row['source'] as TrimlyEvent['source'],
    provider: String(row['provider']),
    model: String(row['model']),
    tokens_input: Number(row['tokens_input'] ?? 0),
    tokens_output: Number(row['tokens_output'] ?? 0),
    tokens_cache_read: Number(row['tokens_cache_read'] ?? 0),
    tokens_cache_write: Number(row['tokens_cache_write'] ?? 0),
    tokens_saved_optim: Number(row['tokens_saved_optim'] ?? 0),
    tokens_saved_shadow: Number(row['tokens_saved_shadow'] ?? 0),
    cost_usd: Number(row['cost_usd'] ?? 0),
    cost_saved_usd: Number(row['cost_saved_usd'] ?? 0),
    cost_saved_shadow_usd: Number(row['cost_saved_shadow_usd'] ?? 0),
    duration_ms: row['duration_ms'] != null ? Number(row['duration_ms']) : null,
    status: row['status'] as TrimlyEvent['status'],
    filler_detected: Boolean(row['filler_detected']),
    strategies_applied: row['strategies_applied']
      ? JSON.parse(String(row['strategies_applied']))
      : [],
    prompt_preview: row['prompt_preview'] != null ? String(row['prompt_preview']) : null,
    tags: row['tags'] != null ? String(row['tags']) : null,
  }
}

export class NodeSqliteStorage implements TrimlyStorage {
  private db: NodeSqliteDb | null = null

  constructor(private readonly path: string) {}

  async init(): Promise<void> {
    // Dynamic import to avoid crashing on Node < 22.5
    const { DatabaseSync } = await import('node:sqlite' as string)
    this.db = new DatabaseSync(this.path) as NodeSqliteDb
    this.db.exec(ENABLE_WAL_SQL)
    this.db.exec(CREATE_TABLES_SQL)
  }

  async close(): Promise<void> {
    this.db?.close()
    this.db = null
  }

  private get _db(): NodeSqliteDb {
    if (!this.db) throw new Error('Storage not initialized')
    return this.db
  }

  async recordEvent(event: TrimlyEventInsert): Promise<string> {
    const id = event.id ?? uuidv4()
    this._db
      .prepare(
        `INSERT INTO events (
          id, session_id, timestamp, source, provider, model,
          tokens_input, tokens_output, tokens_cache_read, tokens_cache_write,
          tokens_saved_optim, tokens_saved_shadow,
          cost_usd, cost_saved_usd, cost_saved_shadow_usd,
          duration_ms, status, filler_detected, strategies_applied, prompt_preview, tags
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      )
      .run(
        id,
        event.session_id,
        event.timestamp,
        event.source,
        event.provider,
        event.model,
        event.tokens_input,
        event.tokens_output ?? 0,
        event.tokens_cache_read ?? 0,
        event.tokens_cache_write ?? 0,
        event.tokens_saved_optim ?? 0,
        event.tokens_saved_shadow ?? 0,
        event.cost_usd,
        event.cost_saved_usd ?? 0,
        event.cost_saved_shadow_usd ?? 0,
        event.duration_ms ?? null,
        event.status ?? 'completed',
        event.filler_detected ? 1 : 0,
        JSON.stringify(event.strategies_applied ?? []),
        event.prompt_preview ?? null,
        event.tags ?? null,
      )
    return id
  }

  async updateEvent(id: string, patch: Partial<TrimlyEvent>): Promise<void> {
    const sets: string[] = []
    const args: unknown[] = []

    for (const [key, value] of Object.entries(patch)) {
      if (key === 'id') continue
      sets.push(`${key} = ?`)
      if (key === 'strategies_applied' && Array.isArray(value)) {
        args.push(JSON.stringify(value))
      } else if (key === 'filler_detected') {
        args.push(value ? 1 : 0)
      } else {
        args.push(value)
      }
    }

    if (sets.length === 0) return
    args.push(id)
    this._db.prepare(`UPDATE events SET ${sets.join(', ')} WHERE id = ?`).run(...args)
  }

  async queryEvents(options: QueryEventsOptions = {}): Promise<TrimlyEvent[]> {
    const conditions: string[] = []
    const args: unknown[] = []

    if (options.session_id) {
      conditions.push('session_id = ?')
      args.push(options.session_id)
    }
    if (options.source) {
      conditions.push('source = ?')
      args.push(options.source)
    }
    if (options.status) {
      conditions.push('status = ?')
      args.push(options.status)
    }
    if (options.cursor) {
      conditions.push('timestamp < ?')
      args.push(options.cursor)
    }
    if (options.days) {
      conditions.push('timestamp >= ?')
      args.push(Date.now() - options.days * 86400_000)
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    const limit = options.limit ?? 100
    args.push(limit)

    const rows = this._db
      .prepare(`SELECT * FROM events ${where} ORDER BY timestamp DESC LIMIT ?`)
      .all(...args)

    return rows.map(rowToEvent)
  }

  async getStats(options: { days?: number; source?: string } = {}): Promise<StatsResult> {
    const conditions: string[] = []
    const args: unknown[] = []

    if (options.days) {
      conditions.push('timestamp >= ?')
      args.push(Date.now() - options.days * 86400_000)
    }
    if (options.source) {
      conditions.push('source = ?')
      args.push(options.source)
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    const t = this._db
      .prepare(
        `SELECT
          COUNT(*) as total_requests,
          SUM(tokens_input) as total_tokens_input,
          SUM(tokens_output) as total_tokens_output,
          SUM(cost_usd) as total_cost_usd,
          SUM(cost_saved_usd) as total_saved_usd
        FROM events ${where}`,
      )
      .get(...args)

    const modelRows = this._db
      .prepare(
        `SELECT model, COUNT(*) as requests, SUM(cost_usd) as cost
        FROM events ${where} GROUP BY model`,
      )
      .all(...args)

    return {
      totalRequests: Number(t?.['total_requests'] ?? 0),
      totalTokensInput: Number(t?.['total_tokens_input'] ?? 0),
      totalTokensOutput: Number(t?.['total_tokens_output'] ?? 0),
      totalCostUsd: Number(t?.['total_cost_usd'] ?? 0),
      totalSavedUsd: Number(t?.['total_saved_usd'] ?? 0),
      byModel: Object.fromEntries(
        modelRows.map((r) => [
          String(r['model']),
          { requests: Number(r['requests']), cost: Number(r['cost']) },
        ]),
      ),
    }
  }

  async upsertSession(session: Partial<TrimlySession> & { id: string; source: TrimlySession['source']; started_at: number }): Promise<void> {
    this._db
      .prepare(
        `INSERT INTO sessions (id, source, started_at, ended_at, cwd, total_tokens_input, total_tokens_output, total_cost_usd)
        VALUES (?,?,?,?,?,?,?,?)
        ON CONFLICT(id) DO UPDATE SET
          ended_at = COALESCE(excluded.ended_at, ended_at),
          cwd = COALESCE(excluded.cwd, cwd)`,
      )
      .run(
        session.id,
        session.source,
        session.started_at,
        session.ended_at ?? null,
        session.cwd ?? null,
        session.total_tokens_input ?? 0,
        session.total_tokens_output ?? 0,
        session.total_cost_usd ?? 0,
      )
  }

  async updateSession(id: string, patch: Partial<TrimlySession>): Promise<void> {
    const sets: string[] = []
    const args: unknown[] = []

    for (const [key, value] of Object.entries(patch)) {
      if (key === 'id') continue
      sets.push(`${key} = ?`)
      args.push(value)
    }

    if (sets.length === 0) return
    args.push(id)
    this._db.prepare(`UPDATE sessions SET ${sets.join(', ')} WHERE id = ?`).run(...args)
  }
}
