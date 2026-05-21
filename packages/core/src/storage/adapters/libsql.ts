import { createClient, type InValue } from '@libsql/client'
import { v4 as uuidv4 } from 'uuid'
import type { QueryEventsOptions, StatsResult, TrimlyEvent, TrimlyEventInsert, TrimlySession } from '../../types/events.js'
import { CREATE_TABLES_SQL, ENABLE_WAL_SQL } from '../schema.js'
import type { TrimlyStorage } from '../types.js'

type LibsqlClient = ReturnType<typeof createClient>

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

function toInValue(v: unknown): InValue {
  if (v === null || v === undefined) return null
  if (typeof v === 'boolean') return v ? 1 : 0
  if (typeof v === 'string' || typeof v === 'number' || typeof v === 'bigint') return v
  return String(v)
}

export class LibsqlStorage implements TrimlyStorage {
  private client: LibsqlClient

  constructor(private readonly path: string) {
    const url = path === ':memory:' ? ':memory:' : `file:${path}`
    this.client = createClient({ url })
  }

  async init(): Promise<void> {
    await this.client.executeMultiple(ENABLE_WAL_SQL + CREATE_TABLES_SQL)
  }

  async close(): Promise<void> {
    this.client.close()
  }

  private async exec(sql: string, args: unknown[] = []): Promise<ReturnType<LibsqlClient['execute']>> {
    return this.client.execute({ sql, args: args.map(toInValue) })
  }

  async recordEvent(event: TrimlyEventInsert): Promise<string> {
    const id = event.id ?? uuidv4()
    await this.exec(
      `INSERT INTO events (
        id, session_id, timestamp, source, provider, model,
        tokens_input, tokens_output, tokens_cache_read, tokens_cache_write,
        tokens_saved_optim, tokens_saved_shadow,
        cost_usd, cost_saved_usd, cost_saved_shadow_usd,
        duration_ms, status, filler_detected, strategies_applied, prompt_preview, tags
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
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
      ],
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
    await this.exec(`UPDATE events SET ${sets.join(', ')} WHERE id = ?`, args)
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

    const result = await this.exec(
      `SELECT * FROM events ${where} ORDER BY timestamp DESC LIMIT ?`,
      args,
    )

    return result.rows.map((r) => rowToEvent(r as Record<string, unknown>))
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

    const [totals, byModel] = await Promise.all([
      this.exec(
        `SELECT
          COUNT(*) as total_requests,
          SUM(tokens_input) as total_tokens_input,
          SUM(tokens_output) as total_tokens_output,
          SUM(cost_usd) as total_cost_usd,
          SUM(cost_saved_usd) as total_saved_usd
        FROM events ${where}`,
        args,
      ),
      this.exec(
        `SELECT model, COUNT(*) as requests, SUM(cost_usd) as cost
        FROM events ${where} GROUP BY model`,
        args,
      ),
    ])

    const t = totals.rows[0] as Record<string, unknown> | undefined

    return {
      totalRequests: Number(t?.['total_requests'] ?? 0),
      totalTokensInput: Number(t?.['total_tokens_input'] ?? 0),
      totalTokensOutput: Number(t?.['total_tokens_output'] ?? 0),
      totalCostUsd: Number(t?.['total_cost_usd'] ?? 0),
      totalSavedUsd: Number(t?.['total_saved_usd'] ?? 0),
      byModel: Object.fromEntries(
        byModel.rows.map((r) => {
          const row = r as Record<string, unknown>
          return [
            String(row['model']),
            { requests: Number(row['requests']), cost: Number(row['cost']) },
          ]
        }),
      ),
    }
  }

  async upsertSession(
    session: Partial<TrimlySession> & {
      id: string
      source: TrimlySession['source']
      started_at: number
    },
  ): Promise<void> {
    await this.exec(
      `INSERT INTO sessions (id, source, started_at, ended_at, cwd, total_tokens_input, total_tokens_output, total_cost_usd)
        VALUES (?,?,?,?,?,?,?,?)
        ON CONFLICT(id) DO UPDATE SET
          ended_at = COALESCE(excluded.ended_at, ended_at),
          cwd = COALESCE(excluded.cwd, cwd)`,
      [
        session.id,
        session.source,
        session.started_at,
        session.ended_at ?? null,
        session.cwd ?? null,
        session.total_tokens_input ?? 0,
        session.total_tokens_output ?? 0,
        session.total_cost_usd ?? 0,
      ],
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
    await this.exec(`UPDATE sessions SET ${sets.join(', ')} WHERE id = ?`, args)
  }
}
