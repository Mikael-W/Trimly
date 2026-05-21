<script setup lang="ts">
import { countTokens } from '../../lib/tokenizer-browser.js'
import { cleanFiller, detectFillerSavings } from '../../lib/cleanFiller-browser.js'
import { estimateCost } from '../../lib/pricing-browser.js'
import type { claudeAiAdapter } from '../sites/claude-ai-adapter.js'

const props = defineProps<{
  adapter: typeof claudeAiAdapter
}>()

const tokens = ref(0)
const costUSD = ref(0)
const savingsPct = ref(0)
const showOverlay = ref(false)
const optimizedText = ref('')
const originalText = ref('')
const tokensOptimized = ref(0)

let stopObserving: (() => void) | null = null
let debounceTimer: ReturnType<typeof setTimeout> | null = null

function handleInput(text: string) {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    tokens.value = countTokens(text)
    costUSD.value = estimateCost(tokens.value)
    const saved = detectFillerSavings(text)
    savingsPct.value = tokens.value > 0 ? Math.round((saved / tokens.value) * 100) : 0
  }, 200)
}

function openOptimize() {
  const input = props.adapter.getInputElement()
  if (!input) return
  const text = props.adapter.getInputText(input)
  originalText.value = text
  const result = cleanFiller(text)
  optimizedText.value = result.text
  tokensOptimized.value = countTokens(result.text)
  showOverlay.value = true
}

function applyOptimized() {
  const input = props.adapter.getInputElement()
  if (input) props.adapter.setInputText(input, optimizedText.value)
  tokens.value = tokensOptimized.value
  costUSD.value = estimateCost(tokensOptimized.value)
  savingsPct.value = 0
  showOverlay.value = false
}

onMounted(() => {
  const start = () => {
    stopObserving?.()
    stopObserving = props.adapter.observe(handleInput)
  }
  setTimeout(start, 1000)

  const observer = new MutationObserver(() => {
    if (props.adapter.getInputElement()) start()
  })
  observer.observe(document.body, { childList: true, subtree: true })
})

onUnmounted(() => {
  stopObserving?.()
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<template>
  <div class="trimly-root">
    <TokenBadge
      v-if="tokens > 0"
      :tokens="tokens"
      :cost-u-s-d="costUSD"
      :savings-pct="savingsPct"
      @optimize="openOptimize"
    />
    <OptimizeOverlay
      v-if="showOverlay"
      :original="originalText"
      :optimized="optimizedText"
      :tokens-original="tokens"
      :tokens-optimized="tokensOptimized"
      :savings-pct="savingsPct"
      @apply="applyOptimized"
      @dismiss="showOverlay = false"
    />
  </div>
</template>

<style scoped>
.trimly-root {
  position: relative;
  z-index: 9998;
}
</style>
