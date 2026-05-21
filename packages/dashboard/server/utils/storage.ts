import { createStorage, ensureTrimlyDir, getDefaultDbPath } from '@trimly/core'
import type { TrimlyStorage } from '@trimly/core'

let _storage: TrimlyStorage | null = null

export async function getStorage(): Promise<TrimlyStorage> {
  if (_storage) return _storage
  const path = process.env['TRIMLY_DB_PATH'] ?? getDefaultDbPath()
  if (!process.env['TRIMLY_DB_PATH']) await ensureTrimlyDir()
  _storage = await createStorage(path)
  return _storage
}
