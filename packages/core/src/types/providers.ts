export type Provider = 'anthropic' | 'openai' | 'mistral' | 'google'

export type AnthropicModel = 'claude-opus-4-7' | 'claude-sonnet-4-6' | 'claude-haiku-4-5'

export type OpenAIModel = 'gpt-4o' | 'gpt-4o-mini' | 'o3' | 'o3-mini'

export type MistralModel = 'mistral-large' | 'mistral-small' | 'codestral'

export type GoogleModel =
  | 'gemini-3.1-pro-preview'
  | 'gemini-3.6-flash'
  | 'gemini-3.5-flash'
  | 'gemini-3.5-flash-lite'
  | 'gemini-3.1-flash-lite'

export type ModelId = AnthropicModel | OpenAIModel | MistralModel | GoogleModel | (string & {})

export interface TokenUsage {
  input_tokens: number
  output_tokens: number
  cache_read_input_tokens?: number
  cache_creation_input_tokens?: number
}
