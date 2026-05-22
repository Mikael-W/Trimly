#!/usr/bin/env node
import { homedir } from 'node:os'
import { join } from 'node:path'
import { createInterface } from 'node:readline'

const args = process.argv.slice(2)

async function confirm(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.toLowerCase().startsWith('y') || answer.toLowerCase() === 'o')
    })
  })
}

async function main() {
  const pluginRoot =
    process.env['CLAUDE_PLUGIN_ROOT'] ?? join(homedir(), '.claude', 'plugins', 'trimly')
  let core
  try {
    core = await import(join(pluginRoot, 'node_modules', '@trimly/core', 'dist', 'index.js'))
  } catch {
    core = await import('@trimly/core')
  }

  const { createStorage, getDefaultDbPath } = core
  const dbPath = process.env['TRIMLY_DB_PATH'] ?? getDefaultDbPath()
  const storage = await createStorage(dbPath)

  const ok = await confirm('⚠️  Supprimer tous les events Trimly? (y/N) ')

  if (!ok) {
    process.stdout.write('Annulé.\n')
    await storage.close()
    return
  }

  // @ts-ignore
  if (storage.client) {
    await storage.client.execute('DELETE FROM events')
    await storage.client.execute('DELETE FROM sessions')
  } else if (storage.db) {
    storage.db.exec('DELETE FROM events; DELETE FROM sessions;')
  }

  await storage.close()
  process.stdout.write('✅ Données Trimly supprimées.\n')
}

main().catch((err) => {
  process.stderr.write(`[Trimly clear error] ${err}\n`)
  process.exit(1)
})
