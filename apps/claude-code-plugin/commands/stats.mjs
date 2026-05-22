#!/usr/bin/env node
import { homedir } from 'node:os'
import { join } from 'node:path'

const args = process.argv.slice(2)
const sessionFlag = args.indexOf('--session')
const sessionId = sessionFlag >= 0 ? args[sessionFlag + 1] : undefined

async function main() {
  try {
    const pluginRoot =
      process.env['CLAUDE_PLUGIN_ROOT'] ?? join(homedir(), '.claude', 'plugins', 'trimly')
    let core
    try {
      core = await import(join(pluginRoot, 'node_modules', '@trimly/core', 'dist', 'index.js'))
    } catch {
      core = await import('@trimly/core')
    }

    const { createStorage, getDefaultDbPath, formatCost } = core
    const dbPath = process.env['TRIMLY_DB_PATH'] ?? getDefaultDbPath()
    const storage = await createStorage(dbPath)

    const [sessionStats, todayStats, monthStats] = await Promise.all([
      sessionId
        ? storage.queryEvents({ session_id: sessionId, status: 'completed' }).then(eventsToStats)
        : Promise.resolve(null),
      storage.getStats({ days: 1 }),
      storage.getStats({ days: 30 }),
    ])

    await storage.close()

    const out = []
    out.push('\n📊 Trimly stats\n')

    if (sessionStats) {
      out.push(`Session courante:`)
      out.push(`  Prompts:    ${sessionStats.count}`)
      out.push(
        `  Tokens:     ${sessionStats.tokensIn.toLocaleString()} in / ${sessionStats.tokensOut.toLocaleString()} out`,
      )
      out.push(`  Cost:       ${formatCost(sessionStats.cost, 'USD', 'en-US')}`)
      out.push(
        `  Saved:      ${formatCost(sessionStats.saved, 'USD', 'en-US')} (${pct(sessionStats.saved, sessionStats.cost)}%)`,
      )
      out.push('')
    }

    out.push(`Aujourd'hui:`)
    out.push(`  Prompts:    ${todayStats.totalRequests}`)
    out.push(
      `  Tokens:     ${todayStats.totalTokensInput.toLocaleString()} in / ${todayStats.totalTokensOutput.toLocaleString()} out`,
    )
    out.push(`  Cost:       ${formatCost(todayStats.totalCostUsd, 'USD', 'en-US')}`)
    out.push(`  Saved:      ${formatCost(todayStats.totalSavedUsd, 'USD', 'en-US')}`)
    out.push('')

    out.push(`Ce mois (30j):`)
    out.push(`  Prompts:    ${monthStats.totalRequests}`)
    out.push(`  Tokens:     ${monthStats.totalTokensInput.toLocaleString()} in`)
    out.push(`  Cost:       ${formatCost(monthStats.totalCostUsd, 'USD', 'en-US')}`)
    out.push(
      `  Saved:      ${formatCost(monthStats.totalSavedUsd, 'USD', 'en-US')} (${pct(monthStats.totalSavedUsd, monthStats.totalCostUsd)}%)`,
    )
    out.push('')

    if (Object.keys(monthStats.byModel).length > 0) {
      out.push('Top modèles (30j):')
      for (const [model, data] of Object.entries(monthStats.byModel).slice(0, 3)) {
        out.push(`  ${model.padEnd(30)} ${data.requests} prompts`)
      }
      out.push('')
    }

    out.push('💡 Run /trimly:dashboard pour la vue détaillée.\n')

    process.stdout.write(out.join('\n'))
  } catch (err) {
    process.stderr.write(`[Trimly stats error] ${err}\n`)
    process.exit(1)
  }
}

function eventsToStats(events) {
  return {
    count: events.length,
    tokensIn: events.reduce((s, e) => s + e.tokens_input, 0),
    tokensOut: events.reduce((s, e) => s + e.tokens_output, 0),
    cost: events.reduce((s, e) => s + e.cost_usd, 0),
    saved: events.reduce((s, e) => s + e.cost_saved_usd, 0),
  }
}

function pct(saved, total) {
  if (!total) return 0
  return Math.round((saved / total) * 100)
}

main()
