import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { LibsqlStorage } from '../storage/adapters/libsql.js'
import type { TrimlyStorage } from '../storage/types.js'
import type { TrimlyEventInsert } from '../types/events.js'

function makeEvent(overrides: Partial<TrimlyEventInsert> = {}): TrimlyEventInsert {
  return {
    session_id: 'session-test',
    timestamp: Date.now(),
    source: 'claude-code',
    provider: 'anthropic',
    model: 'claude-sonnet-4-6',
    tokens_input: 100,
    tokens_output: 50,
    cost_usd: 0.001,
    status: 'completed',
    filler_detected: false,
    ...overrides,
  }
}

// Only LibsqlStorage tested here — NodeSqliteStorage requires Node 22.5+
describe('Given a LibsqlStorage instance initialised in memory', () => {
  let storage: TrimlyStorage

  beforeEach(async () => {
    storage = new LibsqlStorage(':memory:')
    await storage.init()
  })

  afterEach(async () => {
    await storage.close()
  })

  describe('When recordEvent is called', () => {
    test('Then it stores the event and returns a truthy id', async () => {
      const id = await storage.recordEvent(makeEvent())
      expect(id).toBeTruthy()

      const events = await storage.queryEvents({ limit: 1 })
      expect(events).toHaveLength(1)
      expect(events[0]?.tokens_input).toBe(100)
    })
  })

  describe('When updateEvent is called with a new status and token count', () => {
    test('Then it persists the updated fields', async () => {
      const id = await storage.recordEvent(makeEvent({ status: 'pending' }))
      await storage.updateEvent(id, { status: 'completed', tokens_output: 200 })

      const events = await storage.queryEvents()
      expect(events[0]?.status).toBe('completed')
      expect(events[0]?.tokens_output).toBe(200)
    })
  })

  describe('When multiple events are recorded', () => {
    test('Then getStats aggregates total requests and cost correctly', async () => {
      await storage.recordEvent(makeEvent({ cost_usd: 0.01 }))
      await storage.recordEvent(makeEvent({ cost_usd: 0.02 }))

      const stats = await storage.getStats()
      expect(stats.totalRequests).toBe(2)
      expect(stats.totalCostUsd).toBeCloseTo(0.03, 4)
    })
  })

  describe('When events from different sources exist', () => {
    test('Then queryEvents filters by source correctly', async () => {
      await storage.recordEvent(makeEvent({ source: 'claude-code' }))
      await storage.recordEvent(makeEvent({ source: 'browser-extension' }))

      const cc = await storage.queryEvents({ source: 'claude-code' })
      expect(cc).toHaveLength(1)
    })
  })

  describe('When events from different sessions exist', () => {
    test('Then queryEvents filters by session_id correctly', async () => {
      await storage.recordEvent(makeEvent({ session_id: 'session-a' }))
      await storage.recordEvent(makeEvent({ session_id: 'session-b' }))

      const result = await storage.queryEvents({ session_id: 'session-a' })
      expect(result).toHaveLength(1)
    })
  })
})
