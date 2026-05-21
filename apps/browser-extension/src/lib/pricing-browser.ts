import { computeCost, formatCost } from '@trimly/core/browser'

export function estimateCost(tokens: number, model = 'claude-sonnet-4-6'): number {
  return computeCost('anthropic', model, { input_tokens: tokens, output_tokens: 0 })
}

export function formatUSD(cost: number): string {
  return formatCost(cost, 'USD', 'en-US')
}
