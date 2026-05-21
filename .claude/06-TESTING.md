# Trimly — Testing Strategy

## 🎯 Philosophie

Trimly s'insère dans Claude Code (terminal de devs) et claude.ai (browser). **Toute régression = perte d'utilisateurs immédiate.** Tests sérieux, mais pragmatiques sur 4 jours.

## 🧪 Outils

- **Runner** : Vitest 2.x
- **Mocking** : `vi.mock` strictement typé
- **DB en test** : SQLite `:memory:` (rapide, isolé) avec les deux adapters
- **E2E** : Playwright (extension uniquement, V1.5)
- **Fixtures** : dossier `__fixtures__/` par package
- **Coverage** : `vitest --coverage` (v8), seuil 80% pour `@trimly/core`

## 📐 Conventions

### Pas de `any`

```typescript
// ❌ Interdit
const mock: any = vi.fn()

// ✅ Obligatoire
import type { ClaudeCodeHookInput } from '@anthropic-ai/claude-code'
const mock = vi.fn<(input: ClaudeCodeHookInput) => Promise<void>>()
```

### `typedMock` utility

`packages/core/src/utils/typedMock.ts` :

```typescript
import { vi } from 'vitest'

export type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T

export function typedMock<T>(value: DeepPartial<T>): T {
  return value as T
}
```

### `shallowMount` côté Vue (dashboard + extension)

```typescript
import { shallowMount } from '@vue/test-utils'
import BigNumber from '../base/BigNumber.vue'

it('renders formatted value', () => {
  const w = shallowMount(BigNumber, {
    props: { value: 1234.56, label: 'Cost', currency: 'USD' }
  })
  expect(w.text()).toContain('$1,234.56')
})
```

## 🗂️ Structure par package

### `@trimly/core`

```
packages/core/
├── src/
│   ├── strategies/
│   │   ├── cleanFiller/
│   │   │   ├── index.ts
│   │   │   └── __tests__/
│   │   │       ├── cleanFiller.test.ts
│   │   │       └── patterns.test.ts     ← test tous patterns par langue
│   │   ├── compactWhitespace.ts
│   │   └── __tests__/
│   ├── tokenizer/
│   │   └── __tests__/
│   ├── pricing/
│   │   └── __tests__/
│   ├── storage/
│   │   └── __tests__/
│   │       ├── node-sqlite.test.ts
│   │       └── libsql.test.ts            ← mêmes tests, deux adapters
│   └── __fixtures__/
│       ├── messages/
│       │   ├── short-en.json
│       │   ├── verbose-fr.json
│       │   ├── verbose-de.json
│       │   ├── verbose-es.json
│       │   ├── long-history.json
│       │   └── with-code.json
│       └── transcripts/
│           └── sample-anthropic.jsonl
└── vitest.config.ts
```

### Plugin Claude Code

```
apps/claude-code-plugin/
├── hooks/
│   ├── user-prompt-submit.mjs
│   └── __tests__/
│       ├── user-prompt-submit.test.ts
│       ├── stop.test.ts
│       └── __fixtures__/
│           └── transcript-sample.jsonl
```

### Extension

```
apps/browser-extension/
├── src/
│   ├── content/
│   │   └── __tests__/
│   │       ├── claude-ai-adapter.test.ts
│   │       └── TokenBadge.test.ts
│   └── __fixtures__/
│       └── claude-ai-dom.html
└── e2e/
    └── claude-ai.spec.ts             ← Playwright V1.5
```

## ✅ Acceptance tests par feature

### F1 — Tokenization

```typescript
describe('countTokens', () => {
  it.each([
    ['anthropic', 'claude-sonnet-4-5', 'Hello world', { min: 1, max: 5 }],
    ['openai', 'gpt-4o', 'Hello world', { min: 1, max: 5 }],
    ['mistral', 'mistral-large', 'Hello world', { min: 1, max: 10 }],
  ])('counts tokens for %s/%s', async (provider, model, text, range) => {
    const t = await countTokens(provider, model, text)
    expect(t).toBeGreaterThanOrEqual(range.min)
    expect(t).toBeLessThanOrEqual(range.max)
  })
  
  it('handles multilingual content', async () => {
    const texts = {
      fr: 'Bonjour le monde',
      de: 'Hallo Welt',
      ja: 'こんにちは世界',
      zh: '你好世界',
    }
    for (const text of Object.values(texts)) {
      const t = await countTokens('anthropic', 'claude-sonnet-4-5', text)
      expect(t).toBeGreaterThan(0)
    }
  })
})
```

### F2 — Calcul de coût

