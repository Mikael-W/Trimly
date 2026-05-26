import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import kleur from 'kleur'
import { t } from '../i18n/index.js'
import { openStorage } from '../utils/findStorage.js'

interface ExportOptions {
  db?: string
  output?: string
  format?: 'json' | 'csv'
}

export async function cmdExport(options: ExportOptions = {}): Promise<void> {
  const storage = await openStorage(options.db)
  const events = await storage.queryEvents({ limit: 10_000 })
  await storage.close()

  const format = options.format ?? 'json'
  const outPath = options.output ?? join(process.cwd(), `trimly-export-${Date.now()}.${format}`)

  if (format === 'csv') {
    const header = 'id,timestamp,source,provider,model,tokens_input,tokens_output,cost_usd,status'
    const rows = events.map((e) =>
      [
        e.id,
        e.timestamp,
        e.source,
        e.provider,
        e.model,
        e.tokens_input,
        e.tokens_output,
        e.cost_usd,
        e.status,
      ].join(','),
    )
    await writeFile(outPath, [header, ...rows].join('\n'))
  } else {
    await writeFile(outPath, JSON.stringify(events, null, 2))
  }

  console.log(kleur.green(`✅ ${t('export.done', { n: events.length, path: outPath })}`))
}
