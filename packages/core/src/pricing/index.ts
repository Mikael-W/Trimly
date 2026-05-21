import type { Provider, TokenUsage } from '../types/providers.js'
import modelsData from './models.json' with { type: 'json' }

type ModelPricing = {
  input: number
  output: number
  cache_write: number
  cache_read: number
}

type PricingData = Record<string, Record<string, ModelPricing>>

const PRICING = modelsData as PricingData

/** Cost per million tokens (USD) → cost for N tokens */
function perMillion(rate: number, tokens: number): number {
  return (rate / 1_000_000) * tokens
}

/**
 * Compute total cost in USD for a given usage.
 * Returns 0 for unknown provider/model (avoids crashing).
 */
export function computeCost(provider: Provider, model: string, usage: TokenUsage): number {
  const providerPricing = PRICING[provider]
  if (!providerPricing) return 0

  const pricing = providerPricing[model] ?? providerPricing[Object.keys(providerPricing)[0] ?? '']
  if (!pricing) return 0

  return (
    perMillion(pricing.input, usage.input_tokens) +
    perMillion(pricing.output, usage.output_tokens) +
    perMillion(pricing.cache_write, usage.cache_creation_input_tokens ?? 0) +
    perMillion(pricing.cache_read, usage.cache_read_input_tokens ?? 0)
  )
}

/** Format a cost value as a locale-aware currency string. */
export function formatCost(cost: number, currency: 'USD' | 'EUR', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(cost)
}
