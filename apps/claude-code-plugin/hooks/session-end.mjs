#!/usr/bin/env node
import { homedir } from 'node:os'
import { join } from 'node:path'
import { readStdinJson } from './shared/stdin.mjs'

async function main() {
  const input = await readStdinJson()
  if (!input) process.exit(0)

  const { session_id = '' } = input
  if (!session_id) process.exit(0)

  try {
    const pluginRoot =
      process.env['CLAUDE_PLUGIN_ROOT'] ?? join(homedir(), '.claude', 'plugins', 'trimly')
    let core
    try {
      core = await import(join(pluginRoot, 'node_modules', '@trimly/core', 'dist', 'index.js'))
    } catch {
      core = await import('@trimly/core')
    }

    const { createStorage, getDefaultDbPath } = core
    const dbPath = process.env['TRIMLY_DB_PATH'] ?? getDefaultDbPath()
    const storage = await createStorage(dbPath)

    const events = await storage.queryEvents({ session_id, status: 'completed' })
    const totalTokensInput = events.reduce((s, e) => s + e.tokens_input, 0)
    const totalTokensOutput = events.reduce((s, e) => s + e.tokens_output, 0)
    const totalCostUsd = events.reduce((s, e) => s + e.cost_usd, 0)

    await storage.updateSession(session_id, {
      ended_at: Date.now(),
      total_tokens_input: totalTokensInput,
      total_tokens_output: totalTokensOutput,
      total_cost_usd: totalCostUsd,
    })

    await storage.close()

    const config = await loadConfig()
    if (config.summary_on_session_end && events.length > 0) {
      const mins = Math.round((Date.now() - (events[0]?.timestamp ?? Date.now())) / 60000)
      process.stdout.write(
        `\n📊 Trimly session summary\n` +
          `   Prompts:  ${events.length}\n` +
          `   Tokens:   ${totalTokensInput.toLocaleString()} in / ${totalTokensOutput.toLocaleString()} out\n` +
          `   Cost:     $${totalCostUsd.toFixed(4)}\n\n`,
      )
    }
  } catch (err) {
    if (process.env['TRIMLY_DEBUG']) process.stderr.write(`[Trimly session-end] ${err}\n`)
  }

  process.exit(0)
}

async function loadConfig() {
  const { join } = await import('node:path')
  const { homedir } = await import('node:os')
  const { readFile } = await import('node:fs/promises')
  try {
    const raw = await readFile(join(homedir(), '.trimly', 'config.json'), 'utf8')
    return JSON.parse(raw)
  } catch {
    return { summary_on_session_end: true }
  }
}

main()
