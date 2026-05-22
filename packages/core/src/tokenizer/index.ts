import type { Provider } from '../types/providers.js'
import { countTokensAnthropic } from './adapters/anthropic.js'
import { countTokensMistral } from './adapters/mistral.js'
import { countTokensOpenAI } from './adapters/openai.js'

export function countTokens(provider: Provider, model: string, text: string): number {
  if (!text) return 0
  switch (provider) {
    case 'anthropic':
      return countTokensAnthropic(text)
    case 'openai':
      return countTokensOpenAI(model, text)
    case 'mistral':
      return countTokensMistral(text)
    default:
      return Math.ceil(text.length / 4)
  }
}
