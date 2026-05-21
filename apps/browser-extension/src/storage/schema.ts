export interface BrowserEvent {
  id: string
  timestamp: number
  site: 'claude.ai'
  model: string
  tokens_input: number
  cost_input_usd: number
  optimization_applied: boolean
  tokens_saved?: number
  cost_saved_usd?: number
}

export type StorageData = {
  events: BrowserEvent[]
  version: number
}
