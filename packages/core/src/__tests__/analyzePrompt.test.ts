import { describe, expect, test } from 'vitest'
import { analyzePrompt } from '../strategies/analyzePrompt.js'

describe('Given the analyzePrompt strategy', () => {
  describe('When the prompt contains large code blocks', () => {
    test('Then it flags code as heavy reason and reports codeTokens', () => {
      const code = `\`\`\`typescript\n${'const x = 1\n'.repeat(80)}\`\`\``
      const prompt = `Fix this: ${code}`
      const result = analyzePrompt(prompt, 400)
      expect(result.heavyReason).toBe('code')
      expect(result.codeTokens).toBeGreaterThan(100)
      expect(result.codePct).toBeGreaterThan(40)
      expect(result.tip).toMatch(/bloc/)
    })
  })

  describe('When the prompt contains a stack trace', () => {
    test('Then it detects the log and suggests trimming', () => {
      const stackTrace = [
        'TypeError: Cannot read property of undefined',
        '    at Object.<anonymous> (/app/index.ts:42:5)',
        '    at Module._compile (node:internal/modules/cjs/loader:1364:14)',
        '    at Object.Module._extensions..js (node:internal:1)',
        '    at Module.load (node:internal/modules/cjs/loader:1197:32)',
        '    at Function.Module._load (node:internal/modules/cjs/loader:1013:12)',
        '    at Function.executeUserEntryPoint (node:internal/modules/run_main:128:12)',
      ].join('\n')
      const result = analyzePrompt(`Why does this fail?\n${stackTrace}`, 120)
      expect(result.looksLikeLog).toBe(true)
      expect(result.heavyReason).toBe('log')
      expect(result.tip).toMatch(/10 dernières lignes/)
    })
  })

  describe('When the prompt is a heavy plain-text prompt with no code', () => {
    test('Then it flags volume as heavy reason', () => {
      const longText = 'explain this concept in detail. '.repeat(30)
      const result = analyzePrompt(longText, 600)
      expect(result.isHeavy).toBe(true)
      expect(result.heavyReason).toBe('volume')
      expect(result.tip).toMatch(/tokens/)
    })
  })

  describe('When the prompt is short and clean', () => {
    test('Then it returns no tip and no heavy reason', () => {
      const result = analyzePrompt('What does buildChartPath do?', 8)
      expect(result.isHeavy).toBe(false)
      expect(result.heavyReason).toBeNull()
      expect(result.tip).toBeNull()
    })
  })

  describe('When the prompt has multiple code blocks', () => {
    test('Then it counts all blocks and their total tokens', () => {
      const prompt = '```js\nconst a = 1\n```\nand also\n```js\nconst b = 2\n```'
      const result = analyzePrompt(prompt, 30)
      expect(result.codeBlocks).toHaveLength(2)
    })
  })
})
