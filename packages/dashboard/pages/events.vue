<script setup lang="ts">
const { t } = useI18n()

useHead({ title: t('events.title') + ' — Trimly' })

const source = ref<string>('all')
const sources = ['all', 'claude-code', 'browser-extension'] as const

const { data: events, pending } = useEvents(source)

</script>

<template>
  <div class="events">
    <div class="page-header">
      <h1 class="page-title">{{ t('events.title') }}</h1>
      <div class="filter-toggle">
        <button
          v-for="s in sources"
          :key="s"
          class="filter-btn"
          :class="{ 'filter-btn--active': source === s }"
          @click="source = s"
        >
          {{
            s === 'all'
              ? t('events.filter.all')
              : s === 'claude-code'
                ? t('events.filter.claudeCode')
                : t('events.filter.browser')
          }}
        </button>
      </div>
    </div>

    <div class="table-card">
      <div v-if="pending" class="state-msg">…</div>
      <div v-else-if="!events || events.length === 0" class="state-msg">{{ t('events.empty') }}</div>
      <table v-else class="events-table">
        <thead>
          <tr>
            <th>{{ t('events.col.time') }}</th>
            <th>{{ t('events.col.model') }}</th>
            <th class="align-right">{{ t('events.col.tokens') }}</th>
            <th class="align-right">{{ t('events.col.cost') }}</th>
            <th>{{ t('events.col.source') }}</th>
            <th>{{ t('events.col.status') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in events" :key="event.id">
            <td class="cell-time" :title="fmtDateTime(event.timestamp)">{{ fmtRelTime(event.timestamp) }}</td>
            <td class="cell-mono">{{ event.model }}</td>
            <td class="cell-num align-right">{{ event.tokens_input + event.tokens_output }}</td>
            <td class="cell-cost align-right">{{ fmtCost5(event.cost_usd) }}</td>
            <td>
              <span class="badge" :class="event.source === 'claude-code' ? 'badge--violet' : 'badge--green'">
                {{ event.source }}
              </span>
            </td>
            <td>
              <span class="badge" :class="event.status === 'completed' ? 'badge--green' : 'badge--amber'">
                {{ event.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.events {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

.filter-toggle {
  display: flex;
  gap: 2px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 3px;
}

.filter-btn {
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 7px;
  color: var(--text-muted);
  transition: color 0.15s, background 0.15s;
}

.filter-btn:hover { color: var(--text-dim); }

.filter-btn--active {
  background: var(--violet);
  color: #fff;
}

.table-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
}

.state-msg {
  height: 8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: var(--text-muted);
}

.events-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.events-table thead tr {
  border-bottom: 1px solid var(--border);
}

.events-table th {
  padding: 10px 16px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-muted);
  text-align: left;
}

.events-table tbody tr {
  border-bottom: 1px solid var(--surface-2);
  transition: background 0.1s;
}

.events-table tbody tr:last-child { border-bottom: none; }
.events-table tbody tr:hover { background: var(--surface-2); }

.events-table td { padding: 10px 16px; }

.align-right { text-align: right; }

.cell-time {
  color: var(--text-muted);
  font-family: var(--mono);
  font-size: 12px;
  cursor: default;
  white-space: nowrap;
}

.cell-mono {
  color: var(--text-dim);
  font-family: var(--mono);
  font-size: 12px;
}

.cell-num {
  color: var(--text-dim);
  font-variant-numeric: tabular-nums;
}

.cell-cost {
  color: var(--violet-400);
  font-family: var(--mono);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.badge {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.badge--violet {
  background: var(--violet-bg);
  color: var(--violet-400);
  border: 1px solid var(--violet-border);
}

.badge--green {
  background: var(--green-bg);
  color: var(--green);
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.badge--amber {
  background: rgba(245, 158, 11, 0.1);
  color: var(--amber);
  border: 1px solid rgba(245, 158, 11, 0.2);
}
</style>
