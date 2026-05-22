#!/usr/bin/env node
/**
 * /trimly:statusline-setup
 *
 * Writes the Trimly statusLine config into ~/.claude/settings.json
 * and lets the user pick the display mode.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { homedir } from 'node:os'

const SETTINGS_PATH = join(homedir(), '.claude', 'settings.json')
const PLUGIN_ROOT = process.env['CLAUDE_PLUGIN_ROOT'] ?? join(homedir(), '.claude', 'plugins', 'trimly')
// Use full path to node — Claude Code runs statusCommand with a minimal PATH
// where nvm/volta-managed node binaries are not available.
const NODE_BIN = process.execPath
const STATUS_CMD = `${NODE_BIN} --no-warnings ${PLUGIN_ROOT}/statusline/index.mjs`
const CONFIG_PATH = join(homedir(), '.trimly', 'config.json')

async function main() {
  const mode = process.argv[2] ?? 'default'
  const validModes = ['default', 'compact', 'verbose']

  if (!validModes.includes(mode)) {
    process.stdout.write(
      `Usage: /trimly:statusline-setup [mode]\n` +
      `Modes: default (2 lines) | compact (1 line) | verbose (3-4 lines)\n\n` +
      `Current modes:\n` +
      `  default  — budget + savings + sparkline\n` +
      `  compact  — cost today + trend in 1 line\n` +
      `  verbose  — full detail including tool calls\n`
    )
    process.exit(0)
  }

  // Update ~/.claude/settings.json
  let settings = {}
  try {
    settings = JSON.parse(await readFile(SETTINGS_PATH, 'utf8'))
  } catch {
    // settings.json may not exist yet
  }

  // Claude Code expects `statusLine` as an object (type + command), not a
  // bare `statusCommand` string. Remove any legacy key while we're here.
  delete settings.statusCommand
  settings.statusLine = { type: 'command', command: STATUS_CMD, padding: 0 }
  await mkdir(join(homedir(), '.claude'), { recursive: true })
  await writeFile(SETTINGS_PATH, JSON.stringify(settings, null, 2))

  // Update ~/.trimly/config.json statusline.mode
  let config = {}
  try {
    config = JSON.parse(await readFile(CONFIG_PATH, 'utf8'))
  } catch {
    // config may not exist
  }
  config.statusline = { ...config.statusline, mode }
  await mkdir(join(homedir(), '.trimly'), { recursive: true })
  await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2))

  process.stdout.write(
    `✅ Trimly status line configured!\n` +
    `   Mode: ${mode}\n` +
    `   Command: ${STATUS_CMD}\n\n` +
    `Restart Claude Code to activate the status bar.\n` +
    `Toggle mode anytime: /trimly:statusline-setup [default|compact|verbose]\n`
  )
}

main().catch((err) => {
  process.stderr.write(`[Trimly statusline-setup error] ${err}\n`)
  process.exit(1)
})
