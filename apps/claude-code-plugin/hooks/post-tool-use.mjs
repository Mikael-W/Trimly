#!/usr/bin/env node
import { randomUUID } from 'node:crypto'
import { readStdinJson } from './shared/stdin.mjs'
import { getCore } from './shared/storage.mjs'

async function main() {
  const input = await readStdinJson()
  if (!input) process.exit(0)

  const { session_id = '', tool_name = '', tool_input = {}, tool_response = {} } = input
  if (!session_id || !tool_name) process.exit(0)

  try {
    const core = await getCore()
    const { computeCost, createStorage, getDefaultDbPath, resolveAgent } = core
    const adapter = resolveAgent(process.env.TRIMLY_AGENT, process.env)
    const { provider, model } = adapter.resolveModel(process.env)

    const usage = tool_response?.usage ?? {}
    const tokensUsed = (usage.input_tokens ?? 0) + (usage.output_tokens ?? 0)
    const costUsd =
      tokensUsed > 0
        ? computeCost(provider, model, {
            input_tokens: usage.input_tokens ?? 0,
            output_tokens: usage.output_tokens ?? 0,
          })
        : 0

    const target = extractTarget(tool_name, tool_input)

    const dbPath = process.env.TRIMLY_DB_PATH ?? getDefaultDbPath()
    const storage = await createStorage(dbPath)

    await storage.recordToolCall({
      id: randomUUID(),
      session_id,
      event_id: null,
      tool_name,
      target,
      tokens_used: tokensUsed,
      cost_usd: costUsd,
      timestamp: Date.now(),
    })

    await storage.close()
  } catch (err) {
    if (process.env.TRIMLY_DEBUG) {
      process.stderr.write(`[Trimly post-tool-use error] ${err}\n`)
    }
  }

  process.exit(0)
}

function extractTarget(toolName, input) {
  switch (toolName) {
    case 'Edit':
    case 'Write':
    case 'Read':
      return input?.file_path ?? null
    case 'Bash':
      return input?.command?.slice(0, 80) ?? null
    case 'Grep':
      return input?.pattern ?? null
    case 'WebFetch':
      return input?.url ?? null
    default:
      return null
  }
}

main()
