#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HOOKS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'hooks')
const GEMINI_DIR = join(homedir(), '.gemini')
const SETTINGS_FILE = join(GEMINI_DIR, 'settings.json')

function entry(name, script, timeout) {
  return [
    {
      matcher: '*',
      hooks: [
        {
          name,
          type: 'command',
          command: `TRIMLY_AGENT=gemini node "${join(HOOKS_DIR, script)}"`,
          timeout,
        },
      ],
    },
  ]
}

const trimlyHooks = {
  BeforeAgent: entry('trimly-prompt', 'user-prompt-submit.mjs', 5000),
  BeforeModel: entry('trimly-before-model', 'before-model.mjs', 5000),
  AfterModel: entry('trimly-after-model', 'after-model.mjs', 3000),
  AfterTool: entry('trimly-after-tool', 'post-tool-use.mjs', 2000),
  SessionStart: entry('trimly-session-start', 'session-start.mjs', 5000),
  SessionEnd: entry('trimly-session-end', 'session-end.mjs', 2000),
  PreCompress: entry('trimly-pre-compress', 'pre-compact.mjs', 3000),
}

async function main() {
  await mkdir(GEMINI_DIR, { recursive: true })
  let existing = {}
  try {
    existing = JSON.parse(await readFile(SETTINGS_FILE, 'utf8'))
  } catch {}
  const merged = { ...existing, hooks: { ...existing.hooks, ...trimlyHooks } }
  await writeFile(SETTINGS_FILE, JSON.stringify(merged, null, 2))
  process.stdout.write(
    `✅ Trimly hooks installed for Gemini CLI at ${SETTINGS_FILE}\n` +
      `   Events: BeforeAgent, BeforeModel, AfterModel, AfterTool, SessionStart, SessionEnd, PreCompress\n` +
      `   BeforeModel/AfterModel track the resent context + real token usage.\n` +
      `   Context rewrite is OFF by default — enable it in ~/.trimly/config.json (context.rewrite).\n` +
      `   Restart Gemini CLI to activate.\n`,
  )
}

main().catch((e) => {
  process.stderr.write(`[Trimly gemini-setup] ${e}\n`)
  process.exit(1)
})
