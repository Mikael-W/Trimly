
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


export const BaseBigNumber: typeof import("../components/base/BigNumber.vue")['default']
export const BaseLangSwitcher: typeof import("../components/base/LangSwitcher.vue")['default']
export const CommonCostFormat: typeof import("../components/common/CostFormat.vue")['default']
export const LayoutSidebar: typeof import("../components/layout/Sidebar.vue")['default']
export const UnoIcon: typeof import("../../../node_modules/.pnpm/@unocss+nuxt@66.7.0_magicast@0.5.3_vite@7.3.3_@types+node@20.19.41_jiti@2.7.0_terser@5._4d82049c658a875f243fc374e5cba385/node_modules/@unocss/nuxt/runtime/UnoIcon.vue")['default']
export const NuxtWelcome: typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const NuxtLinkLocale: typeof import("../../../node_modules/.pnpm/@nuxtjs+i18n@9.5.6_@vue+compiler-dom@3.5.34_eslint@10.4.0_jiti@2.7.0__magicast@0.5.3_ro_0f44e1fb50dd396ef0eb05b871047554/node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']
export const SwitchLocalePathLink: typeof import("../../../node_modules/.pnpm/@nuxtjs+i18n@9.5.6_@vue+compiler-dom@3.5.34_eslint@10.4.0_jiti@2.7.0__magicast@0.5.3_ro_0f44e1fb50dd396ef0eb05b871047554/node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']
export const NuxtPage: typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const LazyBaseBigNumber: LazyComponent<typeof import("../components/base/BigNumber.vue")['default']>
export const LazyBaseLangSwitcher: LazyComponent<typeof import("../components/base/LangSwitcher.vue")['default']>
export const LazyCommonCostFormat: LazyComponent<typeof import("../components/common/CostFormat.vue")['default']>
export const LazyLayoutSidebar: LazyComponent<typeof import("../components/layout/Sidebar.vue")['default']>
export const LazyUnoIcon: LazyComponent<typeof import("../../../node_modules/.pnpm/@unocss+nuxt@66.7.0_magicast@0.5.3_vite@7.3.3_@types+node@20.19.41_jiti@2.7.0_terser@5._4d82049c658a875f243fc374e5cba385/node_modules/@unocss/nuxt/runtime/UnoIcon.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyNuxtLinkLocale: LazyComponent<typeof import("../../../node_modules/.pnpm/@nuxtjs+i18n@9.5.6_@vue+compiler-dom@3.5.34_eslint@10.4.0_jiti@2.7.0__magicast@0.5.3_ro_0f44e1fb50dd396ef0eb05b871047554/node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']>
export const LazySwitchLocalePathLink: LazyComponent<typeof import("../../../node_modules/.pnpm/@nuxtjs+i18n@9.5.6_@vue+compiler-dom@3.5.34_eslint@10.4.0_jiti@2.7.0__magicast@0.5.3_ro_0f44e1fb50dd396ef0eb05b871047554/node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']>
export const LazyNuxtPage: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.21.6_@biomejs+biome@1.9.4_@libsql+client@0.14.0_@parcel+watcher@2.5.6_@types+nod_6e1d18d86b63ce3c47cb83e99c1bb790/node_modules/nuxt/dist/app/components/nuxt-island")['default']>

export const componentNames: string[]
