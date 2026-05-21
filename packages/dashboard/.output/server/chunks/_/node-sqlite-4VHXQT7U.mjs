import { E as ENABLE_WAL_SQL, C as CREATE_TABLES_SQL } from './chunk-2RFVQSJK.mjs';
import { v4 } from 'uuid';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
function rowToEvent(row) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  return {
    id: String(row["id"]),
    session_id: String((_a = row["session_id"]) != null ? _a : ""),
    timestamp: Number(row["timestamp"]),
    source: row["source"],
    provider: String(row["provider"]),
    model: String(row["model"]),
    tokens_input: Number((_b = row["tokens_input"]) != null ? _b : 0),
    tokens_output: Number((_c = row["tokens_output"]) != null ? _c : 0),
    tokens_cache_read: Number((_d = row["tokens_cache_read"]) != null ? _d : 0),
    tokens_cache_write: Number((_e = row["tokens_cache_write"]) != null ? _e : 0),
    tokens_saved_optim: Number((_f = row["tokens_saved_optim"]) != null ? _f : 0),
    tokens_saved_shadow: Number((_g = row["tokens_saved_shadow"]) != null ? _g : 0),
    cost_usd: Number((_h = row["cost_usd"]) != null ? _h : 0),
    cost_saved_usd: Number((_i = row["cost_saved_usd"]) != null ? _i : 0),
    cost_saved_shadow_usd: Number((_j = row["cost_saved_shadow_usd"]) != null ? _j : 0),
    duration_ms: row["duration_ms"] != null ? Number(row["duration_ms"]) : null,
    status: row["status"],
    filler_detected: Boolean(row["filler_detected"]),
    strategies_applied: row["strategies_applied"] ? JSON.parse(String(row["strategies_applied"])) : [],
    prompt_preview: row["prompt_preview"] != null ? String(row["prompt_preview"]) : null,
    tags: row["tags"] != null ? String(row["tags"]) : null
  };
}
var NodeSqliteStorage = class {
  constructor(path) {
    __publicField(this, "path");
    __publicField(this, "db", null);
    this.path = path;
  }
  async init() {
    const { DatabaseSync } = await import('sqlite');
    this.db = new DatabaseSync(this.path);
    this.db.exec(ENABLE_WAL_SQL);
    this.db.exec(CREATE_TABLES_SQL);
  }
  async close() {
    var _a;
    (_a = this.db) == null ? void 0 : _a.close();
    this.db = null;
  }
  get _db() {
    if (!this.db) throw new Error("Storage not initialized");
    return this.db;
  }
  async recordEvent(event) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
    const id = (_a = event.id) != null ? _a : v4();
    this._db.prepare(
      `INSERT INTO events (
          id, session_id, timestamp, source, provider, model,
          tokens_input, tokens_output, tokens_cache_read, tokens_cache_write,
          tokens_saved_optim, tokens_saved_shadow,
          cost_usd, cost_saved_usd, cost_saved_shadow_usd,
          duration_ms, status, filler_detected, strategies_applied, prompt_preview, tags
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    ).run(
      id,
      event.session_id,
      event.timestamp,
      event.source,
      event.provider,
      event.model,
      event.tokens_input,
      (_b = event.tokens_output) != null ? _b : 0,
      (_c = event.tokens_cache_read) != null ? _c : 0,
      (_d = event.tokens_cache_write) != null ? _d : 0,
      (_e = event.tokens_saved_optim) != null ? _e : 0,
      (_f = event.tokens_saved_shadow) != null ? _f : 0,
      event.cost_usd,
      (_g = event.cost_saved_usd) != null ? _g : 0,
      (_h = event.cost_saved_shadow_usd) != null ? _h : 0,
      (_i = event.duration_ms) != null ? _i : null,
      (_j = event.status) != null ? _j : "completed",
      event.filler_detected ? 1 : 0,
      JSON.stringify((_k = event.strategies_applied) != null ? _k : []),
      (_l = event.prompt_preview) != null ? _l : null,
      (_m = event.tags) != null ? _m : null
    );
    return id;
  }
  async updateEvent(id, patch) {
    const sets = [];
    const args = [];
    for (const [key, value] of Object.entries(patch)) {
      if (key === "id") continue;
      sets.push(`${key} = ?`);
      if (key === "strategies_applied" && Array.isArray(value)) {
        args.push(JSON.stringify(value));
      } else if (key === "filler_detected") {
        args.push(value ? 1 : 0);
      } else {
        args.push(value);
      }
    }
    if (sets.length === 0) return;
    args.push(id);
    this._db.prepare(`UPDATE events SET ${sets.join(", ")} WHERE id = ?`).run(...args);
  }
  async queryEvents(options = {}) {
    var _a;
    const conditions = [];
    const args = [];
    if (options.session_id) {
      conditions.push("session_id = ?");
      args.push(options.session_id);
    }
    if (options.source) {
      conditions.push("source = ?");
      args.push(options.source);
    }
    if (options.status) {
      conditions.push("status = ?");
      args.push(options.status);
    }
    if (options.cursor) {
      conditions.push("timestamp < ?");
      args.push(options.cursor);
    }
    if (options.days) {
      conditions.push("timestamp >= ?");
      args.push(Date.now() - options.days * 864e5);
    }
    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const limit = (_a = options.limit) != null ? _a : 100;
    args.push(limit);
    const rows = this._db.prepare(`SELECT * FROM events ${where} ORDER BY timestamp DESC LIMIT ?`).all(...args);
    return rows.map(rowToEvent);
  }
  async getStats(options = {}) {
    var _a, _b, _c, _d, _e;
    const conditions = [];
    const args = [];
    if (options.days) {
      conditions.push("timestamp >= ?");
      args.push(Date.now() - options.days * 864e5);
    }
    if (options.source) {
      conditions.push("source = ?");
      args.push(options.source);
    }
    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const t = this._db.prepare(
      `SELECT
          COUNT(*) as total_requests,
          SUM(tokens_input) as total_tokens_input,
          SUM(tokens_output) as total_tokens_output,
          SUM(cost_usd) as total_cost_usd,
          SUM(cost_saved_usd) as total_saved_usd
        FROM events ${where}`
    ).get(...args);
    const modelRows = this._db.prepare(
      `SELECT model, COUNT(*) as requests, SUM(cost_usd) as cost
        FROM events ${where} GROUP BY model`
    ).all(...args);
    return {
      totalRequests: Number((_a = t == null ? void 0 : t["total_requests"]) != null ? _a : 0),
      totalTokensInput: Number((_b = t == null ? void 0 : t["total_tokens_input"]) != null ? _b : 0),
      totalTokensOutput: Number((_c = t == null ? void 0 : t["total_tokens_output"]) != null ? _c : 0),
      totalCostUsd: Number((_d = t == null ? void 0 : t["total_cost_usd"]) != null ? _d : 0),
      totalSavedUsd: Number((_e = t == null ? void 0 : t["total_saved_usd"]) != null ? _e : 0),
      byModel: Object.fromEntries(
        modelRows.map((r) => [
          String(r["model"]),
          { requests: Number(r["requests"]), cost: Number(r["cost"]) }
        ])
      )
    };
  }
  async upsertSession(session) {
    var _a, _b, _c, _d, _e;
    this._db.prepare(
      `INSERT INTO sessions (id, source, started_at, ended_at, cwd, total_tokens_input, total_tokens_output, total_cost_usd)
        VALUES (?,?,?,?,?,?,?,?)
        ON CONFLICT(id) DO UPDATE SET
          ended_at = COALESCE(excluded.ended_at, ended_at),
          cwd = COALESCE(excluded.cwd, cwd)`
    ).run(
      session.id,
      session.source,
      session.started_at,
      (_a = session.ended_at) != null ? _a : null,
      (_b = session.cwd) != null ? _b : null,
      (_c = session.total_tokens_input) != null ? _c : 0,
      (_d = session.total_tokens_output) != null ? _d : 0,
      (_e = session.total_cost_usd) != null ? _e : 0
    );
  }
  async updateSession(id, patch) {
    const sets = [];
    const args = [];
    for (const [key, value] of Object.entries(patch)) {
      if (key === "id") continue;
      sets.push(`${key} = ?`);
      args.push(value);
    }
    if (sets.length === 0) return;
    args.push(id);
    this._db.prepare(`UPDATE sessions SET ${sets.join(", ")} WHERE id = ?`).run(...args);
  }
};

export { NodeSqliteStorage };
//# sourceMappingURL=node-sqlite-4VHXQT7U.mjs.map
