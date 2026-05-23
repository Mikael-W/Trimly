import { formatCost } from '@trimly/core'
import kleur from 'kleur'
import { openStorage } from '../utils/findStorage.js'

interface StatsOptions {
  db?: string
  days?: number
}

export async function cmdStats(options: StatsOptions = {}): Promise<void> {
  const storage = await openStorage(options.db)

  const [todayStats, weekStats, monthStats] = await Promise.all([
    storage.getStats({ days: 1 }),
    storage.getStats({ days: 7 }),
    storage.getStats({ days: 30 }),
  ])

  await storage.close()

  const lines: string[] = []
  lines.push('')
  lines.push(kleur.bold('📊 Trimly stats'))
  lines.push('')

  const section = (label: string, stats: Awaited<ReturnType<typeof storage.getStats>>) => {
    lines.push(kleur.bold(label))
    lines.push(`  Prompts:  ${kleur.cyan(String(stats.totalRequests))}`)
    lines.push(
      `  Tokens:   ${kleur.cyan(stats.totalTokensInput.toLocaleString())} in / ${kleur.cyan(stats.totalTokensOutput.toLocaleString())} out`,
    )
    lines.push(`  Cost:     ${kleur.yellow(formatCost(stats.totalCostUsd, 'USD', 'en-US'))}`)
    if (stats.totalSavedUsd > 0) {
      const pct =
        stats.totalCostUsd > 0 ? Math.round((stats.totalSavedUsd / stats.totalCostUsd) * 100) : 0
      lines.push(
        `  Saved:    ${kleur.green(formatCost(stats.totalSavedUsd, 'USD', 'en-US'))} (${pct}%)`,
      )
    }
    lines.push('')
  }

  section("Aujourd'hui:", todayStats)
  section('Cette semaine (7j):', weekStats)
  section('Ce mois (30j):', monthStats)

  if (Object.keys(monthStats.byModel).length > 0) {
    lines.push(kleur.bold('Top modèles (30j):'))
    const sorted = Object.entries(monthStats.byModel)
      .sort((a, b) => b[1].requests - a[1].requests)
      .slice(0, 5)
    for (const [model, data] of sorted) {
      lines.push(`  ${kleur.gray(model.padEnd(32))} ${kleur.cyan(String(data.requests))} prompts`)
    }
    lines.push('')
  }

  console.log(lines.join('\n'))
}
