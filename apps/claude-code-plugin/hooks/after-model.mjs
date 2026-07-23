#!/usr/bin/env node
import { randomUUID } from 'node:crypto'
import { readStdinJson } from './shared/stdin.mjs'
import { getCore } from './shared/storage.mjs'

async function main() {
  const input = await readStdinJson()
  if (!input) process.exit(0)

  try {
    const core = await getCore()
    const { computeCost, createStorage, getDefaultDbPath, resolveAgent } = core

    const adapter = resolveAgent(process.env.TRIMLY_AGENT ?? 'gemini', process.env)
    const payload = adapter.parsePayload('AfterModel', input)
    const usage = payload.usage
    const sessionId = payload.sessionId ?? ''
    if (!usage) process.exit(0)

    const inputTokens = usage.promptTokenCount ?? 0
    const outputTokens = usage.candidatesTokenCount ?? 0
    const cachedTokens = usage.cachedContentTokenCount ?? 0
    if (inputTokens === 0 && outputTokens === 0) process.exit(0)

    const resolved = adapter.resolveModel(process.env)
    const provider = resolved.provider
    const model = payload.model ?? resolved.model

    const costUsd = computeCost(provider, model, {
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      cache_read_input_tokens: cachedTokens,
    })

    const dbPath = process.env.TRIMLY_DB_PATH ?? getDefaultDbPath()
    const storage = await createStorage(dbPath)
    await storage.recordEvent({
      id: randomUUID(),
      session_id: sessionId,
      timestamp: Date.now(),
      source: adapter.source,
      provider,
      model,
      tokens_input: inputTokens,
      tokens_output: outputTokens,
      tokens_cache_read: cachedTokens,
      cost_usd: costUsd,
      status: 'completed',
      filler_detected: false,
    })
    await storage.close()
  } catch (err) {
    if (process.env.TRIMLY_DEBUG) {
      process.stderr.write(`[Trimly after-model error] ${err}\n`)
    }
  }

  process.exit(0)
}

main()
