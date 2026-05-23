---
last-reviewed: 2026-05-14
status: active
---

# MapleSpike — Ultra Grandmaster Comprehensive Master Endpoints Catalog

> Scorched-Earth "Library of Alexandria" Edition — Verified May 13, 2026
> Every free/public data endpoint, API, RSS feed, and dataset for Canadian open data ingestion.

## Master Discovery Layers (Primary Ingestion Routes)

| Layer | URL | Notes |
|-------|-----|-------|
| Open Canada CKAN API v3 (package_list) | `https://open.canada.ca/data/en/api/3/action/package_list` | 47k+ datasets, federated index |
| CKAN package_show | `https://open.canada.ca/data/en/api/3/action/package_show?id=DATASET_ID` | Metadata + resource URLs |
| CKAN resource_show | `https://open.canada.ca/data/en/api/3/action/resource_show?id=RESOURCE_ID` | Individual file metadata |
| StatCan WDS — All Cubes List | `https://www150.statcan.gc.ca/t1/wds/rest/getAllCubesList` | Time-series discovery |
| StatCan WDS — Full Table CSV | `https://www150.statcan.gc.ca/t1/wds/rest/getFullTableDownloadCSV/{cubeId}` | Direct CSV download |
| StatCan WDS — Cube Metadata | `https://www150.statcan.gc.ca/t1/wds/rest/getCubeMetadata` | Cube dimensions & attributes |
| StatCan SDMX REST | `https://www150.statcan.gc.ca/t1/wds/sdmx/statcan/rest/data/` | Structured time-series |
| LODE Geospatial (Buildings/Addresses) | open.canada.ca ⇒ search "LODE" | GeoPackage/CSV downloads |

## 1. Immigration & Borders

### Permanent Residents
- **CKAN Dataset**: `f7e5498e-0ad8-4417-85c9-9b8aff9b9eda`
- **Direct CSVs**: ODP-PR-PT_IMMCAT.csv, ODP-PR-Citz.csv, ODP-PR-PT_CMA.csv, ODP-PR-PT_NOC4.csv (20+ variants)
- **Frequency**: Monthly
- **MCP Tool**: `/tools/ircc_permanent_residents`
- **Status**: ✅ Module Built

### Temporary Residents / Study Permits
- **CKAN Dataset**: `90115b00-f9b8-49e8-afa3-b4cff8facaee`
- **Direct CSVs**: ODP-TR-Study-IS_CITZ.csv, ODP-TR-Study-IS_PT_study.csv, ODP-TR-Study-IS_PT_gender.csv, ODP-TR-Study-DLI_name_PT_Admin_type.csv (15+ variants)
- **Frequency**: Monthly

### TFWP / LMIA
- **CKAN Dataset**: `e8745429-21e7-4a73-b3f5-90a779b78d1e`
- **CSVs**: Multiple NOC/skill/province files
- **Frequency**: Quarterly

### Operational Processing / Citizenship / Sponsorship / PNP
- **CKAN Dataset**: `9b34e712-513f-44e9-babf-9df4f7256550`
- **Content**: Visas, citizenship, sponsorship, PNP, Start-up Visa
- **Frequency**: Monthly XLSX/CSV

### Asylum Claimants / Settlement / Refugee Locations
- **CKAN Dataset**: `b6cbcf4d-f763-4924-a2fb-8cc4a06e3de4`
- **CSVs**: Office type, age, gender, province

### IRB RPD Decisions
- **CKAN Dataset**: `6e47f705-71ed-41f0-8fd5-d1a8508a3b63`
- **Content**: 100+ quarterly CSV files
- **Status**: ✅ Module Built

### CBSA Enforcement / Removals / Ports
- **Source**: `https://www.cbsa-asfc.gc.ca/agency-agence/reports-rapports/security-securite/removals-renvois-eng.html`
- **Content**: HTML tables + quarterly stats
- **Status**: ✅ Module Built

## 2. Indigenous Relations

### CIRNAC Land Claims / Specific Claims
- **Source**: `https://services.aadnc-aandc.gc.ca/scbri_e/main/reportingcentre/external/externalreporting.aspx` + interactive map
- **Format**: HTML/API

### ISC Community Infrastructure / Funding
- **GeoPackage/WFS**: Via `https://data.sac-isc.gc.ca/geomatics/` (ESRI REST/WMS)
- **CKAN Dataset**: Search `owner_org=indigenous-services-canada`

### FNFTA Financial Transparency
- **Portal**: `https://fnp-ppn.aadnc-aandc.gc.ca/fnp/Main/Search/SearchFF.aspx`
- **Format**: Per-community PDF statements

### TRC / MMIWG Progress
- **Source**: `https://www.rcaanc-cirnac.gc.ca/eng/1524494530110/1557511412801`
- **Format**: PDF reports + tables

## 3. Criminal Justice & Corrections

### Corrections / Parole / RCMP / PPSC
- **Primary**: StatCan WDS cubes (search `getAllCubesList` for prison population, crime stats)
- **Parole Board Registry**: `https://www.canada.ca/en/parole-board/services/decision-registry.html`
- **CKAN Dataset**: owner_org=correctional-service

