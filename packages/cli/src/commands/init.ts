import { mkdir, writeFile, access } from 'node:fs/promises'
import { join } from 'node:path'
import { getTrimlyDir, getConfigPath } from '@trimly/core'
import kleur from 'kleur'

const DEFAULT_CONFIG = {
  verbose: false,
  advisor: true,
  filler: { enabled: true, languages: ['fr', 'en'], threshold_pct: 20 },
  storage: { retention_days: 90 },
  currency: 'USD',
  summary_on_session_end: true,
}

export async function cmdInit(): Promise<void> {
  const dir = getTrimlyDir()
  await mkdir(dir, { recursive: true })

  const configPath = getConfigPath()
  try {
    await access(configPath)
    console.log(kleur.yellow(`Config already exists: ${configPath}`))
  } catch {
    await writeFile(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2))
    console.log(kleur.green(`✅ Config created: ${configPath}`))
  }

  console.log(kleur.green(`✅ Trimly initialized at ${dir}`))
  console.log(kleur.gray(`   Run "trimly stats" to see your usage.`))
}
