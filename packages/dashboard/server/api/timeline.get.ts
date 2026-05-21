export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const days = query['days'] ? Number(query['days']) : 30

  const storage = await getStorage()
  const events = await storage.queryEvents({ days, limit: 10000 })

  const byDay = new Map<string, { date: string; cost: number; tokens: number; requests: number }>()

  for (const e of events) {
    const d = new Date(e.timestamp).toISOString().slice(0, 10)
    const entry = byDay.get(d) ?? { date: d, cost: 0, tokens: 0, requests: 0 }
    entry.cost += e.cost_usd
    entry.tokens += e.tokens_input + e.tokens_output
    entry.requests += 1
    byDay.set(d, entry)
  }

  return Array.from(byDay.values()).sort((a, b) => a.date.localeCompare(b.date))
})
