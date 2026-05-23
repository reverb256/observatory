#!/usr/bin/env bash
# MapleSpike Secret Vault — Decrypt & Export
# Zero-knowledge, just-in-time secret injection.
#
# Usage:
#   eval "$(./scripts/decrypt-secrets.sh)"   # export to env
#   ./scripts/decrypt-secrets.sh --json       # print JSON
#   ./scripts/decrypt-secrets.sh --env        # print export statements
#
# Private key source (checked in order):
#   1. AGE_SECRET_KEY env var
#   2. ~/.config/age/key.txt
#   3. /run/agenix/age-key (K3s node — NixOS agenix)
#
set -euo pipefail

VAULT=".secrets/vault.age"
MODE="${1:-env}"

# Resolve private key
PRIVKEY=""
if [[ -n "${AGE_SECRET_KEY:-}" ]]; then
  PRIVKEY="$AGE_SECRET_KEY"
elif [[ -f "$HOME/.config/age/key.txt" ]]; then
  PRIVKEY="$(cat "$HOME/.config/age/key.txt")"
elif [[ -f "/run/agenix/age-key" ]]; then
  PRIVKEY="$(cat /run/agenix/age-key)"
else
  echo "[secrets] ERROR: No age private key found. Set AGE_SECRET_KEY or place key at ~/.config/age/key.txt or /run/agenix/age-key" >&2
  exit 1
fi

if [[ ! -f "$VAULT" ]]; then
  echo "[secrets] ERROR: Vault not found at $VAULT" >&2
  exit 1
fi

# Decrypt
DECRYPTED=$(echo "$PRIVKEY" | age --decrypt -i - "$VAULT" 2>/dev/null) || {
  echo "[secrets] ERROR: Failed to decrypt vault. Wrong key?" >&2
  exit 1
}

case "$MODE" in
  --json)
    echo "$DECRYPTED"
    ;;
  --env|--export|"")
    echo "$DECRYPTED" | jq -r '
      to_entries[]
      | .key as $section
      | .value
      | to_entries[]
      | "export MAPLESPIKE_\($section | ascii_upgrade)_\(.key | ascii_upgrade)=\(.value | @sh)"
    '
    ;;
  *)
    echo "[secrets] Unknown mode: $MODE" >&2
    echo "Usage: $0 [--json|--env]" >&2
    exit 1
    ;;
esac
