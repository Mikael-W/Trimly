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
import 'fs/promises';
import 'os';
import 'path';

const savings_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g;
  const query = getQuery(event);
  const days = query.days ? Number(query.days) : 30;
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
      let m = byModel[e.model];
      if (!m) {
        m = { tokensSaved: 0, costSaved: 0, events: 0 };
        byModel[e.model] = m;
      }
      m.tokensSaved += (_d = e.tokens_saved_optim) != null ? _d : 0;
      m.costSaved += (_e = e.cost_saved_usd) != null ? _e : 0;
      m.events++;
      const d = new Date(e.timestamp).toISOString().slice(0, 10);
      const entry = (_f = byDay.get(d)) != null ? _f : { date: d, costSaved: 0 };
      entry.costSaved += (_g = e.cost_saved_usd) != null ? _g : 0;
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
