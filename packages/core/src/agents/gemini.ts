import type { Message } from '../strategies/compactHistory.js'
import type { AdvisorOutput, AgentAdapter, Env, ModelRewriteOutput, ModelUsage } from './types.js'

interface GeminiMessage {
  role?: string
  content?: string
}

function toCoreMessages(raw: unknown): Message[] | undefined {
  const request = raw as { llm_request?: { messages?: GeminiMessage[] } }
  const messages = request.llm_request?.messages
  if (!Array.isArray(messages)) return undefined
  return messages.map((m) => ({
    role: m.role === 'model' ? 'assistant' : m.role === 'system' ? 'system' : 'user',
    content: m.content ?? '',
  }))
}

function toUsage(raw: unknown): ModelUsage | undefined {
  const response = raw as { llm_response?: { usageMetadata?: ModelUsage } }
  const usage = response.llm_response?.usageMetadata
  if (!usage) return undefined
  return {
    totalTokenCount: usage.totalTokenCount,
    promptTokenCount: usage.promptTokenCount,
    candidatesTokenCount: usage.candidatesTokenCount,
    cachedContentTokenCount: usage.cachedContentTokenCount,
  }
}

export const geminiAdapter: AgentAdapter = {
  id: 'gemini',
  source: 'gemini',
  capabilities: { promptOptimization: true, costTracking: true, toolTracking: true },

  parsePayload(event, raw) {
    const request = raw.llm_request as { model?: string } | undefined
    return {
      event,
      sessionId: raw.session_id as string | undefined,
      transcriptPath: raw.transcript_path as string | undefined,
      cwd: raw.cwd as string | undefined,
      prompt: raw.prompt as string | undefined,
      toolName: raw.tool_name as string | undefined,
      model: request?.model,
      messages: toCoreMessages(raw),
      usage: toUsage(raw),
      raw,
    }
  },

  formatOutput(out: AdvisorOutput) {
    if (!out.context) return ''
    return JSON.stringify({ hookSpecificOutput: { additionalContext: out.context } })
  },

  formatModelRewrite(out: ModelRewriteOutput) {
    if (!out.messages) return ''
    const messages = out.messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : m.role,
      content: m.content,
    }))
    return JSON.stringify({ hookSpecificOutput: { llm_request: { messages } } })
  },

  resolveModel(env: Env) {
    return { provider: 'google', model: env.GEMINI_MODEL ?? 'gemini-3.1-pro-preview' }
  },
}
