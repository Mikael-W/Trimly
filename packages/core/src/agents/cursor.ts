import type { AdvisorOutput, AgentAdapter, Env } from './types.js'

export const cursorAdapter: AgentAdapter = {
  id: 'cursor',
  source: 'cursor',
  capabilities: { promptOptimization: false, costTracking: true, toolTracking: true },

  parsePayload(event, raw) {
    const roots = raw.workspace_roots as string[] | undefined
    return {
      event,
      sessionId: (raw.conversation_id ?? raw.session_id ?? raw.sessionId) as string | undefined,
      cwd: roots?.[0] ?? (raw.cwd as string | undefined),
      prompt: raw.prompt as string | undefined,
      toolName: (raw.hook_event_name ?? raw.tool_name) as string | undefined,
      raw,
    }
  },

  formatOutput(_out: AdvisorOutput) {
    return ''
  },

  resolveModel(env: Env) {
    return { provider: 'anthropic', model: env.CURSOR_MODEL ?? 'claude-sonnet-4-6' }
  },
}
