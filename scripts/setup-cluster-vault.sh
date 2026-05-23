#!/usr/bin/env bash
# Run ONCE on the K3s cluster node (nexus) to bootstrap the age key
# for the MapleSpike Secret Vault.
#
# Usage:
#   ./scripts/setup-cluster-vault.sh
#   # then paste the age private key when prompted
#
set -euo pipefail

AGE_KEY_FILE="/run/agenix/age-key"
VAULT_PATH="/var/lib/maplespike/.secrets/vault.age"

echo "=== MapleSpike Secret Vault — Cluster Bootstrap ==="
echo ""
echo "This will:"
echo "  1. Install age and jq if missing"
echo "  2. Write the age private key to $AGE_KEY_FILE"
echo "  3. Create the vault directory at $VAULT_PATH"
echo "  4. Decrypt and apply the ghcr-pull secret"
echo ""

# 1. Ensure dependencies
if ! command -v age &>/dev/null; then
  echo "[setup] Installing age..."
  if command -v nix-env &>/dev/null; then
    nix-env -iA nixos.age
  else
    echo "Please install age: apt install age or nix-shell -p age"
    exit 1
  fi
fi

# 2. Write age key
echo "[setup] Enter the age private key (paste and press Ctrl+D):"
mkdir -p "$(dirname "$AGE_KEY_FILE")"
cat > "$AGE_KEY_FILE"
chmod 400 "$AGE_KEY_FILE"
echo "[setup] Age key written to $AGE_KEY_FILE"

# 3. Create vault directory
cd /var/lib/maplespike
git clone --depth 1 https://github.com/reverb256/maplespike.git /tmp/maplespike-vault 2>/dev/null || true
mkdir -p "$(dirname "$VAULT_PATH")"
cp /tmp/maplespike-vault/.secrets/vault.age "$VAULT_PATH" 2>/dev/null || true
rm -rf /tmp/maplespike-vault

if [ ! -f "$VAULT_PATH" ]; then
  echo "[setup] WARNING: vault.age not found. Clone the repo and copy .secrets/vault.age manually."
fi

# 4. Decrypt and create ghcr-pull secret
if command -v kubectl &>/dev/null && [ -f "$VAULT_PATH" ]; then
  echo "[setup] Creating/updating ghcr-pull secret..."
  GITHUB_TOKEN=$(age --decrypt -i "$AGE_KEY_FILE" "$VAULT_PATH" 2>/dev/null | jq -r '.ghcr.pat_token')
  if [ -n "$GITHUB_TOKEN" ] && [ "$GITHUB_TOKEN" != "null" ]; then
    kubectl create secret docker-registry ghcr-pull \
      -n maplespike-prod \
      --docker-server=ghcr.io \
      --docker-username=reverb256 \
      --docker-password="$GITHUB_TOKEN" \
      --docker-email=reverb256@users.noreply.github.com \
      --dry-run=client -o yaml | kubectl apply -f -
    echo "[setup] ghcr-pull secret applied"
  fi
fi

echo ""
echo "=== Bootstrap complete ==="
echo "The vault will be decrypted JIT on each deploy or pod startup."
echo "To rotate secrets, re-encrypt vault.age and push to the repo."