```typescript
describe('computeCost', () => {
  it('computes Anthropic cost correctly', () => {
    const cost = computeCost('anthropic', 'claude-sonnet-4-5', {
      input_tokens: 1000,
      output_tokens: 500,
    })
    expect(cost).toBeCloseTo(0.0105, 4)
  })
  
  it('includes cache pricing', () => {
    const cost = computeCost('anthropic', 'claude-sonnet-4-5', {
      input_tokens: 1000,
      output_tokens: 500,
      cache_read_input_tokens: 2000,
      cache_creation_input_tokens: 1000,
    })
    expect(cost).toBeGreaterThan(0.0105)
  })
  
  it('formats cost with locale', () => {
    expect(formatCost(1234.56, 'USD', 'en-US')).toBe('$1,234.56')
    expect(formatCost(1234.56, 'EUR', 'fr-FR')).toBe('1 234,56 €')
  })
})
```

### F3 — Storage (les deux adapters passent les mêmes tests)

```typescript
describe.each([
  ['node-sqlite', () => new NodeSqliteStorage(':memory:')],
  ['libsql', () => new LibsqlStorage(':memory:')],
])('storage adapter: %s', (name, makeStorage) => {
  let storage: TrimlyStorage
  
  beforeEach(async () => {
    storage = await makeStorage()
    await storage.init()
  })
  
  afterEach(async () => {
    await storage.close()
  })
  
  it('records and retrieves an event', async () => {
    const event = makeEventFixture()
    await storage.recordEvent(event)
    const events = await storage.queryEvents({ limit: 1 })
    expect(events).toHaveLength(1)
    expect(events[0]).toMatchObject(event)
  })
  
  it('aggregates stats by date range', async () => {
    for (let i = 0; i < 10; i++) {
      await storage.recordEvent(makeEventFixture({
        timestamp: Date.now() - i * 86400000
      }))
    }
    const stats = await storage.getStats({ days: 7 })
    expect(stats.totalRequests).toBe(7)
  })
  
  it('filters by source', async () => {
    await storage.recordEvent(makeEventFixture({ source: 'claude-code' }))
    await storage.recordEvent(makeEventFixture({ source: 'browser-extension' }))
    const cc = await storage.queryEvents({ source: 'claude-code' })
    expect(cc).toHaveLength(1)
  })
})
```

### F4 — cleanFiller (6 langues)

```typescript
describe('cleanFiller multilingual', () => {
  it.each([
    ['fr', 'S\'il te plaît, peux-tu m\'expliquer Redis ?', /s'il te plaît/i],
    ['en', 'Could you please explain Redis?', /please/i],
    ['es', 'Por favor, podrías explicarme Redis?', /por favor/i],
    ['de', 'Könntest du bitte Redis erklären?', /bitte/i],
    ['it', 'Per favore, potresti spiegarmi Redis?', /per favore/i],
    ['pt', 'Por favor, poderia explicar Redis?', /por favor/i],
  ])('removes filler in %s', (lang, input, removedPattern) => {
    const result = cleanFiller(input, { languages: [lang as any] })
    expect(result.text).not.toMatch(removedPattern)
    expect(result.tokensSaved).toBeGreaterThan(0)
  })
  
  it('preserves protected words', () => {
    const result = cleanFiller('Please use very strict mode', {
      languages: ['en'],
      preserve: ['very strict'],
    })
    expect(result.text).toContain('very strict')
  })
  
  it('applies all 6 languages by default', () => {
    const result = cleanFiller('S\'il te plaît, please, por favor')
    expect(result.text).not.toMatch(/s'il te plaît|please|por favor/i)
  })
})
```

### F5 — compactWhitespace

```typescript
describe('compactWhitespace', () => {
  it('collapses multiple spaces', () => {
    expect(compactWhitespace('a   b    c')).toBe('a b c')
  })
  
  it('limits newlines to max 2', () => {
    expect(compactWhitespace('a\n\n\n\nb')).toBe('a\n\nb')
  })
  
  it('preserves whitespace inside code blocks', () => {
    const code = 'See:\n```\nfunction f() {\n    return 1\n}\n```'
    expect(compactWhitespace(code)).toContain('    return 1')
  })
})
```

### F9 — Hook UserPromptSubmit

```typescript
describe('user-prompt-submit hook', () => {
  it('inserts pending event with token count', async () => {
    const storage = new NodeSqliteStorage(':memory:')
    await storage.init()
    
    const input: UserPromptSubmitInput = {
      session_id: 'test-123',
      transcript_path: '/tmp/test.jsonl',
      cwd: '/tmp',
      prompt: 'Hello world',
    }
    
    await runHook(input, { storage, model: 'claude-sonnet-4-5' })
    
    const events = await storage.queryEvents({ session_id: 'test-123' })
    expect(events).toHaveLength(1)
    expect(events[0].status).toBe('pending')
    expect(events[0].tokens_input).toBeGreaterThan(0)
  })
  
  it('detects filler and suggests optimization', async () => {
    const captureStdout = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
    
    await runHook({
      // ...
      prompt: 'S\'il te plaît, est-ce que tu pourrais m\'expliquer Redis ?',
    }, { advisor: true, threshold_pct: 20 })
    
    expect(captureStdout).toHaveBeenCalledWith(expect.stringContaining('💡 Trimly'))
  })
  
  it('respects timeout (returns under 5s)', async () => {
    const start = Date.now()
    await runHook({/*...*/}, {/*...*/})
    expect(Date.now() - start).toBeLessThan(5000)
  })
})
```

