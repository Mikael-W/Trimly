#!/usr/bin/env node
import { randomUUID } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { readStdinJson } from './shared/stdin.mjs'
import { getCore } from './shared/storage.mjs'

const DEFAULT_CONTEXT = { measure: true, rewrite: false, strategies: ['whitespace', 'dedup'] }

async function loadContextConfig() {
  const configPath = join(homedir(), '.trimly', 'config.json')
  try {
    const config = JSON.parse(await readFile(configPath, 'utf8'))
    return { ...DEFAULT_CONTEXT, ...(config.context ?? {}) }
  } catch {
    return DEFAULT_CONTEXT
  }
}

function applyRewrite(messages, strategies, core) {
  const { compactWhitespace, deduplicate } = core
  return messages.map((m) => {
    if (m.role === 'system') return m
    let content = m.content
    if (strategies.includes('whitespace')) content = compactWhitespace(content)
    if (strategies.includes('dedup')) content = deduplicate(content)
    return { ...m, content }
  })
}

async function main() {
  const input = await readStdinJson()
  if (!input) process.exit(0)

  try {
    const core = await getCore()
    const { countTokens, computeCost, createStorage, getDefaultDbPath, resolveAgent } = core

    const context = await loadContextConfig()
    if (!context.measure && !context.rewrite) process.exit(0)

    const adapter = resolveAgent(process.env.TRIMLY_AGENT ?? 'gemini', process.env)
    const payload = adapter.parsePayload('BeforeModel', input)
    const messages = payload.messages ?? []
    const sessionId = payload.sessionId ?? ''
    if (messages.length === 0) process.exit(0)

    const resolved = adapter.resolveModel(process.env)
    const provider = resolved.provider
    const model = payload.model ?? resolved.model

    const originalText = messages.map((m) => m.content).join('\n')
    const originalTokens = countTokens(provider, model, originalText)

    const rewritten = applyRewrite(messages, context.strategies, core)
    const rewrittenText = rewritten.map((m) => m.content).join('\n')
    const rewrittenTokens = countTokens(provider, model, rewrittenText)
    const tokensSaved = Math.max(0, originalTokens - rewrittenTokens)
    const costSaved =
      tokensSaved > 0
        ? computeCost(provider, model, { input_tokens: tokensSaved, output_tokens: 0 })
        : 0

    const willRewrite = context.rewrite && tokensSaved > 0
    const strategiesApplied = willRewrite ? context.strategies : []

    const dbPath = process.env.TRIMLY_DB_PATH ?? getDefaultDbPath()
    const storage = await createStorage(dbPath)
    await storage.recordEvent({
      id: randomUUID(),
      session_id: sessionId,
      timestamp: Date.now(),
      source: adapter.source,
      provider,
      model,
      tokens_input: 0,
      tokens_output: 0,
      cost_usd: 0,
      tokens_saved_optim: willRewrite ? tokensSaved : 0,
      tokens_saved_shadow: willRewrite ? 0 : tokensSaved,
      cost_saved_usd: willRewrite ? costSaved : 0,
      cost_saved_shadow_usd: willRewrite ? 0 : costSaved,
      status: 'completed',
      filler_detected: false,
      strategies_applied: strategiesApplied,
    })
    await storage.close()

    if (willRewrite && typeof adapter.formatModelRewrite === 'function') {
      const out = adapter.formatModelRewrite({ messages: rewritten }, 'BeforeModel')
      if (out) process.stdout.write(out)
    }
  } catch (err) {
    if (process.env.TRIMLY_DEBUG) {
      process.stderr.write(`[Trimly before-model error] ${err}\n`)
    }
  }

  process.exit(0)
}

main()
