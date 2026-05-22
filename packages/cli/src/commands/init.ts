import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { getConfigPath, getTrimlyDir } from '@trimly/core'
import kleur from 'kleur'

const DEFAULT_CONFIG = {
  verbose: false,
  advisor: true,
  filler: { enabled: true, languages: ['fr', 'en'], threshold_pct: 20 },
  storage: { retention_days: 90 },
  currency: 'USD',
  summary_on_session_end: true,
}

function hookCmd(name: string): string {
  return `node ${join(homedir(), '.claude', 'plugins', 'trimly', 'hooks', name)}`
}

function buildHooksBlock() {
  return {
    UserPromptSubmit: [
      { hooks: [{ type: 'command', command: hookCmd('user-prompt-submit.mjs') }] },
    ],
    Stop: [{ hooks: [{ type: 'command', command: hookCmd('stop.mjs') }] }],
    SessionStart: [{ hooks: [{ type: 'command', command: hookCmd('session-start.mjs') }] }],
    SessionEnd: [{ hooks: [{ type: 'command', command: hookCmd('session-end.mjs') }] }],
    PreCompact: [{ hooks: [{ type: 'command', command: hookCmd('pre-compact.mjs') }] }],
  }
}

async function wireHooks(): Promise<void> {
  const settingsPath = join(homedir(), '.claude', 'settings.json')

  let settings: Record<string, unknown> = {}
  try {
    settings = JSON.parse(await readFile(settingsPath, 'utf8'))
  } catch {}

  if (settings.hooks) {
    console.log(kleur.yellow('  Hooks already configured in ~/.claude/settings.json, skipping.'))
    return
  }

  settings.hooks = buildHooksBlock()
  await writeFile(settingsPath, JSON.stringify(settings, null, 2))
  console.log(kleur.green('✅ Hooks wired in ~/.claude/settings.json'))
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

  await wireHooks()

  console.log(kleur.green(`✅ Trimly initialized at ${dir}`))
  console.log(kleur.gray('   Start a Claude Code session to begin tracking.'))
  console.log(kleur.gray('   Run "trimly stats" or "trimly dashboard" to see your usage.'))
}
