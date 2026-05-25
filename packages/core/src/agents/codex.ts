import type { AdvisorOutput, AgentAdapter, Env } from './types.js'

/**
 * OpenAI Codex CLI. Hook lifecycle and stdin payload field names mirror Claude
 * Code (UserPromptSubmit, Stop, PostToolUse, SessionStart, PreCompact; fields
 * session_id, prompt, tool_name, …). For UserPromptSubmit, Codex adds plain
 * stdout as developer context — which is exactly where we want the advisory.
 */
export const codexAdapter: AgentAdapter = {
  id: 'codex',
  source: 'codex',
  capabilities: { promptOptimization: true, costTracking: true, toolTracking: true },

  parsePayload(event, raw) {
    return {
      event,
      sessionId: (raw.session_id ?? raw.sessionId) as string | undefined,
      transcriptPath: (raw.transcript_path ?? raw.transcriptPath) as string | undefined,
      cwd: raw.cwd as string | undefined,
      prompt: (raw.prompt ?? raw.user_prompt) as string | undefined,
      toolName: (raw.tool_name ?? raw.toolName) as string | undefined,
      raw,
    }
  },

  formatOutput(out: AdvisorOutput) {
    return out.context ?? ''
  },

  resolveModel(env: Env) {
    return { provider: 'openai', model: env.CODEX_MODEL ?? env.OPENAI_MODEL ?? 'gpt-5-codex' }
  },
}
