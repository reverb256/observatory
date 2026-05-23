#!/usr/bin/env bash
set -euo pipefail

# Build packages in explicit topological order.
# tsc -b uses project references to resolve types through tsconfig.json
# (not through node_modules), which avoids pnpm store staleness issues.

# Layer 0: packages with no workspace deps (tsup-based)
pnpm --filter @maplespike/legal-core build
pnpm --filter @maplespike/legislation build
pnpm --filter @maplespike/sdk build

# Layer 1: tsc -b packages — built via root tsconfig project references.
# tsc -b handles the dependency graph automatically (database → pipeline-core → mcp-server/api-server).
# Use npx so tsc is resolved from hoisted node_modules/.bin even when not in global PATH.
npx tsc -b

# Layer 2: standalone builds
pnpm --filter @maplespike/docs build
pnpm --filter @maplespike/portal build
pnpm --filter @maplespike/dashboard build
