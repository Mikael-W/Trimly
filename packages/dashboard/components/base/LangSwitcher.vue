<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
</script>

<template>
  <div class="lang-switcher">
    <button
      v-for="loc in locales"
      :key="loc.code"
      class="lang-btn"
      :class="{ 'lang-btn--active': locale === loc.code }"
      @click="setLocale(loc.code)"
    >
      {{ loc.code.toUpperCase() }}
    </button>
  </div>
</template>

<style scoped>
.lang-switcher {
  display: flex;
  gap: 2px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  padding: 2px;
}

.lang-btn {
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  border-radius: 4px;
  color: var(--text-muted);
  transition: color 0.15s, background 0.15s;
}

.lang-btn:hover { color: var(--text-dim); }

.lang-btn--active {
  background: var(--violet);
  color: #fff;
}
</style>
