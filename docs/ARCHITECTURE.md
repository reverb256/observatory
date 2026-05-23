---
last-reviewed: 2026-05-18
status: active
---

# MapleSpike — Architecture & Product Overview

> **Consolidated document.** Merges former PRD.md, MRD.md, and MVP-SCOPE.md into a single authoritative reference.
> See [docs/metrics.json](./metrics.json) for current module counts and tool counts.

---

## 1. Product Overview

MapleSpike is Canada's sovereign, AI-native government data pipeline. It wraps the `@maplespike/pipeline-core` library into a hosted, multi-module data pipeline that provides a unified REST + MCP API for Canadian government data — including Statistics Canada cubes, open.canada.ca CKAN portals, provincial data, citation verification (SHA-256), trust-scored responses, and immutable audit trails.

One API key grants access to every major Canadian government dataset, packaged with machine-readable citations, provenance metadata, and trust scores.

**Infrastructure:** Backend services (MCP, API, engine) on K3s cluster (nexus). Developer portal on K3s cluster (nginx). No Cloudflare, no custom domain, no external cloud spend.

---

## 2. Current Capabilities

### 2.1 Data Ingestion Pipeline (pipeline-core)

The core library ingests, verifies, and surfaces Canadian government data. See [docs/metrics.json](./metrics.json) for current module counts.

**Module categories (65 registered in registry.ts):**

| Category | Modules |
|----------|---------|
| Government core | rss, gov-api, attestation, provincial-ckan, gc-standards |
| Parliamentary | committees, gic, gazette, elections |
| Oversight | oversight, federal-tribunals, ati |
| Legal | canlii, lmia, legislation, a2aj |
| Immigration | immigration, criminal-justice |
| Indigenous | indigenous-relations |
| Defence | defence, veterans |
| Transport | transport-infrastructure |
| Health | health-canada, health-data |
| Corporate | corporate, corporate-filings, sedi, crown-corporations, cra-charity, bank-of-canada, cmhc |
| Influence | influence, ngo-influence-rss, cross-reference |
| Media | crtc, media-broadcasting, culture |
| Environment | npri, species-at-risk, impact-assessment, geospatial |
| Federal | federal, federal-budget, proactive-disclosure, goc-spending, statcan |
| Provincial | provincial, provincial-lobbying, provincial-legislatures, provincial-orgs, provincial-regulators |
| Municipal | municipal, municipal-long-tail, regional-authorities |
| Social | social-programs, unions |
| Science | science-research, education-research, universities |
| Economy | fisheries, agriculture, global-canada |
| Real-time | real-time-feeds |

### 2.2 MCP Server — All 24 Tools Live

An MCP server deployed on the K3s cluster, exposing MapleSpike data as tools for AI agents.

| Tool | Status | Description |
|------|--------|-------------|
| `query_gov_data` | ✅ LIVE | Query government data by keyword/jurisdiction |
| `fact_check` | ✅ LIVE | Check a claim against official government data |
| `get_citation` | ✅ LIVE | Retrieve and verify citation hash |
| `latest_releases` | ✅ LIVE | Latest government data releases |
| `search_committees` | ✅ LIVE | Full DB-backed search over House and Senate committees |
| `search_corporate` | ✅ LIVE | Full DB-backed search over lobbying records |
| `search_influence` | ✅ LIVE | Full DB-backed search over influence actors |
| `search_gazette` | ✅ LIVE | Full DB-backed search over Canada Gazette |
| `search_gic` | ✅ LIVE | Full DB-backed search over GIC appointments |
| `search_elections` | ✅ LIVE | Full DB-backed search over Elections Canada data |
| `search_provincial_lobbying` | ✅ LIVE | Full DB-backed search over provincial lobbying |
| `search_oversight` | ✅ LIVE | Full DB-backed search over oversight body reports |
| `search_canlii` | ✅ LIVE | Full DB-backed search over CanLII court decisions |
| `search_lmia` | ✅ LIVE | Full DB-backed search over LMIA data |
| `search_immigration` | ✅ LIVE | IRCC, IRB, CBSA immigration data |
| `search_science` | ✅ LIVE | Science research data (CSA, Mitacs, etc.) |
| `search_tribunals` | ✅ LIVE | Federal tribunal decisions |
| `search_lode` | ✅ LIVE | Open Database of Addresses geospatial data |
| `search_ngo_rss` | ✅ LIVE | NGO/think tank RSS feed search across 31 tracked sources |
| `search_veterans` | ✅ LIVE | Defence/veterans data search |
| `ai_ask` | ✅ LIVE | Natural language question-answering |
| `ai_analyze` | ✅ LIVE | AI-powered data analysis |
| `ai_search_semantic` | ✅ LIVE | Semantic search across datasets |
| `system_health` | ✅ LIVE | System health and usage metrics |

