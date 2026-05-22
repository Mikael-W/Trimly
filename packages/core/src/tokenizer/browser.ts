import type { Provider } from '../types/providers.js'
import { countTokensMistral } from './adapters/mistral.js'

export function countTokensBrowser(provider: Provider, _model: string, text: string): number {
  if (!text) return 0
  switch (provider) {
    case 'mistral':
      return countTokensMistral(text)
    default:
      return Math.ceil(text.length / 3.8)
  }
}
