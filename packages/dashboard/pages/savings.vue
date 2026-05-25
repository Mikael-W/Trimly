<script setup lang="ts">
const { t } = useI18n()
const { fmtCost } = useCurrency()

useHead({ title: `${t('savings.title')} — Trimly` })

const period = ref<'7d' | '30d' | 'all'>('30d')
const periods = ['7d', '30d', 'all'] as const

const { data, refresh } = useFetch('/api/savings', {
  query: computed(() => ({
    days: period.value === 'all' ? 365 : period.value === '7d' ? 7 : 30,
  })),
  watch: [period],
})

const CHART_W = 600
const CHART_H = 80

const chartPath = computed(() =>
  buildChartPath(
    (data.value?.timeline ?? []).map((d) => ({ cost: d.costSaved })),
    CHART_W,
    CHART_H,
  ),
)

const modelEntries = computed(() => {
  const entries = Object.entries(data.value?.byModel ?? {})
  if (!entries.length) return []
  const maxSaved = Math.max(...entries.map(([, v]) => v.tokensSaved), 1)
  return entries
    .sort(([, a], [, b]) => b.tokensSaved - a.tokensSaved)
    .map(([model, v]) => ({
      model,
      tokensSaved: fmtTokens(v.tokensSaved),
      costSaved: fmtCost(v.costSaved),
      events: v.events,
      pct: Math.round((v.tokensSaved / maxSaved) * 100),
    }))
})

const savingsRate = computed(() => (data.value?.savingsRate ?? 0).toFixed(1))
</script>

<template>
  <div class="savings">
    <div class="page-header">
      <h1 class="page-title">{{ t('savings.title') }}</h1>
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
      <BaseBigNumber
        :value="fmtCost(data?.totalSavedUsd ?? 0)"
        :label="t('savings.totalSaved')"
        positive
      />
      <BaseBigNumber
        :value="fmtTokens(data?.totalTokensSaved ?? 0)"
        :label="t('savings.tokensSaved')"
      />
      <BaseBigNumber
        :value="`${savingsRate}%`"
        :label="t('savings.rate')"
        accent
      />
    </div>

    <div class="card">
      <h2 class="card-title">{{ t('savings.timeline') }}</h2>
      <div v-if="chartPath" class="chart-wrap">
        <svg class="chart-svg" :viewBox="`0 0 ${CHART_W} ${CHART_H}`" preserveAspectRatio="none">
          <defs>
            <linearGradient id="savings-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#22c55e" stop-opacity="0.22" />
              <stop offset="100%" stop-color="#22c55e" stop-opacity="0.02" />
            </linearGradient>
          </defs>
          <path :d="chartPath.area" fill="url(#savings-grad)" />
          <path
            :d="chartPath.line"
            fill="none"
            stroke="#22c55e"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div v-else class="chart-empty">{{ t('savings.noOptimizations') }}</div>
    </div>

    <div v-if="modelEntries.length > 0" class="card">
      <h2 class="card-title">{{ t('savings.byModel') }}</h2>
      <div class="model-list">
        <div v-for="m in modelEntries" :key="m.model" class="model-row">
          <div class="model-info">
            <span class="model-name">{{ m.model }}</span>
            <span class="model-meta">
              {{ m.events }} {{ t('savings.optimizations') }} ·
              <span class="model-tokens">{{ m.tokensSaved }} tokens</span> ·
              <span class="model-cost">{{ m.costSaved }}</span>
            </span>
          </div>
          <div class="model-bar-track">
            <div class="model-bar" :style="{ width: `${m.pct}%` }" />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <p class="empty-title">{{ t('savings.noOptimizations') }}</p>
      <p class="empty-desc">{{ t('savings.emptyDesc') }}</p>
    </div>
  </div>
</template>

<style scoped>
.savings {
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
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
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
  height: 100px;
}

.chart-svg {
  width: 100%;
  height: 100%;
}

.chart-empty {
  height: 100px;
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
  gap: 1rem;
}

.model-name {
  font-size: 12px;
  font-family: var(--mono);
  color: var(--text-dim);
  flex-shrink: 0;
}

.model-meta {
  font-size: 11px;
  color: var(--text-muted);
  text-align: right;
}

.model-tokens { color: var(--text-dim); }
.model-cost { color: var(--green); }

.model-bar-track {
  height: 3px;
  background: var(--surface-2);
  border-radius: 2px;
  overflow: hidden;
}

.model-bar {
  height: 100%;
  background: linear-gradient(90deg, #16a34a, var(--green));
  border-radius: 2px;
  transition: width 0.4s ease;
  min-width: 4px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 3rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  text-align: center;
}

.empty-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-dim);
}

.empty-desc {
  font-size: 12px;
  color: var(--text-muted);
  max-width: 280px;
  line-height: 1.6;
}
</style>
