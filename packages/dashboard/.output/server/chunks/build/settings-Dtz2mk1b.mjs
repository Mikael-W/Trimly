import { v as vueExports, u as useI18n, m as useTheme, s as serverRenderer_cjs_prodExports } from './server.mjs';
import { u as useHead } from './v3-B0xo3clH.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue';
import 'unhead/plugins';
import 'node:stream';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "settings",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale, locales, setLocale } = useI18n();
    const { theme } = useTheme();
    useHead({ title: `${t("settings.title")} \u2014 Trimly` });
    const currency = vueExports.ref("USD");
    const dbPath = vueExports.ref(
      ""
    );
    const saved = vueExports.ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "settings" }, _attrs))} data-v-a2ce1e8d><h1 class="page-title" data-v-a2ce1e8d>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("settings.title"))}</h1><div class="settings-card" data-v-a2ce1e8d><div class="setting-row" data-v-a2ce1e8d><div class="setting-label-group" data-v-a2ce1e8d><span class="setting-label" data-v-a2ce1e8d>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("settings.language"))}</span></div><div class="toggle-group" data-v-a2ce1e8d><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(locales), (loc) => {
        _push(`<button class="${serverRenderer_cjs_prodExports.ssrRenderClass([{ "toggle-btn--active": vueExports.unref(locale) === loc.code }, "toggle-btn"])}" data-v-a2ce1e8d>${serverRenderer_cjs_prodExports.ssrInterpolate(loc.name)}</button>`);
      });
      _push(`<!--]--></div></div><div class="setting-row" data-v-a2ce1e8d><div class="setting-label-group" data-v-a2ce1e8d><span class="setting-label" data-v-a2ce1e8d>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("settings.theme"))}</span></div><div class="toggle-group" data-v-a2ce1e8d><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(["dark", "light"], (m) => {
        _push(`<button class="${serverRenderer_cjs_prodExports.ssrRenderClass([{ "toggle-btn--active": vueExports.unref(theme) === m }, "toggle-btn"])}" data-v-a2ce1e8d>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)(`settings.theme.${m}`))}</button>`);
      });
      _push(`<!--]--></div></div><div class="setting-row" data-v-a2ce1e8d><div class="setting-label-group" data-v-a2ce1e8d><span class="setting-label" data-v-a2ce1e8d>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("settings.currency"))}</span></div><div class="toggle-group" data-v-a2ce1e8d><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(["USD", "EUR"], (c) => {
        _push(`<button class="${serverRenderer_cjs_prodExports.ssrRenderClass([{ "toggle-btn--active": vueExports.unref(currency) === c }, "toggle-btn"])}" data-v-a2ce1e8d>${serverRenderer_cjs_prodExports.ssrInterpolate(c)}</button>`);
      });
      _push(`<!--]--></div></div><div class="setting-row setting-row--column" data-v-a2ce1e8d><div class="setting-label-group" data-v-a2ce1e8d><span class="setting-label" data-v-a2ce1e8d>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("settings.dbPath"))}</span><span class="setting-desc" data-v-a2ce1e8d>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("settings.dbPathDesc"))}</span></div><input${serverRenderer_cjs_prodExports.ssrRenderAttr("value", vueExports.unref(dbPath))} type="text" class="setting-input"${serverRenderer_cjs_prodExports.ssrRenderAttr("placeholder", vueExports.unref(t)("settings.dbPathDesc"))} data-v-a2ce1e8d></div><div class="setting-footer" data-v-a2ce1e8d><button class="${serverRenderer_cjs_prodExports.ssrRenderClass([{ "btn-save--done": vueExports.unref(saved) }, "btn-save"])}" data-v-a2ce1e8d>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(saved) ? "\u2713" : vueExports.unref(t)("settings.save"))}</button></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/settings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const settings = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a2ce1e8d"]]);

export { settings as default };
//# sourceMappingURL=settings-Dtz2mk1b.mjs.map
