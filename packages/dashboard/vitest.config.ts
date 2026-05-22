import { createRequire } from 'node:module'
import { defineConfig } from 'vitest/config'

const require = createRequire(import.meta.url)

export default defineConfig({
  resolve: {
    alias: {
      vue: require.resolve('vue/dist/vue.cjs.js'),
    },
  },
  test: {
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      thresholds: { lines: 80 },
    },
  },
})
