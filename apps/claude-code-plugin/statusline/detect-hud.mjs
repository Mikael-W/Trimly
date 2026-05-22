import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'

export function detectClaudeHud() {
  const pluginsDir = join(homedir(), '.claude', 'plugins', 'claude-hud')
  if (existsSync(pluginsDir)) return true

  const settingsPath = join(homedir(), '.claude', 'settings.json')
  if (existsSync(settingsPath)) {
    try {
      const settings = JSON.parse(readFileSync(settingsPath, 'utf-8'))
      return (settings.statusLine?.command ?? settings.statusCommand ?? '').includes('claude-hud')
    } catch {
      return false
    }
  }
  return false
}
