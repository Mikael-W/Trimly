#!/usr/bin/env node
import { randomUUID } from 'node:crypto'
import { join } from 'node:path'
import { homedir } from 'node:os'
import { readStdinJson } from './shared/stdin.mjs'

async function main() {
  const input = await readStdinJson()
  if (!input) process.exit(0)

  const { session_id = '', transcript_path = '', cwd = '', prompt = '' } = input

  if (!prompt) process.exit(0)

  try {
    // Resolve @trimly/core — works from workspace symlink during dev
    const pluginRoot = process.env['CLAUDE_PLUGIN_ROOT'] ?? join(homedir(), '.claude', 'plugins', 'trimly')
    let core
    try {
      core = await import(join(pluginRoot, 'node_modules', '@trimly/core', 'dist', 'index.js'))
    } catch {
      core = await import('@trimly/core')
    }

    const { countTokens, computeCost, cleanFiller, createStorage, getDefaultDbPath } = core

    const model = process.env['ANTHROPIC_MODEL'] ?? 'claude-sonnet-4-6'
    const provider = 'anthropic'

    // Count tokens
    const tokensInput = countTokens(provider, model, prompt)

    // Detect filler (mode: detect — does not modify)
    const fillerResult = cleanFiller(prompt, { mode: 'detect' })

    // Estimate input cost
    const costUsd = computeCost(provider, model, { input_tokens: tokensInput, output_tokens: 0 })

    // Persist pending event
    const dbPath = process.env['TRIMLY_DB_PATH'] ?? getDefaultDbPath()
    const storage = await createStorage(dbPath)

    const eventId = await storage.recordEvent({
      id: randomUUID(),
      session_id,
      timestamp: Date.now(),
      source: 'claude-code',
      provider,
      model,
      tokens_input: tokensInput,
      tokens_output: 0,
      cost_usd: costUsd,
      status: 'pending',
      filler_detected: fillerResult.applied,
      strategies_applied: fillerResult.patternsMatched,
    })

    await storage.close()

    // Advisor mode: suggest optimization if savings are significant
    const config = await loadConfig()
    const savingsPct = tokensInput > 0
      ? Math.round((fillerResult.tokensSaved / tokensInput) * 100)
      : 0

    if (config.advisor && fillerResult.applied && savingsPct >= config.filler.threshold_pct) {
      const cleaned = cleanFiller(prompt, { mode: 'apply' })
      process.stdout.write(
        `\n💡 Trimly: ${tokensInput} tokens (~$${costUsd.toFixed(5)}). ${savingsPct}% de gain possible.\n   Alternative: "${cleaned.text.slice(0, 120)}"\n\n`
      )
    } else if (config.verbose) {
      process.stdout.write(`\n[Trimly] ${tokensInput} tokens · $${costUsd.toFixed(5)} · event ${eventId}\n`)
    }

  } catch (err) {
    // Never block the prompt — silent fail
    if (process.env['TRIMLY_DEBUG']) {
      process.stderr.write(`[Trimly error] ${err}\n`)
    }
  }

  process.exit(0)
}

async function loadConfig() {
  const { join } = await import('node:path')
  const { homedir } = await import('node:os')
  const { readFile } = await import('node:fs/promises')

  const configPath = join(homedir(), '.trimly', 'config.json')
  try {
    const raw = await readFile(configPath, 'utf8')
    return JSON.parse(raw)
  } catch {
    return {
      verbose: false,
      advisor: true,
      filler: { enabled: true, languages: ['fr', 'en'], threshold_pct: 20 },
    }
  }
}

main()
