import type { Provider } from '../types/providers.js'

export type AgentId = 'claude-code' | 'codex' | 'cursor' | 'unknown'

/** What a host agent can actually do, given its hook system. */
export interface AgentCapabilities {
  /** Can surface a prompt advisory / inject optimized context before a turn. */
  promptOptimization: boolean
  /** Can record token/cost events. */
  costTracking: boolean
  /** Can record per-tool-call cost. */
  toolTracking: boolean
}

/** Normalized lifecycle events Trimly cares about, across agents. */
export type HookEvent =
  | 'UserPromptSubmit'
  | 'Stop'
  | 'PostToolUse'
  | 'SessionStart'
  | 'SessionEnd'
  | 'PreCompact'

/** A hook payload normalized from an agent's native stdin shape. */
export interface HookPayload {
  event: HookEvent
  sessionId?: string
  transcriptPath?: string
  cwd?: string
  prompt?: string
  toolName?: string
  /** Original, un-normalized payload for agent-specific needs. */
  raw: Record<string, unknown>
}

/** What Trimly wants to communicate back to the agent for a turn. */
export interface AdvisorOutput {
  /** Advisory / optimized guidance to surface to the model or user. */
  context?: string
}

export type Env = Record<string, string | undefined>

/**
 * An adapter abstracts one host agent (Claude Code, Codex, Cursor, …).
 * Core logic (tokenizing, pricing, strategies) stays agent-agnostic; the
 * adapter only translates payloads, output protocol, and model resolution.
 */
export interface AgentAdapter {
  readonly id: AgentId
  /** Value written to `event.source` in storage. */
  readonly source: string
  readonly capabilities: AgentCapabilities
  parsePayload(event: HookEvent, raw: Record<string, unknown>): HookPayload
  /** Serialize advisor output to this agent's stdout protocol ('' = no output). */
  formatOutput(out: AdvisorOutput, event: HookEvent): string
  resolveModel(env: Env): { provider: Provider; model: string }
}
