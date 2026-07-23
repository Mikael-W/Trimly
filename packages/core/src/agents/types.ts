import type { Message } from '../strategies/compactHistory.js'
import type { Provider } from '../types/providers.js'

export type AgentId = 'claude-code' | 'codex' | 'cursor' | 'gemini' | 'unknown'

export interface AgentCapabilities {
  promptOptimization: boolean
  costTracking: boolean
  toolTracking: boolean
}

export type HookEvent =
  | 'UserPromptSubmit'
  | 'Stop'
  | 'PostToolUse'
  | 'SessionStart'
  | 'SessionEnd'
  | 'PreCompact'
  | 'BeforeModel'
  | 'AfterModel'

export interface ModelUsage {
  totalTokenCount?: number
  promptTokenCount?: number
  candidatesTokenCount?: number
  cachedContentTokenCount?: number
}

export interface HookPayload {
  event: HookEvent
  sessionId?: string
  transcriptPath?: string
  cwd?: string
  prompt?: string
  toolName?: string
  model?: string
  messages?: Message[]
  usage?: ModelUsage
  raw: Record<string, unknown>
}

export interface AdvisorOutput {
  context?: string
}

export interface ModelRewriteOutput {
  messages?: Message[]
}

export type Env = Record<string, string | undefined>

export interface AgentAdapter {
  readonly id: AgentId
  readonly source: string
  readonly capabilities: AgentCapabilities
  parsePayload(event: HookEvent, raw: Record<string, unknown>): HookPayload
  formatOutput(out: AdvisorOutput, event: HookEvent): string
  formatModelRewrite?(out: ModelRewriteOutput, event: HookEvent): string
  resolveModel(env: Env): { provider: Provider; model: string }
}
