import { mkdir } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'

export async function getStorage() {
  const dir = join(homedir(), '.trimly')
  await mkdir(dir, { recursive: true })
  const dbPath = join(dir, 'events.db')

  const pluginRoot = process.env.CLAUDE_PLUGIN_ROOT ?? new URL('../..', import.meta.url).pathname

  try {
    const { createStorage } = await import(
      join(pluginRoot, 'node_modules/@trimly/core/dist/index.js')
    )
    return createStorage(dbPath)
  } catch {
    const { createStorage } = await import('@trimly/core')
    return createStorage(dbPath)
  }
}

export async function getCore() {
  const pluginRoot = process.env.CLAUDE_PLUGIN_ROOT ?? new URL('../..', import.meta.url).pathname

  try {
    return await import(join(pluginRoot, 'node_modules/@trimly/core/dist/index.js'))
  } catch {
    return await import('@trimly/core')
  }
}
