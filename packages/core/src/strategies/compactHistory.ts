const HISTORY_THRESHOLD_MESSAGES = 6
const HISTORY_THRESHOLD_TOKENS = 4000
const SHADOW_SUMMARY_TOKENS = 200

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface CompactHistoryResult {
  tokensSavedShadow: number
  costSavedShadowUsd: number
  shouldCompact: boolean
}

export function analyzeCompactHistory(
  messages: Message[],
  totalTokens: number,
  costPerToken: number,
): CompactHistoryResult {
  const nonSystem = messages.filter((m) => m.role !== 'system')
  const shouldCompact =
    nonSystem.length > HISTORY_THRESHOLD_MESSAGES || totalTokens > HISTORY_THRESHOLD_TOKENS

  if (!shouldCompact) {
    return { tokensSavedShadow: 0, costSavedShadowUsd: 0, shouldCompact: false }
  }

  const keptMessages = messages.filter((m) => m.role === 'system').length + 6
  const removedMessages = Math.max(0, messages.length - keptMessages)

  const avgTokensPerMsg = totalTokens / Math.max(1, messages.length)
  const tokensSavedShadow = Math.max(
    0,
    Math.floor(removedMessages * avgTokensPerMsg - SHADOW_SUMMARY_TOKENS),
  )
  const costSavedShadowUsd = tokensSavedShadow * costPerToken

  return { tokensSavedShadow, costSavedShadowUsd, shouldCompact: true }
}
