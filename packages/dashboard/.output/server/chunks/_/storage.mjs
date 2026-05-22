import { homedir } from 'os';
import { join } from 'path';
import { mkdir } from 'fs/promises';

async function hasNodeSqlite() {
  try {
    await import('sqlite');
    return true;
  } catch {
    return false;
  }
}
async function createStorage(path) {
  if (await hasNodeSqlite()) {
    const { NodeSqliteStorage: NodeSqliteStorage2 } = await import('./node-sqlite-W7JKBXRF.mjs');
    const storage2 = new NodeSqliteStorage2(path);
    await storage2.init();
    return storage2;
  }
  const { LibsqlStorage: LibsqlStorage2 } = await import('./libsql-2GA3377W.mjs');
  const storage = new LibsqlStorage2(path);
  await storage.init();
  return storage;
}
function getTrimlyDir() {
  return join(homedir(), ".trimly");
}
function getDefaultDbPath() {
  return join(getTrimlyDir(), "events.db");
}
async function ensureTrimlyDir() {
  const dir = getTrimlyDir();
  await mkdir(dir, { recursive: true });
  return dir;
}

let _storage = null;
async function getStorage() {
  var _a;
  if (_storage) return _storage;
  const path = (_a = process.env["TRIMLY_DB_PATH"]) != null ? _a : getDefaultDbPath();
  if (!process.env["TRIMLY_DB_PATH"]) await ensureTrimlyDir();
  _storage = await createStorage(path);
  return _storage;
}

export { getStorage as g };
//# sourceMappingURL=storage.mjs.map
