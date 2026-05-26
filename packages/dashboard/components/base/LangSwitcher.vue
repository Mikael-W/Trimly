<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

function onChange(e: Event) {
  setLocale((e.target as HTMLSelectElement).value as typeof locale.value)
}
</script>

<template>
  <select class="lang-switcher" :value="locale" @change="onChange">
    <option v-for="loc in locales" :key="loc.code" :value="loc.code">
      {{ loc.name }}
    </option>
  </select>
</template>

<style scoped>
.lang-switcher {
  width: 100%;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  padding: 6px 8px;
  font-size: 12px;
  color: var(--text-dim);
  outline: none;
  cursor: pointer;
}

.lang-switcher:focus {
  border-color: var(--violet);
}
</style>
