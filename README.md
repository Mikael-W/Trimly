<div align="center">

# Trimly

### See and trim your AI token spend.

**Claude HUD shows you what Claude _does_. Trimly shows you what Claude _costs you_.**

Trimly measures and optimizes your LLM token consumption — right where you prompt: Claude Code in your terminal and claude.ai in your browser. 100% local, open source, multi-provider.

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)
[![npm](https://img.shields.io/npm/v/@trimly/cli.svg)](https://www.npmjs.com/package/@trimly/cli)
[![Built for Claude Code](https://img.shields.io/badge/built%20for-Claude%20Code-d97757.svg)](https://claude.com/claude-code)

</div>

<!-- TODO: drop a 15-30s demo GIF here (status line live cost + /optimize suggestion). It's the single highest-impact thing on this page. -->

---

## Why Trimly

You pay per token. But nothing tells you, in the moment, what a session is actually costing — or where the waste is. Trimly puts the number in front of you and trims the fat from your prompts.

| | Claude HUD | **Trimly** |
|---|:---:|:---:|
| Context window % used | ✅ | ✅ |
| **Cost in € / $ — live** | ❌ | ✅ |
| **Cost per tool call / edit** | ❌ | ✅ |
| **Monthly budget + overshoot ETA** | ❌ | ✅ |
| **Filler detection + prompt slimming** | ❌ | ✅ |
| **Persistent history** | ❌ | ✅ |
| **Multi-provider** (Claude · OpenAI · Mistral) | ❌ | ✅ |
| Local-first, no account, no telemetry | — | ✅ |

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

---

## What it does

**💰 Real cost, in real time.** Every prompt, tool call, and edit is priced as it happens — Anthropic, OpenAI, and Mistral pricing built in.

**✂️ Prompt slimming.** Trimly spots filler (FR + EN), long code blocks, and stack traces, and offers a lighter version before you spend tokens on it. Accept with `oui` / decline with `non`.

**📊 Budget + ETA.** Set a monthly budget; Trimly tracks your daily burn rate and tells you how many days until you blow past it.

**📈 Local dashboard.** A Nuxt dashboard (overview, events, savings, settings) running entirely on your machine — history, sparklines, per-model breakdown.

**🔒 Local-first.** Everything lives in a local SQLite database at `~/.trimly`. No account, no cloud, no telemetry.

---

## How it works

Trimly hooks into Claude Code's official lifecycle events (`UserPromptSubmit`, `PostToolUse`, `Stop`, …) to tokenize and price each interaction, then stores it locally. The status line and dashboard read from that local store — never the network.

```
packages/core   →  tokenization · pricing · storage · optimization strategies
packages/cli    →  the `trimly` binary
packages/dashboard  →  local Nuxt dashboard
apps/claude-code-plugin  →  hooks · slash commands · status line
apps/browser-extension   →  claude.ai token badge + optimize overlay
```

---

## Coming soon

- **Team Self-Hosted (free, 1–5 users)** — bring your own PostgreSQL or Supabase, get a shared team dashboard.
- **Trimly Cloud** — managed hosting, SSO, Slack alerts, Anthropic Admin API. [Join the waitlist →](https://trimly.dev) <!-- TODO: real waitlist link -->

---

## Contributing

Issues and PRs welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md) and our [Code of Conduct](./CODE_OF_CONDUCT.md).

## License

[Apache 2.0](./LICENSE) © JOYS LAB
