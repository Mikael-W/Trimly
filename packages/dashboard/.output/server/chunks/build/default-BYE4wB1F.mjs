import { _ as __nuxt_component_0$1 } from './nuxt-link-XC5XjwbG.mjs';
import { v as vueExports, u as useI18n, s as serverRenderer_cjs_prodExports } from './server.mjs';
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

const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "LangSwitcher",
  __ssrInlineRender: true,
  setup(__props) {
    const { locale, locales, setLocale } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "lang-switcher" }, _attrs))} data-v-af32cf70><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(locales), (loc) => {
        _push(`<button class="${serverRenderer_cjs_prodExports.ssrRenderClass([{ "lang-btn--active": vueExports.unref(locale) === loc.code }, "lang-btn"])}" data-v-af32cf70>${serverRenderer_cjs_prodExports.ssrInterpolate(loc.code.toUpperCase())}</button>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/base/LangSwitcher.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-af32cf70"]]);
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Sidebar",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const links = vueExports.computed(() => [
      { to: "/", label: t("nav.overview"), icon: "overview" },
      { to: "/events", label: t("nav.events"), icon: "events" },
      { to: "/savings", label: t("nav.savings"), icon: "savings" },
      { to: "/settings", label: t("nav.settings"), icon: "settings" }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_BaseLangSwitcher = __nuxt_component_1;
      _push(`<aside${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "sidebar" }, _attrs))} data-v-4c17fa70><div class="sidebar-brand" data-v-4c17fa70><span class="sidebar-brand__logo" data-v-4c17fa70>T</span><span class="sidebar-brand__name" data-v-4c17fa70>rimly</span></div><nav class="sidebar-nav" data-v-4c17fa70><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(links), (link) => {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
          key: link.to,
          to: link.to,
          class: "nav-link",
          "active-class": "nav-link--active",
          exact: link.to === "/"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (link.icon === "overview") {
                _push2(`<svg class="nav-icon" viewBox="0 0 16 16" fill="none" data-v-4c17fa70${_scopeId}><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5" data-v-4c17fa70${_scopeId}></rect><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5" data-v-4c17fa70${_scopeId}></rect><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5" data-v-4c17fa70${_scopeId}></rect><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5" data-v-4c17fa70${_scopeId}></rect></svg>`);
              } else {
                _push2(`<!---->`);
              }
              if (link.icon === "events") {
                _push2(`<svg class="nav-icon" viewBox="0 0 16 16" fill="none" data-v-4c17fa70${_scopeId}><path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" data-v-4c17fa70${_scopeId}></path></svg>`);
              } else {
                _push2(`<!---->`);
              }
              if (link.icon === "savings") {
                _push2(`<svg class="nav-icon" viewBox="0 0 16 16" fill="none" data-v-4c17fa70${_scopeId}><path d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8S4.41 14.5 8 14.5 14.5 11.59 14.5 8 11.59 1.5 8 1.5z" stroke="currentColor" stroke-width="1.5" data-v-4c17fa70${_scopeId}></path><path d="M8 5v1.5M8 9.5V11M6.5 7.25C6.5 6.56 7.17 6 8 6s1.5.56 1.5 1.25S8.83 8.5 8 8.5s-1.5.56-1.5 1.25S7.17 11 8 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" data-v-4c17fa70${_scopeId}></path></svg>`);
              } else {
                _push2(`<!---->`);
              }
              if (link.icon === "settings") {
                _push2(`<svg class="nav-icon" viewBox="0 0 16 16" fill="none" data-v-4c17fa70${_scopeId}><circle cx="8" cy="8" r="2.5" stroke="currentColor" stroke-width="1.5" data-v-4c17fa70${_scopeId}></circle><path d="M8 1.5v1.8M8 12.7v1.8M1.5 8h1.8M12.7 8h1.8M3.2 3.2l1.3 1.3M11.5 11.5l1.3 1.3M3.2 12.8l1.3-1.3M11.5 4.5l1.3-1.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" data-v-4c17fa70${_scopeId}></path></svg>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<span data-v-4c17fa70${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(link.label)}</span>`);
            } else {
              return [
                link.icon === "overview" ? (vueExports.openBlock(), vueExports.createBlock("svg", {
                  key: 0,
                  class: "nav-icon",
                  viewBox: "0 0 16 16",
                  fill: "none"
                }, [
                  vueExports.createVNode("rect", {
                    x: "1",
                    y: "1",
                    width: "6",
                    height: "6",
                    rx: "1.5",
                    stroke: "currentColor",
                    "stroke-width": "1.5"
                  }),
                  vueExports.createVNode("rect", {
                    x: "9",
                    y: "1",
                    width: "6",
                    height: "6",
                    rx: "1.5",
                    stroke: "currentColor",
                    "stroke-width": "1.5"
                  }),
                  vueExports.createVNode("rect", {
                    x: "1",
                    y: "9",
                    width: "6",
                    height: "6",
                    rx: "1.5",
                    stroke: "currentColor",
                    "stroke-width": "1.5"
                  }),
                  vueExports.createVNode("rect", {
                    x: "9",
                    y: "9",
                    width: "6",
                    height: "6",
                    rx: "1.5",
                    stroke: "currentColor",
                    "stroke-width": "1.5"
                  })
                ])) : vueExports.createCommentVNode("", true),
                link.icon === "events" ? (vueExports.openBlock(), vueExports.createBlock("svg", {
                  key: 1,
                  class: "nav-icon",
                  viewBox: "0 0 16 16",
                  fill: "none"
                }, [
                  vueExports.createVNode("path", {
                    d: "M2 4h12M2 8h8M2 12h10",
                    stroke: "currentColor",
                    "stroke-width": "1.5",
                    "stroke-linecap": "round"
                  })
                ])) : vueExports.createCommentVNode("", true),
                link.icon === "savings" ? (vueExports.openBlock(), vueExports.createBlock("svg", {
                  key: 2,
                  class: "nav-icon",
                  viewBox: "0 0 16 16",
                  fill: "none"
                }, [
                  vueExports.createVNode("path", {
                    d: "M8 1.5C4.41 1.5 1.5 4.41 1.5 8S4.41 14.5 8 14.5 14.5 11.59 14.5 8 11.59 1.5 8 1.5z",
                    stroke: "currentColor",
                    "stroke-width": "1.5"
                  }),
                  vueExports.createVNode("path", {
                    d: "M8 5v1.5M8 9.5V11M6.5 7.25C6.5 6.56 7.17 6 8 6s1.5.56 1.5 1.25S8.83 8.5 8 8.5s-1.5.56-1.5 1.25S7.17 11 8 11",
                    stroke: "currentColor",
                    "stroke-width": "1.5",
                    "stroke-linecap": "round"
                  })
                ])) : vueExports.createCommentVNode("", true),
                link.icon === "settings" ? (vueExports.openBlock(), vueExports.createBlock("svg", {
                  key: 3,
                  class: "nav-icon",
                  viewBox: "0 0 16 16",
                  fill: "none"
                }, [
                  vueExports.createVNode("circle", {
                    cx: "8",
                    cy: "8",
                    r: "2.5",
                    stroke: "currentColor",
                    "stroke-width": "1.5"
                  }),
                  vueExports.createVNode("path", {
                    d: "M8 1.5v1.8M8 12.7v1.8M1.5 8h1.8M12.7 8h1.8M3.2 3.2l1.3 1.3M11.5 11.5l1.3 1.3M3.2 12.8l1.3-1.3M11.5 4.5l1.3-1.3",
                    stroke: "currentColor",
                    "stroke-width": "1.5",
                    "stroke-linecap": "round"
                  })
                ])) : vueExports.createCommentVNode("", true),
                vueExports.createVNode("span", null, vueExports.toDisplayString(link.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav><div class="sidebar-footer" data-v-4c17fa70>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_BaseLangSwitcher, null, null, _parent));
      _push(`<span class="sidebar-version" data-v-4c17fa70>v0.1.0</span></div></aside>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/Sidebar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-4c17fa70"]]);
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_LayoutSidebar = __nuxt_component_0;
  _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "shell" }, _attrs))} data-v-db4763d0>`);
  _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_LayoutSidebar, null, null, _parent));
  _push(`<main class="shell-main" data-v-db4763d0>`);
  serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</main></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-db4763d0"]]);

export { _default as default };
//# sourceMappingURL=default-BYE4wB1F.mjs.map
