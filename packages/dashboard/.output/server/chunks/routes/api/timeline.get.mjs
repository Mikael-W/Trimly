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

const timeline_get = defineEventHandler(async (event) => {
  var _a;
  const query = getQuery(event);
  const days = query["days"] ? Number(query["days"]) : 30;
  const storage = await getStorage();
  const events = await storage.queryEvents({ days, limit: 1e4 });
  const byDay = /* @__PURE__ */ new Map();
  for (const e of events) {
    const d = new Date(e.timestamp).toISOString().slice(0, 10);
    const entry = (_a = byDay.get(d)) != null ? _a : { date: d, cost: 0, tokens: 0, requests: 0 };
    entry.cost += e.cost_usd;
    entry.tokens += e.tokens_input + e.tokens_output;
    entry.requests += 1;
    byDay.set(d, entry);
  }
  return Array.from(byDay.values()).sort((a, b) => a.date.localeCompare(b.date));
});

export { timeline_get as default };
//# sourceMappingURL=timeline.get.mjs.map
