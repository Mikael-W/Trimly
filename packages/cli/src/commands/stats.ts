import { formatCost } from '@trimly/core'
import kleur from 'kleur'
import { t } from '../i18n/index.js'
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
  lines.push(kleur.bold(`📊 ${t('stats.title')}`))
  lines.push('')

  const section = (label: string, stats: Awaited<ReturnType<typeof storage.getStats>>) => {
    lines.push(kleur.bold(label))
    lines.push(`  ${t('stats.prompts').padEnd(10)}${kleur.cyan(String(stats.totalRequests))}`)
    lines.push(
      `  ${t('stats.tokens').padEnd(10)}${kleur.cyan(stats.totalTokensInput.toLocaleString())} ${t('stats.in')} / ${kleur.cyan(stats.totalTokensOutput.toLocaleString())} ${t('stats.out')}`,
    )
    lines.push(
      `  ${t('stats.cost').padEnd(10)}${kleur.yellow(formatCost(stats.totalCostUsd, 'USD', 'en-US'))}`,
    )
    if (stats.totalSavedUsd > 0) {
      const pct =
        stats.totalCostUsd > 0 ? Math.round((stats.totalSavedUsd / stats.totalCostUsd) * 100) : 0
      lines.push(
        `  ${t('stats.saved').padEnd(10)}${kleur.green(formatCost(stats.totalSavedUsd, 'USD', 'en-US'))} (${pct}%)`,
      )
    }
    lines.push('')
  }

  section(t('stats.today'), todayStats)
  section(t('stats.week'), weekStats)
  section(t('stats.month'), monthStats)

  if (Object.keys(monthStats.byModel).length > 0) {
    lines.push(kleur.bold(t('stats.topModels')))
    const sorted = Object.entries(monthStats.byModel)
      .sort((a, b) => b[1].requests - a[1].requests)
      .slice(0, 5)
    for (const [model, data] of sorted) {
      lines.push(
        `  ${kleur.gray(model.padEnd(32))} ${kleur.cyan(String(data.requests))} ${t('stats.promptsSuffix')}`,
      )
    }
    lines.push('')
  }

  console.log(lines.join('\n'))
}
