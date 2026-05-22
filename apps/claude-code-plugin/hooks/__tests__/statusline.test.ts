import { describe, test, expect } from 'vitest'
import { execa } from 'execa'
import { join } from 'node:path'

const STATUSLINE = join(import.meta.dirname, '../../statusline/index.mjs')

describe('Given the statusline script', () => {
  describe('When it runs with no database (first-use scenario)', () => {
    test('Then it exits within 500ms with exit code 0', async () => {
      const start = Date.now()
      const result = await execa('node', [STATUSLINE], {
        env: { ...process.env, TRIMLY_DB_PATH: '/tmp/nonexistent-trimly-test.db' },
        reject: false,
        timeout: 3000,
      })
      const elapsed = Date.now() - start
      expect(result.exitCode).toBe(0)
      expect(elapsed).toBeLessThan(500)
    })
  })

  describe('When it runs with TRIMLY_DB_PATH pointing to a real (empty) db', () => {
    test('Then it outputs a non-empty string with cost indicator', async () => {
      const { mkdtemp, writeFile } = await import('node:fs/promises')
      const { tmpdir } = await import('node:os')
      const { LibsqlStorage } = await import('@trimly/core')

      const tmpDir = await mkdtemp(join(tmpdir(), 'trimly-sl-'))
      const dbPath = join(tmpDir, 'events.db')

      const storage = new LibsqlStorage(dbPath)
      await storage.init()
      await storage.close()

      const result = await execa('node', [STATUSLINE], {
        env: { ...process.env, TRIMLY_DB_PATH: dbPath },
        reject: false,
        timeout: 3000,
      })

      expect(result.exitCode).toBe(0)
      // Empty db should produce the cost line (€0.00 or $0.00)
      expect(result.stdout).toMatch(/💰/)
    })
  })
})
