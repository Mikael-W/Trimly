export const RESET = '\x1b[0m'
export const BOLD = '\x1b[1m'
export const DIM = '\x1b[2m'

export const GREEN = '\x1b[32m'
export const YELLOW = '\x1b[33m'
export const RED = '\x1b[31m'
export const CYAN = '\x1b[36m'
export const MAGENTA = '\x1b[35m'
export const WHITE = '\x1b[37m'
export const BRIGHT_GREEN = '\x1b[92m'
export const BRIGHT_YELLOW = '\x1b[93m'
export const BRIGHT_RED = '\x1b[91m'

export function budgetColor(pct) {
  if (pct >= 100) return BRIGHT_RED
  if (pct >= 80) return BRIGHT_YELLOW
  if (pct >= 50) return YELLOW
  return BRIGHT_GREEN
}

export function fillerColor(pct) {
  if (pct >= 40) return BRIGHT_RED
  if (pct >= 25) return YELLOW
  return DIM
}

export function c(color, text) {
  return `${color}${text}${RESET}`
}
