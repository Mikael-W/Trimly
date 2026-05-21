export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const days = query['days'] ? Number(query['days']) : 30

  const storage = await getStorage()
  const events = await storage.queryEvents({ days, limit: 50_000 })

  let totalSavedUsd = 0
  let totalTokensSaved = 0
  let totalTokens = 0

  const byModel: Record<string, { tokensSaved: number; costSaved: number; events: number }> = {}
  const byDay = new Map<string, { date: string; costSaved: number }>()

  for (const e of events) {
    totalTokens += e.tokens_input + e.tokens_output
    totalSavedUsd += e.cost_saved_usd ?? 0
    totalTokensSaved += e.tokens_saved_optim ?? 0

    if ((e.tokens_saved_optim ?? 0) > 0) {
      byModel[e.model] ??= { tokensSaved: 0, costSaved: 0, events: 0 }
      byModel[e.model]!.tokensSaved += e.tokens_saved_optim ?? 0
      byModel[e.model]!.costSaved += e.cost_saved_usd ?? 0
      byModel[e.model]!.events++

      const d = new Date(e.timestamp).toISOString().slice(0, 10)
      const entry = byDay.get(d) ?? { date: d, costSaved: 0 }
      entry.costSaved += e.cost_saved_usd ?? 0
      byDay.set(d, entry)
    }
  }

  const savingsRate = totalTokens > 0 ? (totalTokensSaved / totalTokens) * 100 : 0

  return {
    totalSavedUsd,
    totalTokensSaved,
    savingsRate,
    byModel,
    timeline: Array.from(byDay.values()).sort((a, b) => a.date.localeCompare(b.date)),
  }
})
