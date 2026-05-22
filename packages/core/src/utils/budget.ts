export interface DailyStats {
  date: string
  cost: number
  saved: number
  tokens: number
}

export function getDailyAverage(stats: DailyStats[], days = 7): number {
  if (stats.length === 0) return 0
  const total = stats.slice(0, days).reduce((sum, d) => sum + d.cost, 0)
  return total / Math.min(days, stats.length)
}

export function computeBudgetETA(
  currentSpent: number,
  budget: number,
  dailyAverage: number,
): number {
  const remaining = budget - currentSpent
  if (remaining <= 0) return 0
  if (dailyAverage <= 0) return 999
  return Math.floor(remaining / dailyAverage)
}

export function computeBudgetPct(currentSpent: number, budget: number): number {
  if (budget <= 0) return 0
  return Math.min(100, Math.round((currentSpent / budget) * 100))
}
