<script setup lang="ts">
import type { StatsResult } from '@trimly/core'

const { t } = useI18n()

useHead({ title: t('overview.title') + ' — Trimly' })

const period = ref<'today' | '7d' | '30d' | 'all'>('30d')
const periods = ['today', '7d', '30d', 'all'] as const

const { data: stats } = useStats(period)
const { data: timeline } = useFetch<{ date: string; cost: number }[]>('/api/timeline', {
  query: computed(() => ({
    days: period.value === 'all' ? 365 : period.value === 'today' ? 1 : period.value === '7d' ? 7 : 30,
  })),
  watch: [period],
})

const s = computed<StatsResult>(() => stats.value ?? {
  totalRequests: 0,
  totalTokensInput: 0,
  totalTokensOutput: 0,
  totalCostUsd: 0,
  totalSavedUsd: 0,
  byModel: {},
})

const CHART_W = 600
const CHART_H = 100

const chartPath = computed(() => buildChartPath(timeline.value ?? [], CHART_W, CHART_H))

const modelEntries = computed(() => {
  const entries = Object.entries(s.value.byModel)
  if (!entries.length) return []
  const maxCost = Math.max(...entries.map(([, v]) => v.cost), 0.0001)
  return entries
    .sort(([, a], [, b]) => b.cost - a.cost)
    .map(([model, v]) => ({
      model,
      requests: v.requests,
      costStr: `$${v.cost.toFixed(4)}`,
      pct: Math.round((v.cost / maxCost) * 100),
    }))
})

</script>

<template>
  <div class="overview">
    <div class="page-header">
      <h1 class="page-title">{{ t('overview.title') }}</h1>
      <div class="period-toggle">
        <button
          v-for="p in periods"
          :key="p"
          class="period-btn"
          :class="{ 'period-btn--active': period === p }"
          @click="period = p"
        >
          {{ t(`period.${p}`) }}
        </button>
      </div>
    </div>

    <div class="stats-grid">
      <BaseBigNumber :value="fmtCost(s.totalCostUsd)" :label="t('stats.totalCost')" accent />
      <BaseBigNumber
        :value="fmtTokens(s.totalTokensInput + s.totalTokensOutput)"
        :label="t('stats.totalTokens')"
        :sub="`${fmtTokens(s.totalTokensInput)} in · ${fmtTokens(s.totalTokensOutput)} out`"
      />
      <BaseBigNumber :value="s.totalRequests" :label="t('stats.totalRequests')" />
      <BaseBigNumber :value="fmtCost(s.totalSavedUsd)" :label="t('stats.totalSaved')" positive />
    </div>

    <div class="card">
      <h2 class="card-title">{{ t('overview.timeline') }}</h2>
      <div v-if="chartPath" class="chart-wrap">
        <svg
          class="chart-svg"
          :viewBox="`0 0 ${CHART_W} ${CHART_H}`"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.22" />
              <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.02" />
            </linearGradient>
          </defs>
          <path :d="chartPath.area" fill="url(#area-grad)" />
          <path
            :d="chartPath.line"
            fill="none"
            stroke="#8b5cf6"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div v-else class="chart-empty">{{ t('events.empty') }}</div>
    </div>

    <div v-if="modelEntries.length > 0" class="card">
      <h2 class="card-title">Par modèle</h2>
      <div class="model-list">
        <div v-for="m in modelEntries" :key="m.model" class="model-row">
          <div class="model-info">
            <span class="model-name">{{ m.model }}</span>
            <span class="model-meta">{{ m.requests }} req · <span class="model-cost">{{ m.costStr }}</span></span>
          </div>
          <div class="model-bar-track">
            <div class="model-bar" :style="{ width: `${m.pct}%` }" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overview {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.01em;
}

.period-toggle {
  display: flex;
  gap: 2px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 3px;
}

.period-btn {
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 7px;
  color: var(--text-muted);
  transition: color 0.15s, background 0.15s;
}

.period-btn:hover { color: var(--text-dim); }

.period-btn--active {
  background: var(--violet);
  color: #fff;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

@media (max-width: 900px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: 1.25rem 1.5rem;
}

.card-title {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.chart-wrap {
  width: 100%;
  height: 120px;
}

.chart-svg {
  width: 100%;
  height: 100%;
}

.chart-empty {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: var(--text-muted);
}

.model-list {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.model-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.model-info {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.model-name {
  font-size: 12px;
  font-family: var(--mono);
  color: var(--text-dim);
}

.model-meta {
  font-size: 11px;
  color: var(--text-muted);
}

.model-cost { color: var(--violet-400); }

.model-bar-track {
  height: 3px;
  background: var(--surface-2);
  border-radius: 2px;
  overflow: hidden;
}

.model-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--violet), var(--violet-400));
  border-radius: 2px;
  transition: width 0.4s ease;
  min-width: 4px;
}
</style>
