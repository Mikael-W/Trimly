import { ref } from 'vue'

const theme = ref<'dark' | 'light'>('dark')

export function useTheme() {
  function apply(t: 'dark' | 'light') {
    theme.value = t
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', t)
      localStorage.setItem('trimly.theme', t)
    }
  }

  function init() {
    if (typeof localStorage === 'undefined') return
    const saved = localStorage.getItem('trimly.theme') as 'dark' | 'light' | null
    apply(saved ?? 'dark')
  }

  return { theme, apply, init }
}
