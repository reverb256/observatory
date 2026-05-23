---
last-reviewed: 2026-05-14
status: active
---

# MapleSpike

> **Pipeline de données gouvernementales canadiennes souverain et natif pour l'IA** — une couche unifiée pour les données gouvernementales, le suivi de l'influence des entreprises, la surveillance des comités, le renseignement réglementaire et le suivi des acteurs politiques. Construit sans dépendance au nuage externe, déployé sur un cluster K3s.

**Statut :** Développement actif · **Licence :** AGPL-3.0/MIT · **Stack :** TypeScript + Python + NixOS/K3s

> [Version anglaise](README.md) · English version available
> **Métriques actuelles:** Voir [docs/metrics.json](docs/metrics.json) pour les nombres de modules, outils MCP et lignes de code.

---

## Ce que c'est

MapleSpike ingère, vérifie et présente des données gouvernementales canadiennes publiques. Consultez le [README anglais](README.md) pour la liste complète des 65 modules.

> **Modules :** 65 modules d'ingestion enregistrés · **Outils MCP :** 22 tous en direct · **Lignes TypeScript :** ~113 000 · **Forfaits :** 10

Chaque enregistrement comprend des hachages de citation SHA-256, une provenance des sources et des pistes d'audit pour une vérification indépendante.

---

## Structure du dépôt

```
maplespike/
├── packages/
│   ├── pipeline-core/    # Ingestion, vérification, audit (bibliothèque partagée)
│   ├── engine/           # Résolution d'entités, construction de graphes, signaux, briefs
│   ├── pretext-civic/    # Bibliothèque de composants React (graphiques, géo) — orphelin
│   ├── portal/           # Portail développeur et page d'accueil (HTML statique)
│   ├── api-server/       # Passerelle API REST (auth, limites de débit, usage)
│   ├── mcp-server/       # Serveur de protocole MCP (✅ 22 outils réels)
│   ├── sdk/              # Client TypeScript
│   ├── sdk-python/       # Client Python
│   ├── legal-core/       # SDK de données juridiques
│   └── legislation/      # Analyseur XML de lois
├── docs/                 # Documentation d'architecture, feuille de route, analyse
├── .hermes/              # Plans d'analyse et rétrospectives
├── flake.nix             # Construction Nix
├── ROADMAP.md            # Feuille de route complète
└── tsconfig.json         # Configuration TypeScript partagée
```

---

## Infrastructure

| Service | Plateforme | Stack |
|---------|-----------|-------|
| Portail (marketing + docs) | **Cluster K3s (nginx)** | HTML/CSS/JS statique |
| Tableau de bord produit | **Cluster K3s** (nexus) | Next.js |
| Serveur MCP | **Cluster K3s** | Node.js, transport SSE |
| Serveur API | **Cluster K3s** | Node.js, auth Bearer |
| Moteur / CronJobs | **Cluster K3s** | Pipelines d'ingestion programmés |

Toutes les données backend sur un cluster K3s canadien. Aucun fournisseur de nuage externe.

---

## Démarrage rapide

```bash
pnpm install
pnpm run build
cd packages/mcp-server
pnpm start
```

---

## Licence

**Bibliothèque principale** (`packages/pipeline-core`) : AGPL-3.0 · **Serveur MCP** : MIT
**Moteur** : MIT · **Portail** : MIT

Les données gouvernementales conservent leur licence originale (principalement [Licence du gouvernement ouvert – Canada](https://ouvert.canada.ca/fr/licence-du-gouvernement-ouvert-canada)).
