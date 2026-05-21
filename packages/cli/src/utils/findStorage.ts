import { getDefaultDbPath, ensureTrimlyDir, createStorage, resolveDbPath } from '@trimly/core'
import type { TrimlyStorage } from '@trimly/core'

export async function openStorage(dbPath?: string): Promise<TrimlyStorage> {
  const raw = dbPath ?? process.env['TRIMLY_DB_PATH']
  if (raw) {
    const resolved = resolveDbPath(raw)
    return createStorage(resolved)
  }
  await ensureTrimlyDir()
  return createStorage(getDefaultDbPath())
}
