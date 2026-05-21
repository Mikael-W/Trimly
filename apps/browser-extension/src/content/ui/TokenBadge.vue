<script setup lang="ts">
const props = defineProps<{
  tokens: number
  costUSD: number
  savingsPct?: number
}>()

const emit = defineEmits<{ optimize: [] }>()

const costStr = computed(() => `$${props.costUSD.toFixed(4)}`)
</script>

<template>
  <div class="badge">
    <span class="badge-tokens">{{ tokens }} tokens</span>
    <span class="badge-sep">·</span>
    <span class="badge-cost">{{ costStr }}</span>
    <button
      v-if="savingsPct && savingsPct > 5"
      class="badge-optimize"
      @click="emit('optimize')"
    >
      💡 -{{ savingsPct }}%
    </button>
  </div>
</template>

<style scoped>
.badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(17, 17, 17, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 5px 10px;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 12px;
  color: #e5e5e5;
  z-index: 9999;
  pointer-events: auto;
  backdrop-filter: blur(6px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
}

.badge-tokens { color: #a1a1aa; }
.badge-sep { color: #52525b; }

.badge-cost {
  color: #a78bfa;
  font-family: ui-monospace, 'SF Mono', monospace;
  font-weight: 600;
}

.badge-optimize {
  background: rgba(139, 92, 246, 0.15);
  color: #a78bfa;
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 5px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
}

.badge-optimize:hover {
  background: rgba(139, 92, 246, 0.28);
}
</style>
