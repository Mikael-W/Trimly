<script setup lang="ts">
const { init } = useTheme()
const { init: initCurrency } = useCurrency()
onMounted(() => {
  init()
  initCurrency()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #09090b;
  --surface: #18181b;
  --surface-2: #27272a;
  --surface-3: #3f3f46;
  --border: #27272a;
  --text: #fafafa;
  --text-dim: #a1a1aa;
  --text-muted: #52525b;
  --violet: #8b5cf6;
  --violet-400: #a78bfa;
  --violet-bg: rgba(139, 92, 246, 0.08);
  --violet-border: rgba(139, 92, 246, 0.22);
  --green: #22c55e;
  --green-bg: rgba(34, 197, 94, 0.1);
  --amber: #f59e0b;
  --red: #ef4444;
  --blue: #60a5fa;
  --blue-bg: rgba(96, 165, 250, 0.1);
  --r-sm: 6px;
  --r-md: 10px;
  --r-lg: 14px;
  --mono: 'SF Mono', ui-monospace, 'Cascadia Code', Consolas, monospace;
  --sans: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', system-ui, sans-serif;
}

html, body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--sans);
  font-size: 14px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a { color: inherit; text-decoration: none; }
button { font-family: inherit; cursor: pointer; border: none; background: none; }

::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--surface-3); border-radius: 2px; }

::selection { background: var(--violet-bg); color: var(--violet-400); }

[data-theme="light"] {
  --bg: #fafafa;
  --surface: #ffffff;
  --surface-2: #f4f4f5;
  --surface-3: #e4e4e7;
  --border: #e4e4e7;
  --text: #09090b;
  --text-dim: #3f3f46;
  --text-muted: #a1a1aa;
  --violet-bg: rgba(139, 92, 246, 0.06);
  --violet-border: rgba(139, 92, 246, 0.16);
  --green-bg: rgba(34, 197, 94, 0.08);
  --blue-bg: rgba(96, 165, 250, 0.08);
}
</style>
