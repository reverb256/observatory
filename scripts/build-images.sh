#!/usr/bin/env bash
# Build and push MapleSpike Docker images
# Auto-detects podman or docker — whichever is available.
# Usage: ./scripts/build-images.sh [--push] [--tag latest]

set -euo pipefail

REPO="${REPO:-ghcr.io/reverb256}"
TAG="${TAG:-latest}"
PUSH="${PUSH:-false}"

# Detect container engine
if command -v podman &>/dev/null; then
  ENGINE="podman"
elif command -v docker &>/dev/null; then
  ENGINE="docker"
else
  echo "Error: neither podman nor docker found"
  exit 1
fi
echo "Using: $ENGINE"

IMAGES=(
  "mcp:Dockerfile.mcp"
  "api:Dockerfile.api"
  "ingest:Dockerfile.ingest"
  "engine:Dockerfile.engine"
)

for entry in "${IMAGES[@]}"; do
  name="${entry%%:*}"
  dockerfile="${entry##*:}"

  echo ""
  echo "=== Building $REPO/maplespike-$name:$TAG ==="
  $ENGINE build -f "$dockerfile" -t "$REPO/maplespike-$name:$TAG" .

  if [ "$PUSH" = "true" ]; then
    echo "=== Pushing $REPO/maplespike-$name:$TAG ==="
    $ENGINE push "$REPO/maplespike-$name:$TAG"
  fi
done

echo ""
echo "Done. Images built:"
for entry in "${IMAGES[@]}"; do
  name="${entry%%:*}"
  echo "  $REPO/maplespike-$name:$TAG"
done
