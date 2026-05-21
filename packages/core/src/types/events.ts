export type EventSource = 'claude-code' | 'browser-extension'
export type EventStatus = 'pending' | 'completed'

export interface TrimlyEvent {
  id: string
  session_id: string
  timestamp: number
  source: EventSource

  provider: string
  model: string

  tokens_input: number
  tokens_output: number
  tokens_cache_read: number
  tokens_cache_write: number

  tokens_saved_optim: number
  tokens_saved_shadow: number

  cost_usd: number
  cost_saved_usd: number
  cost_saved_shadow_usd: number

  duration_ms: number | null
  status: EventStatus

  filler_detected: boolean
  strategies_applied: string[]

  prompt_preview: string | null
  tags: string | null
}

export type TrimlyEventInsert = Omit<
  TrimlyEvent,
  | 'id'
  | 'tokens_output'
  | 'tokens_cache_read'
  | 'tokens_cache_write'
  | 'tokens_saved_optim'
  | 'tokens_saved_shadow'
  | 'cost_saved_usd'
  | 'cost_saved_shadow_usd'
  | 'duration_ms'
  | 'strategies_applied'
  | 'prompt_preview'
  | 'tags'
> & {
  id?: string
  tokens_output?: number
  tokens_cache_read?: number
  tokens_cache_write?: number
  tokens_saved_optim?: number
  tokens_saved_shadow?: number
  cost_saved_usd?: number
  cost_saved_shadow_usd?: number
  duration_ms?: number | null
  strategies_applied?: string[]
  prompt_preview?: string | null
  tags?: string | null
}

export interface TrimlySession {
  id: string
  source: EventSource
  started_at: number
  ended_at: number | null
  cwd: string | null
  total_tokens_input: number
  total_tokens_output: number
  total_cost_usd: number
}

export interface QueryEventsOptions {
  session_id?: string
  source?: EventSource
  status?: EventStatus
  limit?: number
  cursor?: number
  days?: number
}

export interface StatsResult {
  totalRequests: number
  totalTokensInput: number
  totalTokensOutput: number
  totalCostUsd: number
  totalSavedUsd: number
  byModel: Record<string, { requests: number; cost: number }>
}
