import { c, budgetColor, fillerColor, DIM, BRIGHT_GREEN, RESET } from '../render/colors.mjs'
import { formatCost } from '../render/format.mjs'
import { computeETA, computeBudgetPct, computeTrend } from '../data/budget.mjs'

/**
 * Mode "compact" — 1 ligne :
 * 💰 €0.42 today (▲ +12%) │ ⚠ 32% filler detected
 */
export function renderCompact(data, config) {
  const { todayCost, todaySaved, daily, monthCost, lastFillerPct } = data
  const currency = config.currency ?? 'USD'
  const budget = config.budget?.monthly?.amount ?? 0
  const budgetCurrency = config.budget?.monthly?.currency ?? currency

  const parts = []

  // Cost today
  const costStr = formatCost(todayCost, budgetCurrency)
  let costLine = `💰 ${costStr} today`

  // Trend
  const trend = computeTrend(daily)
  if (trend !== null) {
    const arrow = trend > 0 ? '▲' : '▼'
    const sign = trend > 0 ? '+' : ''
    const trendColor = trend > 0 ? '\x1b[93m' : '\x1b[92m'
    costLine += ` ${c(trendColor, `(${arrow} ${sign}${trend}%)`)}`
  }

  // Budget %
  if (budget > 0) {
    const pct = computeBudgetPct(monthCost, budget)
    costLine += ` ${c(budgetColor(pct), `${pct}% budget`)}`
  }

  parts.push(costLine)

  // Savings
  if (todaySaved > 0) {
    parts.push(`${c(BRIGHT_GREEN, `💎 saved ${formatCost(todaySaved, budgetCurrency)}`)}`)
  }

  // Filler
  if (lastFillerPct > 0) {
    parts.push(`${c(fillerColor(lastFillerPct), `⚠ ${lastFillerPct}% filler`)}`)
  }

  return parts.join(' │ ')
}
