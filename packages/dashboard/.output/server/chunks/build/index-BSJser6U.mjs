import { b as buildChartPath, _ as __nuxt_component_0 } from './chart-lmukVpOm.mjs';
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
  __name: "Sparkline",
  __ssrInlineRender: true,
  props: {
    values: {},
    label: {},
    width: {},
    height: {},
    color: {}
  },
  setup(__props) {
    const props = __props;
    const w = vueExports.computed(() => {
      var _a;
      return (_a = props.width) != null ? _a : 80;
    });
    const h = vueExports.computed(() => {
      var _a;
      return (_a = props.height) != null ? _a : 24;
    });
    const points = vueExports.computed(() => {
      const vals = props.values;
      if (!vals || vals.length === 0) return "";
      const max = Math.max(...vals);
      if (max === 0)
        return vals.map((_, i) => `${i / (vals.length - 1) * w.value},${h.value}`).join(" ");
      return vals.map((v, i) => {
        const x = vals.length === 1 ? w.value / 2 : i / (vals.length - 1) * w.value;
        const y = h.value - v / max * (h.value - 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(" ");
    });
    const fillPoints = vueExports.computed(() => {
      if (!points.value) return "";
      return `${points.value} ${w.value},${h.value} 0,${h.value}`;
    });
    const lineColor = vueExports.computed(() => {
      var _a;
      return (_a = props.color) != null ? _a : "var(--green, #22c55e)";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "sparkline-wrap" }, _attrs))} data-v-3cbeaf45>`);
      if (__props.label) {
        _push(`<span class="sparkline-label" data-v-3cbeaf45>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.label)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<svg${serverRenderer_cjs_prodExports.ssrRenderAttr("width", w.value)}${serverRenderer_cjs_prodExports.ssrRenderAttr("height", h.value)}${serverRenderer_cjs_prodExports.ssrRenderAttr("viewBox", `0 0 ${w.value} ${h.value}`)} class="sparkline" aria-hidden="true" data-v-3cbeaf45><defs data-v-3cbeaf45><linearGradient${serverRenderer_cjs_prodExports.ssrRenderAttr("id", `spark-fill-${w.value}`)} x1="0" y1="0" x2="0" y2="1" data-v-3cbeaf45><stop offset="0%"${serverRenderer_cjs_prodExports.ssrRenderAttr("stop-color", lineColor.value)} stop-opacity="0.3" data-v-3cbeaf45></stop><stop offset="100%"${serverRenderer_cjs_prodExports.ssrRenderAttr("stop-color", lineColor.value)} stop-opacity="0.02" data-v-3cbeaf45></stop></linearGradient></defs>`);
      if (fillPoints.value) {
        _push(`<polygon${serverRenderer_cjs_prodExports.ssrRenderAttr("points", fillPoints.value)}${serverRenderer_cjs_prodExports.ssrRenderAttr("fill", `url(#spark-fill-${w.value})`)} data-v-3cbeaf45></polygon>`);
      } else {
        _push(`<!---->`);
      }
      if (points.value) {
        _push(`<polyline${serverRenderer_cjs_prodExports.ssrRenderAttr("points", points.value)} fill="none"${serverRenderer_cjs_prodExports.ssrRenderAttr("stroke", lineColor.value)} stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" data-v-3cbeaf45></polyline>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</svg></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/base/Sparkline.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-3cbeaf45"]]);
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
const CHART_W = 600;
const CHART_H = 100;
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    useHead({ title: `${t("overview.title")} \u2014 Trimly` });
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
    const s = vueExports.computed(
      () => {
        var _a;
        return (_a = stats.value) != null ? _a : {
          totalRequests: 0,
          totalTokensInput: 0,
          totalTokensOutput: 0,
          totalCostUsd: 0,
          totalSavedUsd: 0,
          byModel: {}
        };
      }
    );
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
    const sparklineValues = vueExports.computed(() => {
      var _a;
      return ((_a = timeline.value) != null ? _a : []).slice(-7).map((d) => d.cost);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BaseBigNumber = __nuxt_component_0;
      const _component_BaseSparkline = __nuxt_component_1;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "overview" }, _attrs))} data-v-b2698a61><div class="page-header" data-v-b2698a61><h1 class="page-title" data-v-b2698a61>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("overview.title"))}</h1><div class="period-toggle" data-v-b2698a61><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(periods, (p) => {
        _push(`<button class="${serverRenderer_cjs_prodExports.ssrRenderClass([{ "period-btn--active": vueExports.unref(period) === p }, "period-btn"])}" data-v-b2698a61>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)(`period.${p}`))}</button>`);
      });
      _push(`<!--]--></div></div><div class="stats-grid" data-v-b2698a61>`);
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
      _push(`</div>`);
      if (vueExports.unref(sparklineValues).length > 1) {
        _push(`<div class="sparkline-row" data-v-b2698a61><span class="sparkline-label-text" data-v-b2698a61>7-day cost trend</span>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_BaseSparkline, {
          values: vueExports.unref(sparklineValues),
          width: 120,
          height: 28
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="card" data-v-b2698a61><h2 class="card-title" data-v-b2698a61>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("overview.timeline"))}</h2>`);
      if (vueExports.unref(chartPath)) {
        _push(`<div class="chart-wrap" data-v-b2698a61><svg class="chart-svg"${serverRenderer_cjs_prodExports.ssrRenderAttr("viewBox", `0 0 ${CHART_W} ${CHART_H}`)} preserveAspectRatio="none" data-v-b2698a61><defs data-v-b2698a61><linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1" data-v-b2698a61><stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.22" data-v-b2698a61></stop><stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.02" data-v-b2698a61></stop></linearGradient></defs><path${serverRenderer_cjs_prodExports.ssrRenderAttr("d", vueExports.unref(chartPath).area)} fill="url(#area-grad)" data-v-b2698a61></path><path${serverRenderer_cjs_prodExports.ssrRenderAttr("d", vueExports.unref(chartPath).line)} fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-b2698a61></path></svg></div>`);
      } else {
        _push(`<div class="chart-empty" data-v-b2698a61>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("events.empty"))}</div>`);
      }
      _push(`</div>`);
      if (vueExports.unref(modelEntries).length > 0) {
        _push(`<div class="card" data-v-b2698a61><h2 class="card-title" data-v-b2698a61>Par mod\xE8le</h2><div class="model-list" data-v-b2698a61><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(modelEntries), (m) => {
          _push(`<div class="model-row" data-v-b2698a61><div class="model-info" data-v-b2698a61><span class="model-name" data-v-b2698a61>${serverRenderer_cjs_prodExports.ssrInterpolate(m.model)}</span><span class="model-meta" data-v-b2698a61>${serverRenderer_cjs_prodExports.ssrInterpolate(m.requests)} req \xB7 <span class="model-cost" data-v-b2698a61>${serverRenderer_cjs_prodExports.ssrInterpolate(m.costStr)}</span></span></div><div class="model-bar-track" data-v-b2698a61><div class="model-bar" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ width: `${m.pct}%` })}" data-v-b2698a61></div></div></div>`);
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
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b2698a61"]]);

export { index as default };
//# sourceMappingURL=index-BSJser6U.mjs.map
