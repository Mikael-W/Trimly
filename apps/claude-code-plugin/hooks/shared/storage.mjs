import { mkdir } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'

function pluginRoot() {
  return process.env.CLAUDE_PLUGIN_ROOT ?? new URL('../..', import.meta.url).pathname
}

export async function getCore() {
  const root = pluginRoot()
  const candidates = [
    join(root, 'node_modules/@trimly/core/dist/index.js'),
    join(root, '.deps/node_modules/@trimly/core/dist/index.js'),
  ]
  for (const path of candidates) {
    try {
      return await import(path)
    } catch {}
  }
  return await import('@trimly/core')
}

export async function getStorage() {
  const dir = join(homedir(), '.trimly')
  await mkdir(dir, { recursive: true })
  const { createStorage } = await getCore()
  return createStorage(join(dir, 'events.db'))
}
