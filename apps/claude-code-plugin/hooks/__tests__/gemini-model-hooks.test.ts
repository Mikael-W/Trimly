import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { LibsqlStorage } from '@trimly/core'
import { execa } from 'execa'
import { beforeEach, describe, expect, test } from 'vitest'

const HOOK_BEFORE_MODEL = join(import.meta.dirname, '../before-model.mjs')
const HOOK_AFTER_MODEL = join(import.meta.dirname, '../after-model.mjs')

async function runHook(hookPath: string, input: object, dbPath: string, configDir?: string) {
  return execa('node', [hookPath], {
    input: JSON.stringify(input),
    env: {
      ...process.env,
      TRIMLY_AGENT: 'gemini',
      TRIMLY_DB_PATH: dbPath,
      TRIMLY_DEBUG: '1',
      ...(configDir ? { HOME: configDir } : {}),
    },
    reject: false,
  })
}

async function readEvents(dbPath: string, sessionId: string) {
  const storage = new LibsqlStorage(dbPath)
  await storage.init()
  const events = await storage.queryEvents({ session_id: sessionId })
  await storage.close()
  return events
}

function beforeModelPayload(sessionId: string) {
  return {
    session_id: sessionId,
    hook_event_name: 'BeforeModel',
    llm_request: {
      model: 'gemini-3.1-pro-preview',
      messages: [
        { role: 'system', content: 'You are helpful.' },
        { role: 'user', content: 'hello      world\n\n\n\nhello      world' },
        { role: 'model', content: 'hi' },
      ],
    },
  }
}

describe('Given a Gemini BeforeModel payload with a bloated resent context', () => {
  let dbPath: string

  beforeEach(async () => {
    const tmpDir = await mkdtemp(join(tmpdir(), 'trimly-gemini-bm-'))
    dbPath = join(tmpDir, 'events.db')
  })

  describe('When the before-model hook runs with measurement only (default)', () => {
    test('Then it records a shadow saving and emits no rewrite', async () => {
      const result = await runHook(HOOK_BEFORE_MODEL, beforeModelPayload('bm-1'), dbPath)

      expect(result.exitCode).toBe(0)
      expect(result.stdout).toBe('')

      const events = await readEvents(dbPath, 'bm-1')
      expect(events).toHaveLength(1)
      expect(events[0]?.tokens_saved_shadow).toBeGreaterThan(0)
      expect(events[0]?.tokens_saved_optim).toBe(0)
      expect(events[0]?.tokens_input).toBe(0)
      expect(events[0]?.cost_usd).toBe(0)
    })
  })

  describe('When the before-model hook runs with rewrite enabled via config', () => {
    test('Then it records a real optim saving and emits an llm_request override', async () => {
      const configDir = await mkdtemp(join(tmpdir(), 'trimly-home-'))
      const trimlyDir = join(configDir, '.trimly')
      await execa('mkdir', ['-p', trimlyDir])
      await writeFile(
        join(trimlyDir, 'config.json'),
        JSON.stringify({ context: { measure: true, rewrite: true, strategies: ['whitespace'] } }),
      )

      const result = await runHook(HOOK_BEFORE_MODEL, beforeModelPayload('bm-2'), dbPath, configDir)

      expect(result.exitCode).toBe(0)
      const override = JSON.parse(result.stdout)
      expect(override.hookSpecificOutput.llm_request.messages).toBeInstanceOf(Array)
      const userMsg = override.hookSpecificOutput.llm_request.messages.find(
        (m: { role: string }) => m.role === 'user',
      )
      expect(userMsg.content).not.toContain('\n\n\n')

      const events = await readEvents(dbPath, 'bm-2')
      expect(events[0]?.tokens_saved_optim).toBeGreaterThan(0)
      expect(events[0]?.tokens_saved_shadow).toBe(0)
      expect(events[0]?.strategies_applied).toContain('whitespace')
    })
  })
})

describe('Given a Gemini AfterModel payload carrying usageMetadata', () => {
  let dbPath: string

  beforeEach(async () => {
    const tmpDir = await mkdtemp(join(tmpdir(), 'trimly-gemini-am-'))
    dbPath = join(tmpDir, 'events.db')
  })

  describe('When the after-model hook runs', () => {
    test('Then it records the real token usage and a non-zero cost', async () => {
      const result = await runHook(
        HOOK_AFTER_MODEL,
        {
          session_id: 'am-1',
          hook_event_name: 'AfterModel',
          llm_request: { model: 'gemini-3.1-pro-preview' },
          llm_response: {
            usageMetadata: {
              promptTokenCount: 1000,
              candidatesTokenCount: 200,
              totalTokenCount: 1200,
            },
          },
        },
        dbPath,
      )

      expect(result.exitCode).toBe(0)

      const events = await readEvents(dbPath, 'am-1')
      expect(events).toHaveLength(1)
      expect(events[0]?.tokens_input).toBe(1000)
      expect(events[0]?.tokens_output).toBe(200)
      expect(events[0]?.cost_usd).toBeGreaterThan(0)
    })
  })

  describe('When the after-model payload has no usage', () => {
    test('Then it exits cleanly without recording anything', async () => {
      const result = await runHook(
        HOOK_AFTER_MODEL,
        { session_id: 'am-2', hook_event_name: 'AfterModel', llm_response: {} },
        dbPath,
      )
      expect(result.exitCode).toBe(0)
      const events = await readEvents(dbPath, 'am-2')
      expect(events).toHaveLength(0)
    })
  })
})
