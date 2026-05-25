#!/usr/bin/env node
import { randomUUID } from 'node:crypto'
import { readStdinJson } from './shared/stdin.mjs'
import { getCore } from './shared/storage.mjs'

async function main() {
  const input = await readStdinJson()
  if (!input) process.exit(0)

  const { session_id = '' } = input

  try {
    const core = await getCore()
    const { createStorage, getDefaultDbPath, resolveAgent } = core
    const adapter = resolveAgent(process.env.TRIMLY_AGENT, process.env)
    const { provider, model } = adapter.resolveModel(process.env)
    const dbPath = process.env.TRIMLY_DB_PATH ?? getDefaultDbPath()
    const storage = await createStorage(dbPath)

    await storage.recordEvent({
      id: randomUUID(),
      session_id: session_id || 'unknown',
      timestamp: Date.now(),
      source: adapter.source,
      provider,
      model,
      tokens_input: 0,
      tokens_output: 0,
      cost_usd: 0,
      status: 'completed',
      filler_detected: false,
      tags: 'compaction',
    })

    await storage.close()
  } catch (err) {
    if (process.env.TRIMLY_DEBUG) process.stderr.write(`[Trimly pre-compact] ${err}\n`)
  }

  process.exit(0)
}

main()
