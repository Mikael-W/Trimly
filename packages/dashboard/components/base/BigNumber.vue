<script setup lang="ts">
defineProps<{
  value: string | number
  label: string
  sub?: string
  accent?: boolean
  positive?: boolean
}>()
</script>

<template>
  <div class="card" :class="{ 'card--accent': accent, 'card--positive': positive }">
    <span class="card-label">{{ label }}</span>
    <span class="card-value">{{ value }}</span>
    <span v-if="sub" class="card-sub">{{ sub }}</span>
  </div>
</template>

<style scoped>
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: border-color 0.2s;
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border), transparent);
}

.card--accent::before { background: linear-gradient(90deg, transparent, var(--violet-border), transparent); }
.card--positive::before { background: linear-gradient(90deg, transparent, rgba(34,197,94,0.2), transparent); }

.card-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.card-value {
  font-size: 2rem;
  font-weight: 700;
  font-family: var(--mono);
  letter-spacing: -0.02em;
  color: var(--text);
  line-height: 1.1;
  margin-top: 2px;
}

.card--accent .card-value { color: var(--violet-400); }
.card--positive .card-value { color: var(--green); }

.card-sub {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--mono);
  margin-top: 2px;
}
</style>
