import { describe, expect, test } from 'vitest'
import { cleanFiller } from '../strategies/cleanFiller/index.js'

describe('Given the cleanFiller strategy', () => {
  describe('When called with filler text in a supported language', () => {
    test.each([
      ['fr', "S'il te plaît, est-ce que tu pourrais m'expliquer Redis ?", /s'il te plaît/i],
      ['en', 'Could you please explain Redis?', /please/i],
      ['es', 'Por favor, podrías explicarme Redis?', /por favor/i],
      ['de', 'Könntest du bitte Redis erklären?', /bitte/i],
      ['it', 'Per favore, potresti spiegarmi Redis?', /per favore/i],
      ['pt', 'Por favor, poderia explicar Redis?', /por favor/i],
    ] as const)('Then it removes the filler phrase for language %s', (lang, input, removedPattern) => {
      const result = cleanFiller(input, { languages: [lang] })
      expect(result.text).not.toMatch(removedPattern)
      expect(result.tokensSaved).toBeGreaterThan(0)
      expect(result.applied).toBe(true)
    })
  })

  describe('When a preserve list is provided containing a word in the text', () => {
    test('Then it keeps the preserved expression in the output', () => {
      const result = cleanFiller('Please use very strict mode', {
        languages: ['en'],
        preserve: ['very strict'],
      })
      expect(result.text).toContain('very strict')
    })
  })

  describe('When called in detect mode', () => {
    test('Then it returns the original text unchanged', () => {
      const input = "S'il te plaît, explique Redis."
      const result = cleanFiller(input, { mode: 'detect', languages: ['fr'] })
      expect(result.text).toBe(input)
      expect(result.applied).toBe(true)
    })
  })

  describe('When called with an empty string', () => {
    test('Then it returns a no-op result with zero tokens saved', () => {
      const result = cleanFiller('')
      expect(result.text).toBe('')
      expect(result.applied).toBe(false)
      expect(result.tokensSaved).toBe(0)
    })
  })
})
