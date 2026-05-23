import type {
  QueryEventsOptions,
  StatsResult,
  TrimlyEvent,
  TrimlyEventInsert,
  TrimlySession,
} from '../types/events.js'
import type { ToolCall, ToolCallInsert } from '../types/tool-calls.js'
import type { DailyStats } from '../utils/budget.js'

export interface TrimlyStorage {
  init(): Promise<void>
  close(): Promise<void>

  recordEvent(event: TrimlyEventInsert): Promise<string>
  updateEvent(id: string, patch: Partial<TrimlyEvent>): Promise<void>
  queryEvents(options?: QueryEventsOptions): Promise<TrimlyEvent[]>
  getStats(options?: { days?: number; source?: string }): Promise<StatsResult>
  getDailyStats(days?: number): Promise<DailyStats[]>

  upsertSession(
    session: Omit<
      TrimlySession,
      'ended_at' | 'total_tokens_input' | 'total_tokens_output' | 'total_cost_usd'
    > &
      Partial<TrimlySession>,
  ): Promise<void>
  updateSession(id: string, patch: Partial<TrimlySession>): Promise<void>

  recordToolCall(call: ToolCallInsert): Promise<string>
  getRecentToolCalls(session_id: string, limit?: number): Promise<ToolCall[]>
}
