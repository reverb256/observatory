---
last-reviewed: 2026-05-14
status: active
---

# MapleSpike Pipeline — Master Roadmap

> **Updated:** 2026-05-17 (licensing strategy baked in)
> **Current metrics:** [docs/metrics.json](./docs/metrics.json)
> **Repository:** `/data/projects/own/maplespike`
> **Working branch:** main
> **Deployment target:** K3s cluster (maplespike.lan)

---

## Session Snapshot (May 13–14, 2026)

| Metric | Start | End |
|--------|-------|-----|
| Ingestion modules | 28 | 65 |
| Lines of TypeScript | ~51k | ~113k |
| Tests passing | broken CI | 179/179 |
| CI status | 🔴 failing | ✅ green |
| Commits on main | — | ~90+ |
| Files changed | — | ~400+ |
| Lines added | — | ~36,000 |
| Packages | 6 | 11 |
| MCP tools | 18 | 26 |
| API routes | ~20 | 38 |
| K8s services | 2 | 7+ |
| Portal pages | 8 | 13 |
| Citation fields enriched | 0 | 3 (citation_text, citation_footnote, original_format) |
| Dev environment deployed | — | ✅ maplespike-dev namespace, 10 k8s/dev/ manifests |
| Scroll-reveal animations | — | 8 sections, 29 data-reveal attributes on landing page |
| Dashboard glass sidebar | — | ✅ Quick-glance metrics with backdrop-filter blur |
| Pricing tier highlight + annual toggle | — | ✅ Pro "BEST VALUE" badge, scale(1.02) glow, Save 17% |
| MCP config showcase | — | ✅ Tabbed configs (curl, TypeScript, Python, JSON) on landing page |

## Legend

| Marking | Meaning |
|---------|---------|
| ✅ DONE | Built and tested |
| 🟡 PARTIAL | Exists but needs expansion |
| 🔴 TODO | Not started |
| ⏸ HOLD | Blocked or deferred |
| 🗄 ARCHIVED | No longer planned |

---

## PHASE 0: FOUNDATION — Complete

| Item | Status | Notes |
|------|--------|-------|
| ✅ Monorepo structure (pnpm workspace) | DONE | 11 packages: pipeline-core, engine, mcp-server, api-server, portal, database, pretext-civic (orphaned), sdk, sdk-python, legal-core, legislation |
| ✅ TypeScript + strict mode | DONE | ES2022 target, bundler resolution |
| ✅ Pipeline core barrel exports → module registry | DONE | 1707→91 lines, `getModule()` / `runModule()` API replaces 230 individual exports |
| ✅ Build compilation | DONE | `tsc -b` clean across all packages — 87k+ lines TS |
| ✅ Core ingestion: RSS feeds | DONE | Parse, hash, deduplicate |
| ✅ Core ingestion: StatCan/CKAN | DONE | `fetchStatCanReleases`, `fetchCKANPackages` |
| ✅ Verification hashing (SHA-256) | DONE | Citation integrity for every record |
| ✅ Audit logging framework | DONE | AIDA-compliant audit trail schema |
| ✅ Trust scoring (>=60% threshold) | DONE | Bias/foreign-influence detection |
| ✅ 5GW analysis module | DONE | 730-line analysis engine for fifth-generation warfare indicators |
| ✅ Unified schema (1042+ lines, 38 tables) | DONE | articles, gov_releases, committees, corporate, influence, gazette, gic, oversight, provincial-lobbying, elections, canlii, lmia, plus auth/users |
| ✅ Module registry (registry.ts) | DONE | 63 modules with metadata, dynamic import, runModule() dispatch |
| ✅ 15 generated .d.ts files removed | DONE | All from engine/src — were build artifacts committed to source |
| ✅ Dynamic import in dev-server | DONE | SQLite native module only loaded when storage=sqlite |
| ✅ API server + MCP server deployed | DONE | K8s pods on nexus, NodePorts 30882 (API) + 32537 (MCP) |
| ✅ All branding purged | DONE | 0 remaining references in code, docs, DNS, K8s |

---

## PHASE 1: INGESTION MODULES — 65 modules across all tiers

### Tier 1 — Federal Core (35+ modules)

| Module | Source | Status | Notes |
|--------|--------|--------|-------|
| ✅ Committees (HoC + Senate) | ourcommons.ca, sencanada.ca | DONE | 50 committees, XML evidence, in-camera detection |
| ✅ Lobbying registry | lobbycanada.gc.ca CKAN | DONE | Monthly CSV reports, registrations, communications |
| ✅ Government procurement | CanadaBuys RSS, proactive disclosure | DONE | Sole-source detection, contract awards |
| ✅ Executive statements | GlobeNewswire, org RSS feeds | DONE | 17 tracked execs, bank/telecom/media CEOs |
| ✅ Influence actors | CRA charities, committee cross-ref | DONE | 32 tracked IOs/NGOs/think tanks/consultancies |
| ✅ Gazette (Parts I+II) | canada.gazette.gc.ca RSS | DONE | Proposed + enacted regulations |
| ✅ GIC appointments | open.canada.ca CKAN | DONE | Patronage tracking, 1,500+ boards |
| ✅ Provincial lobbying (ON) | ontario.ca CKAN | DONE | Largest provincial registry |
| ✅ Third-party ad registry | Elections Canada | DONE | Dark money in elections |
| ✅ Oversight bodies | OAG, PBO, Ethics, CRTC, CB, CIEC | DONE | 6 bodies: reports, investigations, decisions |
| ✅ CanLII court decisions | canlii.org API | DONE | Metadata + summaries (full-text deferred) |
| ✅ LMIA employer data | open.canada.ca CKAN | DONE | Labour market impact assessments |
| ✅ Immigration & Borders | IRCC, IRB, CBSA CKAN | DONE | Permanent residents, refugee decisions, removals |
| ✅ Indigenous Relations | CIRNAC, ISC | DONE | Land claims, FN transparency, TRC calls to action |
| ✅ Criminal Justice | CSC, Parole, RCMP, PPSC | DONE | Prison population, parole decisions, crime stats |
| ✅ Transport Safety | TSB, TC, CTA, CIB | DONE | Occurrence data, recalls, infrastructure funding |
| ✅ Defence & Veterans | DND, VAC | DONE | Personnel, procurement, benefits |
| ✅ Health Deep | CIHI, PHAC, CFIA | DONE | Wait times, recalls, drug pricing |
| ✅ Education Research | Tri-Council, CRC, CFI | DONE | Grants, research chairs, student loans |
| ✅ Social Programs | CCB, CPP/OAS, EI | DONE | Benefits, poverty, food security |
| ✅ Provincial Regulators | 75 bodies, 14 categories, 13 provinces | DONE | Energy, securities, insurance, labour, etc. |
| ✅ Federal Tribunals | SST, CITT, CHRT, Copyright Board | DONE | Social security, trade, human rights |
| ✅ Real-Time Feeds | weather alerts, border waits, parole | DONE | Live data streams |
| ✅ Science Research | CSA, Mitacs, ONC, Polar Data | DONE | Space, innovation, ocean, polar |
| ✅ SEDI insider trading | sedi.ca | DONE | Executive stock trades, C-Suite patterns |
| ✅ Bank of Canada | bankofcanada.ca | DONE | Rate decisions, monetary policy reports |
| ✅ CIPO patent/trademark | cipo.gc.ca | DONE | Canadian Intellectual Property Office |
| ✅ CMHC housing | cmhc.ca | DONE | Housing data, mortgage statistics |
| ✅ CRA charity financials (T3010) | cra-arc.gc.ca | DONE | Revenue, directors, grants paid |
| ✅ Crown corporations | Various | DONE | Disclosures, financials |
| ✅ CRTC decisions | crtc.gc.ca | DONE | Broadcasting/telecom regulatory decisions |
| ✅ Federal budget | budget.canada.ca | DONE | Budget data and analysis |
| ✅ Global Affairs Canada | international.gc.ca | DONE | International development, trade data |
| ✅ Health Canada drug database | health-canada.gc.ca | DONE | Drug product database |
| ✅ Impact assessment data | iaac-aeic.gc.ca | DONE | Project assessments, conditions |
| ✅ Municipal council data | eScribe, iCompass, CivicWeb | DONE | Multi-vendor platform ingestion |
| ✅ NPRI emissions data | ec.gc.ca | DONE | National Pollutant Release Inventory |
| ✅ Proactive disclosure | open.canada.ca | DONE | Contracts over $10K, grants, hospitality |
| ✅ Provincial legislatures | 13 provinces/territories | DONE | Legislative committee data |
| ✅ Species at Risk | wildlife-species.canada.ca | DONE | SAR registry, recovery strategies |

