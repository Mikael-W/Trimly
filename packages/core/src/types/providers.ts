export type Provider = 'anthropic' | 'openai' | 'mistral'

export type AnthropicModel = 'claude-opus-4-7' | 'claude-sonnet-4-6' | 'claude-haiku-4-5'

export type OpenAIModel = 'gpt-4o' | 'gpt-4o-mini' | 'o3' | 'o3-mini'

export type MistralModel = 'mistral-large' | 'mistral-small' | 'codestral'

export type ModelId = AnthropicModel | OpenAIModel | MistralModel | (string & {})

export interface TokenUsage {
  input_tokens: number
  output_tokens: number
  cache_read_input_tokens?: number
  cache_creation_input_tokens?: number
}
