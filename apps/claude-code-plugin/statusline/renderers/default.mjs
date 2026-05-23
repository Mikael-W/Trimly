import { computeBudgetPct, computeETA, computeTrend } from '../data/budget.mjs'
import {
  BRIGHT_GREEN,
  BRIGHT_YELLOW,
  DIM,
  RESET,
  budgetColor,
  c,
  fillerColor,
} from '../render/colors.mjs'
import { formatCost, progressBar, sparkline } from '../render/format.mjs'

export function renderDefault(data, config) {
  const { todayCost, todaySaved, daily, monthCost, lastFillerPct } = data
  const currency = config.currency ?? 'USD'
  const budget = config.budget?.monthly?.amount ?? 0
  const budgetCurrency = config.budget?.monthly?.currency ?? currency

  const lines = []

  let line1 = ''

  if (budget > 0) {
    const pct = computeBudgetPct(monthCost, budget)
    const eta = computeETA(monthCost, budget, daily)
    const etaStr = eta !== null ? ` (ETA: ${eta === 999 ? '∞' : `${eta}d`})` : ''
    const costOfMonth = formatCost(monthCost, budgetCurrency)
    const budgetStr = formatCost(budget, budgetCurrency)
    line1 += `${c(budgetColor(pct), `💰 ${costOfMonth} / ${budgetStr}${etaStr}`)}`
  } else {
    line1 += `💰 ${formatCost(todayCost, budgetCurrency)} today`
  }

  if (daily.length > 0) {
    const values = [...daily].reverse().map((d) => d.cost)
    const spark = sparkline(values)
    line1 += `  ${c(DIM, `7d: ${spark}`)}`
  }

  lines.push(line1)

  const line2Parts = []

  if (todaySaved > 0) {
    const savedPct = todayCost > 0 ? Math.round((todaySaved / (todayCost + todaySaved)) * 100) : 0
    line2Parts.push(
      c(BRIGHT_GREEN, `💎 Saved today: ${formatCost(todaySaved, budgetCurrency)} (${savedPct}%)`),
    )
  }

  if (lastFillerPct >= 10) {
    line2Parts.push(c(fillerColor(lastFillerPct), `⚠ ${lastFillerPct}% filler in last prompt`))
  }

  if (line2Parts.length > 0) {
    lines.push(line2Parts.join(' │ '))
  }

  return lines.join('\n')
}
