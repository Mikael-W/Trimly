<script setup lang="ts">
const { t, locale, locales, setLocale } = useI18n()
const { theme, apply: applyTheme } = useTheme()

useHead({ title: `${t('settings.title')} — Trimly` })

const currency = ref<'USD' | 'EUR'>('USD')
const dbPath = ref(
  typeof window !== 'undefined' ? (localStorage.getItem('trimly.dbPath') ?? '') : '',
)
const saved = ref(false)

function save() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('trimly.currency', currency.value)
    localStorage.setItem('trimly.dbPath', dbPath.value)
  }
  saved.value = true
  setTimeout(() => {
    saved.value = false
  }, 1800)
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    currency.value = (localStorage.getItem('trimly.currency') as 'USD' | 'EUR') ?? 'USD'
    dbPath.value = localStorage.getItem('trimly.dbPath') ?? ''
  }
})
</script>

<template>
  <div class="settings">
    <h1 class="page-title">{{ t('settings.title') }}</h1>

    <div class="settings-card">
      <div class="setting-row">
        <div class="setting-label-group">
          <span class="setting-label">{{ t('settings.language') }}</span>
        </div>
        <div class="toggle-group">
          <button
            v-for="loc in locales"
            :key="loc.code"
            class="toggle-btn"
            :class="{ 'toggle-btn--active': locale === loc.code }"
            @click="setLocale(loc.code)"
          >
            {{ loc.name }}
          </button>
        </div>
      </div>

      <div class="setting-row">
        <div class="setting-label-group">
          <span class="setting-label">{{ t('settings.theme') }}</span>
        </div>
        <div class="toggle-group">
          <button
            v-for="m in (['dark', 'light'] as const)"
            :key="m"
            class="toggle-btn"
            :class="{ 'toggle-btn--active': theme === m }"
            @click="applyTheme(m)"
          >
            {{ t(`settings.theme.${m}`) }}
          </button>
        </div>
      </div>

      <div class="setting-row">
        <div class="setting-label-group">
          <span class="setting-label">{{ t('settings.currency') }}</span>
        </div>
        <div class="toggle-group">
          <button
            v-for="c in ['USD', 'EUR']"
            :key="c"
            class="toggle-btn"
            :class="{ 'toggle-btn--active': currency === c }"
            @click="currency = c as 'USD' | 'EUR'"
          >
            {{ c }}
          </button>
        </div>
      </div>

      <div class="setting-row setting-row--column">
        <div class="setting-label-group">
          <span class="setting-label">{{ t('settings.dbPath') }}</span>
          <span class="setting-desc">{{ t('settings.dbPathDesc') }}</span>
        </div>
        <input
          v-model="dbPath"
          type="text"
          class="setting-input"
          :placeholder="t('settings.dbPathDesc')"
        />
      </div>

      <div class="setting-footer">
        <button class="btn-save" :class="{ 'btn-save--done': saved }" @click="save">
          {{ saved ? '✓' : t('settings.save') }}
        </button>

      </div>
    </div>
  </div>
</template>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 520px;
}

.page-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.01em;
}

.settings-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--surface-2);
}

.setting-row--column {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
}

.setting-label-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.setting-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
}

.setting-desc {
  font-size: 11px;
  color: var(--text-muted);
}

.toggle-group {
  display: flex;
  gap: 2px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  padding: 2px;
  flex-shrink: 0;
}

.toggle-btn {
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
  color: var(--text-muted);
  transition: color 0.15s, background 0.15s;
}

.toggle-btn:hover { color: var(--text-dim); }

.toggle-btn--active {
  background: var(--violet);
  color: #fff;
}

.setting-input {
  width: 100%;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  padding: 8px 12px;
  font-size: 13px;
  font-family: var(--mono);
  color: var(--text);
  outline: none;
  transition: border-color 0.15s;
}

.setting-input:focus { border-color: var(--violet); }
.setting-input::placeholder { color: var(--text-muted); }

.setting-footer {
  padding: 1rem 1.5rem;
  background: var(--bg);
}

.btn-save {
  padding: 7px 18px;
  background: var(--violet);
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  border-radius: var(--r-sm);
  transition: opacity 0.15s;
}

.btn-save:hover { opacity: 0.85; }

.btn-save--done {
  background: var(--green);
  opacity: 1;
}
</style>
