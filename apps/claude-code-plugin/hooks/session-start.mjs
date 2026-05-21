#!/usr/bin/env node
import { join } from 'node:path'
import { homedir } from 'node:os'
import { readStdinJson } from './shared/stdin.mjs'

async function main() {
  const input = await readStdinJson()
  if (!input) process.exit(0)

  const { session_id = '', cwd = '' } = input
  if (!session_id) process.exit(0)

  try {
    const pluginRoot = process.env['CLAUDE_PLUGIN_ROOT'] ?? join(homedir(), '.claude', 'plugins', 'trimly')
    let core
    try {
      core = await import(join(pluginRoot, 'node_modules', '@trimly/core', 'dist', 'index.js'))
    } catch {
      core = await import('@trimly/core')
    }

    const { createStorage, getDefaultDbPath } = core
    const dbPath = process.env['TRIMLY_DB_PATH'] ?? getDefaultDbPath()
    const storage = await createStorage(dbPath)

    await storage.upsertSession({
      id: session_id,
      source: 'claude-code',
      started_at: Date.now(),
      cwd: cwd || null,
    })

    await storage.close()
  } catch (err) {
    if (process.env['TRIMLY_DEBUG']) process.stderr.write(`[Trimly session-start] ${err}\n`)
  }

  process.exit(0)
}

main()
