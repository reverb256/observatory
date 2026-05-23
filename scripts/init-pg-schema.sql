-- MapleSpike Production Schema — PostgreSQL 17
-- Applied manually on first deploy or via PgStorage.init()

BEGIN;

CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free','pro','business','enterprise','internal')),
  is_active BOOLEAN DEFAULT TRUE,
  journalism_mode BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS api_keys (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL UNIQUE,
  name TEXT DEFAULT 'default',
  is_active BOOLEAN DEFAULT TRUE,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_keys_tenant ON api_keys(tenant_id);
CREATE INDEX IF NOT EXISTS idx_keys_hash  ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_keys_active ON api_keys(is_active);

CREATE TABLE IF NOT EXISTS daily_usage (
  id SERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  call_count INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, date)
);
CREATE INDEX IF NOT EXISTS idx_usage_tenant_date ON daily_usage(tenant_id, date);

CREATE TABLE IF NOT EXISTS monthly_usage (
  id SERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  year_month TEXT NOT NULL,
  call_count INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, year_month)
);
CREATE INDEX IF NOT EXISTS idx_monthly_tenant ON monthly_usage(tenant_id, year_month);

CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  api_key_id TEXT,
  operation TEXT NOT NULL,
  model TEXT,
  endpoint TEXT,
  input_preview TEXT,
  output_summary TEXT,
  confidence INTEGER,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_tenant    ON audit_log(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_operation ON audit_log(operation);
CREATE INDEX IF NOT EXISTS idx_audit_created   ON audit_log(created_at DESC);

-- Seed internal tenant
INSERT INTO tenants (id, name, tier, journalism_mode) VALUES ('ms-internal', 'MapleSpike', 'internal', TRUE)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO tenants (id, name, tier, journalism_mode) VALUES ('anon', 'Anonymous', 'free', FALSE)
  ON CONFLICT (id) DO NOTHING;

-- Seed dev API key (SHA-256 of "maplespike-dev-key")
INSERT INTO api_keys (id, tenant_id, key_hash, name) VALUES
  ('dev-key-1', 'ms-internal', 'c73d089e582ca8a90a5e3543a1c2fe6f89afc0f9c82319cea56a804048075799', 'dev')
  ON CONFLICT (id) DO NOTHING;

COMMIT;
