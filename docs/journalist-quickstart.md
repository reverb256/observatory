---
last-reviewed: 2026-05-18
status: active
---

# MapleSpike — Journalist Quickstart

> **Access Canadian government data through MCP tools. No more scraping portals or waiting on ATI.**
>
> MapleSpike is a **public API service** (self-hosted on K3s, open-source core). Access via MCP, REST API, SDK. Free tier available — no credit card required.

---

## Quick Intro

MapleSpike ingests **65 data modules** of Canadian government data — House of Commons and Senate committees, federal lobbying, procurement, Canada Gazette, GIC appointments, provincial lobbying registries, Elections Canada third-party advertising, oversight bodies (OAG, PBO, Ethics Commissioner, Competition Bureau, CRTC), CanLII court decisions, LMIA data, immigration data, defence, criminal justice, health, education, and more.

Every record includes SHA-256 citation hashes for independent verification.

---

## Access Methods

### 1. MCP Server (Recommended)

The MapleSpike MCP server exposes **24 tools** for AI agents. All return real data from live databases.

**Configure Claude Desktop (public when available):**

```json
{
  "mcpServers": {
    "maplespike": {
      "url": "https://mcp.maplespike.ca/sse"  <!-- Replace with actual public endpoint -->
    }
  }
}
```

**All MCP tools are live and return real data:**

| Tool | Description |
|------|-------------|
| `query_gov_data` | Query government data by keyword/jurisdiction |
| `fact_check` | Check a claim against official data |
| `get_citation` | Retrieve and verify SHA-256 citation hash |
| `latest_releases` | Recent government data releases |
| `search_committees` | Full-text committee intervention search — 50 HoC + Senate committees |
| `search_corporate` | Lobbying + procurement search |
| `search_influence` | Influence actor investigation (32 tracked actors) |
| `search_gazette` | Canada Gazette regulation search (Parts I, II) |
| `search_gic` | GIC appointment lookup |
| `search_elections` | Elections Canada third-party advertiser search |
| `search_provincial_lobbying` | All 13 provinces/territories lobbying registry search |
| `search_oversight` | OAG/PBO/Ethics/Competition Bureau/CRTC search |
| `search_canlii` | Court decision search via CanLII |
| `search_lmia` | LMIA quarterly data search |
| `search_immigration` | IRCC, IRB, CBSA immigration data |
| `search_science` | Science and research data |
| `search_tribunals` | Federal tribunal decisions |
| `search_lode` | Open Database of Addresses geospatial data |
| `search_ngo_rss` | NGO/think tank RSS feed search — monitor 31 tracked organizations |
| `search_veterans` | Defence/veterans data — DND personnel, procurement |
| `ai_ask` | Natural language Q&A across all datasets |
| `ai_analyze` | AI-powered data analysis |
| `ai_search_semantic` | Semantic search across datasets |
| `system_health` | System health and usage metrics |

### 2. REST API

**Public endpoint (when deployed):**

```bash
# Search government data releases
curl -H "Authorization: Bearer <your-key>" \
  "https://api.maplespike.ca/v1/gov/releases?jurisdiction=federal&category=spending&limit=10"
```

**Note**: For local/self-hosted clusters, use your internal `.lan` or NodePort URL.

### 3. CLI (Local Development)

```bash
# Clone and build
git clone <repo-url>
cd maplespike
pnpm install
pnpm run build

# Run MCP server locally via stdio
cd packages/mcp-server
pnpm start
```

---

## Five Queries Every Canadian Journalist Should Run

### 1. Find Recent Committee Meetings on a Topic

**Ask your AI agent:** *"Search committee transcripts for recent mentions of housing policy"*

Uses `search_committees` to find interventions across all 50 committees (30 HoC + 20 Senate). Returns speaker, party, riding, date, and transcript excerpts.

### 2. Track Lobbying Activity Around a Bill

**Ask your AI agent:** *"Search for lobbying records related to Bill C-27"*

Uses `search_corporate` to query the federal lobbying registry — who's lobbying whom about what.

### 3. Find Sole-Source Contracts by Department

**Ask your AI agent:** *"Find sole-source contracts awarded by Department of National Defence in the last quarter"*

Uses `search_corporate` with the `isSoleSource()` flag.

### 4. Investigate an Organization's Influence Footprint

**Ask your AI agent:** *"Search for all data on the influence activity of the Fraser Institute"*

Uses `search_influence` to find committee appearances, lobbying, funding, and CRA charity status.

### 5. Verify a Data Point by Citation Hash

**Ask your AI agent:** *"Verify citation cit-001 and show the verification command"*

Uses `get_citation` to retrieve the SHA-256 hash and verify data integrity.

---

## Citation Verification

Every record includes a SHA-256 content hash. Verify data integrity from any terminal:

```bash
# Get citation details
curl -H "Authorization: Bearer <your-key>" \
  "https://api.maplespike.ca/v1/citation/cit-001"
```

---

## Attribution Requirements

All responses using Canadian government data include OGL-C attribution:

> *"Contains information licensed under the Open Government Licence – Canada."*

When publishing stories based on MapleSpike data, include this attribution.

---

## What's NOT Available (Not Yet Built)

- Public signup / developer portal with self-serve API key generation
- Usage dashboard or billing portal
- Web-based API explorer (Swagger UI)
- Journalism mode with editorial overrides
- Email notifications / alerting
- Shareable citation pages (human-readable HTML)

---

## Need Help?

- **Repo:** [https://github.com/reverb256/maplespike](https://github.com/reverb256/maplespike)
- **Docs:** See [README.md](../README.md) and [ROADMAP.md](../ROADMAP.md)
- **MCP configuration:** See `packages/mcp-server/README.md`
