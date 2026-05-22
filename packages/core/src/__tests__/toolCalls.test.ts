import { describe, test, expect, beforeEach } from 'vitest'
import { mkdtemp } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { LibsqlStorage } from '../storage/adapters/libsql.js'

describe('Given a fresh Trimly database', () => {
  let storage: LibsqlStorage
  let dbPath: string

  beforeEach(async () => {
    const tmpDir = await mkdtemp(join(tmpdir(), 'trimly-tools-'))
    dbPath = join(tmpDir, 'test.db')
    storage = new LibsqlStorage(dbPath)
    await storage.init()
  })

  describe('When a tool call is recorded', () => {
    test('Then it can be retrieved by session_id', async () => {
      await storage.recordToolCall({
        session_id: 'sess-1',
        event_id: null,
        tool_name: 'Edit',
        target: 'src/auth.ts',
        tokens_used: 350,
        cost_usd: 0.00105,
        timestamp: Date.now(),
      })

      const calls = await storage.getRecentToolCalls('sess-1')
      expect(calls).toHaveLength(1)
      expect(calls[0]?.tool_name).toBe('Edit')
      expect(calls[0]?.target).toBe('src/auth.ts')
      expect(calls[0]?.tokens_used).toBe(350)
    })
  })

  describe('When multiple tool calls are recorded for different sessions', () => {
    test('Then getRecentToolCalls only returns calls for the requested session', async () => {
      await storage.recordToolCall({
        session_id: 'sess-A',
        event_id: null,
        tool_name: 'Read',
        target: 'index.ts',
        tokens_used: 100,
        cost_usd: 0.0003,
        timestamp: Date.now(),
      })
      await storage.recordToolCall({
        session_id: 'sess-B',
        event_id: null,
        tool_name: 'Bash',
        target: 'npm test',
        tokens_used: 200,
        cost_usd: 0.0006,
        timestamp: Date.now(),
      })

      const callsA = await storage.getRecentToolCalls('sess-A')
      expect(callsA).toHaveLength(1)
      expect(callsA[0]?.session_id).toBe('sess-A')
    })
  })

  describe('When getDailyStats is called with no events', () => {
    test('Then it returns an empty array', async () => {
      const stats = await storage.getDailyStats(7)
      expect(stats).toEqual([])
    })
  })
})
