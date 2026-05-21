import { v as vueExports, u as useI18n, s as serverRenderer_cjs_prodExports } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { u as useFetch, f as fmtCost, d as fmtTokens } from './format-q5tNrZ12.mjs';
import { u as useHead } from './v3-B0xo3clH.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "BigNumber",
  __ssrInlineRender: true,
  props: {
    value: {},
    label: {},
    sub: {},
    accent: { type: Boolean },
    positive: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        class: ["card", { "card--accent": __props.accent, "card--positive": __props.positive }]
      }, _attrs))} data-v-eb4a3006><span class="card-label" data-v-eb4a3006>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.label)}</span><span class="card-value" data-v-eb4a3006>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.value)}</span>`);
      if (__props.sub) {
        _push(`<span class="card-sub" data-v-eb4a3006>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.sub)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/base/BigNumber.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-eb4a3006"]]);
function useStats(period) {
  const days = vueExports.computed(() => {
    if (period.value === "today") return 1;
    if (period.value === "7d") return 7;
    if (period.value === "30d") return 30;
    return void 0;
  });
  return useFetch(
    "/api/stats",
    {
      query: vueExports.computed(() => ({ days: days.value })),
      watch: [days]
    },
    "$S1bf_NpWWH"
    /* nuxt-injected */
  );
}
function buildChartPath(pts, chartW, chartH) {
  if (pts.length < 2) return null;
  const maxV = Math.max(...pts.map((p) => p.cost), 1e-5);
  const coords = pts.map((p, i) => ({
    x: i / (pts.length - 1) * chartW,
    y: chartH - p.cost / maxV * (chartH - 20) - 10
  }));
  let line = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 1; i < coords.length; i++) {
    const p = coords[i - 1];
    const c = coords[i];
    const cpx = (p.x + c.x) / 2;
    line += ` C ${cpx} ${p.y} ${cpx} ${c.y} ${c.x} ${c.y}`;
  }
  const last = coords[coords.length - 1];
  const area = `${line} L ${last.x} ${chartH} L 0 ${chartH} Z`;
  return { line, area };
}
const CHART_W = 600;
const CHART_H = 100;
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    useHead({ title: t("overview.title") + " \u2014 Trimly" });
    const period = vueExports.ref("30d");
    const periods = ["today", "7d", "30d", "all"];
    const { data: stats } = useStats(period);
    const { data: timeline } = useFetch(
      "/api/timeline",
      {
        query: vueExports.computed(() => ({
          days: period.value === "all" ? 365 : period.value === "today" ? 1 : period.value === "7d" ? 7 : 30
        })),
        watch: [period]
      },
      "$SmsxT1n5Xu"
      /* nuxt-injected */
    );
    const s = vueExports.computed(() => {
      var _a;
      return (_a = stats.value) != null ? _a : {
        totalRequests: 0,
        totalTokensInput: 0,
        totalTokensOutput: 0,
        totalCostUsd: 0,
        totalSavedUsd: 0,
        byModel: {}
      };
    });
    const chartPath = vueExports.computed(() => {
      var _a;
      return buildChartPath((_a = timeline.value) != null ? _a : [], CHART_W, CHART_H);
    });
    const modelEntries = vueExports.computed(() => {
      const entries = Object.entries(s.value.byModel);
      if (!entries.length) return [];
      const maxCost = Math.max(...entries.map(([, v]) => v.cost), 1e-4);
      return entries.sort(([, a], [, b]) => b.cost - a.cost).map(([model, v]) => ({
        model,
        requests: v.requests,
        costStr: `$${v.cost.toFixed(4)}`,
        pct: Math.round(v.cost / maxCost * 100)
      }));
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BaseBigNumber = __nuxt_component_0;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "overview" }, _attrs))} data-v-c623ab5f><div class="page-header" data-v-c623ab5f><h1 class="page-title" data-v-c623ab5f>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("overview.title"))}</h1><div class="period-toggle" data-v-c623ab5f><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(periods, (p) => {
        _push(`<button class="${serverRenderer_cjs_prodExports.ssrRenderClass([{ "period-btn--active": vueExports.unref(period) === p }, "period-btn"])}" data-v-c623ab5f>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)(`period.${p}`))}</button>`);
      });
      _push(`<!--]--></div></div><div class="stats-grid" data-v-c623ab5f>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_BaseBigNumber, {
        value: ("fmtCost" in _ctx ? _ctx.fmtCost : vueExports.unref(fmtCost))(vueExports.unref(s).totalCostUsd),
        label: vueExports.unref(t)("stats.totalCost"),
        accent: ""
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_BaseBigNumber, {
        value: ("fmtTokens" in _ctx ? _ctx.fmtTokens : vueExports.unref(fmtTokens))(vueExports.unref(s).totalTokensInput + vueExports.unref(s).totalTokensOutput),
        label: vueExports.unref(t)("stats.totalTokens"),
        sub: `${("fmtTokens" in _ctx ? _ctx.fmtTokens : vueExports.unref(fmtTokens))(vueExports.unref(s).totalTokensInput)} in \xB7 ${("fmtTokens" in _ctx ? _ctx.fmtTokens : vueExports.unref(fmtTokens))(vueExports.unref(s).totalTokensOutput)} out`
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_BaseBigNumber, {
        value: vueExports.unref(s).totalRequests,
        label: vueExports.unref(t)("stats.totalRequests")
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_BaseBigNumber, {
        value: ("fmtCost" in _ctx ? _ctx.fmtCost : vueExports.unref(fmtCost))(vueExports.unref(s).totalSavedUsd),
        label: vueExports.unref(t)("stats.totalSaved"),
        positive: ""
      }, null, _parent));
      _push(`</div><div class="card" data-v-c623ab5f><h2 class="card-title" data-v-c623ab5f>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("overview.timeline"))}</h2>`);
      if (vueExports.unref(chartPath)) {
        _push(`<div class="chart-wrap" data-v-c623ab5f><svg class="chart-svg"${serverRenderer_cjs_prodExports.ssrRenderAttr("viewBox", `0 0 ${CHART_W} ${CHART_H}`)} preserveAspectRatio="none" data-v-c623ab5f><defs data-v-c623ab5f><linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1" data-v-c623ab5f><stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.22" data-v-c623ab5f></stop><stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.02" data-v-c623ab5f></stop></linearGradient></defs><path${serverRenderer_cjs_prodExports.ssrRenderAttr("d", vueExports.unref(chartPath).area)} fill="url(#area-grad)" data-v-c623ab5f></path><path${serverRenderer_cjs_prodExports.ssrRenderAttr("d", vueExports.unref(chartPath).line)} fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-c623ab5f></path></svg></div>`);
      } else {
        _push(`<div class="chart-empty" data-v-c623ab5f>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("events.empty"))}</div>`);
      }
      _push(`</div>`);
      if (vueExports.unref(modelEntries).length > 0) {
        _push(`<div class="card" data-v-c623ab5f><h2 class="card-title" data-v-c623ab5f>Par mod\xE8le</h2><div class="model-list" data-v-c623ab5f><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(modelEntries), (m) => {
          _push(`<div class="model-row" data-v-c623ab5f><div class="model-info" data-v-c623ab5f><span class="model-name" data-v-c623ab5f>${serverRenderer_cjs_prodExports.ssrInterpolate(m.model)}</span><span class="model-meta" data-v-c623ab5f>${serverRenderer_cjs_prodExports.ssrInterpolate(m.requests)} req \xB7 <span class="model-cost" data-v-c623ab5f>${serverRenderer_cjs_prodExports.ssrInterpolate(m.costStr)}</span></span></div><div class="model-bar-track" data-v-c623ab5f><div class="model-bar" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ width: `${m.pct}%` })}" data-v-c623ab5f></div></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c623ab5f"]]);

export { index as default };
//# sourceMappingURL=index-ByI-XErv.mjs.map
