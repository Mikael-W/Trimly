#!/usr/bin/env node
import { join } from 'node:path'
import { homedir } from 'node:os'
import { mkdir, writeFile, access } from 'node:fs/promises'

async function main() {
  const trimlyDir = join(homedir(), '.trimly')
  await mkdir(trimlyDir, { recursive: true })

  const configPath = join(trimlyDir, 'config.json')
  try {
    await access(configPath)
  } catch {
    const defaultConfig = {
      verbose: false,
      advisor: true,
      filler: { enabled: true, languages: ['fr', 'en'], threshold_pct: 20 },
      storage: { path: join(trimlyDir, 'events.db'), retention_days: 90 },
      currency: 'USD',
      summary_on_session_end: true,
    }
    await writeFile(configPath, JSON.stringify(defaultConfig, null, 2))
    console.log(`✅ Trimly config created at ${configPath}`)
  }

  console.log(`✅ Trimly initialized at ${trimlyDir}`)
}

main().catch(console.error)
