#!/usr/bin/env node
import { randomUUID, createHash } from 'node:crypto'
import { join } from 'node:path'
import { homedir } from 'node:os'
import { readStdinJson } from './shared/stdin.mjs'
import { readFile, unlink, writeFile } from 'node:fs/promises'

const PENDING_FILE = join(homedir(), '.trimly', '.pending.json')

function promptHash(prompt) {
  return createHash('sha1').update(prompt).digest('hex').slice(0, 12)
}

const PENDING_TTL_MS = 5 * 60_000

async function savePending(original, lighter) {
  await writeFile(PENDING_FILE, JSON.stringify({ original, lighter, ts: Date.now() }))
}

async function readPending() {
  try {
    const data = JSON.parse(await readFile(PENDING_FILE, 'utf8'))
    if (Date.now() - (data.ts ?? 0) > PENDING_TTL_MS) {
      await clearPending()
      return null
    }
    return data
  } catch {
    return null
  }
}

async function clearPending() {
  await unlink(PENDING_FILE).catch(() => {})
}

function cleanupSuggestion(text) {
  let r = text
  r = r.replace(/\s*[.!?]\s*,/g, ',')        // ". ," → ","
  r = r.replace(/,\s*\./g, '.')               // ", ." → "."
  r = r.replace(/,\s*,+/g, ',')              // ",," → ","
  r = r.replace(/[.!?]\s*[.!?]+/g, '.')      // ".." → "."
  // Remove short orphaned fragments at start (< 5 words before first meaningful clause)
  r = r.replace(/^(?:[\w\s''àâéèêëîïôùûç]{1,40},\s*){1,3}/, (m) => {
    const words = m.trim().split(/\s+/).length
    return words <= 6 ? '' : m
  })
  r = r.replace(/^[\s.,;:!?]+/, '')           // strip leading punctuation
  r = r.replace(/\s+/g, ' ').trim()
  return r.replace(/^([a-zàâéèêëîïôùûç])/, c => c.toUpperCase())
}

async function main() {
  const input = await readStdinJson()
  if (!input) process.exit(0)

  const { session_id = '', transcript_path = '', cwd = '', prompt = '' } = input

  if (!prompt) process.exit(0)

  try {
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
    const config = await loadConfig()

    // Handle oui/non responses to a pending advisor suggestion
    const trimmed = prompt.trim().toLowerCase()
    if (trimmed === 'oui' || trimmed === 'non') {
      const pending = await readPending()
      if (pending) {
        await clearPending()
        const chosen = trimmed === 'oui' ? pending.lighter : pending.original
        const label = trimmed === 'oui' ? 'allégée' : 'originale'
        process.stdout.write(JSON.stringify({
          hookSpecificOutput: {
            hookEventName: 'UserPromptSubmit',
            additionalContext: `[Trimly] L'utilisateur a choisi la version ${label}. Traite ce message comme si l'utilisateur avait envoyé : "${chosen}". Réponds directement à cette demande, ignore le "${trimmed}".`,
          },
        }))
        process.exit(0)
      }
    }

    // Count tokens + detect filler
    const tokensInput = countTokens(provider, model, prompt)
    const fillerResult = cleanFiller(prompt, { mode: 'detect', languages: config.filler?.languages })
    const costUsd = computeCost(provider, model, { input_tokens: tokensInput, output_tokens: 0 })

    // Persist event
    const dbPath = process.env['TRIMLY_DB_PATH'] ?? getDefaultDbPath()
    const storage = await createStorage(dbPath)
    const costSavedUsd = fillerResult.tokensSaved > 0
      ? computeCost(provider, model, { input_tokens: fillerResult.tokensSaved, output_tokens: 0 })
      : 0

    await storage.recordEvent({
      id: randomUUID(),
      session_id,
      timestamp: Date.now(),
      source: 'claude-code',
      provider,
      model,
      tokens_input: tokensInput,
      tokens_output: 0,
      cost_usd: costUsd,
      cost_saved_usd: costSavedUsd,
      tokens_saved_optim: fillerResult.tokensSaved ?? 0,
      status: 'pending',
      filler_detected: fillerResult.applied,
      strategies_applied: fillerResult.patternsMatched,
    })
    await storage.close()

    // Advisor: block and suggest if savings are significant
    const savingsPct = tokensInput > 0
      ? Math.round((fillerResult.tokensSaved / tokensInput) * 100)
      : 0

    if (config.advisor && fillerResult.applied && savingsPct >= config.filler.threshold_pct) {
      const cleaned = cleanFiller(prompt, { mode: 'apply', languages: config.filler?.languages })
      const suggestion = cleanupSuggestion(cleaned.text).slice(0, 200)
      await savePending(prompt, suggestion)
      process.stdout.write(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'UserPromptSubmit',
          additionalContext: `[Trimly advisor] ${tokensInput} tokens (~$${costUsd.toFixed(5)}) · ${savingsPct}% de filler détecté.\nVersion allégée : "${suggestion}"\nRéponds UNIQUEMENT avec cette ligne exacte, rien d'autre :\n💡 Trimly: ${tokensInput} → ${tokensInput - fillerResult.tokensSaved} tokens (−${fillerResult.tokensSaved} · −$${costSavedUsd.toFixed(5)}) · Tape \`oui\` pour la version allégée ou \`non\` pour l'original.`,
        },
      }))
    }

  } catch (err) {
    if (process.env['TRIMLY_DEBUG']) {
      process.stderr.write(`[Trimly error] ${err}\n`)
    }
  }

  process.exit(0)
}

async function loadConfig() {
  const configPath = join(homedir(), '.trimly', 'config.json')
  try {
    return JSON.parse(await readFile(configPath, 'utf8'))
  } catch {
    return {
      verbose: false,
      advisor: true,
      filler: { enabled: true, languages: ['fr', 'en'], threshold_pct: 20 },
    }
  }
}

main()
