import { countTokens as _countTokens } from '@anthropic-ai/tokenizer'

export function countTokensAnthropic(text: string): number {
  if (!text) return 0
  try {
    return _countTokens(text)
  } catch {
    return Math.ceil(text.length / 4)
  }
}
