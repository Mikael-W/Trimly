import type { TrimlyStorage } from './types.js'

async function hasNodeSqlite(): Promise<boolean> {
  try {
    await import('node:sqlite' as string)
    return true
  } catch {
    return false
  }
}

export async function createStorage(path: string): Promise<TrimlyStorage> {
  if (await hasNodeSqlite()) {
    const { NodeSqliteStorage } = await import('./adapters/node-sqlite.js')
    const storage = new NodeSqliteStorage(path)
    await storage.init()
    return storage
  }

  const { LibsqlStorage } = await import('./adapters/libsql.js')
  const storage = new LibsqlStorage(path)
  await storage.init()
  return storage
}
