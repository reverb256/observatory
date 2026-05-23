---
last-reviewed: 2026-05-14
status: active
---

# MapleSpike — External Data Compatibility Standards

> How MapleSpike aligns with canonical Canadian government data standards.

## 1. GC Department Codes

**Source**: [GoC-Spending/goc-spending-analysis](https://github.com/GoC-Spending/goc-spending-analysis) — 83 standardized department acronyms

**File**: `packages/pipeline-core/src/ingestion/gc-standards/index.ts`

**Mapping**: `GC_DEPARTMENTS` (acronym → full name) + `GC_DEPARTMENT_CODES` (full name → acronym)

**Used by**: `proactive-disclosure`, `goc-spending`

**Departments covered**: acoa, agr, atssc, cannor, cas, cbsa, cc, ccohs, ceaa, ced, cfia, cgc, chrc, cics, cihr, cnsc, cpc, cra, crtc, csa, csc, csps, cta, dfo, dnd, ec, elections, esdc, fcac, feddev, fin, fintrac, fja, fpcc, gac, hc, ic, ijc, inac, infra, ircc, isc, just, lac, mgerc, mpcc, neb, nfb, nrc, nrcan, nserc, oag, oci, ocl, ocol, oic, opc, osfi, osgg, oto, pbc, pc, pch, pco, phac, pmprb, ppsc, pptc, ps, psc, psic, pspc, rcmp, sirc, ssc, sshrc, stats, swc, tbs, tc, tsb, vac, vrab

**Usage**:
```ts
import { normalizeDepartment } from '@maplespike/pipeline-core/ingestion/gc-standards';

// Any department name variant → canonical code
normalizeDepartment('Department of National Defence') // → 'dnd'
normalizeDepartment('Employment and Social Development') // → 'esdc'
normalizeDepartment('DND') // → 'dnd'
```

---

## 2. A2AJ Legal Dataset Codes

**Source**: [api.a2aj.ca](https://api.a2aj.ca/coverage) — live API returning 116K+ decision corpus

**File**: `packages/pipeline-core/src/ingestion/gc-standards/index.ts` → `A2AJ_DATASET_CODES`

**Codes**: SCC, FCA, FC, TCC, ONCA, ONSC, BCCA, BCSC, ABCA, ABKB, QCCA, QCCS, RAD, RPD, SST, CITT, CHRT, FED, LEGISLATION_FED, REGULATIONS_FED

**Used by**: `a2aj` module (api.a2aj.ca coverage endpoint → auto-discovers all datasets)

---

## 3. CanLII Court Database IDs

**Source**: [CanLII API Documentation](https://github.com/canlii/API_documentation)

**File**: `packages/pipeline-core/src/ingestion/gc-standards/index.ts` → `CANLII_COURT_IDS`

**Maps**: A2AJ dataset codes → CanLII database IDs
```ts
CANLII_COURT_IDS.SCC  // → 'scc-csc'
CANLII_COURT_IDS.FCA  // → 'fca-caf'
CANLII_COURT_IDS.FC   // → 'fc-cf'
```

**Used by**: `canlii` module (requires CANLII_API_KEY env var)

---

## 4. GoC-Spending Combined CSV Schema

**Source**: [GoC-Spending/goc-spending-data](https://github.com/GoC-Spending/goc-spending-data)

**Fields**: vendor_name, vendor_normalized, department, owner_org, description, value, start_year, end_year, reference_number, contract_date, procurement_method, trade_agreement_exemption, duplicate_flag, error_flag

**Used by**: `goc-spending` module — fetches combined CSVs + department aggregates + vendor aggregates

**Schema alignment**: Our `GoCContract` type maps 1:1 with GoC-Spending's combined CSV schema.

---

## 5. Justice Canada Laws XML (Point-in-Time Legislation)

**Source**: [justicecanada/laws-lois-xml](https://github.com/justicecanada/laws-lois-xml) (285 MB, XML)

**Master index**: `https://laws-lois.justice.gc.ca/eng/XML/Legis.xml`

**Used by**: `legislation` module — fetches master index, parses <Act> and <Regulation> entries with Title, Chapter, Year, URL

**Compatibility**: Outputs structured records with `title, chapter, year, url, format: 'XML'`. Justice Canada's Otto AI platform (AGPL-3.0) consumes similar XML structures for ML training.

---

## 6. Algorithmic Impact Assessment (AIA)

**Source**: [canada-ca/aia-eia-js](https://github.com/canada-ca/aia-eia-js) (MIT, Vue.js)

**Relevance**: Treasury Board's official AI assessment framework. Contains department lists and impact classification criteria.

**Status**: Not yet ingested. Could feed our oversight module for tracking automated decision systems across government.

---

## 7. Justice Canada Otto (Legal AI)

**Source**: [justicecanada/otto](https://github.com/justicecanada/otto) (163 MB, Python, AGPL-3.0)

**Relevance**: Justice Canada's AI legal research platform. Django-based, uses structured legal data.

**Status**: Not yet integrated. AGPL license allows use. Our legislation module outputs align with their expected XML input format.

---

## Cross-Reference: Data Source → MapleSpike Module

| External Source | MapleSpike Module | Status |
|-----------------|-------------------|--------|
| GoC-Spending combined CSVs | `goc-spending` | ✅ Live |
| GoC-Spending dept aggregates | `goc-spending` | ✅ Live |
| GoC-Spending vendor aggregates | `goc-spending` | ✅ Live |
| GoC department acronyms | `gc-standards` | ✅ Canonical |
| A2AJ API (116K decisions) | `a2aj` | ✅ Live |
| CanLII API | `canlii` | ✅ Live (needs API key) |
| Justice Canada laws XML | `legislation` | ✅ Live |
| Ontario e-Laws | `legislation` | ✅ Live |
| BC Laws | `legislation` | ✅ Live |
| Canada.ca AIA (impact criteria) | Not yet | 🟡 Roadmapped |
| Justice Otto (legal AI) | Not yet | 🔵 Roadmapped |
