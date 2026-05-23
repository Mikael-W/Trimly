import { b as buildChartPath, _ as __nuxt_component_0 } from './chart-lmukVpOm.mjs';
import { u as useFetch, f as fmtCost, d as fmtTokens } from './format-q5tNrZ12.mjs';
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

const CHART_W = 600;
const CHART_H = 80;
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "savings",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    useHead({ title: `${t("savings.title")} \u2014 Trimly` });
    const period = vueExports.ref("30d");
    const periods = ["7d", "30d", "all"];
    const { data, refresh } = useFetch(
      "/api/savings",
      {
        query: vueExports.computed(() => ({
          days: period.value === "all" ? 365 : period.value === "7d" ? 7 : 30
        })),
        watch: [period]
      },
      "$aUAn5a9a_p"
      /* nuxt-injected */
    );
    const chartPath = vueExports.computed(
      () => {
        var _a, _b;
        return buildChartPath(
          ((_b = (_a = data.value) == null ? void 0 : _a.timeline) != null ? _b : []).map((d) => ({ cost: d.costSaved })),
          CHART_W,
          CHART_H
        );
      }
    );
    const modelEntries = vueExports.computed(() => {
      var _a, _b;
      const entries = Object.entries((_b = (_a = data.value) == null ? void 0 : _a.byModel) != null ? _b : {});
      if (!entries.length) return [];
      const maxSaved = Math.max(...entries.map(([, v]) => v.tokensSaved), 1);
      return entries.sort(([, a], [, b]) => b.tokensSaved - a.tokensSaved).map(([model, v]) => ({
        model,
        tokensSaved: fmtTokens(v.tokensSaved),
        costSaved: fmtCost(v.costSaved),
        events: v.events,
        pct: Math.round(v.tokensSaved / maxSaved * 100)
      }));
    });
    const savingsRate = vueExports.computed(() => {
      var _a, _b;
      return ((_b = (_a = data.value) == null ? void 0 : _a.savingsRate) != null ? _b : 0).toFixed(1);
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      const _component_BaseBigNumber = __nuxt_component_0;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "savings" }, _attrs))} data-v-89c312e9><div class="page-header" data-v-89c312e9><h1 class="page-title" data-v-89c312e9>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("savings.title"))}</h1><div class="period-toggle" data-v-89c312e9><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(periods, (p) => {
        _push(`<button class="${serverRenderer_cjs_prodExports.ssrRenderClass([{ "period-btn--active": vueExports.unref(period) === p }, "period-btn"])}" data-v-89c312e9>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)(`period.${p}`))}</button>`);
      });
      _push(`<!--]--></div></div><div class="stats-grid" data-v-89c312e9>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_BaseBigNumber, {
        value: ("fmtCost" in _ctx ? _ctx.fmtCost : vueExports.unref(fmtCost))((_b = (_a = vueExports.unref(data)) == null ? void 0 : _a.totalSavedUsd) != null ? _b : 0),
        label: vueExports.unref(t)("savings.totalSaved"),
        positive: ""
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_BaseBigNumber, {
        value: ("fmtTokens" in _ctx ? _ctx.fmtTokens : vueExports.unref(fmtTokens))((_d = (_c = vueExports.unref(data)) == null ? void 0 : _c.totalTokensSaved) != null ? _d : 0),
        label: vueExports.unref(t)("savings.tokensSaved")
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_BaseBigNumber, {
        value: `${vueExports.unref(savingsRate)}%`,
        label: vueExports.unref(t)("savings.rate"),
        accent: ""
      }, null, _parent));
      _push(`</div><div class="card" data-v-89c312e9><h2 class="card-title" data-v-89c312e9>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("savings.timeline"))}</h2>`);
      if (vueExports.unref(chartPath)) {
        _push(`<div class="chart-wrap" data-v-89c312e9><svg class="chart-svg"${serverRenderer_cjs_prodExports.ssrRenderAttr("viewBox", `0 0 ${CHART_W} ${CHART_H}`)} preserveAspectRatio="none" data-v-89c312e9><defs data-v-89c312e9><linearGradient id="savings-grad" x1="0" y1="0" x2="0" y2="1" data-v-89c312e9><stop offset="0%" stop-color="#22c55e" stop-opacity="0.22" data-v-89c312e9></stop><stop offset="100%" stop-color="#22c55e" stop-opacity="0.02" data-v-89c312e9></stop></linearGradient></defs><path${serverRenderer_cjs_prodExports.ssrRenderAttr("d", vueExports.unref(chartPath).area)} fill="url(#savings-grad)" data-v-89c312e9></path><path${serverRenderer_cjs_prodExports.ssrRenderAttr("d", vueExports.unref(chartPath).line)} fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-89c312e9></path></svg></div>`);
      } else {
        _push(`<div class="chart-empty" data-v-89c312e9>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("savings.noOptimizations"))}</div>`);
      }
      _push(`</div>`);
      if (vueExports.unref(modelEntries).length > 0) {
        _push(`<div class="card" data-v-89c312e9><h2 class="card-title" data-v-89c312e9>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("savings.byModel"))}</h2><div class="model-list" data-v-89c312e9><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(modelEntries), (m) => {
          _push(`<div class="model-row" data-v-89c312e9><div class="model-info" data-v-89c312e9><span class="model-name" data-v-89c312e9>${serverRenderer_cjs_prodExports.ssrInterpolate(m.model)}</span><span class="model-meta" data-v-89c312e9>${serverRenderer_cjs_prodExports.ssrInterpolate(m.events)} ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("savings.optimizations"))} \xB7 <span class="model-tokens" data-v-89c312e9>${serverRenderer_cjs_prodExports.ssrInterpolate(m.tokensSaved)} tokens</span> \xB7 <span class="model-cost" data-v-89c312e9>${serverRenderer_cjs_prodExports.ssrInterpolate(m.costSaved)}</span></span></div><div class="model-bar-track" data-v-89c312e9><div class="model-bar" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ width: `${m.pct}%` })}" data-v-89c312e9></div></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<div class="empty-state" data-v-89c312e9><p class="empty-title" data-v-89c312e9>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("savings.noOptimizations"))}</p><p class="empty-desc" data-v-89c312e9>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(t)("savings.emptyDesc"))}</p></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/savings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const savings = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-89c312e9"]]);

export { savings as default };
//# sourceMappingURL=savings-DZ3wgU-t.mjs.map
