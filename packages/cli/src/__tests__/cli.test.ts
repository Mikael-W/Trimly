import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execa } from 'execa'
import { describe, expect, test } from 'vitest'

const CLI = join(import.meta.dirname, '../../bin/trimly.js')

describe('Given the trimly CLI binary', () => {
  describe('When --help flag is used', () => {
    test('Then it shows usage information including known subcommands', async () => {
      const { stdout } = await execa('node', [CLI, '--help'], { reject: false })
      expect(stdout).toContain('trimly')
      expect(stdout).toContain('stats')
      expect(stdout).toContain('dashboard')
    })
  })

  describe('When --version flag is used', () => {
    test('Then it prints a valid semver version string', async () => {
      const { stdout } = await execa('node', [CLI, '--version'], { reject: false })
      expect(stdout).toMatch(/\d+\.\d+\.\d+/)
    })
  })

  describe('When the init command is run with a custom HOME', () => {
    test('Then it creates the .trimly directory and confirms with a checkmark', async () => {
      const tmpDir = await mkdtemp(join(tmpdir(), 'trimly-cli-'))
      const { stdout } = await execa('node', [CLI, 'init'], {
        env: {
          ...process.env,
          HOME: tmpDir,
          USERPROFILE: tmpDir,
        },
        reject: false,
      })
      expect(stdout).toContain('✅')
    })
  })

  describe('When the stats command is run against an empty database', () => {
    test('Then it exits with code 0 and prints the stats header', async () => {
      const tmpDir = await mkdtemp(join(tmpdir(), 'trimly-stats-'))
      const dbPath = join(tmpDir, 'events.db')
      const { stdout, exitCode } = await execa('node', [CLI, 'stats'], {
        env: { ...process.env, TRIMLY_DB_PATH: dbPath },
        reject: false,
      })
      expect(exitCode).toBe(0)
      expect(stdout).toContain('📊 Trimly stats')
    })
  })

  describe('When import-browser is run with a valid JSON export file', () => {
    test('Then it imports all events and reports the count', async () => {
      const tmpDir = await mkdtemp(join(tmpdir(), 'trimly-import-'))
      const dbPath = join(tmpDir, 'events.db')
      const jsonPath = join(tmpDir, 'export.json')

      const events = [
        {
          id: 'b1',
          timestamp: Date.now(),
          site: 'claude.ai',
          model: 'claude-sonnet-4-6',
          tokens_input: 100,
          cost_input_usd: 0.0003,
        },
        {
          id: 'b2',
          timestamp: Date.now() - 1000,
          site: 'claude.ai',
          model: 'claude-sonnet-4-6',
          tokens_input: 200,
          cost_input_usd: 0.0006,
        },
      ]
      await writeFile(jsonPath, JSON.stringify(events))

      const { stdout, exitCode } = await execa(
        'node',
        [CLI, 'import-browser', jsonPath, '--db', dbPath],
        { reject: false },
      )
      expect(exitCode).toBe(0)
      expect(stdout).toContain('✅')
      expect(stdout).toContain('2')
    })
  })

  describe('When import-browser is run twice with the same file', () => {
    test('Then duplicates are skipped and the output reports 0 inserted', async () => {
      const tmpDir = await mkdtemp(join(tmpdir(), 'trimly-dedup-'))
      const dbPath = join(tmpDir, 'events.db')
      const jsonPath = join(tmpDir, 'export.json')

      const events = [
        {
          id: 'dup1',
          timestamp: Date.now(),
          site: 'claude.ai',
          model: 'claude-sonnet-4-6',
          tokens_input: 50,
          cost_input_usd: 0.0001,
        },
      ]
      await writeFile(jsonPath, JSON.stringify(events))

      await execa('node', [CLI, 'import-browser', jsonPath, '--db', dbPath], { reject: false })
      const { stdout } = await execa('node', [CLI, 'import-browser', jsonPath, '--db', dbPath], {
        reject: false,
      })
      expect(stdout).toContain('0')
      expect(stdout).toContain('skipped')
    })
  })
})
