#!/usr/bin/env node
import { join } from 'node:path'
import { homedir } from 'node:os'
import { randomUUID } from 'node:crypto'
import { readStdinJson } from './shared/stdin.mjs'

async function main() {
  const input = await readStdinJson()
  if (!input) process.exit(0)

  const { session_id = '' } = input

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

    // Log a compaction event
    await storage.recordEvent({
      id: randomUUID(),
      session_id: session_id || 'unknown',
      timestamp: Date.now(),
      source: 'claude-code',
      provider: 'anthropic',
      model: process.env['ANTHROPIC_MODEL'] ?? 'unknown',
      tokens_input: 0,
      tokens_output: 0,
      cost_usd: 0,
      status: 'completed',
      filler_detected: false,
      tags: 'compaction',
    })

    await storage.close()
  } catch (err) {
    if (process.env['TRIMLY_DEBUG']) process.stderr.write(`[Trimly pre-compact] ${err}\n`)
  }

  process.exit(0)
}

main()
