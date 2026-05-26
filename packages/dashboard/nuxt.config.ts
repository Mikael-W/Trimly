export default defineNuxtConfig({
  modules: ['@unocss/nuxt', '@nuxtjs/i18n'],

  devServer: { port: 3737 },

  i18n: {
    locales: [
      { code: 'fr', name: 'Français', file: 'fr.json' },
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'bg', name: 'Български', file: 'bg.json' },
      { code: 'cs', name: 'Čeština', file: 'cs.json' },
      { code: 'da', name: 'Dansk', file: 'da.json' },
      { code: 'de', name: 'Deutsch', file: 'de.json' },
      { code: 'el', name: 'Ελληνικά', file: 'el.json' },
      { code: 'es', name: 'Español', file: 'es.json' },
      { code: 'et', name: 'Eesti', file: 'et.json' },
      { code: 'fi', name: 'Suomi', file: 'fi.json' },
      { code: 'ga', name: 'Gaeilge', file: 'ga.json' },
      { code: 'hr', name: 'Hrvatski', file: 'hr.json' },
      { code: 'hu', name: 'Magyar', file: 'hu.json' },
      { code: 'it', name: 'Italiano', file: 'it.json' },
      { code: 'lt', name: 'Lietuvių', file: 'lt.json' },
      { code: 'lv', name: 'Latviešu', file: 'lv.json' },
      { code: 'mt', name: 'Malti', file: 'mt.json' },
      { code: 'nl', name: 'Nederlands', file: 'nl.json' },
      { code: 'pl', name: 'Polski', file: 'pl.json' },
      { code: 'pt', name: 'Português', file: 'pt.json' },
      { code: 'ro', name: 'Română', file: 'ro.json' },
      { code: 'sk', name: 'Slovenčina', file: 'sk.json' },
      { code: 'sl', name: 'Slovenščina', file: 'sl.json' },
      { code: 'sv', name: 'Svenska', file: 'sv.json' },
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
