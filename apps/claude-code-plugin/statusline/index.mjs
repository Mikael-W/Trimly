#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'

import { getHistoricalData } from './data/historical.mjs'
import { detectClaudeHud } from './detect-hud.mjs'
import { renderComboHud } from './renderers/combo-hud.mjs'
import { renderCompact } from './renderers/compact.mjs'
import { renderDefault } from './renderers/default.mjs'
import { renderVerbose } from './renderers/verbose.mjs'

const CONFIG_PATH = join(homedir(), '.trimly', 'config.json')
const DEFAULT_DB_PATH = join(homedir(), '.trimly', 'events.db')

async function loadConfig() {
  try {
    return JSON.parse(await readFile(CONFIG_PATH, 'utf8'))
  } catch {
    return {}
  }
}

async function main() {
  const input = await readStdinWithTimeout(200)

  const config = await loadConfig()
  const dbPath = process.env.TRIMLY_DB_PATH ?? config.storage?.path ?? DEFAULT_DB_PATH

  const data = await getHistoricalData(dbPath)

  const mode = config.statusline?.mode ?? 'default'
  const hudDetected = detectClaudeHud()

  let output = ''

  if (hudDetected || mode === 'combo') {
    output = renderComboHud(data, config)
  } else if (mode === 'compact') {
    output = renderCompact(data, config)
  } else if (mode === 'verbose') {
    const recentTools = await getRecentTools(input?.session_id, dbPath)
    output = renderVerbose(data, config, recentTools)
  } else {
    output = renderDefault(data, config)
  }

  if (output) {
    process.stdout.write(`${output}\n`)
  }

  process.exit(0)
}

async function getRecentTools(sessionId, dbPath) {
  if (!sessionId) return []
  try {
    const { DatabaseSync } = await import('node:sqlite')
    const { existsSync } = await import('node:fs')
    if (!existsSync(dbPath)) return []

    const db = new DatabaseSync(dbPath, { open: false })
    db.open({ readOnly: true })
    const rows = db
      .prepare('SELECT * FROM tool_calls WHERE session_id = ? ORDER BY timestamp DESC LIMIT 5')
      .all(sessionId)
    db.close()
    return rows
  } catch {
    return []
  }
}

function readStdinWithTimeout(ms) {
  return new Promise((resolve) => {
    if (process.stdin.isTTY) {
      resolve(null)
      return
    }

    let data = ''
    const timer = setTimeout(() => resolve(null), ms)

    process.stdin.setEncoding('utf8')
    process.stdin.on('data', (chunk) => {
      data += chunk
    })
    process.stdin.on('end', () => {
      clearTimeout(timer)
      try {
        resolve(JSON.parse(data))
      } catch {
        resolve(null)
      }
    })
    process.stdin.on('error', () => {
      clearTimeout(timer)
      resolve(null)
    })
  })
}

main().catch(() => process.exit(0))
