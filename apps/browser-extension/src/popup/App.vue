<script setup lang="ts">
import { exportJson, getStats } from '../storage/index.js'

const stats = ref<{
  todayCount: number
  todayCost: number
  monthCount: number
  monthCost: number
  totalSaved: number
} | null>(null)

onMounted(async () => {
  stats.value = await getStats()
})

function fmt(n: number) {
  return `$${n.toFixed(4)}`
}

async function doExport() {
  const json = await exportJson()
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `trimly-export-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="popup">
    <header class="popup-header">
      <div class="brand">
        <span class="brand-logo">T</span>
        <span class="brand-name">rimly</span>
      </div>
    </header>

    <div v-if="stats" class="popup-body">
      <div class="stat-section">
        <div class="stat-label">Aujourd'hui</div>
        <div class="stat-row">
          <span class="stat-dim">{{ stats.todayCount }} requêtes</span>
          <span class="stat-cost">{{ fmt(stats.todayCost) }}</span>
        </div>
      </div>

      <div class="stat-divider" />

      <div class="stat-section">
        <div class="stat-label">Ce mois</div>
        <div class="stat-row">
          <span class="stat-dim">{{ stats.monthCount }} requêtes</span>
          <span class="stat-cost">{{ fmt(stats.monthCost) }}</span>
        </div>
        <div class="stat-row stat-row--sub">
          <span class="stat-muted">Économisé</span>
          <span class="stat-saved">{{ fmt(stats.totalSaved) }}</span>
        </div>
      </div>
    </div>

    <div v-else class="popup-loading">Chargement…</div>

    <footer class="popup-footer">
      <button class="btn-export" @click="doExport">Exporter JSON</button>
    </footer>
  </div>
</template>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  width: 240px;
  background: #09090b;
  color: #fafafa;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', system-ui, sans-serif;
  font-size: 13px;
  -webkit-font-smoothing: antialiased;
}
button { font-family: inherit; cursor: pointer; border: none; background: none; }
</style>

<style scoped>
.popup {
  display: flex;
  flex-direction: column;
}

.popup-header {
  padding: 12px 14px 10px;
  border-bottom: 1px solid #27272a;
}

.brand {
  display: flex;
  align-items: center;
  gap: 3px;
}

.brand-logo {
  font-size: 15px;
  font-weight: 800;
  color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.22);
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ui-monospace, 'SF Mono', monospace;
  line-height: 1;
}

.brand-name {
  font-size: 14px;
  font-weight: 600;
  color: #fafafa;
  letter-spacing: -0.01em;
}

.popup-body {
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-divider {
  height: 1px;
  background: #27272a;
  margin: 0 -14px;
  padding: 0;
}

.stat-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #52525b;
}

.stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-row--sub { margin-top: -2px; }

.stat-dim { color: #a1a1aa; }
.stat-muted { color: #71717a; font-size: 12px; }

.stat-cost {
  color: #a78bfa;
  font-family: ui-monospace, 'SF Mono', monospace;
  font-size: 12px;
  font-weight: 600;
}

.stat-saved {
  color: #22c55e;
  font-family: ui-monospace, 'SF Mono', monospace;
  font-size: 12px;
  font-weight: 600;
}

.popup-loading {
  padding: 24px 14px;
  text-align: center;
  color: #52525b;
  font-size: 12px;
}

.popup-footer {
  padding: 10px 14px;
  border-top: 1px solid #27272a;
}

.btn-export {
  width: 100%;
  padding: 7px;
  font-size: 12px;
  font-weight: 500;
  color: #71717a;
  border: 1px solid #27272a;
  border-radius: 6px;
  transition: color 0.15s, border-color 0.15s;
}

.btn-export:hover {
  color: #a1a1aa;
  border-color: #3f3f46;
}
</style>
