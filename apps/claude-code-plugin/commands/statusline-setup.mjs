#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'

const SETTINGS_PATH = join(homedir(), '.claude', 'settings.json')
const PLUGIN_ROOT =
  process.env.CLAUDE_PLUGIN_ROOT ?? join(homedir(), '.claude', 'plugins', 'trimly')
const NODE_BIN = process.execPath
const STATUS_CMD = `${NODE_BIN} --no-warnings ${PLUGIN_ROOT}/statusline/index.mjs`
const CONFIG_PATH = join(homedir(), '.trimly', 'config.json')

async function main() {
  const mode = process.argv[2] ?? 'default'
  const validModes = ['default', 'compact', 'verbose']

  if (!validModes.includes(mode)) {
    process.stdout.write(
      'Usage: /trimly:statusline-setup [mode]\n' +
        'Modes: default (2 lines) | compact (1 line) | verbose (3-4 lines)\n\n' +
        'Current modes:\n' +
        '  default  — budget + savings + sparkline\n' +
        '  compact  — cost today + trend in 1 line\n' +
        '  verbose  — full detail including tool calls\n',
    )
    process.exit(0)
  }

  let settings = {}
  try {
    settings = JSON.parse(await readFile(SETTINGS_PATH, 'utf8'))
  } catch {}

  settings.statusCommand = undefined
  settings.statusLine = { type: 'command', command: STATUS_CMD, padding: 0 }
  await mkdir(join(homedir(), '.claude'), { recursive: true })
  await writeFile(SETTINGS_PATH, JSON.stringify(settings, null, 2))

  let config = {}
  try {
    config = JSON.parse(await readFile(CONFIG_PATH, 'utf8'))
  } catch {}
  config.statusline = { ...config.statusline, mode }
  await mkdir(join(homedir(), '.trimly'), { recursive: true })
  await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2))

  process.stdout.write(
    `✅ Trimly status line configured!\n   Mode: ${mode}\n   Command: ${STATUS_CMD}\n\nRestart Claude Code to activate the status bar.\nToggle mode anytime: /trimly:statusline-setup [default|compact|verbose]\n`,
  )
}

main().catch((err) => {
  process.stderr.write(`[Trimly statusline-setup error] ${err}\n`)
  process.exit(1)
})
