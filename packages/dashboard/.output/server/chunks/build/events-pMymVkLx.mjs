import { b as fmtDateTime, c as fmtRelTime, a as fmtCost5, u as useFetch } from './format-q5tNrZ12.mjs';
import { v as vueExports, u as useI18n, s as serverRenderer_cjs_prodExports } from './server.mjs';
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
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue';
import 'unhead/plugins';
import 'node:stream';

function useEvents(source, days) {
  return useFetch(
    "/api/events",
    {
      query: vueExports.computed(() => ({
        source: source.value !== "all" ? source.value : void 0,
        days: void 0 ,
        limit: 200
      })),
      watch: [source, ...[]]
    },
    "$D0optzsGeN"
    /* nuxt-injected */
  );
}
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "events",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    useHead({ title: `${t("events.title")} \u2014 Trimly` });
    const source = vueExports.ref("all");
    const sources = ["all", "claude-code", "browser-extension"];
    const { data: events2, pending } = useEvents(source);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "events" }, _attrs))} data-v-e8cf16fb><div class="page-header" data-v-e8cf16fb><h1 class="page-title" data-v-e8cf16fb>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("events.title"))}</h1><div class="filter-toggle" data-v-e8cf16fb><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(sources, (s) => {
        _push(`<button class="${serverRenderer_cjs_prodExports.ssrRenderClass([{ "filter-btn--active": vueExports.unref(source) === s }, "filter-btn"])}" data-v-e8cf16fb>${serverRenderer_cjs_prodExports.ssrInterpolate(s === "all" ? vueExports.unref(t)("events.filter.all") : s === "claude-code" ? vueExports.unref(t)("events.filter.claudeCode") : vueExports.unref(t)("events.filter.browser"))}</button>`);
      });
      _push(`<!--]--></div></div><div class="table-card" data-v-e8cf16fb>`);
      if (vueExports.unref(pending)) {
        _push(`<div class="state-msg" data-v-e8cf16fb>\u2026</div>`);
      } else if (!vueExports.unref(events2) || vueExports.unref(events2).length === 0) {
        _push(`<div class="state-msg" data-v-e8cf16fb>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("events.empty"))}</div>`);
      } else {
        _push(`<table class="events-table" data-v-e8cf16fb><thead data-v-e8cf16fb><tr data-v-e8cf16fb><th data-v-e8cf16fb>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("events.col.time"))}</th><th data-v-e8cf16fb>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("events.col.model"))}</th><th class="align-right" data-v-e8cf16fb>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("events.col.tokens"))}</th><th class="align-right" data-v-e8cf16fb>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("events.col.cost"))}</th><th data-v-e8cf16fb>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("events.col.source"))}</th><th data-v-e8cf16fb>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("events.col.status"))}</th></tr></thead><tbody data-v-e8cf16fb><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(events2), (event) => {
          _push(`<tr data-v-e8cf16fb><td class="cell-time"${serverRenderer_cjs_prodExports.ssrRenderAttr("title", ("fmtDateTime" in _ctx ? _ctx.fmtDateTime : vueExports.unref(fmtDateTime))(event.timestamp))} data-v-e8cf16fb>${serverRenderer_cjs_prodExports.ssrInterpolate(("fmtRelTime" in _ctx ? _ctx.fmtRelTime : vueExports.unref(fmtRelTime))(event.timestamp))}</td><td class="cell-mono" data-v-e8cf16fb>${serverRenderer_cjs_prodExports.ssrInterpolate(event.model)}</td><td class="cell-num align-right" data-v-e8cf16fb>${serverRenderer_cjs_prodExports.ssrInterpolate(event.tokens_input + event.tokens_output)}</td><td class="cell-cost align-right" data-v-e8cf16fb>${serverRenderer_cjs_prodExports.ssrInterpolate(("fmtCost5" in _ctx ? _ctx.fmtCost5 : vueExports.unref(fmtCost5))(event.cost_usd))}</td><td data-v-e8cf16fb><span class="${serverRenderer_cjs_prodExports.ssrRenderClass([event.source === "claude-code" ? "badge--violet" : "badge--green", "badge"])}" data-v-e8cf16fb>${serverRenderer_cjs_prodExports.ssrInterpolate(event.source)}</span></td><td data-v-e8cf16fb><span class="${serverRenderer_cjs_prodExports.ssrRenderClass([event.status === "completed" ? "badge--green" : "badge--amber", "badge"])}" data-v-e8cf16fb>${serverRenderer_cjs_prodExports.ssrInterpolate(event.status)}</span></td></tr>`);
        });
        _push(`<!--]--></tbody></table>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/events.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const events = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e8cf16fb"]]);

export { events as default };
//# sourceMappingURL=events-pMymVkLx.mjs.map