### 2.3 REST API Server (api-server)

A REST API gateway with auth, rate limiting, and usage tracking (36 routes).

| Endpoint | Method | Description |
|----------|--------|-------------|
| **Core** | | |
| `GET /v1/health` | GET | Health check |
| `GET /v1/me` | GET | Current user info |
| `POST /v1/register` | POST | Register new account |
| `GET /v1` | GET | API root (redirects to openapi.json) |
| `GET /v1/openapi.json` | GET | OpenAPI specification |
| `GET /v1/usage` | GET | View current usage and quota |
| `GET /v1/signals` | GET | Engine signals (lazy-loaded) |
| **Government Data** | | |
| `GET /v1/gov/releases` | GET | Government data releases (StatCan/CKAN) |
| `GET /v1/gov/search` | GET | Search across all gov data sources |
| `GET /v1/citation/:id` | GET | SHA-256 citation verification |
| `POST /v1/audit/query` | POST | Query audit log |
| **AI** | | |
| `POST /v1/ai/ask` | POST | Natural language question-answering |
| `POST /v1/ai/analyze` | POST | AI-powered data analysis |
| `POST /v1/ai_ask` | POST | DEPRECATED — use /v1/ai/ask |
| **API Keys** | | |
| `GET /v1/keys` | GET | List API keys |
| `POST /v1/keys` | POST | Create API key |
| `DELETE /v1/keys/:id` | DELETE | Delete API key |
| `POST /v1/keys/:id/rotate` | POST | Rotate API key |
| **Auth — OAuth 2.0** | | |
| `GET /v1/auth/oauth/providers` | GET | List OAuth providers |
| `GET /v1/auth/oauth/:provider` | GET | Initiate OAuth login |
| `GET /v1/auth/oauth/:provider/callback` | GET | OAuth callback |
| **Auth — GitHub (legacy)** | | |
| `GET /v1/auth/github` | GET | Initiate GitHub OAuth |
| `GET /v1/auth/github/callback` | GET | GitHub OAuth callback |
| `POST /v1/auth/refresh` | POST | Refresh auth token |
| `POST /v1/auth/logout` | POST | Logout |
| `GET /v1/auth/me` | GET | Current auth status |
| **Auth — Web3 Wallet** | | |
| `POST /v1/auth/web3/challenge` | POST | Request Web3 challenge |
| `POST /v1/auth/web3/login` | POST | Web3 wallet login |
| **Auth — Passkey/WebAuthn** | | |
| `POST /v1/auth/passkey/register/begin` | POST | Begin passkey registration |
| `POST /v1/auth/passkey/register/complete` | POST | Complete passkey registration |
| `POST /v1/auth/passkey/login/begin` | POST | Begin passkey login |
| `POST /v1/auth/passkey/login/complete` | POST | Complete passkey login |
| `GET /v1/auth/passkey/credentials` | GET | List passkey credentials |
| `DELETE /v1/auth/passkey/credentials/:id` | DELETE | Delete passkey credential |
| **Billing** | | |
| `GET /v1/billing/plans` | GET | List billing plans |
| `POST /v1/billing/checkout` | POST | Create checkout session |

### 2.4 Developer Portal (Portal)

A lightweight static site for marketing, documentation, and API interaction, served from K3s via nginx.

