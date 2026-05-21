import { countTokens as _count } from '@trimly/core/browser'

export function countTokens(text: string): number {
  return _count('anthropic', 'claude-sonnet-4-6', text)
}
