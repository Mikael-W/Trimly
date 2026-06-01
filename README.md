<div align="center">

# Trimly

### See and trim your AI token spend.

**Your coding agent bills by the token. Trimly shows you the cost — live — and trims the waste before you pay for it.**

Trimly measures and optimizes your LLM token consumption — right where you prompt. Stable today for **Claude Code**, with **OpenAI Codex** and **Cursor** in preview. 100% local, open source, multi-provider, and fully localized in **24 EU languages**.

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)
[![npm](https://img.shields.io/npm/v/@trimly/cli.svg)](https://www.npmjs.com/package/@trimly/cli)
[![npm downloads](https://img.shields.io/npm/dw/@trimly/core.svg)](https://npmjs.com/package/@trimly/core)
[![Built for Claude Code](https://img.shields.io/badge/built%20for-Claude%20Code-d97757.svg)](https://claude.com/claude-code)

</div>

<!-- TODO: drop a 15-30s demo GIF here (status line live cost + /optimize suggestion). It's the single highest-impact thing on this page. -->

---

## Why Trimly

You pay per token. But nothing tells you, in the moment, what a session is actually costing — or where the waste is. Trimly puts the number in front of you and trims the bloat from your prompts.

**What you get:**

- 💰 **Live cost** in € / $ — every prompt, tool call, and edit
- 📊 **Monthly budget** with overshoot ETA
- ✂️ **Prompt slimming** — strip filler, heavy code blocks, and stack traces
- 🌍 **24 EU languages** — the whole UI (dashboard · CLI · extension) *and* filler detection, not just English
- 🗂️ **Persistent history** + local dashboard
- 🧩 **Multi-provider** (Claude · OpenAI) · **multi-agent** — Claude Code (stable), Codex & Cursor (preview)
- 🔒 **Local-first** — no account, no cloud, no telemetry

---

## Quick start

### Claude Code plugin (status line + optimization)

```bash
# In Claude Code:
/plugin install trimly

# Then enable the live status line:
/trimly:statusline-setup
```

You'll get a live cost line under your prompt:

```
[Sonnet 4.6] my-project  git:(main*)
Context ████░░░░░░ 42%  │  💰 €12.40 / €30 budget (ETA: 8d)
💎 Saved today: €0.42 (32%)  │  ⚠ 23% filler in last prompt
```

### CLI

```bash
npm install -g @trimly/cli

trimly init        # set up local storage (~/.trimly)
trimly stats       # spend, savings, top models
trimly dashboard   # open the local web dashboard
```

### Codex & Cursor (preview)

> The Codex and Cursor adapters live in `packages/core/src/agents/` and their hooks-config schemas match the published docs, but the end-to-end flow has **not yet been validated against a real Codex or Cursor session**. Treat as preview; feedback via issues welcome.
>
> Both setups assume the Claude Code plugin is already installed (they reuse its hook scripts). Run them from a checkout of this repo otherwise.

```bash
# OpenAI Codex CLI — full lifecycle hooks (preview, not yet validated end-to-end)
node ~/.claude/plugins/trimly/integrations/codex-setup.mjs

# Cursor — input-cost tracking only (no advisor on Cursor; no per-tool cost)
node ~/.claude/plugins/trimly/integrations/cursor-setup.mjs
```

---

## What it does

**💰 Real cost, in real time.** Every prompt, tool call, and edit is priced as it happens — Anthropic and OpenAI pricing built in.

**✂️ Prompt slimming.** Trimly spots filler across **24 EU languages**, long code blocks, and stack traces, and offers a lighter version before you spend tokens. Choose how: `advisor` (suggest, accept with `oui`), `auto` (apply without asking), or `off` (track only).

**🤖 Works across agents.** One engine, many hosts. Claude Code is the stable target; Codex and Cursor adapters are shipped as previews (see Quick start). The host is auto-detected (or set it in config).

**📊 Budget + ETA.** Set a monthly budget; Trimly tracks your daily burn rate and tells you how many days until you blow past it.

**📈 Local dashboard.** A Nuxt dashboard (overview, events, savings, settings) running entirely on your machine — history, sparklines, per-model breakdown. Localized in **24 EU languages**.

**🔒 Local-first.** Everything lives in a local SQLite database at `~/.trimly`. No account, no cloud, no telemetry.

---

## How it works

Trimly plugs into each agent's lifecycle hooks (`UserPromptSubmit`, `PostToolUse`, `Stop`, …) through a small **adapter per host** (factory pattern), tokenizes and prices each interaction, then stores it locally. The status line and dashboard read from that local store — never the network. Adding a new agent = one adapter.

```
packages/core   →  tokenization · pricing · storage · strategies · agent adapters
packages/cli    →  the `trimly` binary
packages/dashboard  →  local Nuxt dashboard
apps/claude-code-plugin  →  hooks · slash commands · status line
  └─ integrations/  →  codex-setup · cursor-setup
apps/browser-extension   →  claude.ai token badge + optimize overlay (alpha — not on Web Stores yet)
```

---

## Roadmap

Exploration only — none of these are started, no ETA. Listed so you know where Trimly might go:

- **Production-grade Codex & Cursor support** — validation against the live agents, end-to-end tests, then promotion from preview to stable.
- **Browser extension on stores** — package `apps/browser-extension` for the Chrome Web Store and Firefox Add-ons (today it builds but isn't published).
- **Team Self-Hosted (1–5 users)** — bring-your-own PostgreSQL or Supabase + shared team dashboard.
- **Trimly Cloud** — managed hosting, SSO, Slack alerts.

If any of these matter to you, open an issue — that's the best signal to start.

---

## Contributing

Issues and PRs welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md) and our [Code of Conduct](./CODE_OF_CONDUCT.md).

## License

[Apache 2.0](./LICENSE) © JOYS LAB
