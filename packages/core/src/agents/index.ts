export type {
  AgentAdapter,
  AgentCapabilities,
  AgentId,
  AdvisorOutput,
  Env,
  HookEvent,
  HookPayload,
} from './types.js'
export { claudeCodeAdapter } from './claude-code.js'
export { codexAdapter } from './codex.js'
export { cursorAdapter } from './cursor.js'
export { createAdapter, detectAgent, resolveAgent } from './factory.js'
