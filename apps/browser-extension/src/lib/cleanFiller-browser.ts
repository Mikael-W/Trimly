import { cleanFiller } from '@trimly/core/browser'

export { cleanFiller }

export function detectFillerSavings(text: string): number {
  if (!text) return 0
  const result = cleanFiller(text, { mode: 'detect' })
  return result.applied ? result.tokensSaved : 0
}
