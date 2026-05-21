# Trimly — Plugin Claude Code

Track and optimize your Claude Code token spend directly from Claude Code.

## Install (dev mode)

```bash
# From repo root
pnpm install

# Symlink into Claude Code plugins dir
ln -s "$(pwd)/apps/claude-code-plugin" "${HOME}/.claude/plugins/trimly"

# Run install script
node apps/claude-code-plugin/scripts/install.mjs
```

## Commands

- `/trimly:stats` — token/cost stats for current session + today + 30 days
- `/trimly:dashboard` — launch the local dashboard at http://localhost:3737
- `/trimly:config` — edit `~/.trimly/config.json`
- `/trimly:clear` — delete tracked data (with confirmation)

## Hooks

- `UserPromptSubmit` — count tokens, detect filler, store pending event
- `Stop` — finalize event with real output tokens from transcript
- `SessionStart` / `SessionEnd` — track session boundaries
- `PreCompact` — log compaction events

## Config

`~/.trimly/config.json`:

```json
{
  "verbose": false,
  "advisor": true,
  "filler": {
    "enabled": true,
    "languages": ["fr", "en"],
    "threshold_pct": 20
  },
  "currency": "USD",
  "summary_on_session_end": true
}
```

## License

Apache 2.0
