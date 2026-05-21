import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    platform: 'node',
    target: 'node20',
  },
  {
    entry: { browser: 'src/browser.ts' },
    format: ['esm'],
    dts: true,
    sourcemap: true,
    platform: 'browser',
    target: 'es2022',
    // Both tokenizer libs require WASM — keep external, browser.ts uses heuristics only
    external: ['@anthropic-ai/tokenizer', 'js-tiktoken'],
  },
])
