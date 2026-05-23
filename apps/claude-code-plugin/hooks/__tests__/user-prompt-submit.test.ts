import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { LibsqlStorage } from '@trimly/core'
import { execa } from 'execa'
import { beforeEach, describe, expect, test } from 'vitest'

const HOOK = join(import.meta.dirname, '../user-prompt-submit.mjs')

async function runHook(input: object, dbPath: string): Promise<{ stdout: string; stderr: string }> {
  const result = await execa('node', [HOOK], {
    input: JSON.stringify(input),
    env: { ...process.env, TRIMLY_DB_PATH: dbPath, TRIMLY_DEBUG: '1' },
    reject: false,
  })
  return { stdout: result.stdout, stderr: result.stderr }
}

describe('Given a fresh database and the user-prompt-submit hook', () => {
  let dbPath: string
  let tmpDir: string

  beforeEach(async () => {
    tmpDir = await mkdtemp(join(tmpdir(), 'trimly-test-'))
    dbPath = join(tmpDir, 'events.db')
  })

  describe('When a simple prompt is submitted', () => {
    test('Then a pending event is inserted with token count and provider', async () => {
      await runHook(
        { session_id: 'sess-1', transcript_path: '', cwd: '/tmp', prompt: 'Hello world' },
        dbPath,
      )

      const storage = new LibsqlStorage(dbPath)
      await storage.init()
      const events = await storage.queryEvents({ session_id: 'sess-1' })
      await storage.close()

      expect(events).toHaveLength(1)
      expect(events[0]?.status).toBe('pending')
      expect(events[0]?.tokens_input).toBeGreaterThan(0)
      expect(events[0]?.provider).toBe('anthropic')
    })
  })

  describe('When a French prompt with filler phrases is submitted', () => {
    test('Then filler is detected and an advisor suggestion is printed to stdout', async () => {
      const { stdout } = await runHook(
        {
          session_id: 'sess-2',
          transcript_path: '',
          cwd: '/tmp',
          prompt: "S'il te plaît, est-ce que tu pourrais m'expliquer Redis ?",
        },
        dbPath,
      )

      const storage = new LibsqlStorage(dbPath)
      await storage.init()
      const events = await storage.queryEvents({ session_id: 'sess-2' })
      await storage.close()

      expect(events[0]?.filler_detected).toBe(true)
      expect(stdout).toContain('💡 Trimly')
    })
  })

  describe('When an empty prompt is submitted', () => {
    test('Then the hook exits cleanly with no stdout output', async () => {
      const { stdout } = await runHook(
        { session_id: 'sess-3', transcript_path: '', cwd: '/tmp', prompt: '' },
        dbPath,
      )
      expect(stdout).toBe('')
    })
  })

  describe('When invalid JSON is piped to the hook', () => {
    test('Then it exits with code 0 without crashing', async () => {
      const result = await execa('node', [HOOK], {
        input: 'not json at all',
        env: { ...process.env, TRIMLY_DB_PATH: dbPath },
        reject: false,
      })
      expect(result.exitCode).toBe(0)
    })
  })

  describe('When a prompt is submitted', () => {
    test('Then the hook completes within 5 seconds', async () => {
      const start = Date.now()
      await runHook(
        { session_id: 'sess-perf', transcript_path: '', cwd: '/tmp', prompt: 'Hello' },
        dbPath,
      )
      expect(Date.now() - start).toBeLessThan(5000)
    })
  })
})
