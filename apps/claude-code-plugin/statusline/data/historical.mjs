import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { homedir } from 'node:os'
import { existsSync } from 'node:fs'

const CACHE_FILE = join(homedir(), '.trimly', '.statusline-cache.json')
const CACHE_TTL_MS = 10_000

/**
 * Returns today's stats + 7-day history from SQLite,
 * using a file cache to stay under 50ms on most ticks.
 */
export async function getHistoricalData(dbPath) {
  // Fast path: return cache if fresh
  const cached = await readCache()
  if (cached) return cached

  // Slow path: query SQLite directly (synchronous, < 5ms)
  const data = await queryDb(dbPath)
  await writeCache(data)
  return data
}

async function readCache() {
  try {
    const raw = await readFile(CACHE_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    if (Date.now() - (parsed.ts ?? 0) < CACHE_TTL_MS) {
      return parsed.data
    }
  } catch {
    // no cache or parse error
  }
  return null
}

async function writeCache(data) {
  try {
    await writeFile(CACHE_FILE, JSON.stringify({ ts: Date.now(), data }))
  } catch {
    // ignore write errors
  }
}

async function queryDb(dbPath) {
  if (!dbPath || !existsSync(dbPath)) {
    return emptyData()
  }

  try {
    const { DatabaseSync } = await import('node:sqlite')
    // node:sqlite requires Node 22.5+; on older versions the import throws → caught below
    const db = new DatabaseSync(dbPath)

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todaySince = todayStart.getTime()
    const sevenDaysSince = Date.now() - 7 * 86400_000
    const monthSince = Date.now() - 30 * 86400_000

    const today = db.prepare(
      `SELECT
        COALESCE(SUM(cost_usd), 0) as cost,
        COALESCE(SUM(cost_saved_usd), 0) as saved,
        COALESCE(SUM(tokens_input + tokens_output), 0) as tokens,
        COUNT(*) as requests
      FROM events WHERE timestamp >= ? AND status = 'completed'`
    ).get(todaySince) ?? {}

    const month = db.prepare(
      `SELECT COALESCE(SUM(cost_usd), 0) as cost FROM events WHERE timestamp >= ? AND status = 'completed'`
    ).get(monthSince) ?? {}

    const dailyRows = db.prepare(
      `SELECT
        date(timestamp/1000, 'unixepoch', 'localtime') as date,
        SUM(cost_usd) as cost,
        SUM(cost_saved_usd) as saved
      FROM events
      WHERE timestamp >= ? AND status = 'completed'
      GROUP BY date ORDER BY date DESC`
    ).all(sevenDaysSince)

    // Last prompt filler stats (most recent event with filler_detected)
    const lastFiller = db.prepare(
      `SELECT tokens_input, tokens_saved_optim FROM events
      WHERE filler_detected = 1 AND status = 'completed'
      ORDER BY timestamp DESC LIMIT 1`
    ).get() ?? null

    db.close()

    const daily = dailyRows.map(r => ({
      date: String(r.date),
      cost: Number(r.cost ?? 0),
      saved: Number(r.saved ?? 0),
    }))

    const lastFillerPct = lastFiller && Number(lastFiller.tokens_input) > 0
      ? Math.round((Number(lastFiller.tokens_saved_optim) / Number(lastFiller.tokens_input)) * 100)
      : 0

    return {
      todayCost: Number(today.cost ?? 0),
      todaySaved: Number(today.saved ?? 0),
      todayTokens: Number(today.tokens ?? 0),
      todayRequests: Number(today.requests ?? 0),
      monthCost: Number(month.cost ?? 0),
      daily,
      lastFillerPct,
    }
  } catch {
    return emptyData()
  }
}

function emptyData() {
  return {
    todayCost: 0,
    todaySaved: 0,
    todayTokens: 0,
    todayRequests: 0,
    monthCost: 0,
    daily: [],
    lastFillerPct: 0,
  }
}