## 4. Transport Safety & Infrastructure

### TSB Occurrences
- **Source**: `https://www.tsb.gc.ca/eng/stats/`
- **Content**: 5-table CSV sets (air/rail/marine/pipeline)
- **Frequency**: Monthly

### Canada Infrastructure Bank
- **Source**: `https://cib-bic.ca/en/investments/`

## 5. Defence & Veterans

### DND/CAF Personnel
- **CKAN**: owner_org=dnd-mdn on open.canada.ca
- **Content**: Regular Force by rank, intake, promotions CSV

### Procurement
- **Source**: PSPC proactive disclosure CKAN

### Veterans Affairs
- **CKAN Dataset**: `460aa2e0-5a37-47cf-a858-98b4327d29de`
- **VAC Facts & Figures**: `bbc93ab8-3a92-44bd-a7e4-cb9cc40edeb3`

## 6. Health (Deep)

### CIHI Wait Times / ED Visits / Outcomes
- **NACRS ED Tables**: `https://www.cihi.ca/sites/default/files/document/emergency-department-visits-apr-sep-2025-provisional-data-tables-en.xlsx`
- **Priority Procedures**: XLSX series
- **Format**: Direct XLSX downloads

### PHAC / CFIA / PMPRB
- **CKAN**: owner_org=phac-aspe, search health-canada

## 7. Education & Research

### Tri-Council Grants
- **CKAN**: owner_org=cihr / nserc / sshrc
- **Content**: All grant data CSV

### Canada Research Chairs
- **CKAN**: Search open.canada.ca for "research chairs"

### Student Loans
- **CKAN**: owner_org=esdc, search "student loans"

## 8. Social Programs

### CPP / EI / OAS / GIS / CCB
- **Primary**: StatCan WDS cubes
- **CKAN**: owner_org=esdc

### CPP Investment Board
- **Source**: Annual reports (PDF)

## 9. Federal Spending (Deep)

### Transfer Payments / Consulting / Real Property
- **CKAN**: Finance Canada + PSPC proactive disclosure + Treasury Board

## 10. Provincial Governments (All 13) — Detailed

All use CKAN `/api/3/action/package_list` pattern. Dataset counts verified May 2026.

| Province | Portal URL | CKAN API Base | Approx. Datasets | Key Provincial Orgs |
|----------|------------|---------------|------------------|---------------------|
| Ontario | https://data.ontario.ca | `https://data.ontario.ca/api/3/action/package_list` | ~2,948 | AG, OSC (securities), WSIB, OEB, sunshine list |
| British Columbia | https://catalogue.data.gov.bc.ca | `https://catalogue.data.gov.bc.ca/api/3/action/package_list` | Thousands | AG, BCSC, WorkSafeBC, BCUC |
| Alberta | https://open.alberta.ca | `https://open.alberta.ca/api/3/action/package_list` | 33,335+ | AG, ASC, WCB, AUC |
| Saskatchewan | https://catalogue.saskatchewan.ca | `https://catalogue.saskatchewan.ca/api/3/action/package_list` | Hundreds | AG, FCAA (securities), WCB, SaskEnergy |
| Manitoba | https://data.gov.mb.ca | `https://canwin-datahub.ad.umanitoba.ca/data/api/3/action/package_list` | Hundreds | AG, MSC (securities), WCB, PUB |
| Quebec | https://donneesquebec.ca | `https://donneesquebec.ca/api/3/action/package_list` | Thousands | AG, AMF (securities), CNESST, Régie de l'énergie |
| New Brunswick | https://data.gnb.ca | CKAN (via open.canada.ca federation) | Hundreds | AG, WCB NB |
| Nova Scotia | https://data.novascotia.ca | `https://data.novascotia.ca/api/3/action/package_list` | 752+ | AG, NS Securities Commission, WCB |
| Prince Edward Island | https://data.princeedwardisland.ca | CKAN pattern | Hundreds | AG, WCB PEI |
| Newfoundland & Labrador | https://opendata.gov.nl.ca | CKAN pattern | Hundreds | AG, WCB NL |
| Yukon | https://data.yukon.ca | CKAN pattern | Hundreds | AG |
| Northwest Territories | https://opendata.gov.nt.ca | CKAN pattern | Hundreds | AG |
| Nunavut | Via open.canada.ca federation | Federal CKAN | Limited | AG |

### Provincial Organizations — Data Available via CKAN Portals
| Organization Type | Examples | How to Find |
|-------------------|----------|-------------|
| Auditor General | ON, BC, AB, QC, etc. | Search "Auditor General" or "value-for-money audits" in portal |
| Securities Commissions | OSC, BCSC, ASC, AMF, etc. | Search commission name + "disciplinary" or "decisions" |
| Workers' Compensation | WSIB (ON), WorkSafeBC, WCB AB, etc. | Via AWCBC (awcbc.org) + individual portals |
| Energy Regulators | OEB, BCUC, AUC, Régie de l'énergie | Search "decisions" or "proceedings" in portal |
| Sunshine Lists | ON, BC, AB (public sector salaries) | Search "sunshine list" or "public sector salaries" |
| Lobbying Registries | ON, BC, AB, QC | Dedicated registry portals + CKAN exports |
| Human Rights Tribunals | All provinces | Search "human rights tribunal decisions" |

