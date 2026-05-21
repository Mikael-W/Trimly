import { v as vueExports, u as useI18n, s as serverRenderer_cjs_prodExports } from './server.mjs';
import { u as useHead } from './v3-B0xo3clH.mjs';
import { u as useFetch } from './fetch-CBQjeXl2.mjs';
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
import 'perfect-debounce';

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
    useHead({ title: t("events.title") + " \u2014 Trimly" });
    const source = vueExports.ref("all");
    const sources = ["all", "claude-code", "browser-extension"];
    const { data: events2, pending } = useEvents(source);
    function fmtRelTime(ts) {
      const diff = Date.now() - ts;
      const m = Math.floor(diff / 6e4);
      if (m < 1) return "< 1m";
      if (m < 60) return `${m}m`;
      const h = Math.floor(m / 60);
      if (h < 24) return `${h}h`;
      return `${Math.floor(h / 24)}d`;
    }
    function fmtTime(ts) {
      return new Date(ts).toLocaleString();
    }
    function fmtCost(n) {
      return `$${n.toFixed(5)}`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "events" }, _attrs))} data-v-5651f96f><div class="page-header" data-v-5651f96f><h1 class="page-title" data-v-5651f96f>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("events.title"))}</h1><div class="filter-toggle" data-v-5651f96f><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(sources, (s) => {
        _push(`<button class="${serverRenderer_cjs_prodExports.ssrRenderClass([{ "filter-btn--active": vueExports.unref(source) === s }, "filter-btn"])}" data-v-5651f96f>${serverRenderer_cjs_prodExports.ssrInterpolate(s === "all" ? vueExports.unref(t)("events.filter.all") : s === "claude-code" ? vueExports.unref(t)("events.filter.claudeCode") : vueExports.unref(t)("events.filter.browser"))}</button>`);
      });
      _push(`<!--]--></div></div><div class="table-card" data-v-5651f96f>`);
      if (vueExports.unref(pending)) {
        _push(`<div class="state-msg" data-v-5651f96f>\u2026</div>`);
      } else if (!vueExports.unref(events2) || vueExports.unref(events2).length === 0) {
        _push(`<div class="state-msg" data-v-5651f96f>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("events.empty"))}</div>`);
      } else {
        _push(`<table class="events-table" data-v-5651f96f><thead data-v-5651f96f><tr data-v-5651f96f><th data-v-5651f96f>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("events.col.time"))}</th><th data-v-5651f96f>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("events.col.model"))}</th><th class="align-right" data-v-5651f96f>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("events.col.tokens"))}</th><th class="align-right" data-v-5651f96f>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("events.col.cost"))}</th><th data-v-5651f96f>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("events.col.source"))}</th><th data-v-5651f96f>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("events.col.status"))}</th></tr></thead><tbody data-v-5651f96f><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(events2), (event) => {
          _push(`<tr data-v-5651f96f><td class="cell-time"${serverRenderer_cjs_prodExports.ssrRenderAttr("title", fmtTime(event.timestamp))} data-v-5651f96f>${serverRenderer_cjs_prodExports.ssrInterpolate(fmtRelTime(event.timestamp))}</td><td class="cell-mono" data-v-5651f96f>${serverRenderer_cjs_prodExports.ssrInterpolate(event.model)}</td><td class="cell-num align-right" data-v-5651f96f>${serverRenderer_cjs_prodExports.ssrInterpolate(event.tokens_input + event.tokens_output)}</td><td class="cell-cost align-right" data-v-5651f96f>${serverRenderer_cjs_prodExports.ssrInterpolate(fmtCost(event.cost_usd))}</td><td data-v-5651f96f><span class="${serverRenderer_cjs_prodExports.ssrRenderClass([event.source === "claude-code" ? "badge--violet" : "badge--green", "badge"])}" data-v-5651f96f>${serverRenderer_cjs_prodExports.ssrInterpolate(event.source)}</span></td><td data-v-5651f96f><span class="${serverRenderer_cjs_prodExports.ssrRenderClass([event.status === "completed" ? "badge--green" : "badge--amber", "badge"])}" data-v-5651f96f>${serverRenderer_cjs_prodExports.ssrInterpolate(event.status)}</span></td></tr>`);
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
const events = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5651f96f"]]);

export { events as default };
//# sourceMappingURL=events-Df17G1c_.mjs.map
