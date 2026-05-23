import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { LibsqlStorage } from '@trimly/core'
import { execa } from 'execa'
import { beforeEach, describe, expect, test } from 'vitest'

const HOOK_SUBMIT = join(import.meta.dirname, '../user-prompt-submit.mjs')
const HOOK_STOP = join(import.meta.dirname, '../stop.mjs')
const TRANSCRIPT = join(import.meta.dirname, '__fixtures__/transcript-sample.jsonl')

async function runHook(hookPath: string, input: object, dbPath: string) {
  return execa('node', [hookPath], {
    input: JSON.stringify(input),
    env: { ...process.env, TRIMLY_DB_PATH: dbPath, TRIMLY_DEBUG: '1' },
    reject: false,
  })
}

describe('Given a pending event in the database and a transcript with token usage', () => {
  let dbPath: string

  beforeEach(async () => {
    const tmpDir = await mkdtemp(join(tmpdir(), 'trimly-stop-'))
    dbPath = join(tmpDir, 'events.db')
  })

  describe('When the stop hook runs', () => {
    test('Then it updates the event to completed with real token counts and cost', async () => {
      await runHook(
        HOOK_SUBMIT,
        { session_id: 'stop-sess-1', transcript_path: '', cwd: '/tmp', prompt: 'Hello' },
        dbPath,
      )

      await runHook(HOOK_STOP, { session_id: 'stop-sess-1', transcript_path: TRANSCRIPT }, dbPath)

      const storage = new LibsqlStorage(dbPath)
      await storage.init()
      const events = await storage.queryEvents({ session_id: 'stop-sess-1' })
      await storage.close()

      expect(events).toHaveLength(1)
      expect(events[0]?.status).toBe('completed')
      expect(events[0]?.tokens_input).toBe(15)
      expect(events[0]?.tokens_output).toBe(10)
      expect(events[0]?.cost_usd).toBeGreaterThan(0)
    })
  })
})

describe('Given no pending event exists for a session', () => {
  let dbPath: string

  beforeEach(async () => {
    const tmpDir = await mkdtemp(join(tmpdir(), 'trimly-stop-'))
    dbPath = join(tmpDir, 'events.db')
  })

  describe('When the stop hook runs', () => {
    test('Then it exits cleanly with exit code 0', async () => {
      const result = await runHook(
        HOOK_STOP,
        { session_id: 'nonexistent', transcript_path: TRANSCRIPT },
        dbPath,
      )
      expect(result.exitCode).toBe(0)
    })
  })
})
