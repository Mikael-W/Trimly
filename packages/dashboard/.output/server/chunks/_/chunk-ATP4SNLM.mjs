var CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  started_at INTEGER NOT NULL,
  ended_at INTEGER,
  cwd TEXT,
  total_tokens_input INTEGER DEFAULT 0,
  total_tokens_output INTEGER DEFAULT 0,
  total_cost_usd REAL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  timestamp INTEGER NOT NULL,
  source TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  tokens_input INTEGER NOT NULL DEFAULT 0,
  tokens_output INTEGER DEFAULT 0,
  tokens_cache_read INTEGER DEFAULT 0,
  tokens_cache_write INTEGER DEFAULT 0,
  tokens_saved_optim INTEGER DEFAULT 0,
  tokens_saved_shadow INTEGER DEFAULT 0,
  cost_usd REAL NOT NULL DEFAULT 0,
  cost_saved_usd REAL DEFAULT 0,
  cost_saved_shadow_usd REAL DEFAULT 0,
  duration_ms INTEGER,
  status TEXT NOT NULL DEFAULT 'completed',
  filler_detected INTEGER DEFAULT 0,
  strategies_applied TEXT,
  prompt_preview TEXT,
  tags TEXT
);

CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp);
CREATE INDEX IF NOT EXISTS idx_events_session ON events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_provider_model ON events(provider, model);
CREATE INDEX IF NOT EXISTS idx_events_source ON events(source);

CREATE TABLE IF NOT EXISTS tool_calls (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_id TEXT,
  tool_name TEXT NOT NULL,
  target TEXT,
  tokens_used INTEGER NOT NULL DEFAULT 0,
  cost_usd REAL NOT NULL DEFAULT 0,
  timestamp INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tool_calls_session ON tool_calls(session_id);
CREATE INDEX IF NOT EXISTS idx_tool_calls_timestamp ON tool_calls(timestamp);

CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`;
var ENABLE_WAL_SQL = "PRAGMA journal_mode=WAL;";

export { CREATE_TABLES_SQL as C, ENABLE_WAL_SQL as E };
//# sourceMappingURL=chunk-ATP4SNLM.mjs.map
