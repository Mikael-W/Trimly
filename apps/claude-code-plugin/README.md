# Trimly — multi-agent plugin (Claude Code · Codex · Cursor)

Track and optimize your AI token spend directly from your coding agent. One engine, an adapter per host (factory pattern).

## Supported agents

| Agent | Cost tracking | Prompt advisor |
|---|:---:|:---:|
| Claude Code | ✅ | ✅ |
| OpenAI Codex | ✅ | ✅ |
| Cursor | ✅ (input) | — (no token usage exposed to hooks) |

The host is auto-detected from the environment, or set explicitly via `agent` in config. Override anytime with `TRIMLY_AGENT=<id>`.

## Install

### Claude Code (dev mode)

```bash
# From repo root
pnpm install
ln -s "$(pwd)/apps/claude-code-plugin" "${HOME}/.claude/plugins/trimly"
node apps/claude-code-plugin/scripts/install.mjs
```

### OpenAI Codex

```bash
node apps/claude-code-plugin/integrations/codex-setup.mjs   # writes ~/.codex/hooks.json
# then run /hooks in Codex to review & trust, and restart
```

### Cursor

```bash
node apps/claude-code-plugin/integrations/cursor-setup.mjs  # writes ~/.cursor/hooks.json
```

## Commands (Claude Code)

- `/trimly:stats` — token/cost stats for current session + today + 30 days
- `/trimly:dashboard` — launch the local dashboard at http://localhost:3737
- `/trimly:config` — edit `~/.trimly/config.json`
- `/trimly:clear` — delete tracked data (with confirmation)
- `/trimly:statusline-setup` — enable the live cost status line

## Hooks

- `UserPromptSubmit` — count tokens, detect filler (24 EU languages), run the advisor
- `PostToolUse` — record per-tool-call cost
- `Stop` — finalize the event with real output tokens from the transcript
- `SessionStart` / `SessionEnd` — track session boundaries
- `PreCompact` — log compaction events

Hook scripts are agent-aware: they resolve the host adapter at runtime and emit
the right output format (Claude Code `additionalContext` vs Codex stdout).

## Config

`~/.trimly/config.json`:

```json
{
  "agent": "auto",
  "optimize": { "mode": "advisor" },
  "filler": {
    "enabled": true,
    "languages": ["fr", "en"],
    "threshold_pct": 20
  },
  "currency": "USD",
  "locale": "en",
  "summary_on_session_end": true
}
```

- **`agent`** — `auto` (detect) · `claude-code` · `codex` · `cursor`
- **`optimize.mode`** — `advisor` (suggest, confirm with `oui`/`non`) · `auto` (apply without asking) · `off` (track only)
- **`filler.languages`** — any of the 24 supported EU languages; add the ones you prompt in
- **`locale`** — UI language for the CLI

## License

Apache 2.0
