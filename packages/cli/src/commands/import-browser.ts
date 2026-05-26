import { readFile } from 'node:fs/promises'
import type { TrimlyEventInsert } from '@trimly/core'
import kleur from 'kleur'
import { t } from '../i18n/index.js'
import { openStorage } from '../utils/findStorage.js'

interface BrowserEvent {
  id: string
  timestamp: number
  site: string
  model: string
  tokens_input: number
  cost_input_usd: number
  optimization_applied?: boolean
  tokens_saved?: number
  cost_saved_usd?: number
}

interface ImportOptions {
  db?: string
}

export async function cmdImportBrowser(
  filePath: string,
  options: ImportOptions = {},
): Promise<void> {
  const raw = await readFile(filePath, 'utf8')
  const browserEvents: BrowserEvent[] = JSON.parse(raw)

  if (!Array.isArray(browserEvents)) {
    throw new Error(t('import.invalidFormat'))
  }

  const storage = await openStorage(options.db)
  let inserted = 0
  let skipped = 0

  for (const be of browserEvents) {
    const event: TrimlyEventInsert = {
      id: be.id,
      session_id: `browser-${be.site}-${new Date(be.timestamp).toISOString().slice(0, 10)}`,
      timestamp: be.timestamp,
      source: 'browser-extension',
      provider: 'anthropic',
      model: be.model ?? 'claude-sonnet-4-6',
      tokens_input: be.tokens_input ?? 0,
      tokens_output: 0,
      cost_usd: be.cost_input_usd ?? 0,
      cost_saved_usd: be.cost_saved_usd ?? 0,
      status: 'completed',
      filler_detected: be.optimization_applied ?? false,
      tokens_saved_optim: be.tokens_saved ?? 0,
    }

    try {
      await storage.recordEvent(event)
      inserted++
    } catch {
      skipped++
    }
  }

  await storage.close()
  console.log(kleur.green(`✅ ${t('import.done', { n: inserted, m: skipped })}`))
}