- **13 static HTML pages**: index (hero, features, stats), dashboard, docs, pricing, agents, ask, blog, changelog, contact, explorer, signal, workspace, 404
- **Environment-aware config**: `config.js` (shared defaults), `config.dev.js` (dev override), `config.prod.js` (prod override). Mounted as a ConfigMap at `/usr/share/nginx/html/config.js`. Dev uses `apiBase: https://dev-maplespike-api.lan`, prod uses `https://maplespike-api.lan`.
- **Dark/light theme** toggle with `localStorage` persistence and CSS custom properties
- **Mobile responsive** navigation with hamburger menu
- **Scroll-reveal animations** via `IntersectionObserver` on section entrances
- **Glass dashboard sidebar** showing live modules tracked, API calls, and data sources
- **Pricing toggle** for monthly / annual billing display
- **MCP showcase** section demonstrating 24-tool MCP configuration
- **AI-friendly**: `llms.txt`, `llms-full.txt`, OpenAPI spec at `/v1/openapi.json`, `Accept: text/markdown` content negotiation, `x-markdown-tokens` header

---

## 3. Architecture

### 3.1 System Diagram

The K3s cluster (nexus) hosts two environments in separate namespaces, sharing the same image registry but differing in tags, ConfigMaps, NodePorts, and replica counts.

```
K3s Cluster (nexus)
│
├── Namespace: maplespike (prod)
│   ├── Ingress: maplespike.lan (Caddy)
│   │     /api/v1/*  → maplespike-api:8082
│   │     /mcp/*     → maplespike-mcp:3001
│   │     /*         → maplespike-portal:8080
│   ├── Image tag: :latest (ghcr.io/reverb256)
│   ├── Portal config: config.prod.js → apiBase: https://maplespike-api.lan
│   ├── Replicas: API=2, MCP=1, Portal=1
│   │
│   ├── MCP server (NodePort 31745) ── 24 tools, all live
│   ├── API server (NodePort 31283, Bearer auth, rate limits)
│   │     ├── SQLite (keys, usage, audit)
│   │     ├── In-memory cache (node-cache)
│   │     └── pipeline-core (ingestion, curation, verification)
│   │           ├── RSS Feeds .................... ✅
│   │           ├── Gov API (StatCan/CKAN) ....... ✅
│   │           ├── Committees (HoC + Senate) .... ✅
│   │           ├── Corporate .................... ✅
│   │           ├── Influence .................... ✅
│   │           ├── Gazette (Parts I, II) ........ ✅
│   │           ├── GIC Appointments ............ ✅
│   │           ├── Provincial Lobbying (all 13 provinces/territories) .. ✅ 11 active + 2 stubs
│   │           ├── Elections Canada ............. ✅
│   │           ├── Oversight Bodies ............ ✅
│   │           ├── CanLII Court Decisions ...... ✅
│   │           └── LMIA Data ................... ✅
│   └── Engine CronJobs (ingestion scheduling)
│
└── Namespace: maplespike-dev (dev)
    ├── Ingress: dev.maplespike.lan (Caddy)
    │     /api/v1/*  → maplespike-api:8082
    │     /mcp/*     → maplespike-mcp:3001
    │     /*         → maplespike-portal:8080
    ├── Image tag: :dev (ghcr.io/reverb256)
    ├── Portal config: config.dev.js → apiBase: https://dev-maplespike-api.lan
    ├── Replicas: API=1, MCP=1, Portal=1
    │
    ├── MCP server (NodePort 31746) ── 24 tools, all live
    ├── API server (NodePort 31284)
    │     └── pipeline-core (same module list as prod)
    └── Engine CronJobs (dev ingestion)
```

No Cloudflare, no D1, no KV — everything runs on the existing cluster. Both namespaces pull from the same GHCR registry but use different image tags (:dev vs :latest) and different ConfigMaps for environment-specific settings.

### 3.2 Data Flow

```
FETCH ──→ PARSE ──→ PERSIST ──→ SEARCH ──→ PRESENT
  ✅       ✅        ✅          ✅          🟡
```

| Layer | Status |
|-------|--------|
| **pipeline-core fetchers** | ✅ All modules fetch data |
| **pipeline-core parsers** | ✅ All modules parse into typed records |
| **pipeline-core DB persistence** | ✅ All modules persist via shared SQLite database |
| **MCP search tools** | ✅ All 24 tools wired to pipeline-core DB queries |
| **Dashboard / presentation** | 🟡 Static HTML — needs wiring to live API |

### 3.3 Integration Points

- **Upstream**: Statistics Canada WDS REST API, open.canada.ca CKAN, provincial CKAN portals, 44+ RSS feeds, CanLII REST API, sencanada.ca
- **Downstream**: MCP clients (Claude Desktop, Cursor, etc.), Frostbite Gazette
- **Auth**: API keys stored in database, Bearer token auth in api-server

