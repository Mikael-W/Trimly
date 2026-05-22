import { computeBudgetPct, computeETA, computeTrend } from '../data/budget.mjs'
import {
  BRIGHT_GREEN,
  BRIGHT_YELLOW,
  CYAN,
  DIM,
  RESET,
  budgetColor,
  c,
  fillerColor,
} from '../render/colors.mjs'
import { formatCost, formatToolCall, progressBar, sparkline } from '../render/format.mjs'

export function renderVerbose(data, config, recentTools = []) {
  const { todayCost, todaySaved, daily, monthCost, todayTokens, lastFillerPct } = data
  const currency = config.currency ?? 'USD'
  const budget = config.budget?.monthly?.amount ?? 0
  const budgetCurrency = config.budget?.monthly?.currency ?? currency

  const lines = []

  let line1 = ''
  if (budget > 0) {
    const pct = computeBudgetPct(monthCost, budget)
    const eta = computeETA(monthCost, budget, daily)
    const etaStr = eta !== null ? ` · ETA: ${eta === 999 ? '∞' : `${eta}d`}` : ''
    const bar = progressBar(pct, 10)
    line1 = `${c(budgetColor(pct), `💰 ${formatCost(monthCost, budgetCurrency)} / ${formatCost(budget, budgetCurrency)} (${bar}${etaStr})`)}`
  } else {
    const trend = computeTrend(daily)
    const trendStr =
      trend !== null
        ? ` ${c(trend > 0 ? '\x1b[93m' : '\x1b[92m', `${trend > 0 ? '▲' : '▼'} ${Math.abs(trend)}%`)}`
        : ''
    line1 = `💰 ${formatCost(todayCost, budgetCurrency)} today${trendStr}  ${c(DIM, `${todayTokens.toLocaleString()} tokens`)}`
  }
  lines.push(line1)

  if (recentTools.length > 0) {
    const grouped = groupTools(recentTools)
    const toolLine = grouped
      .slice(0, 4)
      .map((t) => formatToolCall(t, budgetCurrency))
      .join(' │ ')
    lines.push(c(DIM, toolLine))
  }

  const line3Parts = []
  if (todaySaved > 0) {
    const savedPct = todayCost > 0 ? Math.round((todaySaved / (todayCost + todaySaved)) * 100) : 0
    line3Parts.push(
      c(BRIGHT_GREEN, `💎 Saved: ${formatCost(todaySaved, budgetCurrency)} (${savedPct}%)`),
    )
  }
  if (lastFillerPct >= 10) {
    line3Parts.push(c(fillerColor(lastFillerPct), `⚠ ${lastFillerPct}% filler`))
  }
  if (daily.length > 0) {
    const values = [...daily].reverse().map((d) => d.cost)
    line3Parts.push(c(DIM, `7d: ${sparkline(values)}`))
  }
  if (line3Parts.length > 0) {
    lines.push(line3Parts.join(' │ '))
  }

  return lines.join('\n')
}

function groupTools(tools) {
  if (tools.length === 0) return []
  const result = []
  let current = { ...tools[0], count: 1 }
  for (let i = 1; i < tools.length; i++) {
    if (tools[i].tool_name === current.tool_name) {
      current.count++
      current.cost_usd += tools[i].cost_usd
    } else {
      result.push(current)
      current = { ...tools[i], count: 1 }
    }
  }
  result.push(current)
  return result.map((t) => ({
    ...t,
    tool_name: t.count > 1 ? `${t.tool_name} ×${t.count}` : t.tool_name,
  }))
}