### F10 — Hook Stop

```typescript
describe('stop hook', () => {
  it('updates pending event to completed with real tokens', async () => {
    const storage = new NodeSqliteStorage(':memory:')
    await storage.init()
    
    // pre-existing pending event
    await storage.recordEvent({
      id: 'evt-1',
      session_id: 'test-123',
      status: 'pending',
      tokens_input: 0,  // will be replaced with real value
      // ...
    })
    
    // fixture transcript
    const transcriptPath = path.join(__dirname, '__fixtures__/transcripts/sample.jsonl')
    
    await runStopHook({ session_id: 'test-123', transcript_path: transcriptPath }, { storage })
    
    const events = await storage.queryEvents({ session_id: 'test-123' })
    expect(events[0].status).toBe('completed')
    expect(events[0].tokens_input).toBeGreaterThan(0)
    expect(events[0].tokens_output).toBeGreaterThan(0)
    expect(events[0].cost_usd).toBeGreaterThan(0)
  })
})
```

### F17 — Content script adapter

```typescript
describe('claudeAiAdapter', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div contenteditable="true" role="textbox">Hello</div>
      <button aria-label="Send Message">Send</button>
    `
  })
  
  it('finds input element', () => {
    const el = document.querySelector(claudeAiAdapter.inputSelector)
    expect(el).toBeTruthy()
  })
  
  it('reads input text', () => {
    const el = document.querySelector(claudeAiAdapter.inputSelector) as HTMLElement
    expect(claudeAiAdapter.getInputText(el)).toBe('Hello')
  })
  
  it('observes input changes', async () => {
    const callback = vi.fn()
    const cleanup = claudeAiAdapter.observe(callback)
    
    const el = document.querySelector(claudeAiAdapter.inputSelector) as HTMLElement
    el.dispatchEvent(new Event('input', { bubbles: true }))
    
    expect(callback).toHaveBeenCalled()
    cleanup()
  })
})
```

### F18 — TokenBadge UI

```typescript
describe('TokenBadge.vue', () => {
  it('renders token count', () => {
    const w = shallowMount(TokenBadge, {
      props: { tokens: 247, costUSD: 0.001, currency: 'USD' }
    })
    expect(w.text()).toContain('247 tokens')
    expect(w.text()).toContain('$0.00')
  })
  
  it('shows optimize button when savings available', () => {
    const w = shallowMount(TokenBadge, {
      props: { tokens: 247, costUSD: 0.001, savingsPct: 32 }
    })
    expect(w.find('.optimize').exists()).toBe(true)
    expect(w.text()).toContain('-32%')
  })
  
  it('emits optimize event on button click', async () => {
    const w = shallowMount(TokenBadge, {
      props: { tokens: 247, costUSD: 0.001, savingsPct: 32 }
    })
    await w.find('.optimize').trigger('click')
    expect(w.emitted('optimize')).toBeTruthy()
  })
})
```

### F23+ Dashboard

```typescript
describe('Dashboard /events page', () => {
  it('lists events from API', async () => {
    // mock fetch /api/events
    const w = await renderPage('/events')
    expect(w.findAll('tr').length).toBeGreaterThan(1)
  })
})
```

## 🚀 CI

`.github/workflows/ci.yml` :

```yaml
name: CI

on:
  push: { branches: [main] }
  pull_request: { branches: [main] }

jobs:
  test:
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        node: [20, 22, 24]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build
```

## 🧹 Tests à NE PAS écrire en V1

- ❌ E2E full stack avec navigateur réel (V1.5 avec Playwright)
- ❌ Tests d'intégration avec vrais providers (paie des tokens)
- ❌ Tests visuels (Chromatic etc., V2)
- ❌ Tests de performance (V2)
- ❌ Tests sur Bun et Deno (V2, mais le code doit y tourner)

## ⚠️ Cas edge à tester explicitement

- Prompt vide → no-op pas crash
- Prompt 100k tokens → tokenizer ne timeout pas
- Caractères Unicode complexes (emojis, RTL) → comptage correct
- Storage corrompu → recovery propre
- Hook timeout dépassé → fallback heuristique
- Extension sur claude.ai sans textarea trouvé → no-op silencieux
- Multi-tabs claude.ai → un seul TokenBadge actif à la fois
