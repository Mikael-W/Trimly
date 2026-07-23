import { claudeCodeAdapter } from './claude-code.js'
import { codexAdapter } from './codex.js'
import { cursorAdapter } from './cursor.js'
import { geminiAdapter } from './gemini.js'
import type { AgentAdapter, AgentId, Env } from './types.js'

const ADAPTERS: Record<Exclude<AgentId, 'unknown'>, AgentAdapter> = {
  'claude-code': claudeCodeAdapter,
  codex: codexAdapter,
  cursor: cursorAdapter,
  gemini: geminiAdapter,
}

function currentEnv(env?: Env): Env {
  if (env) return env
  return typeof process !== 'undefined' ? process.env : {}
}

export function detectAgent(env?: Env): AgentId {
  const e = currentEnv(env)
  if (e.CLAUDECODE === '1' || e.CLAUDE_PLUGIN_ROOT) return 'claude-code'
  if (e.CODEX_HOME || e.CODEX_SANDBOX || e.CODEX_PLUGIN_ROOT) return 'codex'
  if (e.CURSOR_TRACE_ID || e.CURSOR_AGENT || e.CURSOR_PLUGIN_ROOT) return 'cursor'
  if (e.GEMINI_CLI || e.GEMINI_SANDBOX || e.GEMINI_PLUGIN_ROOT) return 'gemini'
  return 'unknown'
}

export function createAdapter(id: AgentId): AgentAdapter {
  if (id === 'unknown') return claudeCodeAdapter
  return ADAPTERS[id]
}

export function resolveAgent(configAgent?: AgentId | 'auto', env?: Env): AgentAdapter {
  if (configAgent && configAgent !== 'auto') return createAdapter(configAgent)
  const detected = detectAgent(env)
  return createAdapter(detected === 'unknown' ? 'claude-code' : detected)
}
