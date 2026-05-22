<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  values: number[]
  label?: string
  width?: number
  height?: number
  color?: string
}>()

const w = computed(() => props.width ?? 80)
const h = computed(() => props.height ?? 24)

const points = computed(() => {
  const vals = props.values
  if (!vals || vals.length === 0) return ''
  const max = Math.max(...vals)
  if (max === 0) return vals.map((_, i) => `${(i / (vals.length - 1)) * w.value},${h.value}`).join(' ')

  return vals
    .map((v, i) => {
      const x = vals.length === 1 ? w.value / 2 : (i / (vals.length - 1)) * w.value
      const y = h.value - (v / max) * (h.value - 2)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
})

const fillPoints = computed(() => {
  if (!points.value) return ''
  return `${points.value} ${w.value},${h.value} 0,${h.value}`
})

const lineColor = computed(() => props.color ?? 'var(--green, #22c55e)')
</script>

<template>
  <div class="sparkline-wrap">
    <span v-if="label" class="sparkline-label">{{ label }}</span>
    <svg
      :width="w"
      :height="h"
      :viewBox="`0 0 ${w} ${h}`"
      class="sparkline"
      aria-hidden="true"
    >
      <defs>
        <linearGradient :id="`spark-fill-${w}`" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="lineColor" stop-opacity="0.3" />
          <stop offset="100%" :stop-color="lineColor" stop-opacity="0.02" />
        </linearGradient>
      </defs>
      <polygon
        v-if="fillPoints"
        :points="fillPoints"
        :fill="`url(#spark-fill-${w})`"
      />
      <polyline
        v-if="points"
        :points="points"
        fill="none"
        :stroke="lineColor"
        stroke-width="1.5"
        stroke-linejoin="round"
        stroke-linecap="round"
      />
    </svg>
  </div>
</template>

<style scoped>
.sparkline-wrap {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.sparkline-label {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--mono);
  white-space: nowrap;
}

.sparkline {
  display: block;
  overflow: visible;
}
</style>
