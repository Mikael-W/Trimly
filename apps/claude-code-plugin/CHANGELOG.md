# Changelog

## 0.3.0

- CLI localized in 24 EU languages (auto-detected from `$LANG`, or set via `locale` / `TRIMLY_LOCALE`)
- Fix: `trimly init` no longer crashes when `~/.claude` does not exist yet

## 0.2.0

- Multi-agent factory — adapters for Claude Code, OpenAI Codex, and Cursor
- Configurable prompt optimization: `advisor` (suggest) · `auto` (apply) · `off` (track only)
- Currency conversion (USD → EUR) in the dashboard
- Filler detection extended to 24 EU languages
- Codex and Cursor setup scripts (`integrations/`)

## 0.1.0

- Initial release: token tracking, cost computation, live status line, local dashboard, and the prompt advisor (FR/EN)
