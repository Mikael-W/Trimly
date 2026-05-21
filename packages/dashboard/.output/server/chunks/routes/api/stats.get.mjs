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

const stats_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const days = query["days"] ? Number(query["days"]) : void 0;
  const source = typeof query["source"] === "string" ? query["source"] : void 0;
  const storage = await getStorage();
  return storage.getStats({ days, source });
});

export { stats_get as default };
//# sourceMappingURL=stats.get.mjs.map
