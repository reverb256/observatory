---
last-reviewed: 2026-05-14
status: active
---

# MapleSpike — Feuille de route

> [Version anglaise](ROADMAP.md) · English version available
> **Dernière mise à jour :** 2026-05-14
> **Métriques actuelles:** Voir [docs/metrics.json](docs/metrics.json) pour les nombres à jour.

---

## Phases de développement

| Phase | Description | Statut |
|-------|-------------|--------|
| 1 | **BD partagée** — Interface D1 → adaptateur `better-sqlite3`, migration de schéma | ✅ TERMINÉ |
| 2 | **Ingestion** — Parsing CSV, requêtes d'influence réelles | ✅ TERMINÉ |
| 3 | **Outils MCP** — 22 outils tous reliés aux requêtes BD réelles | ✅ TERMINÉ |
| 4 | **Intégration du moteur** — Résolution d'entités + génération de briefs | ⏳ À FAIRE |
| 5 | **Tableau de bord en direct** — Application React utilisant MCP/API | ⏳ À FAIRE |
| 6 | **SaaS / API publique** — Facturation Stripe + crypto + Interac, console développeur | 🔴 À FAIRE |
| 7 | **CI/CD + Privé** — GitHub Actions, locataires entreprise, mode journalisme | 🔴 À FAIRE |

## Services déployés

| Service | Image | Port | Description |
|---------|-------|------|-------------|
| Serveur MCP | `maplespike-mcp` | 3001 | 22 outils MCP, transport SSE |
| Serveur API | `maplespike-api` | 8082 | API REST avec auth et limites de débit |
| Ingestion | `maplespike-ingest` | — | 10 pipelines CronJob (comités, lobbying, etc.) |
| Moteur | `maplespike-engine` | — | Balayage SweepEngine, résolution d'entités |

## Voir aussi

- [ROADMAP.md](ROADMAP.md) — Feuille de route complète en anglais (registre des décisions, inventaire des fichiers)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — Architecture du système
- [docs/metrics.json](docs/metrics.json) — Métriques actuelles (modules, outils, lignes)
