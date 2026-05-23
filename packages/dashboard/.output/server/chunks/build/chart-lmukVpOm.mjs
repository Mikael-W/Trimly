import { v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/base/BigNumber.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-eb4a3006"]]);
function buildChartPath(pts, chartW, chartH) {
  if (pts.length < 2) return null;
  const maxV = Math.max(...pts.map((p) => p.cost), 1e-5);
  const coords = pts.map((p, i) => ({
    x: i / (pts.length - 1) * chartW,
    y: chartH - p.cost / maxV * (chartH - 20) - 10
  }));
  let prev = coords[0];
  if (!prev) return null;
  let line = `M ${prev.x} ${prev.y}`;
  for (let i = 1; i < coords.length; i++) {
    const c = coords[i];
    if (!c) continue;
    const cpx = (prev.x + c.x) / 2;
    line += ` C ${cpx} ${prev.y} ${cpx} ${c.y} ${c.x} ${c.y}`;
    prev = c;
  }
  const area = `${line} L ${prev.x} ${chartH} L 0 ${chartH} Z`;
  return { line, area };
}

export { __nuxt_component_0 as _, buildChartPath as b };
//# sourceMappingURL=chart-lmukVpOm.mjs.map
