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

/**
 * Prompt-lightening behaviour:
 * - 'advisor' : show the oui/non suggestion (default, non-intrusive)
 * - 'auto'    : inject the optimized version without confirmation
 * - 'off'     : track usage only, no suggestion
 */
export interface OptimizeConfig {
  mode: 'advisor' | 'auto' | 'off'
}

/** Provider API keys, used to infer provider/model and (later) pricing. */
export interface ProviderKeys {
  anthropic?: string
  openai?: string
  mistral?: string
}

export interface TrimlyConfig {
  verbose: boolean
  advisor: boolean
  /** Host agent: 'auto' detects from env; an explicit id overrides detection. */
  agent: AgentId | 'auto'
  optimize: OptimizeConfig
  filler: FillerConfig
  storage: StorageConfig
  currency: 'USD' | 'EUR'
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
