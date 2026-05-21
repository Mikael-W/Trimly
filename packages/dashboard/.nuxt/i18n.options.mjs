
// @ts-nocheck
import locale_fr_46json_ada684b7 from "#nuxt-i18n/ada684b7";
import locale_en_46json_83c40dc8 from "#nuxt-i18n/83c40dc8";

export const localeCodes =  [
  "fr",
  "en"
]

export const localeLoaders = {
  fr: [
    {
      key: "locale_fr_46json_ada684b7",
      load: () => Promise.resolve(locale_fr_46json_ada684b7),
      cache: true
    }
  ],
  en: [
    {
      key: "locale_en_46json_83c40dc8",
      load: () => Promise.resolve(locale_en_46json_83c40dc8),
      cache: true
    }
  ]
}

export const vueI18nConfigs = []

export const nuxtI18nOptions = {
  restructureDir: "i18n",
  experimental: {
    localeDetector: "",
    switchLocalePathLinkSSR: false,
    autoImportTranslationFunctions: false,
    typedPages: true,
    typedOptionsAndMessages: false,
    generatedLocaleFilePathFormat: "absolute",
    alternateLinkCanonicalQueries: false,
    hmr: true
  },
  bundle: {
    compositionOnly: true,
    runtimeOnly: false,
    fullInstall: true,
    dropMessageCompiler: false,
    optimizeTranslationDirective: true
  },
  compilation: {
    strictMessage: true,
    escapeHtml: false
  },
  customBlocks: {
    defaultSFCLang: "json",
    globalSFCScope: false
  },
  locales: [
    {
      code: "fr",
      name: "Français",
      files: [
        {
          path: "/Users/mw/Work/JOYS-LAB/projets/trimly/packages/dashboard/i18n/locales/fr.json",
          cache: undefined
        }
      ]
    },
    {
      code: "en",
      name: "English",
      files: [
        {
          path: "/Users/mw/Work/JOYS-LAB/projets/trimly/packages/dashboard/i18n/locales/en.json",
          cache: undefined
        }
      ]
    }
  ],
  defaultLocale: "fr",
  defaultDirection: "ltr",
  routesNameSeparator: "___",
  trailingSlash: false,
  defaultLocaleRouteNameSuffix: "default",
  strategy: "no_prefix",
  lazy: false,
  langDir: "locales",
  rootRedirect: undefined,
  detectBrowserLanguage: {
    alwaysRedirect: false,
    cookieCrossOrigin: false,
    cookieDomain: null,
    cookieKey: "i18n_redirected",
    cookieSecure: false,
    fallbackLocale: "",
    redirectOn: "root",
    useCookie: true
  },
  differentDomains: false,
  baseUrl: "",
  customRoutes: "page",
  pages: {},
  skipSettingLocaleOnNavigate: false,
  types: "composition",
  debug: false,
  parallelPlugin: false,
  multiDomainLocales: false,
  i18nModules: []
}

export const normalizedLocales = [
  {
    code: "fr",
    name: "Français",
    files: [
      {
        path: "/Users/mw/Work/JOYS-LAB/projets/trimly/packages/dashboard/i18n/locales/fr.json",
        cache: undefined
      }
    ]
  },
  {
    code: "en",
    name: "English",
    files: [
      {
        path: "/Users/mw/Work/JOYS-LAB/projets/trimly/packages/dashboard/i18n/locales/en.json",
        cache: undefined
      }
    ]
  }
]

export const NUXT_I18N_MODULE_ID = "@nuxtjs/i18n"
export const parallelPlugin = false
export const isSSG = false
export const hasPages = true

export const DEFAULT_COOKIE_KEY = "i18n_redirected"
export const DEFAULT_DYNAMIC_PARAMS_KEY = "nuxtI18nInternal"
export const SWITCH_LOCALE_PATH_LINK_IDENTIFIER = "nuxt-i18n-slp"
/** client **/
if(import.meta.hot) {

function deepEqual(a, b, ignoreKeys = []) {
  // Same reference?
  if (a === b) return true

  // Check if either is null or not an object
  if (a == null || b == null || typeof a !== 'object' || typeof b !== 'object') {
    return false
  }

  // Get top-level keys, excluding ignoreKeys
  const keysA = Object.keys(a).filter(k => !ignoreKeys.includes(k))
  const keysB = Object.keys(b).filter(k => !ignoreKeys.includes(k))

  // Must have the same number of keys (after ignoring)
  if (keysA.length !== keysB.length) {
    return false
  }

  // Check each property
  for (const key of keysA) {
    if (!keysB.includes(key)) {
      return false
    }

    const valA = a[key]
    const valB = b[key]

    // Compare functions stringified
    if (typeof valA === 'function' && typeof valB === 'function') {
      if (valA.toString() !== valB.toString()) {
        return false
      }
    }
    // If nested, do a normal recursive check (no ignoring at deeper levels)
    else if (typeof valA === 'object' && typeof valB === 'object') {
      if (!deepEqual(valA, valB)) {
        return false
      }
    }
    // Compare primitive values
    else if (valA !== valB) {
      return false
    }
  }

  return true
}



async function loadCfg(config) {
  const nuxt = useNuxtApp()
  const { default: resolver } = await config()
  return typeof resolver === 'function' ? await nuxt.runWithContext(() => resolver()) : resolver
}


  import.meta.hot.accept("../i18n/locales/fr.json", async mod => {
    localeLoaders["fr"][0].load = () => Promise.resolve(mod.default)
    await useNuxtApp()._nuxtI18nDev.resetI18nProperties("fr")
  })

  import.meta.hot.accept("../i18n/locales/en.json", async mod => {
    localeLoaders["en"][0].load = () => Promise.resolve(mod.default)
    await useNuxtApp()._nuxtI18nDev.resetI18nProperties("en")
  })



}
/** client-end **/