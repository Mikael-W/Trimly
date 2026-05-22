export interface ToolCall {
  id: string
  session_id: string
  event_id: string | null
  tool_name: string
  target: string | null
  tokens_used: number
  cost_usd: number
  timestamp: number
}

export type ToolCallInsert = Omit<ToolCall, 'id'> & { id?: string }
