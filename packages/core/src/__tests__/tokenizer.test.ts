import { describe, expect, test } from 'vitest'
import { countTokens } from '../tokenizer/index.js'

describe('Given the countTokens function', () => {
  describe('When called with a supported provider and non-empty text', () => {
    test.each([
      ['anthropic', 'claude-sonnet-4-6', 'Hello world'],
      ['openai', 'gpt-4o', 'Hello world'],
      ['mistral', 'mistral-large', 'Hello world'],
    ] as const)('Then it returns a positive count within range for %s/%s', (provider, model, text) => {
      const t = countTokens(provider, model, text)
      expect(t).toBeGreaterThan(0)
      expect(t).toBeLessThan(20)
    })
  })

  describe('When called with an empty string', () => {
    test('Then it returns 0', () => {
      expect(countTokens('anthropic', 'claude-sonnet-4-6', '')).toBe(0)
    })
  })

  describe('When called with multilingual text', () => {
    test('Then it returns a positive count for each language', () => {
      const texts = ['Bonjour le monde', 'Hallo Welt', 'こんにちは', '你好世界']
      for (const text of texts) {
        expect(countTokens('anthropic', 'claude-sonnet-4-6', text)).toBeGreaterThan(0)
      }
    })
  })
})
