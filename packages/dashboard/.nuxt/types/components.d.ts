
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T

interface _GlobalComponents {
  BaseBigNumber: typeof import("../../components/base/BigNumber.vue")['default']
  BaseLangSwitcher: typeof import("../../components/base/LangSwitcher.vue")['default']
  CommonCostFormat: typeof import("../../components/common/CostFormat.vue")['default']
  LayoutSidebar: typeof import("../../components/layout/Sidebar.vue")['default']
  UnoIcon: typeof import("../../../../node_modules/.pnpm/@unocss+nuxt@66.7.0_magicast@0.5.3_vite@7.3.3_@types+node@20.19.41_jiti@2.7.0_terser@5._4d82049c658a875f243fc374e5cba385/node_modules/@unocss/nuxt/runtime/UnoIcon.vue")['default']
  NuxtWelcome: typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/welcome.vue")['default']
  NuxtLayout: typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-layout")['default']
  NuxtErrorBoundary: typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
  ClientOnly: typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/client-only")['default']
  DevOnly: typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/dev-only")['default']
  ServerPlaceholder: typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/server-placeholder")['default']
  NuxtLink: typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-link")['default']
  NuxtLoadingIndicator: typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
  NuxtTime: typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
  NuxtRouteAnnouncer: typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
  NuxtImg: typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
  NuxtPicture: typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
  NuxtLinkLocale: typeof import("../../../../node_modules/.pnpm/@nuxtjs+i18n@9.5.6_@vue+compiler-dom@3.5.34_eslint@10.4.0_jiti@2.7.0__magicast@0.5.3_ro_0f44e1fb50dd396ef0eb05b871047554/node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']
  SwitchLocalePathLink: typeof import("../../../../node_modules/.pnpm/@nuxtjs+i18n@9.5.6_@vue+compiler-dom@3.5.34_eslint@10.4.0_jiti@2.7.0__magicast@0.5.3_ro_0f44e1fb50dd396ef0eb05b871047554/node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']
  NuxtPage: typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/pages/runtime/page")['default']
  NoScript: typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['NoScript']
  Link: typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Link']
  Base: typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Base']
  Title: typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Title']
  Meta: typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Meta']
  Style: typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Style']
  Head: typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Head']
  Html: typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Html']
  Body: typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Body']
  NuxtIsland: typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-island")['default']
  LazyBaseBigNumber: LazyComponent<typeof import("../../components/base/BigNumber.vue")['default']>
  LazyBaseLangSwitcher: LazyComponent<typeof import("../../components/base/LangSwitcher.vue")['default']>
  LazyCommonCostFormat: LazyComponent<typeof import("../../components/common/CostFormat.vue")['default']>
  LazyLayoutSidebar: LazyComponent<typeof import("../../components/layout/Sidebar.vue")['default']>
  LazyUnoIcon: LazyComponent<typeof import("../../../../node_modules/.pnpm/@unocss+nuxt@66.7.0_magicast@0.5.3_vite@7.3.3_@types+node@20.19.41_jiti@2.7.0_terser@5._4d82049c658a875f243fc374e5cba385/node_modules/@unocss/nuxt/runtime/UnoIcon.vue")['default']>
  LazyNuxtWelcome: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/welcome.vue")['default']>
  LazyNuxtLayout: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
  LazyNuxtErrorBoundary: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
  LazyClientOnly: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/client-only")['default']>
  LazyDevOnly: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/dev-only")['default']>
  LazyServerPlaceholder: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
  LazyNuxtLink: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-link")['default']>
  LazyNuxtLoadingIndicator: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
  LazyNuxtTime: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
  LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
  LazyNuxtImg: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
  LazyNuxtPicture: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
  LazyNuxtLinkLocale: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxtjs+i18n@9.5.6_@vue+compiler-dom@3.5.34_eslint@10.4.0_jiti@2.7.0__magicast@0.5.3_ro_0f44e1fb50dd396ef0eb05b871047554/node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']>
  LazySwitchLocalePathLink: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxtjs+i18n@9.5.6_@vue+compiler-dom@3.5.34_eslint@10.4.0_jiti@2.7.0__magicast@0.5.3_ro_0f44e1fb50dd396ef0eb05b871047554/node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']>
  LazyNuxtPage: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/pages/runtime/page")['default']>
  LazyNoScript: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['NoScript']>
  LazyLink: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Link']>
  LazyBase: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Base']>
  LazyTitle: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Title']>
  LazyMeta: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Meta']>
  LazyStyle: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Style']>
  LazyHead: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Head']>
  LazyHtml: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Html']>
  LazyBody: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Body']>
  LazyNuxtIsland: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-island")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
