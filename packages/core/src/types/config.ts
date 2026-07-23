import type { AgentId } from '../agents/types.js'

export interface FillerConfig {
  enabled: boolean
  languages: string[]
  threshold_pct: number
}

export interface StorageConfig {
  path: string
  retention_days: number
}

export interface BudgetAlerts {
  at_50_pct: boolean
  at_80_pct: boolean
  at_100_pct: boolean
}

export interface BudgetConfig {
  monthly: { amount: number; currency: 'USD' | 'EUR' }
  alerts: BudgetAlerts
}

export interface StatuslineConfig {
  mode: 'default' | 'compact' | 'verbose'
}

export interface OptimizeConfig {
  mode: 'advisor' | 'auto' | 'off'
}

export type ContextStrategy = 'whitespace' | 'dedup' | 'compactHistory'

export interface ContextConfig {
  measure: boolean
  rewrite: boolean
  strategies: ContextStrategy[]
}

export interface ProviderKeys {
  anthropic?: string
  openai?: string
  mistral?: string
}

export interface TrimlyConfig {
  verbose: boolean
  advisor: boolean
  agent: AgentId | 'auto'
  optimize: OptimizeConfig
  context?: ContextConfig
  filler: FillerConfig
  storage: StorageConfig
  currency: 'USD' | 'EUR'
  locale?: string
  summary_on_session_end: boolean
  budget?: BudgetConfig
  statusline?: StatuslineConfig
  keys?: ProviderKeys
}

export const DEFAULT_CONFIG: TrimlyConfig = {
  verbose: false,
  advisor: true,
  agent: 'auto',
  optimize: { mode: 'advisor' },
  context: { measure: true, rewrite: false, strategies: ['whitespace', 'dedup'] },
  filler: {
    enabled: true,
    languages: ['fr', 'en'],
    threshold_pct: 20,
  },
  storage: {
    path: '',
    retention_days: 90,
  },
  currency: 'USD',
  summary_on_session_end: true,
  budget: {
    monthly: { amount: 0, currency: 'USD' },
    alerts: { at_50_pct: true, at_80_pct: true, at_100_pct: true },
  },
  statusline: { mode: 'default' },
}
