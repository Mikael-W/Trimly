import { describe, expect, test } from 'vitest'
import { createAdapter, detectAgent, resolveAgent } from '../agents/index.js'

describe('Given detectAgent', () => {
  describe('When the env carries a Claude Code marker', () => {
    test('Then it returns claude-code', () => {
      expect(detectAgent({ CLAUDE_PLUGIN_ROOT: '/x' })).toBe('claude-code')
      expect(detectAgent({ CLAUDECODE: '1' })).toBe('claude-code')
    })
  })

  describe('When the env carries a Codex marker', () => {
    test('Then it returns codex', () => {
      expect(detectAgent({ CODEX_HOME: '/x' })).toBe('codex')
    })
  })

  describe('When the env carries a Cursor marker', () => {
    test('Then it returns cursor', () => {
      expect(detectAgent({ CURSOR_TRACE_ID: 'abc' })).toBe('cursor')
    })
  })

  describe('When no marker is present', () => {
    test('Then it returns unknown', () => {
      expect(detectAgent({})).toBe('unknown')
    })
  })
})

describe('Given resolveAgent', () => {
  describe('When config specifies an explicit agent', () => {
    test('Then it overrides env detection', () => {
      const adapter = resolveAgent('codex', { CLAUDE_PLUGIN_ROOT: '/x' })
      expect(adapter.id).toBe('codex')
    })
  })

  describe('When config is auto', () => {
    test('Then it uses env detection', () => {
      expect(resolveAgent('auto', { CURSOR_TRACE_ID: 'a' }).id).toBe('cursor')
    })

    test('Then it falls back to claude-code when nothing is detected', () => {
      expect(resolveAgent('auto', {}).id).toBe('claude-code')
    })
  })
})

describe('Given the claude-code adapter', () => {
  const adapter = createAdapter('claude-code')

  describe('When parsing a UserPromptSubmit payload', () => {
    test('Then it normalizes the prompt and session id', () => {
      const p = adapter.parsePayload('UserPromptSubmit', { session_id: 's1', prompt: 'hi' })
      expect(p.sessionId).toBe('s1')
      expect(p.prompt).toBe('hi')
    })
  })

  describe('When formatting advisor output', () => {
    test('Then it emits additionalContext JSON', () => {
      const out = adapter.formatOutput({ context: 'tip' }, 'UserPromptSubmit')
      expect(JSON.parse(out).hookSpecificOutput.additionalContext).toBe('tip')
    })
  })
})

describe('Given the codex adapter', () => {
  const adapter = createAdapter('codex')

  describe('When formatting advisor output', () => {
    test('Then it emits the context as plain developer-context text', () => {
      expect(adapter.formatOutput({ context: 'tip' }, 'UserPromptSubmit')).toBe('tip')
    })
  })

  describe('When resolving the model', () => {
    test('Then it defaults to the openai provider', () => {
      expect(adapter.resolveModel({}).provider).toBe('openai')
    })
  })
})

describe('Given the cursor adapter', () => {
  const adapter = createAdapter('cursor')

  describe('When checking capabilities', () => {
    test('Then prompt optimization is unsupported but cost tracking is', () => {
      expect(adapter.capabilities.promptOptimization).toBe(false)
      expect(adapter.capabilities.costTracking).toBe(true)
    })
  })

  describe('When formatting advisor output', () => {
    test('Then it emits nothing', () => {
      expect(adapter.formatOutput({ context: 'tip' }, 'UserPromptSubmit')).toBe('')
    })
  })
})
