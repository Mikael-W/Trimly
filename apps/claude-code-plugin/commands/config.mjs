#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'

const CONFIG_PATH = join(homedir(), '.trimly', 'config.json')

const DEFAULT_CONFIG = {
  verbose: false,
  advisor: true,
  filler: { enabled: true, languages: ['fr', 'en'], threshold_pct: 20 },
  storage: { path: join(homedir(), '.trimly', 'events.db'), retention_days: 90 },
  currency: 'USD',
  summary_on_session_end: true,
  budget: {
    monthly: { amount: 0, currency: 'USD' },
    alerts: { at_50_pct: true, at_80_pct: true, at_100_pct: true },
  },
  statusline: { mode: 'default' },
}

async function main() {
  await mkdir(join(homedir(), '.trimly'), { recursive: true })

  let config
  try {
    const raw = await readFile(CONFIG_PATH, 'utf8')
    config = JSON.parse(raw)
  } catch {
    config = DEFAULT_CONFIG
    await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2))
  }

  const editor = process.env['EDITOR'] ?? process.env['VISUAL'] ?? 'nano'

  if (process.argv.includes('--show')) {
    process.stdout.write(JSON.stringify(config, null, 2) + '\n')
    return
  }

  const child = spawn(editor, [CONFIG_PATH], { stdio: 'inherit' })
  child.on('exit', () => process.exit(0))
}

main().catch((err) => {
  process.stderr.write(`[Trimly config error] ${err}\n`)
  process.exit(1)
})
