import { defineConfig, presetAttributify, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno({ dark: 'class' }), presetAttributify()],
  theme: {
    colors: {
      surface: '#111111',
      border: '#222222',
      accent: '#8b5cf6',
      muted: '#6b7280',
    },
  },
})
