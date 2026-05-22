export * from './types/index.js'

export { countTokens } from './tokenizer/index.js'

export { computeCost, formatCost } from './pricing/index.js'

export { createStorage } from './storage/factory.js'
export type { TrimlyStorage } from './storage/types.js'
export { LibsqlStorage } from './storage/adapters/libsql.js'
export { NodeSqliteStorage } from './storage/adapters/node-sqlite.js'

export * from './strategies/index.js'

export {
  getTrimlyDir,
  getDefaultDbPath,
  getConfigPath,
  ensureTrimlyDir,
  resolveDbPath,
} from './utils/paths.js'
export { formatSparkline } from './utils/sparkline.js'
export { computeBudgetETA, computeBudgetPct, getDailyAverage } from './utils/budget.js'
export type { DailyStats } from './utils/budget.js'
export { typedMock } from './utils/typedMock.js'
export type { DeepPartial } from './utils/typedMock.js'