### Tier 2 — Deep & Sector (28 modules)

| Module | Status | Notes |
|--------|--------|-------|
| ✅ Municipal (17 cities) | DONE | CKAN/Socrata/ArcGIS federation |
| ✅ Provincial Deep (SK/MB/NS/NB/NL/PE/YT/NT/NU CKAN) | DONE | All remaining provincial portals |
| ✅ Municipal Long-Tail (3,490+ cities) | DONE | Via federation |
| ✅ Unions Deep (CUPE, Unifor, PSAC) | DONE | Annual reports, financials |
| ✅ Universities Deep (CUDO + per-institution CKAN) | DONE | University data |
| ✅ Corporate Filings (SEDAR+ CKAN) | DONE | Public company filings |
| ✅ Culture & Heritage (Canada Council, Telefilm, CMF) | DONE | Cultural funding |
| ✅ Media & Broadcasting (CRTC ownership) | DONE | Ownership charts |
| ✅ Federal Deep (ESDC, CIHI, PHAC aggregated) | DONE | Aggregated federal data |
| ✅ NGO Influence RSS (31 feeds) | DONE | Think tank/NGO monitoring |
| ✅ Agriculture + Fisheries | DONE | CKAN data |
| ✅ GoC Spending (GitHub-based) | DONE | Federal contracts |
| ✅ A2J (Access to Justice) | DONE | Legal aid, justice data |
| ✅ Legislation tracking | DONE | Bills, statutes |
| ✅ ATI (Access to Information) | DONE | FOI requests |
| ✅ Attestation & compliance | DONE | Gov attestations |
| ✅ GC Standards | DONE | Government standards |
| ✅ Geospatial data | DONE | LODE, geospatial datasets |
| ✅ Global Canada | DONE | Trade, intl development |
| ✅ Immigration (deeper) | DONE | Visa, work permits |
| ✅ Municipal long-tail (extended) | DONE | Additional cities |
| ✅ Provincial orgs | DONE | Provincial bodies |
| ✅ Provincial regulators (deep) | DONE | Extended regulatory coverage |
| ✅ Regional authorities | DONE | Regional gov data |
| ✅ Social programs (deep) | DONE | Extended social data |
| ✅ Transport infrastructure | DONE | Infrastructure projects |
| ✅ Veterans (deep) | DONE | Extended veterans data |
| ✅ Criminal justice (deep) | DONE | Extended justice data |

---

## PHASE 2: API & MCP — 38 Routes, 22 Tools

### REST API (`packages/api-server/`)

| Feature | Status | Notes |
|---------|--------|-------|
| ✅ 38 API routes | DONE | 15+ gov data, auth, key management, billing stubs |
| ✅ /v1/health | DONE | System status, request count, uptime |
| ✅ /v1/gov/releases | DONE | Latest government releases |
| ✅ /v1/gov/search | DONE | Unified search across all modules |
| ✅ /v1/citation/:hash | DONE | Citation hash retrieval |
| ✅ /v1/usage | DONE | Usage stats for authenticated keys |
| ✅ /v1/keys CRUD | DONE | Create, list, revoke API keys |
| ✅ JWT auth (refresh, logout, me) | DONE | /v1/auth/refresh, /v1/auth/logout, /v1/auth/me |
| ✅ GitHub OAuth login | DONE | /v1/auth/github, /v1/auth/github/callback |
| ✅ Quota enforcement (402) | DONE | Hard cap on free tier, Retry-After header |
| ✅ Rate limiting | DONE | Sliding window, per-key |
| ✅ Token optimization params | DONE | `_fields`, `_format`, `_limit`, `_page`, `_summary`, `_mock` |
| ✅ JIT key rotation | DONE | POST /v1/keys/:id/rotate, auto-rotate within 7 days of expiry |
| ✅ Storage-backed auth | DONE | db.authenticate() fallback chain |
| ✅ AI Ask endpoint | DONE | /v1/ai_ask with gateway/CKAN/helpful fallback chain |
| 🔴 Web3 auth (wallet) | TODO | SIWE/EIP-4361 + Solana |
| 🔴 Passkey auth (WebAuthn) | TODO | Biometric/platform passkeys |
| 🔴 Stripe billing | TODO | Checkout sessions + webhooks |
| 🔴 Crypto payments | TODO | BTC/ETH via BTCPay Server |
| 🔴 Interac e-Transfer | TODO | Canadian bank transfer billing |

