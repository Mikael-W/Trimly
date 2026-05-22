export function computeETA(monthCost, budgetAmount, daily) {
  if (!budgetAmount || budgetAmount <= 0) return null
  const remaining = budgetAmount - monthCost
  if (remaining <= 0) return 0

  const dailyAvg = getDailyAverage(daily, 7)
  if (dailyAvg <= 0) return 999
  return Math.floor(remaining / dailyAvg)
}

export function computeBudgetPct(monthCost, budgetAmount) {
  if (!budgetAmount || budgetAmount <= 0) return null
  return Math.min(100, Math.round((monthCost / budgetAmount) * 100))
}

function getDailyAverage(daily, days) {
  if (!daily || daily.length === 0) return 0
  const slice = daily.slice(0, days)
  return slice.reduce((s, d) => s + d.cost, 0) / slice.length
}

export function computeTrend(daily) {
  if (!daily || daily.length < 2) return null
  const today = daily[0]?.cost ?? 0
  const yesterday = daily[1]?.cost ?? 0
  if (yesterday === 0) return null
  const pct = Math.round(((today - yesterday) / yesterday) * 100)
  return pct
}
