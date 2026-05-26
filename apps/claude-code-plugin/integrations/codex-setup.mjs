#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HOOKS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'hooks')
const CODEX_DIR = join(homedir(), '.codex')
const HOOKS_FILE = join(CODEX_DIR, 'hooks.json')

function entry(script, timeout) {
  return [
    {
      hooks: [
        {
          type: 'command',
          command: `TRIMLY_AGENT=codex node "${join(HOOKS_DIR, script)}"`,
          timeout,
        },
      ],
    },
  ]
}

const trimlyHooks = {
  UserPromptSubmit: entry('user-prompt-submit.mjs', 5),
  Stop: entry('stop.mjs', 3),
  PostToolUse: entry('post-tool-use.mjs', 2),
  SessionStart: entry('session-start.mjs', 2),
  SessionEnd: entry('session-end.mjs', 2),
  PreCompact: entry('pre-compact.mjs', 3),
}

async function main() {
  await mkdir(CODEX_DIR, { recursive: true })
  let existing = {}
  try {
    existing = JSON.parse(await readFile(HOOKS_FILE, 'utf8'))
  } catch {}
  const merged = { ...existing, hooks: { ...existing.hooks, ...trimlyHooks } }
  await writeFile(HOOKS_FILE, JSON.stringify(merged, null, 2))
  process.stdout.write(
    `✅ Trimly hooks installed for Codex at ${HOOKS_FILE}\n` +
      `   Events: UserPromptSubmit, Stop, PostToolUse, SessionStart, SessionEnd, PreCompact\n` +
      `   Run \`/hooks\` in Codex to review & trust them, then restart.\n`,
  )
}

main().catch((e) => {
  process.stderr.write(`[Trimly codex-setup] ${e}\n`)
  process.exit(1)
})
