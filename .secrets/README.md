# MapleSpike Secret Vault

Zero-knowledge, just-in-time secret management. Secrets encrypted at rest with [age](https://age-encryption.org), decrypted only when needed.

## How it works

```
.secrets/
├── vault.age        ← Encrypted secrets (safe to commit)
├── vault.age.pub    ← Public key (safe to commit)
├── vault.json.example ← Template showing structure
└── README.md        ← This file
scripts/
├── decrypt-secrets.sh  ← Decrypt vault → env vars
└── encrypt-secrets.sh  ← Encrypt plaintext → vault.age
```

The **private key** is never stored in the repo. It's distributed through secure channels:

| Environment | Where the private key lives |
|---|---|
| GitHub Actions | `AGE_SECRET_KEY` repo secret |
| K3s cluster (NixOS) | `/run/agenix/age-key` |
| Local dev machine | `~/.config/age/key.txt` |
| Anywhere else | `AGE_SECRET_KEY` environment variable |

## Usage

### Decrypt (just-in-time)

```bash
# Export all secrets as environment variables
eval "$(scripts/decrypt-secrets.sh)"

# Or get JSON
scripts/decrypt-secrets.sh --json
```

### Encrypt (update secrets)

```bash
# Edit the JSON, then re-encrypt
vim /tmp/secrets-plain.json
scripts/encrypt-secrets.sh /tmp/secrets-plain.json
shred -u /tmp/secrets-plain.json  # secure delete plaintext
```

## First-time setup

```bash
# 1. Get the private key from the cluster admin
# 2. Save it locally
mkdir -p ~/.config/age
chmod 700 ~/.config/age
# Paste the private key into ~/.config/age/key.txt
chmod 400 ~/.config/age/key.txt

# 3. Test decryption
eval "$(scripts/decrypt-secrets.sh)"
echo $MAPLESPIKE_GITHUB_PROMOTION_TOKEN
```

## Adding to GitHub Actions

```yaml
- name: Decrypt secrets
  run: eval "$(scripts/decrypt-secrets.sh)"
  env:
    AGE_SECRET_KEY: ${{ secrets.AGE_SECRET_KEY }}
```

## Adding to K3s cluster

Add to your NixOS configuration (see `k8s/prod/ghcr-secret.nix` for the pattern):

```nix
systemd.services.maplespike-secret-vault = {
  script = ''
    AGE_KEY=$(cat /run/agenix/age-key)
    cd /var/lib/maplespike
    echo "$AGE_KEY" | age --decrypt -i - .secrets/vault.age > /run/secrets/maplespike.json
  '';
};
```
