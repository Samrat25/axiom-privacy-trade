# Axiom — Privacy-First Natural-Language Trading Protocol on Midnight

[![Axiom CI/CD Pipeline](https://github.com/Samrat25/axiom-privacy-trade/actions/workflows/ci.yml/badge.svg)](https://github.com/Samrat25/axiom-privacy-trade/actions/workflows/ci.yml)
[![Network](https://img.shields.io/badge/Midnight-Preprod%20%26%20Preview-orange.svg)](https://midnight.network)
[![Compact Version](https://img.shields.io/badge/Compact-v0.24%20ZKIR-purple.svg)](https://docs.midnight.network)
[![Tests](https://img.shields.io/badge/Vitest-19%20Passed-emerald.svg)](https://github.com/Samrat25/axiom-privacy-trade)
[![Product X Profile](https://img.shields.io/badge/X-@AxiomPrivacy-black.svg?logo=x)](https://x.com/AxiomPrivacy)

> **State your trading strategy once in plain natural language; every trade after is cryptographically proven to follow it on the Midnight blockchain—without revealing your strategy rules, portfolio balance, or trade sizes.**

---

## 🌔 Level 4 - Waxing Gibbous Submission Details

| Requirement | Details / Link | Status |
|:---|:---|:---:|
| **Public GitHub Repo** | [https://github.com/Samrat25/axiom-privacy-trade](https://github.com/Samrat25/axiom-privacy-trade) | ✅ Complete |
| **Live Preprod Contract** | [`0x5ef6f5142328af863af9851c83d0d60c852af470435b34b0906b21c636b2df2e`](https://preprod.midnightexplorer.com/contracts/0x5ef6f5142328af863af9851c83d0d60c852af470435b34b0906b21c636b2df2e) | ✅ Deployed |
| **Live Preview Contract** | [`0x33eb41d22028264e9e8bbe7f95b3089cece6e3c2a53008535e72a9f3350d3e30`](https://preview.midnightexplorer.com/contracts/0x33eb41d22028264e9e8bbe7f95b3089cece6e3c2a53008535e72a9f3350d3e30) | ✅ Deployed |
| **CI/CD Pipeline** | [GitHub Actions Workflow `.github/workflows/ci.yml`](https://github.com/Samrat25/axiom-privacy-trade/actions/workflows/ci.yml) | ✅ Passing |
| **Product X (Twitter) Profile** | [@AxiomPrivacy](https://x.com/AxiomPrivacy) | ✅ Linked |
| **Meaningful Commits** | **34+ Commits** (Exceeds required 15) | ✅ Verified |
| **Test Suite** | 19 Unit & Privacy Tests Passing (`npm test`) | ✅ 100% Pass |

---

## Deployed Contract Addresses & Explorer Verification

| Network | Version | Contract Address | Midnight Explorer | Status |
|:---|:---|:---|:---|:---|
| **Midnight Preprod Testnet** | `v1.2.0` | `0x5ef6f5142328af863af9851c83d0d60c852af470435b34b0906b21c636b2df2e` | [Preprod Explorer ↗](https://preprod.midnightexplorer.com/contracts/0x5ef6f5142328af863af9851c83d0d60c852af470435b34b0906b21c636b2df2e) | 🟢 **ACTIVE PREPROD MVP** |
| **Midnight Preview Testnet** | `v1.2.0` | `0x33eb41d22028264e9e8bbe7f95b3089cece6e3c2a53008535e72a9f3350d3e30` | [Preview Explorer ↗](https://preview.midnightexplorer.com/contracts/0x33eb41d22028264e9e8bbe7f95b3089cece6e3c2a53008535e72a9f3350d3e30) | 🟢 **ACTIVE PREVIEW MVP** |
| **Historical Deployment** | `v1.1.0` | `0x110f64de15f7f8ae579821999392da4c02c1143cfe7fb4e0572aad52484234d5` | [Historical Record ↗](https://preview.midnightexplorer.com/contracts/0x110f64de15f7f8ae579821999392da4c02c1143cfe7fb4e0572aad52484234d5) | 🟡 *Historical (Vault v1)* |

---

## What Axiom Does

Axiom solves the fundamental vulnerability of on-chain automated trading: **strategy leakage, MEV front-running, and portfolio surveillance**.

Traditional automated trading requires exposing bot logic or order limits to public mempools. Axiom uses **Midnight's zero-knowledge Compact circuits** and **LangGraph / Gemini AI** to allow traders to:

1. **State Strategy Rules in Natural Language**:
   *"Lock a conservative strategy: max 25% position sizing, 8% stop-loss drawdown, 30 days duration."*
2. **AI Pre-Commitment Risk Parsing**:
   Gemini 2.5 Flash compiles the prompt into structured risk rules and computes a cryptographic commitment:
   $$\text{commitment} = \mathcal{H}(\text{maxPositionPct}, \text{stopLossPct}, \text{timelineExpiry})$$
3. **On-Chain ZK Strategy Lock**:
   The trader commits this hash on Midnight via their **1AM Wallet**. Only the 32-byte hash is published; private bounds remain confidential.
4. **Asset-Agnostic Zero-Knowledge Trade Execution**:
   The agent executes trades across multiple assets (ADA, BTC, ETH, SOL, tNIGHT). For each trade, Midnight verifies locally in zero-knowledge:
   $$\text{tradeSize} \times 100 \le \text{portfolioValue} \times \text{maxPositionPct} \quad \wedge \quad \text{currentTime} \le \text{timelineExpiry}$$
5. **Shielded Trading Vault (vUSD)**:
   Traders deposit and burn collateral via shielded vault notes. Private balances are verified without on-chain ledger exposure.

---

## Zero-Knowledge Privacy Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                             CLIENT ENVIRONMENT                           │
│                                                                          │
│  [ Natural Language Prompt ] ──> [ Gemini 2.5 Flash ]                   │
│                                           │                              │
│                                           ▼                              │
│  [ Private Strategy Witness ] ──> [ Compact ZK Prover / 1AM ProofStation ]│
│   • maxPositionPct: 25%                   │                              │
│   • stopLossPct: 8%                       │                              │
│   • timelineExpiry: BigInt                │ Generates ZK Proof           │
│   • portfolioBalance (Shielded)           ▼                              │
└───────────────────────────────────────────┬──────────────────────────────┘
                                            │ Only Proof + 32-Byte Hash
                                            ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                   MIDNIGHT BLOCKCHAIN (Preprod / Preview)                │
│                                                                          │
│  Public State:                                                           │
│   • agentCommitment[agentId] = 0x8a92... (32-byte hash)                  │
│   • tradeStatus[tradeId]     = 1 (Executed)                              │
│   • tradeCount[agentId]      = 4 trades                                  │
│                                                                          │
│  ZERO Knowledge Revealed:                                                │
│   ❌ Strategy rules (Hidden)                                             │
│   ❌ Portfolio balance (Hidden)                                          │
│   ❌ Position percentages (Hidden)                                       │
└──────────────────────────────────────────────────────────────────────────┘
```

### What is PUBLIC (On-Chain)
- **`agentCommitment`**: Public ledger map storing `agentId -> commitmentHash` (`Bytes<32>`).
- **`tradeStatus`**: Public ledger map storing `tradeId -> Uint<8>` status (1 = Executed, 2 = Rejected).
- **`tradeCount`**: Counter tracking total proven trades executed under the strategy.

### What is PRIVATE (Never Leaves the Browser)
- **Strategy Risk Rules**: Position sizing %, stop loss drawdown %, timeline expiry.
- **Shielded Vault Balance**: Decrypted client-side over private state notes.
- **Trade Execution Parameters**: Specific asset allocation and private order size.
- **Caller Identity**: Derived via `localSecretKey()`.

---

## Compact Smart Contract Circuits (`contracts/axiom.compact`)

The contract defines 5 zero-knowledge circuits:

```rust
pragma language_version >= 0.16;

export ledger agentCommitment: Cell<Map<Bytes<32>, Bytes<32>>>;
export ledger tradeStatus: Cell<Map<Bytes<32>, Uint<8>>>;
export ledger tradeCount: Cell<Map<Bytes<32>, Uint<32>>>;

// 1. Lock risk boundaries into public commitment hash
export circuit commitStrategy(
    agentId: Bytes<32>,
    maxPositionPct: Uint<8>,
    stopLossPct: Uint<8>,
    timelineExpiry: Uint<64>
): Bytes<32>

// 2. Execute trade with client-side ZK proof of risk compliance
export circuit executeTrade(
    agentId: Bytes<32>,
    tradeId: Bytes<32>,
    tradeAsset: Bytes<32>,
    tradeSizeUsd: Uint<64>,
    portfolioValueUsd: Uint<64>,
    currentTime: Uint<64>,
    maxPositionPct: Uint<8>,
    stopLossPct: Uint<8>,
    timelineExpiry: Uint<64>
): Boolean

// 3. Mint shielded vUSD vault balance note
export circuit mintVaultBalance(amountVusd: Uint<64>): Boolean

// 4. Burn shielded vUSD vault balance note
export circuit burnVaultBalance(amountVusd: Uint<64>): Boolean

// 5. Unshield and withdraw private note to public address
export circuit unshieldWithdraw(amount: Uint<64>): Boolean
```

---

## Tech Stack

- **Blockchain**: Midnight Network (Preprod & Preview Testnets)
- **Smart Contract Language**: Compact (ZKIR compiler >= 0.16)
- **Frontend Framework**: React 19 + TypeScript + Vite + Tailwind CSS
- **AI Agent Engine**: LangGraph + LangChain (`gemini-2.5-flash`)
- **Database & Sync**: Supabase Realtime Backend (`zzrkbimybbuzrrzdheac.supabase.co`)
- **Wallet Connector**: Midnight DApp Connector API v4 (1AM / Lace Wallet)
- **ZK Prover**: 1AM ProofStation (Zero-DUST sponsored) & Local Docker Prover (Port 6300)
- **Test Runner**: Vitest (19 Unit & Privacy Tests)
- **CI/CD**: GitHub Actions

---

## Setup & Local Installation

### 1. Prerequisites
- **Node.js**: `v20` or `v22+`
- **Wallet**: [1AM Midnight Wallet Extension](https://1am.xyz) installed in Chrome/Brave.
- **Git**: Installed on your system.

### 2. Clone and Install
```bash
git clone https://github.com/Samrat25/axiom-privacy-trade.git
cd axiom-privacy-trade
npm install
```

### 3. Configure Environment (`.env`)
Create a `.env` file in the project root:
```env
VITE_MIDNIGHT_NETWORK=preprod
VITE_CONTRACT_ADDRESS=0x5ef6f5142328af863af9851c83d0d60c852af470435b34b0906b21c636b2df2e
VITE_GOOGLE_API_KEY=your_gemini_api_key_here
VITE_SUPABASE_URL=https://zzrkbimybbuzrrzdheac.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Run Unit Tests (19/19 passing)
```bash
npm test
```

### 5. Start Local Dev Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Step-by-Step MVP User Flow

1. **Connect 1AM Wallet**:
   - Click **Connect 1AM Wallet** in the top right.
   - Select **Preprod** or **Preview** network.
   - Approve the connection in the 1AM extension popup.

2. **Deposit to Shielded Trading Vault (vUSD)**:
   - Navigate to the **Vault & Withdraw** tab.
   - Enter deposit amount (e.g. `$250` or `$500` vUSD) or click a quick preset chip.
   - Click **Mint vUSD to Vault** and sign the transaction in 1AM.

3. **Lock a Strategy via Natural Language AI**:
   - Navigate to the **Strategy Builder** tab.
   - Enter a trading prompt or select a preset:
     *"Lock a conservative strategy: max 25% position, 8% stop-loss, 30 days duration."*
   - Click **Generate ZK Strategy & Prove**.
   - Gemini parses the bounds and generates an AI Risk Assessment.
   - Click **Commit Strategy to Midnight (1AM Popup)** to publish the 32-byte commitment hash on-chain.

4. **Execute Proven ZK Trades**:
   - Go to **Market Insights** or **Overview**.
   - Select your locked strategy and pick an asset (`ADA`, `BTC`, `ETH`, `SOL`, `tNIGHT`).
   - Click **Execute ZK Trade**.
   - Axiom verifies risk bounds client-side, requests 1AM wallet signature, and broadcasts the proof to Midnight.

5. **Track Protocol Telemetry**:
   - Inspect live events, transaction hashes, and proof confirmations in the **Protocol Telemetry** feed (formatted in Indian Standard Time, IST).
   - Click the **Midnight Explorer** link to verify on-chain contracts and transactions.

---

## Repository Structure

```
axiom-privacy-trade/
├── .github/workflows/ci.yml       # Automated CI/CD build & test pipeline
├── contracts/
│   └── axiom.compact              # Midnight Compact smart contract with 5 circuits
├── managed/                       # ZKIR binaries and TypeScript contract bindings
│   ├── axiom.ts                   # Contract simulator & witness schemas
│   └── zkir/                      # Pre-compiled ZKIR circuit binaries
├── src/
│   ├── components/
│   │   ├── LandingPage.tsx        # Hero landing page with live feature suite
│   │   ├── MarketChart.tsx        # Interactive market price & volatility chart
│   │   ├── OverviewStrategies.tsx # Active strategy commitment matrix
│   │   ├── ProtocolLog.tsx        # Sticky live protocol telemetry feed
│   │   ├── StrategyBuilder.tsx    # Natural language AI strategy builder
│   │   ├── MarketInsights.tsx     # AI market intelligence & direct trade execution
│   │   ├── Portfolio.tsx          # Client-side decrypted shielded portfolio
│   │   ├── TradeHistory.tsx       # Verified ZK trade log with explorer links
│   │   └── WalletModal.tsx        # 1AM wallet connection & network selector
│   ├── hooks/
│   │   └── useMidnight.ts         # React hook for Midnight state & wallet
│   ├── lib/
│   │   ├── lace-wallet.ts         # 1AM / Lace Midnight DApp connector
│   │   ├── midnight-api.ts        # ProofStation & transaction signing cascade
│   │   ├── riskModel.ts           # EZKL ZK-ML risk model
│   │   ├── supabase-sync.ts       # Supabase dedicated backend database
│   │   └── vault.ts               # Shielded vault state management
│   └── utils/
│       ├── agent.ts               # Gemini 2.5 Flash AI trading decision engine
│       ├── contract.ts            # Strategy hashing and witness definitions
│       ├── marketData.ts          # Real-time multi-asset market price feeds
│       └── time.ts                # Indian Standard Time (IST) formatting
├── tests/
│   ├── agent.test.ts              # AI agent LangGraph decision suite
│   ├── axiom.test.ts              # Compact circuit privacy verification
│   ├── riskFlowVerification.test.ts # Asset-agnostic multi-asset test
│   └── riskModel.test.ts          # ZK-ML risk scoring test
├── package.json
└── README.md
```

---

## License

MIT License. Developed for the **Midnight Blockchain Ecosystem**.
