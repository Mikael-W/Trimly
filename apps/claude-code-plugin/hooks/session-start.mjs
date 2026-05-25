#!/usr/bin/env node
import { readStdinJson } from './shared/stdin.mjs'
import { getCore } from './shared/storage.mjs'

async function main() {
  const input = await readStdinJson()
  if (!input) process.exit(0)

  const { session_id = '', cwd = '' } = input
  if (!session_id) process.exit(0)

  try {
    const core = await getCore()
    const { createStorage, getDefaultDbPath, resolveAgent } = core
    const adapter = resolveAgent(process.env.TRIMLY_AGENT, process.env)
    const dbPath = process.env.TRIMLY_DB_PATH ?? getDefaultDbPath()
    const storage = await createStorage(dbPath)

    await storage.upsertSession({
      id: session_id,
      source: adapter.source,
      started_at: Date.now(),
      cwd: cwd || null,
    })

    await storage.close()
  } catch (err) {
    if (process.env.TRIMLY_DEBUG) process.stderr.write(`[Trimly session-start] ${err}\n`)
  }

  process.exit(0)
}

main()