### 3.4 Module Architecture

Each ingestion module follows a consistent pattern:

```
Module/
  constants.ts  — URL configs, source definitions, lookup tables
  types.ts      — TypeScript interfaces and types
  fetcher.ts    — HTTP/API fetch functions
  parser.ts     — Data parsing and normalization
  db.ts         — Database persistence (upsert, search) — OPTIONAL
  index.ts      — Public API (ingest*, search*)
```

### 3.5 Scalability & Performance

- **Caching**: In-memory cache (node-cache) for curation results (7-day TTL), gov releases (24h TTL)
- **Rate limiting**: Per-key in-memory token bucket in api-server
- **MCP server**: Single replica on nexus; scale via HPA if needed
- **Ingestion**: K8s CronJobs for periodic data refresh (not yet deployed)

---

## 4. CI/CD Pipeline

Two GitHub Actions workflows handle continuous deployment, mapped to two long-lived branches.

```
                      ┌──────────────┐
                      │  Pull Request │
                      │  (any branch) │
                      └──────┬───────┘
                             │
                     ┌───────▼────────┐
                     │  CI (ci.yml)   │
                     │  pnpm install  │
                     │  pnpm build    │
                     │  pnpm test     │
                     └───────┬────────┘
                             │ pass
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼────────┐    │    ┌─────────▼─────────┐
     │  push to main   │    │    │  push to prod      │
     └────────┬────────┘    │    └─────────┬──────────┘
              │             │              │
     ┌────────▼────────┐    │    ┌─────────▼──────────┐
     │  Deploy Dev     │    │    │  Deploy (deploy.yml)│
     │  (deploy-dev.yml)│    │    │  Build :latest tag │
     │  Build :dev tag  │    │    │  Push to GHCR      │
     │  Push to GHCR    │    │    │  SSH → K3s nexus   │
     │  SSH → K3s nexus │    │    │  kubectl apply     │
     │  kubectl apply   │    │    │  maplespike ns     │
     │  maplespike-dev  │    │    └─────────┬──────────┘
     │  ns              │    │              │
     └────────┬────────┘    │    ┌─────────▼──────────┐
              │             │    │  Publish           │
              │             │    │  (publish.yml)     │
              │             │    │  npm publish SDK   │
              │             │    │  PyPI publish      │
              │             │    └────────────────────┘
              │             │
              ▼             ▼
    maplespike-dev     maplespike
    (dev.maplespike.lan)  (maplespike.lan)
```

### 4.1 Branch Strategy

| Branch | CI Run | Deploy To | Image Tag | Ingress |
|--------|--------|-----------|-----------|---------|
| `main` | `ci.yml` — pnpm build + test | `maplespike-dev` namespace | `:dev` | `dev.maplespike.lan` |
| `prod` | N/A (separate) | `maplespike` namespace | `:latest` | `maplespike.lan` |

### 4.2 Workflow: CI (ci.yml)

Triggers on pull request to `main` and push to `main`. Runs `pnpm install`, `pnpm build`, and tests for all packages (pipeline-core, mcp-server, engine, sdk, legal-core, legislation, api-server). Serves as the quality gate before any deployment.

### 4.3 Workflow: Deploy Dev (deploy-dev.yml)

Triggers on push to `main` (path-filtered to `packages/`, `Dockerfile.*`, `k8s/`).

1. **Test** — same suite as ci.yml
2. **Build** — Docker images for `api`, `mcp`, `portal`, `ingest`, `engine` tagged as `:dev` and `:${{ github.sha }}`
3. **Push** — all images to `ghcr.io/reverb256/`
4. **SSH** — connects to nexus host, pulls images, tags for local registry
5. **Apply** — `kubectl apply -f k8s/dev/*.yaml`
6. **Rollout** — restarts deployments in `maplespike-dev`, waits for readiness

### 4.4 Workflow: Deploy Prod (deploy.yml)

Triggers on push to `prod` (path-filtered to `packages/`, `Dockerfile.*`, `k8s/prod/`).

1. **Test** — same suite as ci.yml
2. **Build** — same images tagged as `:latest` and `:${{ github.sha }}`
3. **Push** — to `ghcr.io/reverb256/`
4. **SSH** — connects to nexus, pulls images, tags for local registry
5. **Apply** — `kubectl apply -f k8s/prod/*.yaml`
6. **Rollout** — restarts deployments in `maplespike`, waits for readiness

