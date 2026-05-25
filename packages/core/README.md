# @trimly/core

> Tokenization, pricing, currency conversion, local storage, prompt-optimization strategies, and multi-agent adapters for [Trimly](https://github.com/Mikael-W/Trimly).

The engine behind Trimly — token counting and cost computation for Anthropic, OpenAI, and Mistral, a local SQLite store, filler/prompt-slimming strategies in 24 EU languages, and a factory of agent adapters (Claude Code, Codex, Cursor). Used by `@trimly/cli` and the Trimly plugin, but usable standalone.

## Install

```bash
npm install @trimly/core
```

## Usage

### Count tokens

```ts
import { countTokens } from '@trimly/core'

countTokens('anthropic', 'claude-sonnet-4-6', 'Hello, world!') // → number
countTokens('openai', 'gpt-4o', 'Hello, world!')
```

### Compute and format cost

```ts
import { computeCost, convertCost, formatCost } from '@trimly/core'

const usage = { input_tokens: 1200, output_tokens: 350 }
const usd = computeCost('anthropic', 'claude-sonnet-4-6', usage) // → number (USD)

const eur = convertCost(usd, 'EUR') // USD → EUR (configurable rate, default 0.92)
formatCost(eur, 'EUR', 'fr-FR') // → "0,01 €"
```

`TokenUsage` also accepts `cache_read_input_tokens` and `cache_creation_input_tokens` for cache-aware pricing.

### Local storage

```ts
import { createStorage, getDefaultDbPath } from '@trimly/core'

// Picks node:sqlite when available, falls back to libSQL
const storage = await createStorage(getDefaultDbPath())
await storage.recordEvent(/* TrimlyEvent */)
const events = await storage.queryEvents({ days: 30 })
```

### Optimization strategies

```ts
import { cleanFiller, analyzePrompt } from '@trimly/core'

cleanFiller(text)     // strip filler phrases — 24 EU languages, auto-detected
analyzePrompt(text)   // detect heavy code blocks, stack traces, etc.
```

### Agent adapters

A factory resolves the host agent (from config override or env detection) and
abstracts each agent's hook payloads, output protocol, and model resolution.

```ts
import { resolveAgent, detectAgent } from '@trimly/core'

const adapter = resolveAgent('auto') // 'claude-code' | 'codex' | 'cursor'
adapter.source            // event source for storage
adapter.capabilities      // { promptOptimization, costTracking, toolTracking }
adapter.parsePayload('UserPromptSubmit', rawStdinJson)
adapter.formatOutput({ context: '…' }, 'UserPromptSubmit')
```

## Browser build

A dependency-light entry point (no WASM, no Node APIs) is available for browser/extension use:

```ts
import { countTokens } from '@trimly/core/browser'
```

## License

[Apache 2.0](https://github.com/Mikael-W/Trimly/blob/main/LICENSE) © JOYS LAB
