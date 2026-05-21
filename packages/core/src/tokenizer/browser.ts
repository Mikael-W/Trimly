import type { Provider } from '../types/providers.js'
import { countTokensMistral } from './adapters/mistral.js'

/**
 * Browser-safe token counter — pure JS, no WASM/Node deps.
 * Uses heuristics: ~4 chars/token for most Western languages.
 */
export function countTokensBrowser(provider: Provider, _model: string, text: string): number {
  if (!text) return 0
  switch (provider) {
    case 'mistral':
      return countTokensMistral(text)
    case 'anthropic':
    case 'openai':
    default:
      // Anthropic BPE ~3.8 chars/token, conservative estimate
      return Math.ceil(text.length / 3.8)
  }
}
