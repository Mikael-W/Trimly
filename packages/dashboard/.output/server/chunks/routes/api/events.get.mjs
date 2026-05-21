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

const events_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const storage = await getStorage();
  return storage.queryEvents({
    source: query["source"],
    status: query["status"],
    days: query["days"] ? Number(query["days"]) : void 0,
    limit: query["limit"] ? Number(query["limit"]) : 100,
    cursor: query["cursor"] ? Number(query["cursor"]) : void 0
  });
});

export { events_get as default };
//# sourceMappingURL=events.get.mjs.map
