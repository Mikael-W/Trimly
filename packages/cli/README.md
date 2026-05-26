# @trimly/cli

> See and trim your AI token spend, from the terminal. The `trimly` command for [Trimly](https://github.com/Mikael-W/Trimly).

Track and optimize your LLM token consumption locally — spend, savings, and history, all stored in a local SQLite database at `~/.trimly`. No account, no cloud, no telemetry.

## Install

```bash
npm install -g @trimly/cli
```

## Usage

```bash
trimly init             # set up local storage (~/.trimly)
trimly stats            # spend, savings, and top models
trimly dashboard        # open the local web dashboard
trimly export           # export your events (JSON)
trimly import-browser   # import events captured on claude.ai
trimly clear            # wipe local data
```

Run `trimly <command> --help` for options.

## Languages

The CLI is localized in **24 EU languages**. It auto-detects from `$LANG`, or set it
explicitly — `"locale": "de"` in `~/.trimly/config.json`, or per-invocation:

```bash
TRIMLY_LOCALE=de trimly stats
```

## How it works

`trimly` reads from the same local store that the Trimly plugin writes to. Install the plugin for your agent — **Claude Code, OpenAI Codex, or Cursor** — to capture token usage automatically as you work, then use the CLI (or `trimly dashboard`) to review spend and savings over time.

Built on [`@trimly/core`](https://www.npmjs.com/package/@trimly/core).

## License

[Apache 2.0](https://github.com/Mikael-W/Trimly/blob/main/LICENSE) © JOYS LAB
