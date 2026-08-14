# Axiom — Midnight Deployment Registry

This directory contains versioned deployment records for Axiom's Compact ZK circuits on Midnight testnets.

> [!IMPORTANT]
> **Contract Immutability**: Midnight contracts are immutable once deployed. Upgrades are achieved by deploying a new contract version, updating `deployments/registry.json`, and appending the deployment record below. Old versions are preserved indefinitely.

---

## Deployment Records

### Midnight Preview Testnet

| Version | Contract Address | Deployed At | Circuits | Status |
| :--- | :--- | :--- | :--- | :--- |
| `1.0.0` | `0x62a27ceda5eb600263e208768d5d285c659d47f2cd6b14a20c62b160f4da46f3` | 2026-08-12 | `commitStrategy`, `executeTrade`, `unshieldWithdraw` | **Active** |

### Midnight Preprod Testnet

| Version | Contract Address | Deployed At | Circuits | Status |
| :--- | :--- | :--- | :--- | :--- |
| `1.0.0` | `0x62a27ceda5eb600263e208768d5d285c659d47f2cd6b14a20c62b160f4da46f3` | 2026-08-12 | `commitStrategy`, `executeTrade`, `unshieldWithdraw` | **Active** |

---

## Deployment Commands

### Deploy to Preview
```bash
npx @midnight-ntwrk/compact-cli deploy --network preview --contract contracts/axiom.compact
```

### Deploy to Preprod
```bash
npx @midnight-ntwrk/compact-cli deploy --network preprod --contract contracts/axiom.compact
```
