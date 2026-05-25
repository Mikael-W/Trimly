import type { AdvisorOutput, AgentAdapter, Env, HookEvent } from './types.js'

export const claudeCodeAdapter: AgentAdapter = {
  id: 'claude-code',
  source: 'claude-code',
  capabilities: { promptOptimization: true, costTracking: true, toolTracking: true },

  parsePayload(event, raw) {
    return {
      event,
      sessionId: raw.session_id as string | undefined,
      transcriptPath: raw.transcript_path as string | undefined,
      cwd: raw.cwd as string | undefined,
      prompt: raw.prompt as string | undefined,
      toolName: raw.tool_name as string | undefined,
      raw,
    }
  },

  formatOutput(out: AdvisorOutput, event: HookEvent) {
    if (!out.context) return ''
    return JSON.stringify({
      hookSpecificOutput: { hookEventName: event, additionalContext: out.context },
    })
  },

  resolveModel(env: Env) {
    return { provider: 'anthropic', model: env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6' }
  },
}
