import { d as defineEventHandler, l as getQuery } from '../../nitro/nitro.mjs';
import { g as getStorage } from '../../_/storage.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'os';
import 'path';
import 'fs/promises';

const savings_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const query = getQuery(event);
  const days = query["days"] ? Number(query["days"]) : 30;
  const storage = await getStorage();
  const events = await storage.queryEvents({ days, limit: 5e4 });
  let totalSavedUsd = 0;
  let totalTokensSaved = 0;
  let totalTokens = 0;
  const byModel = {};
  const byDay = /* @__PURE__ */ new Map();
  for (const e of events) {
    totalTokens += e.tokens_input + e.tokens_output;
    totalSavedUsd += (_a = e.cost_saved_usd) != null ? _a : 0;
    totalTokensSaved += (_b = e.tokens_saved_optim) != null ? _b : 0;
    if (((_c = e.tokens_saved_optim) != null ? _c : 0) > 0) {
      (_e = byModel[_d = e.model]) != null ? _e : byModel[_d] = { tokensSaved: 0, costSaved: 0, events: 0 };
      byModel[e.model].tokensSaved += (_f = e.tokens_saved_optim) != null ? _f : 0;
      byModel[e.model].costSaved += (_g = e.cost_saved_usd) != null ? _g : 0;
      byModel[e.model].events++;
      const d = new Date(e.timestamp).toISOString().slice(0, 10);
      const entry = (_h = byDay.get(d)) != null ? _h : { date: d, costSaved: 0 };
      entry.costSaved += (_i = e.cost_saved_usd) != null ? _i : 0;
      byDay.set(d, entry);
    }
  }
  const savingsRate = totalTokens > 0 ? totalTokensSaved / totalTokens * 100 : 0;
  return {
    totalSavedUsd,
    totalTokensSaved,
    savingsRate,
    byModel,
    timeline: Array.from(byDay.values()).sort((a, b) => a.date.localeCompare(b.date))
  };
});

export { savings_get as default };
//# sourceMappingURL=savings.get.mjs.map
