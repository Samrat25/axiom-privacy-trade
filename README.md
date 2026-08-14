# Axiom — Privacy-First Natural-Language Trading Agent on Midnight

> State your trading strategy once in plain natural language; every trade after is cryptographically proven to follow it on Midnight blockchain—without revealing your strategy rules, portfolio value, or order sizes.

---

## Contract Addresses & Version History

| Network | Version | Contract Address | Explorer Link | Status |
|:--------|:--------|:-----------------|:-------------|:-------|
| **Midnight Preview Testnet** | `v1.2.0` | `0x33eb41d22028264e9e8bbe7f95b3089cece6e3c2a53008535e72a9f3350d3e30` | [View on Midnight Explorer](https://preview.midnightexplorer.com/contract/0x33eb41d22028264e9e8bbe7f95b3089cece6e3c2a53008535e72a9f3350d3e30) | 🟢 **CURRENT / ACTIVE (Asset-Agnostic Risk Engine)** |
| **Midnight Preprod Testnet** | `v1.1.0` | `0x5ef6f5142328af863af9851c83d0d60c852af470435b34b0906b21c636b2df2e` | [View on Midnight Explorer](https://preprod.midnightexplorer.com/contract/0x5ef6f5142328af863af9851c83d0d60c852af470435b34b0906b21c636b2df2e) | 🟢 **CURRENT / ACTIVE (Asset-Agnostic Risk Engine)** |
| **Midnight Preview Testnet** | `v1.1.0` | `0x110f64de15f7f8ae579821999392da4c02c1143cfe7fb4e0572aad52484234d5` | [View on Midnight Explorer](https://preview.midnightexplorer.com/contract/0x110f64de15f7f8ae579821999392da4c02c1143cfe7fb4e0572aad52484234d5) | 🟡 *Historical (Vault v1)* |
| **Midnight Preprod Testnet** | `v1.0.0` | `0x62a27ceda5eb600263e208768d5d285c659d47f2cd6b14a20c62b160f4da46f3` | [View on Midnight Explorer](https://preprod.midnightexplorer.com/contract/0x62a27ceda5eb600263e208768d5d285c659d47f2cd6b14a20c62b160f4da46f3) | 🟡 *Historical (Initial Deployment)* |

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Axiom — Deployed Compact Smart Contract (v1.2.0)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Contract         : ./contracts/axiom.compact
  Managed Bindings : ./managed/
  Network          : Midnight Preview & Preprod
  Preview Address  : 0x33eb41d22028264e9e8bbe7f95b3089cece6e3c2a53008535e72a9f3350d3e30
  Preprod Address  : 0x5ef6f5142328af863af9851c83d0d60c852af470435b34b0906b21c636b2df2e
  Circuits         : commitStrategy, executeTrade, mintVaultBalance, burnVaultBalance, unshieldWithdraw
  Status           : DEPLOYED (Active Asset-Agnostic ZK Risk Engine)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## What This Does

Axiom is a privacy-first algorithmic trading protocol built on the **Midnight blockchain**. It enables crypto traders to state trading rules in plain natural language (e.g., *"only buy ADA, max 20% position size, 8% stop-loss, run for 30 days"*).

- **Traders** lock private trading strategy witnesses into zero-knowledge circuits without exposing parameters to block explorers or front-runners.
- **AI Agents** execute automated trade signals, proving locally that `hash(witnesses) == committed_hash` and `trade_size * 100 <= portfolio_value * max_pos_pct`.
- **Observers & Public Ledger** verify compliance without ever learning strategy limits, portfolio balances, or order amounts.

---

## Privacy Model

### What is PUBLIC (On-Chain, Visible to Anyone)
- **`agentCommitment`**: Public ledger map storing `agentId -> strategy commitment hash` (`Bytes<32>`).
- **`tradeStatus`**: Public ledger map storing `tradeId -> Uint<8>` status (1 = Executed, 2 = Rejected, 3 = Withdrawn).
- **`tradeCount`**: Counter tracking the total number of proven trades executed by the agent.

### What is PRIVATE (Private Witness, Never On-Chain)
- **Strategy Boundaries**: Target asset, max position allocation %, stop-loss %, timeline expiry timestamp.
- **Portfolio Balance**: Decrypted strictly client-side over shielded note state.
- **Trade Parameters**: Target asset, trade size in USD, execution price.
- **Secret Key**: `localSecretKey()` used for caller identity derivation.

### What the User PROVES Without Revealing
- That every trade in the agent's history adheres to the **SAME** strategy originally committed.
- That the trade position size is \(\le\) `maxPositionPct` of current portfolio value.
- That the trade target asset matches the strategy asset.
- That the trade execution timestamp is within the active timeline.

---

## Tech Stack

- **Midnight Network**: Midnight Preview & Preprod Testnets
- **Smart Contract Language**: Compact (pragma language_version >= 0.16)
- **Runtime Environment**: Node.js v22+
- **Containerization**: Docker (Midnight Proof Server on port 6300 & Compiler)
- **AI Agent Engine**: LangChain / Gemini (`gemini-2.5-flash`)
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Wallet Connection**: Midnight DApp Connector API (`window.midnight` / 1AM Wallet)
- **Test Runner**: Vitest

---

## Prerequisites

- **Node.js**: v22.0.0 or higher
- **Docker**: Docker Desktop running for `midnightnetwork/proof-server:latest`
- **Wallet**: 1AM / Lace Wallet extension installed in Chrome set to Preview/Preprod network

---

## Setup & Run Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Samrat25/axiom-privacy-trade.git
   cd axiom-privacy-trade
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Midnight Proof Server (Docker)**:
   ```bash
   docker run -d -p 6300:6300 --name midnight-proof-server midnightnetwork/proof-server:latest
   ```

4. **Compile Compact Smart Contract**:
   ```bash
   npm run compile
   ```

5. **Start Local Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

---

## Run Tests

Run the Vitest zero-knowledge privacy test suite:

```bash
npm test
```

---

## Initial Idea

[ Private Natural-Language Algorithmic Risk Escrow & Automated Compliance Settlement ]

---

## Screenshots

- **1AM Wallet Connection Modal**: [Add screenshot showing 1AM wallet popup on Preprod/Preview network]
- **Proof Server & Circuit Compilation Output**: [Add screenshot showing 3/3 ZKIR circuits compiled]
- **On-Chain Strategy Commitment & Audit Feed**: [Add screenshot of live protocol log & committed hashes]

---

## Final Verification Checklist

- [x] Contract compiles with `compact compile` / ZKIR artifacts generated in `./managed/zkir/`
- [x] `managed/` directory present with TypeScript contract simulator & circuit bindings
- [x] 3+ tests passing in `tests/axiom.test.ts` (5/5 passing)
- [x] Contract deployed to Preprod & Preview Testnets
- [x] Contract address visible in `README.md` (`0x62a27ceda5eb600263e208768d5d285c659d47f2cd6b14a20c62b160f4da46f3`)
- [x] `README.md` has all required sections (What This Does, Privacy Model, Tech Stack, Setup, Run Tests, Initial Idea, Screenshots)
- [x] Project file structure matches the Midnight spec