### MCP Server (`packages/mcp-server/`)

| Feature | Status | Notes |
|---------|--------|-------|
| ✅ 26 MCP tools | DONE | All 26 in get_all_tools(), all return real data |
| ✅ SSE transport | DONE | HTTP on port 3001, /sse, /messages |
| ✅ stdio transport | DONE | For local CLI use |
| ✅ K8s deployment | DONE | maplespike-mcp pod, NodePort 32537 |
| ✅ Bilingual descriptions | DONE | All tools en/fr, locale-aware |
| ✅ query_gov_data | DONE | Unified CKAN search across jurisdictions |
| ✅ fact_check | DONE | Basic verification |
| ✅ get_citation | DONE | Citation hash retrieval |
| ✅ latest_releases | DONE | Recent government data |
| ✅ search_committees | DONE | Committee evidence + transcripts |
| ✅ search_corporate | DONE | Lobbying + procurement + exec statements |
| ✅ search_influence | DONE | Influence actor data |
| ✅ search_gazette | DONE | Canada Gazette records |
| ✅ search_gic | DONE | GIC appointments |
| ✅ search_elections | DONE | Third-party advertising data |
| ✅ search_provincial_lobbying | DONE | Ontario lobbying data |
| ✅ search_oversight | DONE | OAG, PBO, Ethics, CRTC, etc. |
| ✅ search_canlii | DONE | Court decisions |
| ✅ search_lmia | DONE | LMIA employer data |
| ✅ search_immigration | DONE | IRCC, IRB, CBSA data |
| ✅ search_indigenous_relations | DONE | CIRNAC, ISC, TRC data |
| ✅ search_criminal_justice | DONE | CSC, Parole, RCMP data |
| ✅ search_transport_safety | DONE | TSB, TC, Infrastructure Canada data |
| ✅ search_defence | DONE | DND personnel, VAC services data |
| ✅ search_science | DONE | Science research data |
| ✅ search_tribunals | DONE | Federal tribunal data |
| ✅ search_lode | DONE | LODE geospatial metadata |
| ✅ ai_analyze | DONE | AI-powered data analysis |
| ✅ ai_ask | DONE | Natural language question answering |
| ✅ ai_search_semantic | DONE | Semantic search across datasets |
| ✅ system_health | DONE | System status + usage data |
| 🔴 Prometheus metrics | TODO | Request rate, latency, error rate |

---

## PHASE 2B: PORTAL — 13 Pages, Live

| Item | Status | Notes |
|------|--------|-------|
| ✅ 13 HTML pages | DONE | index, dashboard, explorer, workspace, docs, pricing, ask, signal, agents, 404, changelog, blog, contact |
| ✅ Identical bracket-style nav on all pages | DONE | DATA → PRICING → DOCS → EXPLORER → CHANGELOG → WORKSPACE → Get API Key → 🌙 |
| ✅ Footer with live status indicator | DONE | ALL SYSTEMS OPERATIONAL with live badge |
| ✅ Mobile full-screen overlay menu | DONE | Body scroll lock, Escape key, staggered links |
| ✅ System fonts (no Google Fonts) | DONE | -apple-system + ui-monospace stack |
| ✅ Canadian heritage palette | DONE | Red #C23030, gold #D4A017, Base16 token system |
| ✅ Theme toggle (dark/light) | DONE | localStorage persistence across all pages |
| ✅ Live stats from API | DONE | Fetches from /v1/health — no fake data |
| ✅ Pricing page | DONE | Free/Pro/Business, monthly/annual toggle, FAQ |
| ✅ Data Explorer with category chips | DONE | 21 categories with action counts |
| ✅ Workspace with API key management | DONE | Key display, regenerate, usage stats (HTML wired) |
| ✅ Docs page — 10-section API reference | DONE | Quickstart, Auth, Request/Response, Endpoints, Token Optimization, Citation Contract, 22-Tool Catalog, Rate Limits, Error Codes, FAQ |
| ✅ Changelog page | DONE | v0.1.0 and v0.2.0 entries |
| ✅ JSON-LD schema on all pages | DONE | SEO / AI readability |
| ✅ agents.json | DONE | WXT-style agent discovery card |
| ✅ llms.txt | DONE | AI crawl instructions |
| ✅ Anti-grid brutalism landing page | DONE | Terminal-style API code demo replaces bento-card grid. Code itself is the illustration. |
| ✅ SDK tabstrip integration | DONE | curl / TypeScript / Python tabs in hero quickstart section |
| ✅ Data Explorer depth (21 categories) | DONE | Exceeds 20-category target with action counts per category |
| ✅ Typography polish | DONE | Body line-height 1.8, section headings 2.5rem, section padding 100px |
| ✅ blog.html page exists | DONE | Static page live at /blog.html — RSS feed not yet wired |
| ✅ contact.html page exists | DONE | Static page with email contact — no form backend yet |
| ✅ Scroll-reveal animations on 8 sections | DONE | 29 data-reveal attributes across landing page, hero, features, stats, pricing, MCP, CTA, footer |
| ✅ Dashboard glass sidebar | DONE | Quick-glance metrics with backdrop-filter blur, frosted glass effect, stat polish |
| ✅ Pro "BEST VALUE" featured tier | DONE | scale(1.02) transform, gold glow border, "Most Popular" badge |
| ✅ Annual/monthly billing toggle | DONE | Save 17% annual discount, smooth transition between tiers |
| ✅ MCP integration showcase | DONE | Tabbed code samples: curl, TypeScript, Python, JSON — copy-to-clipboard |
| 🔴 blog RSS feed | TODO | Wire RSS feed to blog.html content |
| 🔴 Contact form backend | TODO | Add server-side form handler or mailto fallback |

---

## PHASE 2C: CI/CD & ENVIRONMENTS

| Item | Status | Notes |
|------|--------|-------|
| ✅ Branch mapping: main→dev, prod→prod | DONE | main branch auto-deploys to dev; prod branch deploys to production |
| ✅ k8s/dev/ manifests (10 files) | DONE | namespace, api/mcp/portal deployments + services, portal-config, ingress, kustomization |
| ✅ deploy-dev.yml workflow | DONE | Trigger: push to main. Builds 5 Docker images with :dev tag, deploys to K3s dev namespace |
| ✅ Image tag strategy | DONE | `:dev` for dev deploys, `:latest` for prod deploys; commit SHA tags for traceability |
| ✅ Dev namespace (maplespike-dev) | DONE | Isolated from production, single-domain ingress dev.maplespike.lan |
| ✅ CI workflow (ci.yml) | DONE | Build + test all packages on push to main |
| ✅ Prod deploy (deploy.yml) | DONE | Auto-merge main→prod after tests pass |
| ✅ Portal on K3s (nginx) | DONE | Auto-deployed on prod branch |