### 4.5 Workflow: Publish (publish.yml)

Also triggers on push to `prod`. Publishes SDK packages:
- **npm**: Uses Changesets to version and publish `@maplespike/sdk` to npm registry
- **PyPI**: Builds `packages/sdk-python` wheel, publishes via `pypa/gh-action-pypi-publish`

---

## 6. Build Plan (7 Phases)

| Phase | What | Why | Status |
|-------|------|-----|--------|
| 1 | **Shared DB** — D1 interface → `better-sqlite3` wrapper, schema migration | Gates everything — no data can flow without it | ✅ DONE |
| 2 | **Wire Ingestion** — corporate CSV parse + DB insert, influence real queries | Fill the empty tables with real data | ✅ DONE |
| 3 | **Wire MCP Tools** — 14 stubs → 24 real DB queries | All tools return real results | ✅ DONE |
| 4 | **Engine Integration** — entity resolution reads shared DB | Use data already collected | ⏳ TODO |
| 5 | **Live Dashboard** — React dashboard hits MCP/API | Replace static mockups with live data | ⏳ TODO |
| 6 | **SaaS / Public API + Console** — Stripe + crypto + Interac billing, public signup, tier enforcement, developer console (API keys, usage, catalog, playground, Ask, Signal) | Revenue + developer self-service | 🔴 TODO |
| 7 | **CI/CD + White-Label** — GitHub Actions, enterprise tenants, journalism mode | Scale + enterprise | 🔴 TODO |

---

## 7. Market Context

### 7.1 Market Sizing

*This section reserved for market analysis. Core insight: Canadian government accountability data is currently fragmented across 50+ portals. MapleSpike is the first unified API layer.*

### 7.2 Competitive Landscape

*No direct competitor offers a unified Canadian government data API with verified SHA-256 citations. Comparisons: mqp-canada (precursor, fewer modules), Google Dataset Search (no API), individual CKAN portals (no aggregation).*

### 7.3 Target Audiences

1. **Independent Journalists** (~500 in Canada) — Verified data feeds with citations
2. **Civic Tech Developers** (~2,000) — Open pipeline they can extend
3. **AI Agent / LLM Developers** (growing) — MCP-native access for agent integration
4. **Frostbite Gazette** (internal dogfood) — Journalism-mode pipeline

---

## 8. SaaS Pricing

| Tier | Price | Requests | Rate | Support |
|------|-------|----------|------|---------|
| Free | $0 | 1,000/mo | 30/min | Community (Discord) |
| Pro | $49/mo | 100,000/mo | 25/sec | Email |
| Business | $199/mo | 500,000/mo | 100/sec | 24h SLA |
| Enterprise | Custom | Custom | Custom | Dedicated |

**Payment methods:** Stripe (cards), Crypto (BTC/ETH via BTCPay Server), Interac e-Transfer (Canada).

**Already built:** Auth, rate limiting, SQLite usage tracking, tenant DB schema, static HTML pricing/dashboard pages. **Remaining:** billing engine backend, public signup flow wiring, live data in dashboard.

---

## 9. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| mcp-canada goes production | Low | Medium | Already production-grade with more modules, audit, curation |
| Government APIs change | Medium | Low | CKAN standardized, StatCan WDS stable; pipeline-core can adapt |
| AIDA regulations increase compliance cost | Low | Medium | Audit logger already exceeds requirements |
| Adoption too slow | Medium | High | Frostbite Gazette dogfooding guarantees at least one active consumer |

---

## 10. Non-Goals

- Not a newsroom — no editorial content (journalism is Frostbite Gazette's role)
- Not a CKAN replacement — we're an aggregation/curation layer, not a data portal
- Not a general-purpose AI platform — MapleSpike only curates Canadian government data
- Not a social network — no user profiles, comments, or community features

---

## 11. Data Privacy

- **Pipeline data**: Cached gov releases, articles — SQLite/Postgres + in-memory cache
- **No PII**: The pipeline intentionally excludes personal information. All data is public government data.
- **Attribution**: Every API response includes license attribution per OGL-C: *"Contains information licensed under the Open Government Licence – Canada."*
