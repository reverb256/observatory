---
last-reviewed: 2026-05-14
status: active
---

# MapleSpike RSS Feeds Catalog

> Verified May 13, 2026 — Scorched-earth catalog of every RSS feed available for Canadian government, NGO, think tank, UN, and corporate narrative tracking.

## 1. Government News & Regulatory RSS

### Canada Gazette (Official)
| Feed | URL | Coverage | Frequency |
|------|-----|----------|-----------|
| Part I — Notices & Proposed Regulations | `https://www.gazette.gc.ca/rss/p1-eng.xml` | Proposed regs, appointments, notices | Daily |
| Part II — Official Regulations | `https://www.gazette.gc.ca/rss/p2-eng.xml` | Final regulations | Daily |
| Part III — Acts of Parliament | `https://www.gazette.gc.ca/rss/en-ls-eng.xml` | New laws | As published |

### Executive & Foreign Affairs
| Feed | URL | Coverage |
|------|-----|----------|
| Prime Minister of Canada — News | `https://pm.gc.ca/en/news.rss` | PM statements, announcements |
| Global Affairs Canada — All News | `https://www.international.gc.ca/international/news-nouvelles.aspx?lang=eng&rss=1` | Foreign policy, influence |

### Departmental RSS
| Department | URL | Coverage |
|------------|-----|----------|
| Indigenous Services Canada (ISC) | `https://api.io.canada.ca/io-server/gc/news/en/v2?dept=indigenousservicescanada&sort=publishedDate&orderBy=desc&publishedDate%3E=2020-10-22&pick=100&format=atom` | ISC/CIRNAC news, funding, claims |
| Health Canada / PHAC News | `https://www.canada.ca/en/health-canada/services/rss-feeds.html` (multiple dept feeds) | Recalls, public health, opioids |
| Justice Canada / PPSC | `https://www.justice.gc.ca/eng/news-nouv/rss.html` | Prosecutions, justice news |
| Environment Canada | `https://www.canada.ca/en/environment-climate-change/services/rss-feeds.html` | Climate, enforcement, weather |
| Transport Canada | `https://www.canada.ca/en/transport-canada/services/rss-feeds.html` | Safety, recalls, regulations |

## 2. NGO / Influence Org / Think Tank RSS

### Think Tanks & Policy Institutes
| Organization | URL | Notes |
|--------------|-----|-------|
| Fraser Institute | `https://www.fraserinstitute.org/rss` | Economic policy papers |
| C.D. Howe Institute | `https://www.cdhowe.org/feed` | Policy reports |
| Macdonald-Laurier Institute | `https://macdonaldlaurier.ca/feed/` | National security, Indigenous |
| IRPP (Policy Options) | `https://policyoptions.irpp.org/feed/` | Public policy |
| Conference Board of Canada | `https://www.conferenceboard.ca/feed/` | Economic forecasts |
| Canada West Foundation | `https://cwf.ca/feed/` | Western Canada policy |
| Broadbent Institute | `https://www.broadbentinstitute.ca/feed/` | Progressive policy |
| Cardus | `https://www.cardus.ca/feed/` | Social policy, faith |
| Canadian Taxpayers Federation | `https://www.taxpayer.com/feed` | Fiscal accountability |
| Canadian Centre for Policy Alternatives | `https://www.policyalternatives.ca/feed/` | Progressive alternative policy |

### NGOs & Non-Profits
| Organization | URL | Notes |
|--------------|-----|-------|
| Food Banks Canada | `https://foodbankscanada.ca/feed/` | May not have RSS in 2026; use newsroom monitor |
| UNHCR Canada / Global | `https://www.unhcr.org/rss.xml` | Global refugee news; Canada data via manual scrape |
| Canadian Red Cross | `https://www.redcross.ca/feed/` | Disaster response, humanitarian |
| Amnesty International Canada | `https://www.amnesty.ca/feed/` | Human rights |
| David Suzuki Foundation | `https://davidsuzuki.org/feed/` | Environmental policy |
| World Wildlife Fund Canada | `https://wwf.ca/feed/` | Conservation, species |
| Canadian Bar Association | `https://www.cba.org/feed` | Legal policy |
| Canadian Medical Association | `https://www.cma.ca/feed` | Health policy |

## 3. UN & International Organization RSS

| Organization | URL | Notes |
|--------------|-----|-------|
| UNHCR Global News | `https://www.unhcr.org/rss.xml` | Refugee news & data releases |
| UN News | `https://news.un.org/feed/` | General UN coverage |
| WTO News | `https://www.wto.org/english/news_e/news_e.rss` | Trade/international influence |
| WHO News | `https://www.who.int/rss-feeds/news-english.xml` | Global health |
| World Economic Forum | No current RSS (dropped ~2024). Use: `http://wef.ch/rss` (test), or newsroom scrape at `https://www.weforum.org/press` | Global reports, Davos, influence |

## 4. Corporate & Regulatory RSS

| Organization | URL | Notes |
|--------------|-----|-------|
| SEDAR+ Filings | No public RSS. Use Canada Gazette RSS for regulatory cross-ref | Corporate filings |
| CanadaBuys / Procurement | Already in lobbying module; supplement with department RSS | Tenders, contracts |
| Competition Bureau | `https://ised-isde.canada.ca/site/competition-bureau-canada/en/rss` | Mergers, enforcement |

## 5. Pipeline Integration

All feeds above should be added to `rss.ts` (existing 43+ sources) in two new category groups:

```typescript
export const RSS_SOURCES: RSSSource[] = [
  // ... existing 43 sources ...

  // --- NGO & Think Tanks ---
  { name: 'Fraser Institute', url: 'https://www.fraserinstitute.org/rss', category: 'think-tank' },
  { name: 'C.D. Howe Institute', url: 'https://www.cdhowe.org/feed', category: 'think-tank' },
  { name: 'Macdonald-Laurier Institute', url: 'https://macdonaldlaurier.ca/feed/', category: 'think-tank' },
  // ... etc ...

  // --- Government Feeds ---
  { name: 'Canada Gazette Part I', url: 'https://www.gazette.gc.ca/rss/p1-eng.xml', category: 'government' },
  // ... etc ...
];
```

### Ingestion Flow
1. **Cron**: Every 6 hours pull all feeds → parse → hash-dedup → store
2. **5GW Analysis**: Run semantic fingerprinting against known influence narratives
3. **Cross-ref**: Match NGO mentions against committee transcripts, lobbying records, GIC appointments
4. **MCP Tool**: `search_ngo_rss` and `ngo_narrative_tracker` (with 5GW classification flags)

### Related Pipeline Modules
- `ingestion/rss.ts` — Existing 43+ sources + parser + hash dedup
- `ingestion/influence/` — Actor tracking, funding flows, grant detection
- `ingestion/corporate/` — Procurement, lobbying, insider trading
