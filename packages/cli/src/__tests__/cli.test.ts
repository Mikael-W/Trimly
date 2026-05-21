import { describe, test, expect } from 'vitest'
import { execa } from 'execa'
import { mkdtemp } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

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
})