## 11. Municipal (Top-30+ Cities) — Detailed

All major cities use CKAN or Socrata with `/api/3/action/package_list`.

| City | Portal | Key Datasets |
|------|--------|--------------|
| Toronto | https://open.toronto.ca | Council votes, campaign finance, zoning/permits, TTC ridership, police board |
| Vancouver | https://opendata.vancouver.ca | Council minutes, developer donations, building permits, TransLink |
| Montreal | https://donnees.montreal.ca | Council, zoning, STM transit |
| Calgary | https://data.calgary.ca | Council, budget, transit ridership |
| Ottawa | https://open.ottawa.ca | Council, transit, permits |
| Edmonton | https://data.edmonton.ca | Council, budget, transit |
| Winnipeg, Mississauga, Hamilton, Quebec City, Surrey, Laval, Halifax, London, etc. | Individual portals (CKAN/Socrata) | Council minutes/votes, campaign finance, development permits, transit, police oversight |

## 12. Fisheries & Oceans / Agriculture / Energy

- **DFO**: open.canada.ca CKAN (owner_org=dfo-mpo)
- **CFIA**: open.canada.ca CKAN + RSS
- **NRCan**: open.canada.ca CKAN (owner_org=nrcan-rncan)
- **Provincial Regulators**: BCUC, OEB, AUC, etc.

## 13. Foreign Influence / Culture / CRTC

- **ISED / NSIRA**: open.canada.ca CKAN
- **Canadian Heritage**: CKAN + CRTC RSS/decisions
- **Tribunals**: HTML reports + StatCan WDS

## 14. NGO / Think Tank / WEF / UN (RSS Layer)

### WEF Alternatives (no native RSS since ~2024)
- rss.app generator: `https://rss.app/rss-feed/world-economic-forum-rss-feed`
- PR Newswire: `https://www.prnewswire.com/news-releases/latest-news-topics/world-economic-forum/`
- Press page scrape: `https://www.weforum.org/press/news/`

### Canadian Think Tanks RSS
| Think Tank | Feed URL |
|------------|----------|
| Fraser Institute | `https://www.fraserinstitute.org/rss` |
| C.D. Howe Institute | `https://www.cdhowe.org/feed` |
| Macdonald-Laurier Institute | `https://macdonaldlaurier.ca/feed/` |
| CIGI | `https://www.cigionline.org/feed/` |
| IRPP (Policy Options) | `https://policyoptions.irpp.org/feed/` |
| Conference Board of Canada | newsroom RSS |

### UNHCR Refugee Data
- Global statistics API: `https://www.unhcr.org/refugee-statistics`
- Canada portal: `https://www.unhcr.ca/in-canada/refugee-statistics/`

### Food Banks Canada
- Annual HungerCount: `https://foodbankscanada.ca/hunger-in-canada/hungercount/` (PDF/tables)

## 15. Government RSS Feeds

| Feed | URL |
|------|-----|
| Canada Gazette Part I | `https://www.gazette.gc.ca/rss/p1-eng.xml` |
| Canada Gazette Part II | `https://www.gazette.gc.ca/rss/p2-eng.xml` |
| Canada Gazette Part III | `https://www.gazette.gc.ca/rss/en-ls-eng.xml` |
| PM of Canada News | `https://pm.gc.ca/en/news.rss` |
| Global Affairs Canada | `https://www.international.gc.ca/international/news-nouvelles.aspx?lang=eng&rss=1` |
| ISC/CIRNAC News | `https://api.io.canada.ca/io-server/gc/news/en/v2?dept=indigenousservicescanada&format=atom` |
| Health Canada | `https://www.canada.ca/en/health-canada/services/rss-feeds.html` |
| Justice Canada | `https://www.justice.gc.ca/eng/news-nouv/rss.html` |

## 16. Integrated Pipeline Architecture

```
CKAN Federated Discovery →
  └─ package_list (47k+ datasets across gov portals)
  └─ package_show → resource list
  └─ resource_show → direct CSV/XLSX URLs

StatCan WDS →
  └─ getAllCubesList → cube metadata
  └─ getFullTableDownloadCSV → CSV for any time-series

RSS (Gov + NGO + Think Tank) →
  └─ 6-hour cron → parse → hash → store
  └─ semantic fingerprinting → 5GW classification

Provincial/Municipal CKAN →
  └─ Same /api/3/action/package_list pattern
  └─ Federated via open.canada.ca search

All outputs → SHA-256 hash + citation envelope → SQLite database
```

## Ingestion Policy
- **All sources**: Free/public under Open Government Licence – Canada or equivalent
- **Refresh**: Monthly for bulk CKAN, daily for RSS, quarterly for annual reports
- **Antifragile**: 6-hour semantic fingerprinting, provider rotation, Claude-backed PDF/HTML parsing
