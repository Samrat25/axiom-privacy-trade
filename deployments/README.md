# Axiom — Midnight Deployment Registry

This directory contains versioned deployment records for Axiom's Compact ZK circuits on Midnight testnets.

> [!IMPORTANT]
> **Contract Immutability**: Midnight contracts are immutable once deployed. Upgrades are achieved by deploying a new contract version, updating `deployments/registry.json`, and appending the deployment record below. Old versions are preserved indefinitely.

---

## Deployment Records

### Midnight Preview Testnet

| Version | Contract Address | Deployed At | Circuits | Status |
| :--- | :--- | :--- | :--- | :--- |
| `1.2.0` | `0x33eb41d22028264e9e8bbe7f95b3089cece6e3c2a53008535e72a9f3350d3e30` | 2026-08-14 | `commitStrategy`, `executeTrade`, `mintVaultBalance`, `burnVaultBalance`, `unshieldWithdraw` | **Active** |
| `1.0.0` | `0x62a27ceda5eb600263e208768d5d285c659d47f2cd6b14a20c62b160f4da46f3` | 2026-08-12 | `commitStrategy`, `executeTrade`, `unshieldWithdraw` | Historical |

### Midnight Preprod Testnet

| Version | Contract Address | Deployed At | Circuits | Status |
| :--- | :--- | :--- | :--- | :--- |
| `1.2.0` | `0x2428cd4ae7c2cd0bb501e1e9162de3003b103c1063c220e0d5cfc3f0b438e524` | 2026-08-14 | `commitStrategy`, `executeTrade`, `mintVaultBalance`, `burnVaultBalance`, `unshieldWithdraw` | **Active (Verified)** |
| `1.0.0` | `0x62a27ceda5eb600263e208768d5d285c659d47f2cd6b14a20c62b160f4da46f3` | 2026-08-12 | `commitStrategy`, `executeTrade`, `unshieldWithdraw` | Historical |

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
