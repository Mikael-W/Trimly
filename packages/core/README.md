# @trimly/core

> Tokenization, pricing, local storage, and prompt-optimization strategies for [Trimly](https://github.com/Mikael-W/Trimly).

The engine behind Trimly — token counting and cost computation for Anthropic, OpenAI, and Mistral, a local SQLite store, and filler/prompt-slimming strategies. Used by `@trimly/cli` and the Trimly Claude Code plugin, but usable standalone.

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
import { computeCost, formatCost } from '@trimly/core'

const usage = { input_tokens: 1200, output_tokens: 350 }
const cost = computeCost('anthropic', 'claude-sonnet-4-6', usage) // → number (USD)

formatCost(cost, 'EUR', 'fr-FR') // → "0,01 €"
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

cleanFiller(text)     // strip filler phrases (FR/EN/ES/DE/IT/PT)
analyzePrompt(text)   // detect heavy code blocks, stack traces, etc.
```

## Browser build

A dependency-light entry point (no WASM, no Node APIs) is available for browser/extension use:

```ts
import { countTokens } from '@trimly/core/browser'
```

## License

[Apache 2.0](https://github.com/Mikael-W/Trimly/blob/main/LICENSE) © JOYS LAB
