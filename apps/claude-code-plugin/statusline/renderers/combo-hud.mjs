import { BRIGHT_GREEN, DIM, budgetColor, c } from '../render/colors.mjs'
import { formatCost } from '../render/format.mjs'

export function renderComboHud(data, config) {
  const { todayCost, todaySaved, monthCost } = data
  const currency = config.currency ?? 'USD'
  const budgetCurrency = config.budget?.monthly?.currency ?? currency

  const parts = [`💰 Trimly: ${formatCost(todayCost, budgetCurrency)} today`]

  if (monthCost > todayCost) {
    parts.push(`saved ${formatCost(todaySaved, budgetCurrency)} month`)
  }

  return parts.join(' │ ')
}
