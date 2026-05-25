import { describe, expect, test } from 'vitest'
import { DEFAULT_USD_TO_EUR, computeCost, convertCost, formatCost } from '../pricing/index.js'

describe('Given the computeCost function', () => {
  describe('When called with Anthropic provider and standard input/output tokens', () => {
    test('Then it computes the correct USD cost', () => {
      const cost = computeCost('anthropic', 'claude-sonnet-4-6', {
        input_tokens: 1000,
        output_tokens: 500,
      })
      expect(cost).toBeCloseTo(0.0105, 4)
    })
  })

  describe('When cache read and creation tokens are included', () => {
    test('Then it returns a higher cost than without cache', () => {
      const cost = computeCost('anthropic', 'claude-sonnet-4-6', {
        input_tokens: 1000,
        output_tokens: 500,
        cache_read_input_tokens: 2000,
        cache_creation_input_tokens: 1000,
      })
      expect(cost).toBeGreaterThan(0.0105)
    })
  })

  describe('When called with an unknown provider', () => {
    test('Then it returns 0', () => {
      expect(
        computeCost('unknown' as 'anthropic', 'unknown-model', {
          input_tokens: 100,
          output_tokens: 50,
        }),
      ).toBe(0)
    })
  })
})

describe('Given the formatCost function', () => {
  describe('When formatting a cost in USD', () => {
    test('Then it includes the dollar sign and the value', () => {
      const result = formatCost(0.0105, 'USD', 'en-US')
      expect(result).toContain('$')
      expect(result).toContain('0.0105')
    })
  })

  describe('When formatting a cost in EUR', () => {
    test('Then it includes the euro sign', () => {
      const result = formatCost(0.5, 'EUR', 'fr-FR')
      expect(result).toContain('€')
    })
  })

  describe('When a custom fraction-digits count is passed', () => {
    test('Then it formats to that many decimals', () => {
      const result = formatCost(0.00123, 'USD', 'en-US', 5)
      expect(result).toContain('0.00123')
    })
  })
})

describe('Given the convertCost function', () => {
  describe('When the target currency is USD', () => {
    test('Then it returns the cost unchanged', () => {
      expect(convertCost(12.34, 'USD')).toBe(12.34)
      expect(convertCost(12.34, 'USD', 0.5)).toBe(12.34)
    })
  })

  describe('When the target currency is EUR', () => {
    test('Then it multiplies the USD cost by the rate', () => {
      expect(convertCost(10, 'EUR', 0.9)).toBeCloseTo(9, 10)
    })

    test('Then it uses DEFAULT_USD_TO_EUR when no rate is provided', () => {
      expect(convertCost(10, 'EUR')).toBeCloseTo(10 * DEFAULT_USD_TO_EUR, 10)
    })
  })
})
