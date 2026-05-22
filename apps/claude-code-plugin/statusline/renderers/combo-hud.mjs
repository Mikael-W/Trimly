import { c, budgetColor, BRIGHT_GREEN, DIM } from '../render/colors.mjs'
import { formatCost } from '../render/format.mjs'

/**
 * Mode "combo Claude HUD" — 1 ligne Trimly seulement (Claude HUD gère les autres).
 * 💰 Trimly: €0.42 today │ saved €2.37 month
 */
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
