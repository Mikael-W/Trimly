#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HOOKS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'hooks')
const CURSOR_DIR = join(homedir(), '.cursor')
const HOOKS_FILE = join(CURSOR_DIR, 'hooks.json')

function hook(script, timeout) {
  return [
    { type: 'command', command: `TRIMLY_AGENT=cursor node "${join(HOOKS_DIR, script)}"`, timeout },
  ]
}

const trimlyHooks = {
  beforeSubmitPrompt: hook('user-prompt-submit.mjs', 5),
  stop: hook('session-end.mjs', 2),
}

async function main() {
  await mkdir(CURSOR_DIR, { recursive: true })
  let existing = { version: 1, hooks: {} }
  try {
    existing = JSON.parse(await readFile(HOOKS_FILE, 'utf8'))
  } catch {}
  const merged = {
    version: existing.version ?? 1,
    hooks: { ...existing.hooks, ...trimlyHooks },
  }
  await writeFile(HOOKS_FILE, JSON.stringify(merged, null, 2))
  process.stdout.write(
    `✅ Trimly hooks installed for Cursor at ${HOOKS_FILE}\n` +
      `   Events: beforeSubmitPrompt (input cost), stop (session end)\n` +
      `   Note: Cursor doesn't expose token usage to hooks — output/tool cost is not tracked.\n` +
      `   Reload Cursor to activate.\n`,
  )
}

main().catch((e) => {
  process.stderr.write(`[Trimly cursor-setup] ${e}\n`)
  process.exit(1)
})
