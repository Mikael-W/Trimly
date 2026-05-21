export default defineNuxtConfig({
  modules: ['@unocss/nuxt', '@nuxtjs/i18n'],

  devServer: { port: 3737 },

  i18n: {
    locales: [
      { code: 'fr', name: 'Français', file: 'fr.json' },
      { code: 'en', name: 'English', file: 'en.json' },
    ],
    defaultLocale: 'fr',
    strategy: 'no_prefix',
  },

  nitro: {
    experimental: { wasm: true },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  compatibilityDate: '2024-11-01',
})
