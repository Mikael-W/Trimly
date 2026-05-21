import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { mkdir } from 'node:fs/promises'

export function getTrimlyDir(): string {
  return join(homedir(), '.trimly')
}

export function getDefaultDbPath(): string {
  return join(getTrimlyDir(), 'events.db')
}

export function getConfigPath(): string {
  return join(getTrimlyDir(), 'config.json')
}

export async function ensureTrimlyDir(): Promise<string> {
  const dir = getTrimlyDir()
  await mkdir(dir, { recursive: true })
  return dir
}

export function resolveDbPath(path: string): string {
  if (path === ':memory:') return path
  if (path.startsWith('~')) return resolve(path.replace('~', homedir()))
  return resolve(path)
}
