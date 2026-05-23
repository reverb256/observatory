#!/usr/bin/env bash
# MapleSpike Secret Vault — Encrypt
#
# Usage:
#   ./scripts/encrypt-secrets.sh < plaintext-secrets.json
#   ./scripts/encrypt-secrets.sh /path/to/secrets.json
#
set -euo pipefail

VAULT=".secrets/vault.age"
PUBKEY="$(cat .secrets/vault.age.pub | grep -v '^#' | head -1)"

if [[ -z "$PUBKEY" ]]; then
  echo "[secrets] ERROR: Public key not found in .secrets/vault.age.pub" >&2
  exit 1
fi

INPUT="${1:-/dev/stdin}"

if [[ ! -f "$INPUT" && "$INPUT" != "/dev/stdin" ]]; then
  echo "[secrets] ERROR: Input file not found: $INPUT" >&2
  exit 1
fi

age -r "$PUBKEY" < "$INPUT" > "$VAULT"
echo "[secrets] Encrypted $INPUT → $VAULT"