---

## PHASE 3: CLUSTER DEPLOYMENT — All Services Running

| Service | Namespace | NodePort | Status | Notes |
|---------|-----------|----------|--------|-------|
| maplespike-api | maplespike | 30882 | ✅ Running | 2 pods, 38 routes |
| maplespike-mcp | maplespike | 32537 | ✅ Running | 26 tools, SSE transport |
| maplespike-portal | maplespike | 30964 | ✅ Running | Static HTML dashboard |
| maplespike-db | maplespike | — | ✅ Running | PostgreSQL PVC provisioned |
| gitea | gitea | 30954 | ✅ Running | Self-hosted Git with Casdoor OAuth |
| uptime-kuma | monitoring | 32007 | ✅ Running | Status page at status.maplespike.lan |
| Casdoor | auth | 32556 | ✅ Running | OAuth/SSO provider |
| PostgreSQL | gitea | — | ✅ Running | Gitea database backend |
| NFS share | — | — | ✅ Provisioned | /data/shared/gitea for git repos |

### NixOS Infrastructure

| Component | Status | Notes |
|-----------|--------|-------|
| ✅ Caddy reverse proxy | DONE | maplespike.lan routes through nexus VIP, path-based: /v1/*→API, /sse/health→MCP, /→portal |
| ✅ Unbound DNS | DONE | .lan resolution on 10.1.1.120 + 10.1.1.100 |
| ✅ Cluster CA cert | DONE | SAN includes all .lan domains, self-signed |
| ✅ Nix overlay | DONE | maplespike-mcp-image in overlay |
| 🔴 colmena apply | TODO | Current DNS is bind-mount workaround, not permanent |
| 🔴 Gitea TLS cert mounting | TODO | Go TLS verification vs self-signed CA |

### Docker Images (5)

| Image | Status | Notes |
|-------|--------|-------|
| maplespike-api | ✅ Built | REST API server |
| maplespike-mcp | ✅ Built | MCP protocol server |
| maplespike-portal | ✅ Built | Static nginx |
| maplespike-ingest | ✅ Built | CronJob ingestion runner |
| maplespike-engine | ✅ Built | Entity resolution + graph |

### CI/CD

| Workflow | Status | Notes |
|----------|--------|-------|
| ✅ ci.yml | DONE | Build + test all packages on push to main |
| ✅ deploy.yml | DONE | Auto-merge main→prod after tests pass |
| ✅ deploy-k3s | DONE | Builds 5 Docker images + deploys to cluster |
| ✅ Portal on K3s (nginx) | DONE | Auto-deployed on prod branch |
| 🔴 Dependabot alerts | TODO | 2 high, 3 moderate |
| ✅ Zombie cleanup | DONE | 13 orphaned K8s services deleted, auto-deploy timer fixed |
| ✅ AI model registry | DONE | /etc/nixos/ai-models.toml (single source of truth, Phase 1) |

---

## PHASE 4: OBSERVABILITY & MONITORING

| Item | Status | Notes |
|------|--------|-------|
| ✅ Uptime Kuma | DONE | Deployed pod, configured monitors, status page |
| ✅ Grafana dashboard | DONE | Prometheus + alerting rules |
| 🔴 Prometheus Pushgateway + AlertManager | TODO | CronJob heartbeat alerts |
| 🔴 Loki + Promtail log aggregation | TODO | Ship logs from all pods |
| 🔴 GlitchTip error tracking | TODO | Sentry-compatible, catch API exceptions |
| 🔴 SigNoz / Tempo distributed tracing | TODO | OpenTelemetry-native |
| 🔴 MCP health metrics | TODO | Request rate, latency, error rate |

### Monitoring Build Order

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 1 | Add Pushgateway + AlertManager rules for CronJobs | High — catch silent pipeline failures | 30 min |
| 2 | Ship pod logs to Loki via Promtail | Medium — replace kubectl logs | 1 hour |
| 3 | Create Grafana dashboards for MCP/API | Medium — single pane of glass | 30 min |
| 4 | Deploy GlitchTip for API error tracking | Medium — catch exceptions in production | 1 hour |

---

## PHASE 5: TESTS — 179 Passing

| Package | Tests | Framework | Coverage |
|---------|-------|-----------|----------|
| engine | 133/133 | vitest | ✅ configured |
| pipeline-core | 46/46 | node --test | ✅ configured |
| sdk | 7/7 | node --test | ✅ configured |
| mcp-server | 38 total | node --test | ✅ configured |
| api-server | — | — | 🔴 no tests yet |

### Competitive Research — Katzilla

- **What:** Full API deep-dive of [Katzilla](https://katzilla.dev) (@katzilla/mcp MCP server) — the US-equivalent to MapleSpike
- **Findings:** Katzilla wraps 27 agents, 217 actions across 300+ US government sources (SEC, FDA, Congress, NOAA, etc.)
- **Feature gaps identified:**
  - Richer citation envelope with citation_text, citation_footnote, original_format — **now implemented in MapleSpike**
  - Python SDK — **exists** (@maplespike/sdk-python)
  - LangChain tool adapter — **exists** (get_maplespike_tools())
  - `_fields` param for token optimization — **exists** (documented in QueryOptions)
  - Zoo/Anthropic tool adapters — **not yet implemented**
  - Per-action Zod validation — **not yet implemented**
- **Status:** Katzilla API key registered, research complete. No direct feature parity gap that blocks launch.

### Pipeline-core tests breakdown (46)

The 46 pipeline-core tests exercise:
- Module registry: getModule() lookup, getModulesByCategory() filtering, runModule() dispatch, error handling for missing/malformed modules
- Constants verification: committee ID formats, URL patterns, source catalog completeness
- RSS feed fetching: parsing multiple live feeds, deduplication, hash verification
- StateCan WDS and CKAN API integration tests against live endpoints
- Citation and verification hashing SHA-256 chain integrity

---

## PHASE 6: SDK — @maplespike/sdk v0.2.0

| Feature | Status | Notes |
|---------|--------|-------|
| ✅ tsup dual build | DONE | CJS + ESM + type declarations |
| ✅ 20 domain method groups | DONE | Typed queries for every data module |
| ✅ 7 tests passing | DONE | Class, auth, query, agents |
| ✅ Changesets | DONE | GitHub Release workflow |
| ✅ Python SDK (@maplespike/sdk-python) | DONE | PyPI package |
| ✅ LangChain adapter | DONE | `get_maplespike_tools()` |
| ✅ Citation fields (citation_text, citation_footnote, original_format) | DONE | Rich citation envelope |
| 🟡 Python build backend | BROKEN | pyproject.toml needs fix |

---

## PHASE 7: FROSTBITE GAZETTE INTEGRATION — Separate Project

| Item | Priority | Effort | Notes |
|------|----------|--------|-------|
| 🔴 FG uses pipeline-core as dependency | HIGH | Low | Replace direct API calls with `@maplespike/pipeline-core` |
| 🔴 Committee evidence → story pipeline | HIGH | Medium | Auto-detect newsworthy testimony |
| 🔴 In-camera meeting alerts | HIGH | Low | Push notification when a committee meets in camera |
| 🔴 Executive statement → story pipeline | MEDIUM | Medium | CEO says something notable → article idea |
| 🔴 Lobbying spike detection | MEDIUM | Medium | Sudden increase in lobbying on a topic |
| 🔴 Sole-source contract flagging | MEDIUM | Low | Notify when non-competitive contracts are awarded |

> Frostbite Gazette is a separate project. These items track integration points, not MapleSpike core features.

---

## PHASE 8: SAAS — PUBLIC API

### Auth Stack

| Feature | Status | Effort |
|---------|--------|--------|
| ✅ API key management (CRUD) | DONE | 3 endpoints |
| ✅ JWT tokens (refresh, logout, me) | DONE | 3 endpoints |
| ✅ GitHub OAuth (interim) | DONE | 2 endpoints |
| ✅ Quota enforcement (402) | DONE | Hard cap on free |
| 🔴 Web3 auth (wallet) | TODO | 2 days |
| 🔴 Passkey auth (WebAuthn) | TODO | 3 days |
| 🔴 OIDC (Google, GitHub) | TODO | 2 days |

### Billing

| Feature | Status | Effort |
|---------|--------|--------|
| ✅ Static pricing page | DONE | Portal has Free/Pro/Business |
| 🔴 Stripe integration | TODO | 2 days |
| 🔴 Crypto payments (BTC/ETH) | TODO | 2 days |
| 🔴 Interac e-Transfer | TODO | 3 days |
| 🔴 Public signup flow | TODO | 2 days |
| 🔴 Usage dashboard (live) | TODO | 2 days |

### Pricing Tiers

| Tier | Price | Requests | Rate | Support |
|------|-------|----------|------|---------|
| Free | $0 | 1,000/mo | 30/min | Community (Discord) |
| Pro | $49/mo | 100,000/mo | 25/sec | Email |
| Business | $199/mo | 500,000/mo | 100/sec | 24h SLA |
| Enterprise | Custom | Custom | Custom | Dedicated |

---

## CLEANUP SUMMARY (This Session)

| Category | Count | Details |
|----------|-------|---------|
| Mock/stale docs deleted | 8 files | MRD.md, MVP-SCOPE.md, PRD.md, ROADMAP.md, KATZILLA_GAPS.md, features.md, NAME.md, endpoints-catalog.md |
| Mock data files deleted | 6 files | mock-data.ts (422 lines), pipeline-data.ts (63 lines), pipeline-data.json (37KB), real-committees.json (15KB), real-data.json (3KB), 6 stale logos (~4.9MB) |
| Source files rewired | 16 files | 12 MCP tools stripped of static fallback, api-client.ts, gov.ts, citation.ts, index.ts |
| Stale references purged | ~30 | Branding and naming references |
| Build errors fixed | 26 | Across 6 modules |
| Plans archived | 12 files | .hermes/plans/* and .sisyphus/plans/* marked superseded |
| Stale branches pruned | 10 | merged branches deleted |
| Old artifacts cleaned | 15+ | .d.ts files, nix-eval-cache, .devenv patches, bash/ template |

## REMAINING GAPS (Deferred)

| Gap | Severity | Notes |
|-----|----------|-------|
| 57 `as any` casts | Low | Type system cleanup, no runtime impact |
| 9 god files >800 lines | Low | Gradual refactor across modules |
| Python SDK build backend | Medium | pyproject.toml broken |
| MCP 10 pipeline-data tests | Medium | Need live API for test fixtures |
| Gitea Casdoor OAuth TLS cert | Low | Go TLS verification vs self-signed CA |
| colmena apply for permanent DNS | Low | Current DNS is bind-mount workaround |
| Dependabot alerts | Medium | 2 high, 3 moderate |
| NixOS branding references (18) | Low | Package names, SAN list, service configs |
| 16 missing agent schemas in agents.ts | Low | SDK catalog gap, not a regression |

---

## COMPLETE FILE INVENTORY

### Ingestion modules (63 total — registry.ts provides discoverable API)

**Module Registry** (`packages/pipeline-core/src/ingestion/registry.ts`):
- 63 modules in 20 categories
- `getModule(name)` — lookup by name
- `getModulesByCategory(cat)` — filter by category
- `runModule(name)` — dynamically import and run
- `runAllModules()` — run all modules

Source directories under `packages/pipeline-core/src/ingestion/`:
```
a2aj/            agriculture/    ati/            attestation/
bank-of-canada/  canlii/          cipo/           cmhc/
committees/      corporate/       corporate-filings/  cra-charity/
criminal-justice/ cross-reference/  crown-corporations/ crtc/
culture/         defence/         education-research/  elections/
federal/         federal-budget/  federal-tribunals/   fisheries/
gazette/         gc-standards/    geospatial/          gic/
global-canada/   goc-spending/    health-canada/       health-data/
immigration/     impact-assessment/  indigenous-relations/
influence/       legislation/     lmia/                media-broadcasting/
municipal/       municipal-long-tail/  ngo-influence-rss/  npri/
oversight/       proactive-disclosure/  provincial/
provincial-ckan.ts  provincial-legislatures/  provincial-lobbying/
provincial-orgs/  provincial-regulators/  real-time-feeds/
regional-authorities/  registry.ts  rss.ts  science-research/
sedi/            social-programs/   species-at-risk/   statcan/
transport-infrastructure/  unions/  universities/      veterans/
__tests__/
```

### Engine (`packages/engine/`)
```
Real implementation with drizzle-orm, better-sqlite3, zod, fuse.js.
Has 133 vitest tests and builds cleanly with source maps.
```

### MCP Server (`packages/mcp-server/`)
```
server.ts       — JSON-RPC 2.0 protocol, tools/list, tools/call, SSE
index.ts        — HTTP server on port 3001, /health, /sse, /messages
cli.ts          — stdio transport for local use
tools/
  index.ts      — Tool registry (getAllTools: 26 tools)
  query-gov-data.ts      — CKAN search across jurisdictions
  fact-check.ts           — Basic verification
  get-citation.ts         — Citation hash retrieval
  latest-releases.ts     — Recent government data
  search-committees.ts   — Committee evidence + transcripts
  search-corporate.ts    — Lobbying + procurement + exec statements
  search-influence.ts    — Influence actor data
  search-gazette.ts      — Canada Gazette records
  search-gic.ts          — GIC appointments
  search-elections.ts    — Third-party advertising
  search-provincial-lobbying.ts — Ontario lobbying
  search-oversight.ts    — OAG, PBO, Ethics, CRTC, etc.
  search-canlii.ts       — Court decisions
  search-lmia.ts         — LMIA employer data
  search-immigration.ts  — IRCC, IRB, CBSA
  search-indigenous.ts   — CIRNAC, ISC, TRC
  search-criminal-justice.ts — CSC, Parole, RCMP
  search-transport.ts    — TSB, TC, Infrastructure Canada
  search-defence.ts      — DND, VAC
  search-science.ts       — Science research
  search-tribunals.ts    — Federal tribunal data
  search-lode.ts         — LODE geospatial metadata
  ai_analyze.ts          — AI-powered analysis
  ai_ask.ts              — Natural language Q&A
  ai_search_semantic.ts  — Semantic search
  system_health.ts       — System status
```

### Schema
```
packages/pipeline-core/schema/d1.sql (1042 lines, 38 tables across all modules)
```

### Infrastructure
```
Deployment:
  K3s cluster (nginx) → Portal (static HTML/CSS/JS, no build step)
  K3s cluster   → MCP server (SSE, port 32537)
                → API server (REST, Bearer auth, port 30882)
                → Engine (CronJobs for ingestion)
                → PostgreSQL (maplespike-db)
                → Gitea (git.lan, port 30954)
                → Uptime Kuma (status.maplespike.lan, port 32007)

NixOS (zephyr/nexus):
  /etc/nixos/packages/maplespike-mcp-image.nix    — OCI image build
  /etc/nixos/overlay.nix                           — Package registration
  /etc/nixos/flake.nix                             — Flake inputs + outputs
  /etc/nixos/hosts/zephyr/caddy-routes.nix         — Caddy reverse proxy
  /etc/nixos/modules/network/cluster-dns.nix       — Unbound DNS
  /etc/nixos/modules/services/cluster-ca.nix       — TLS cert authority
```

---

## DECISION LOG

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-12 | Influence tracking added as sibling to corporate/ | Same architecture, same verification pipeline, separate concerns |
| 2026-05-12 | Corporate data module built | Lobbying + procurement + exec statements as unified module |
| 2026-05-12 | Committee evidence ingestion built | ourcommons.ca HTML → XML → parsed interventions → DB |
| 2026-05-12 | Senate committees added | 20 committees via sencanada.ca, same architecture |
| 2026-05-12 | Gazette, GIC, Elections, Provincial Lobbying, Oversight, CanLII, LMIA modules built | Expanded coverage to regulatory, judicial, and provincial data |
| 2026-05-12 | All MCP tools return real data — no more stubs | Schema-first approach: tools wired to pipeline-core DB queries |
| 2026-05-12 | .lan domains + K3s cluster over Cloudflare | Zero external cloud spend, existing infrastructure |
| 2026-05-12 | SaaS/commercial — Stripe + crypto + Interac e-Transfer billing | Billing trifecta for Canadian market |
| 2026-05-13 | Portal visual uplift applied | fade-in opacity fix, particle background, hero refined |
| 2026-05-13 | Modular architecture over monolith | 11 packages, clear interface boundaries |
| 2026-05-13 | CI/CD: ci.yml + deploy.yml + deploy-k3s | Auto-build, auto-test, auto-deploy pipeline |
| 2026-05-14 | Ingestion barrel refactored: 1707→91 lines | Module registry (registry.ts) with 63 modules |
| 2026-05-14 | 15 generated .d.ts files removed from engine/src | Build artifacts committed to source |
| 2026-05-14 | MCP data access unified through api-client.ts | pipeline-data.ts reduced 340→60 lines as thin re-export |
| 2026-05-14 | Gitea deployed with Casdoor OAuth SSO | Self-hosted Git with SSO, Actions CI, NFS-backed repos |
| 2026-05-14 | Uptime Kuma deployed | Status monitoring for all .lan services |
| 2026-05-14 | All mock/placeholder data purged | 6 data files deleted, 16 source files rewired, zero fake fallbacks |
| 2026-05-14 | All branding purged | Code, docs, DNS, K8s — zero remaining references |
| 2026-05-14 | Subagent model configs unified | All 14 subagents switched to opencode-go/deepseek-v4-flash |
| 2026-05-14 | Docs consolidated (8→3 files) | MRD, MVP-SCOPE, PRD merged into single ARCHITECTURE.md |
| 2026-05-14 | Portal nav standardized across all 13 pages | Identical bracket-style nav, no variant link orders |
| 2026-05-14 | Anti-grid brutalism design for landing page | Terminal-style API code demo replaces bento-card grid — the code IS the illustration |
| 2026-05-14 | All mock/placeholder data purged from portal pages | 5 page areas had hardcoded stats; replaced with live API calls or honest empty states |
| 2026-05-14 | Citation envelope enriched to Katzilla parity | Added citation_text, citation_footnote, original_format — ready-to-paste strings for AI agents |
| 2026-05-14 | Katzilla competitive research completed | Deep-dive comparison — feature gaps identified for future build (Anthropic adapter, Zod validation) |
| 2026-05-14 | Dev/prod CI/CD branching established | main→dev (deploy-dev.yml), prod→prod (deploy.yml), :dev / :latest image tags |
| 2026-05-14 | Pricing toggle + featured tier | Annual/monthly billing toggle (Save 17%), Pro "BEST VALUE" card with scale(1.02) glow |
| 2026-05-14 | Dashboard glass sidebar | backdrop-filter blur glassmorphism sidebar with quick-glance metrics |
|| 2026-05-14 | MCP showcase section added | Tabbed config samples (curl, TypeScript, Python, JSON) with copy-to-clipboard |
|| 2026-05-14 | Scroll-reveal animations across landing page | Intersection Observer-based reveal on 8 sections, 29 data-reveal attributes |

---

## PHASE 9: AGENT SECURITY FIREWALL — Hermes Agent Defense Architecture

> **Context:** Multi-layer security for the Hermes AI agent ecosystem. Defends against prompt injection, memory poisoning, data exfiltration, and supply-chain attacks. Aligns with OWASP LLM01:2025 (Prompt Injection), LLM05:2025 (Improper Output Handling), LLM06:2025 (Excessive Agency), and LLM03:2025 (Supply Chain).
> **Threat model:** State-level adversaries + automated prompt injection at scale.
> **Principle:** Don't try to detect attacks — design the system so attacks have bounded impact even when they succeed.

| Phase | Component | OWASP Cross-Ref | Status | Effort |
|-------|-----------|-----------------|--------|--------|
| 9a | Trust Context Tracker | LLM01:2025 (#6) — Segregate external content | 🟡 PARTIAL | 2-3 days |
| 9b | Memory Guardian | OWASP MCP Guide — Memory poisoning | 🟡 PARTIAL | 1-2 days |
| 9c | Action Gate | LLM06:2025 — Excessive Agency | 🟡 PARTIAL | 2-3 days |
| 9d | Secret Redaction | LLM05:2025 — Improper Output Handling | 🟡 PARTIAL | 1 day |
| 9e | Network Egress Control | OS-level defense (NixOS) | 🔴 TODO | 1-2 days |
| 9f | Audit & Monitoring | LLM06:2025 — Oversight | 🟡 PARTIAL | 2-3 days |
| 9g | Sandbox Escalation | OS-level defense (microVM) | 🔴 TODO | 3-5 days |
| 9h | MCP Server Hardening | OWASP MCP Server Guide | 🔴 TODO | 1-2 days |
| 9i | Supply Chain Verification | LLM03:2025 — Supply Chain | 🔴 TODO | 1 day |
| 9j | OWASP Threat Model Mapping | All categories | 🔴 TODO | Pre-build step |

### Phase 9a: Trust Context Tracker (Priority 1)

**Goal:** Every piece of information in the agent's context is tagged with provenance (USER / SYSTEM / AGENT / EXTERNAL_WEB / EXTERNAL_GIT / EXTERNAL_MAIL). This is the foundation for all other layers.

| Item | Status | Notes |
|------|--------|-------|
| 🟡 Provenance type system | ✅ DONE | TrustContext, Provenance, TrustLevel, RiskLevel enums |
| 🟡 Per-session context tracking | ✅ DONE | SessionTrustState with active provenances, global session registry |
| 🟡 Trust decay logic | ✅ DONE | call_count_since_external tracking, automatic MEDIUM recovery after 3 calls |
| 🔴 Provenance propagation to subagents | TODO | Subagents inherit parent's trust level |
| 🟡 `hermes security` CLI | ✅ DONE | status, sessions, session, audit, trust-context subcommands |
| 🔴 Provenance tagging on memory::add | TODO | Tag memory entries with source provenance |

### Phase 9b: Memory Guardian (Priority 2)

**Goal:** Prevent persistent memory poisoning. Memory writes that are directives/instructions from external sources get quarantined or blocked.

| Item | Status | Notes |
|------|--------|-------|
| 🟡 Content classification (FACT vs INSTRUCTION) | ✅ DONE | Pattern-based classifier, 20+ instruction patterns, FACT/PREFERENCE support |
| 🟡 Instruction-from-EXTERNAL blocking | ✅ DONE | check_memory_write() blocks INSTRUCTION from EXTERNAL/LOW sources |
| 🔴 Provenance tagging on memory entries | TODO | Every entry stores source, session ID, context hash |
| 🔴 Session-start memory diff | TODO | Show what changed since last session |
| 🔴 TTL enforcement | TODO | EXTERNAL = 30d, AGENT = 90d, USER = indefinite |

### Phase 9c: Action Gate (Priority 3)

**Goal:** Intercept every tool call and enforce risk-based confirmation rules.

| Item | Status | Notes |
|------|--------|-------|
| 🟡 Tool risk classification | ✅ DONE | 150+ tools classified GREEN/YELLOW/RED/BLACK |
| 🟡 Read→write sequence detection | ✅ DONE | Implicit — EXTERNAL read drops trust, next RED/YELLOW blocked |
| 🟡 Gate intercept middleware | ✅ DONE | pre_tool_call hook fires before every tool execution |
| 🔴 Confirmation UI | TODO | Show trust context + risk level + allow/block/allow-session |
| 🔴 Configurable per-skill overrides | TODO | Skills declare `security: { maxRiskLevel }` |
| 🔴 "Panic mode" toggle | TODO | `hermes security panic` |

### Phase 9d: Secret Redaction (Priority 4)

**Goal:** Prevent data exfiltration by ensuring the model never receives sensitive data in tool outputs.

| Item | Status | Notes |
|------|--------|-------|
| 🟡 Pattern matchers | ✅ DONE | API keys, JWT tokens, SSH keys, GitHub tokens, AWS keys, connection strings, internal IPs |
| 🟡 Tool output interception | ✅ DONE | transform_terminal_output hook, output/terminal/file redaction functions |
| 🔴 Redaction logging | TODO | Log what was redacted |
| 🟡 Configurable allowlist | ✅ DONE | Internal IPs preserved for cluster-status context; config files preserve IPs |

### Phase 9e: Network Egress Control (Priority 5)

**Goal:** Compromised agent can't exfiltrate data because the network won't let it.

| Item | Status | Notes |
|------|--------|-------|
| 🔴 Agent network namespace | TODO | Hermes runs in dedicated netns |
| 🔴 Egress whitelist | TODO | github.com, nexus:5000, kubernetes API, SearXNG, gateway |
| 🔴 nftables/iptables rules | TODO | NixOS module for agent network restrictions |
| 🔴 Block DNS tunneling | TODO | Restrict nameserver to cluster DNS only |

### Phase 9f: Audit & Monitoring (Priority 6)

**Goal:** Append-only audit trail of every tool call and its trust context. Grafana dashboard for anomaly detection.

| Item | Status | Notes |
|------|--------|-------|
| 🟡 SQLite audit log | ✅ DONE | Append-only at ~/.hermes/agent-firewall/audit.db — gate decisions, redactions, trust changes |
| 🔴 Grafana dashboard | TODO | Call rate, rejection rate, provenance distribution, anomaly scores |
| 🔴 Anomaly detection rules | TODO | Spike in YELLOW/RED calls, too much EXTERNAL provenance |
| 🔴 Alerting | TODO | Prometheus alerts for repeated BLOCKED actions |

### Phase 9g: Sandbox Escalation (Priority 7)

**Goal:** Subagents run in microVMs with no host access.

| Item | Status | Notes |
|------|--------|-------|
| 🔴 Default microVM for subagents | TODO | Using microsandbox skill |
| 🔴 Restricted securityContext | TODO | No hostPath mounts, read-only root, no privilege escalation |
| 🔴 Reduced capabilities for EXTERNAL-trusted subagents | TODO | File writes disabled, network restricted |

### Phase 9h: MCP Server Hardening (Priority 8)

**Goal:** Harden all MCP servers we operate against tool poisoning and tool interference.

| Item | Status | Notes |
|------|--------|-------|
| 🔴 Tool argument validation | TODO | Validate all inputs before processing |
| 🔴 Rate limiting per client | TODO | Prevent tool call flooding |
| 🔴 Session isolation | TODO | Separate state per session |
| 🔴 Output sanitization | TODO | Sanitize outputs before returning to agent |

### Phase 9i: Supply Chain Verification (Priority 9)

**Goal:** Ensure tools and dependencies haven't been tampered with.

| Item | Status | Notes |
|------|--------|-------|
| 🔴 Container image digest pinning | TODO | All K8s images use sha256: digest |
| 🔴 MCP server integrity checks | TODO | SHA-256 of binaries at startup |
| 🔴 Model weight verification | TODO | Verify SHA-256 of weights before loading |

### Phase 9j: OWASP Threat Model Mapping (Pre-build)

**Goal:** Map every security control to the specific OWASP category it addresses.

| Item | Status | Notes |
|------|--------|-------|
| 🔴 OWASP category mapping per phase | TODO | Each control cross-referenced to LLM01-10 |
| 🔴 Compliance dashboard | TODO | Grafana panel showing coverage across categories |
| 🔴 Penetration testing framework | TODO | Simulate known injection patterns against own defenses |

### Research Findings (May 15, 2026)

| Source | Type | Key Finding |
|--------|------|-------------|
| OWASP LLM01:2025 Prompt Injection | Guide | "Segregate and identify external content" is Mitigation #6 — validates trust context tracker |
| OWASP LLM06:2025 Excessive Agency | Guide | Tool risk classification directly addresses agency control |
| OWASP Agentic Security Initiative | Working Group | Dedicated sub-group producing MCP-specific security guidance |
| OWASP MCP Server Development Guide | Guide | Tool poisoning, memory poisoning, tool interference are top MCP-specific threats |
| OWASP Third-Party MCP Cheat Sheet v1.0 | Cheat Sheet | Recommends least-privilege and human-in-the-loop for MCP servers |
| Greshake et al. (2023) | Paper | External content can act as "arbitrary code execution" on LLM agents |
| No existing open-source solution | Landscape | ~40 vendors focus on prompt filtering — none do provenance-based action gating |

### Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-15 | Trust context tracker first — all other phases depend on it | Foundation for provenance-based action gating |
| 2026-05-15 | Memory Guardian moved up to priority 2 | OWASP calls out memory poisoning as primary MCP threat |
| 2026-05-15 | OWASP alignment for all phases | Industry standard — provides compliance framework |
| 2026-05-15 | MCP Server Hardening added as dedicated phase | OWASP MCP Security Guide provides specific controls |
| 2026-05-15 | SQLite for audit (not JSONL or syslog) | Queryable, append-only, no binary format drift, built into Python stdlib |
| 2026-05-15 | Threat-local storage for session context | Thread-local avoids modifying tool hook signatures across all Hermes tools |
| 2026-05-15 | Agent Firewall implemented (Phase 9a-9d) | Plugin at plugins/agent-firewall/ — trust context, action gate, memory guardian, secret redaction all functional |
| 2026-05-15 | Agent Firewall registered as bundled backend | Auto-loads on every Hermes session — no manual enable required |
| 2026-05-15 | `hermes security` CLI command added | Status, sessions, audit, trust-context, panic, redactions subcommands |
| 2026-05-15 | Panic mode implemented | `hermes security panic` — levels up all risk classifications |
| 2026-05-15 | SQLite audit database | Durable append-only log at ~/.hermes/agent-firewall/audit.db |
| 2026-05-15 | Redaction audit logging | Every secret redaction logged with pattern name, tool, session |
|| 2026-05-15 | Thread-local session context | `get_current_session_id()` — TLS shared between pre/post/transform hooks |
| 2026-05-17 | Three-tier licensing: AGPL core / Apache-2.0 interface / MIT client | Protects ingestion moat (AGPL network clause), drives API/MCP adoption (Apache-2.0 patent grant), zero-friction SDK (MIT). Commercial license path for enterprise. See [LICENSE.md](./LICENSE.md). |
| 2026-05-17 | CLA required for all external contributions | Enables commercial re-licensing for MapleSpike Enterprise License — standard dual-license pattern (MongoDB, GitLab, Grafana) |
| 2026-05-17 | Data vs. code license separation | Source data = OGL-Canada (always free). Code = three-tier. Derived outputs inherit data freedom. |

### Agent Firewall File Inventory

Plugin at `~/.hermes/hermes-agent/plugins/agent-firewall/`:

```
agent-firewall/
  plugin.yaml             — Manifest: name, kind=backend, hooks declaration
  __init__.py             — Plugin entry: register() registers 3 hooks
  trust_context.py        — Trust Context Tracker + Action Gate + Audit + SecurityCLI
  memory_guardian.py      — Memory content classification + write gate
  secret_redaction.py     — Pattern matchers for 8 secret types + redaction engine
```

CLI command at `~/.hermes/hermes-agent/hermes_cli/main.py`:

```
  cmd_security()          — "hermes security" subcommand handler
  security_parser         — Argument parser with 5 subcommands
```

**Architecture:** The plugin uses Hermes' built-in `pre_tool_call`, `post_tool_call`, and `transform_terminal_output` hooks. Every tool call is intercepted before execution — trust context updated, action gate checked, block directive returned if restricted.

**Hook wiring:**
- `pre_tool_call` → `trust_context.SessionTrustState` tracking + `check_action_gate()` (GREEN/YELLOW/RED/BLACK enforcement)
- `post_tool_call` → `memory_guardian.check_memory_write()` (future: memory classification)
- `transform_terminal_output` → `secret_redaction.redact_terminal_output()` (API keys, SSH keys, JWT, etc.)

**Verification:** All unit tests passed: 20 trust context assertions, 10 memory guardian assertions, 10 secret redaction assertions. Plugin auto-loads, all 3 hooks register, action gate blocks untrusted RED/YELLOW tools, secret redaction strips API keys from terminal output.
