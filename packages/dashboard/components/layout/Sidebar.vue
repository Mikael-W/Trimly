<script setup lang="ts">
const { t } = useI18n()

const links = computed(() => [
  { to: '/', label: t('nav.overview'), icon: 'overview' },
  { to: '/events', label: t('nav.events'), icon: 'events' },
  { to: '/settings', label: t('nav.settings'), icon: 'settings' },
])
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-brand">
      <span class="sidebar-brand__logo">T</span>
      <span class="sidebar-brand__name">rimly</span>
    </div>

    <nav class="sidebar-nav">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="nav-link"
        active-class="nav-link--active"
        :exact="link.to === '/'"
      >
        <svg v-if="link.icon === 'overview'" class="nav-icon" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
          <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
          <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
          <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <svg v-if="link.icon === 'events'" class="nav-icon" viewBox="0 0 16 16" fill="none">
          <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <svg v-if="link.icon === 'settings'" class="nav-icon" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="2.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M8 1.5v1.8M8 12.7v1.8M1.5 8h1.8M12.7 8h1.8M3.2 3.2l1.3 1.3M11.5 11.5l1.3 1.3M3.2 12.8l1.3-1.3M11.5 4.5l1.3-1.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <span>{{ link.label }}</span>
      </NuxtLink>
    </nav>

    <div class="sidebar-footer">
      <BaseLangSwitcher />
      <span class="sidebar-version">v0.1.0</span>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 220px;
  min-height: 100vh;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-brand {
  padding: 1.5rem 1.25rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 2px;
  border-bottom: 1px solid var(--border);
}

.sidebar-brand__logo {
  font-size: 18px;
  font-weight: 800;
  color: var(--violet);
  font-family: var(--mono);
  background: var(--violet-bg);
  border: 1px solid var(--violet-border);
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.sidebar-brand__name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.01em;
}

.sidebar-nav {
  flex: 1;
  padding: 0.75rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 7px 10px;
  border-radius: var(--r-sm);
  font-size: 13px;
  font-weight: 450;
  color: var(--text-muted);
  transition: color 0.15s, background 0.15s;
  border-left: 2px solid transparent;
}

.nav-link:hover {
  color: var(--text-dim);
  background: rgba(255,255,255,0.04);
}

.nav-link--active {
  color: var(--text);
  background: var(--violet-bg);
  border-left-color: var(--violet);
}

.nav-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.sidebar-footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-version {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--mono);
}
</style>
