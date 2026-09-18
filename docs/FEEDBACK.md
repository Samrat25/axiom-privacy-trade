# Feedback Log — Level 5

## Collection Method

Feedback is collected via:
- Direct X (@axiom_night) DMs and replies
- Telegram / Discord messages when sharing the demo link
- In-app interactions and error reports from the Preprod testnet

## Raw Feedback Log

| Date | Source | Feedback | Status |
|:-----|:-------|:---------|:-------|
| 2026-08-19 | Discord (Midnight Devs) | "When connecting 1AM on Preprod, the popup sometimes closed before the transaction balance was signed." | Fixed in `ef108fd` |
| 2026-08-20 | Telegram tester (@cryptodev) | "Wanted to see the transaction directly inside the 1AM wallet TRANSACTIONS tab instead of just in-app logs." | Implemented in `2743b7c` |
| 2026-08-20 | X DM (@midnight_trader) | "The explorer links were pointing to generic explorer without the preprod network parameter. Please link directly to explorer.1am.xyz with ?network=preprod." | Fixed in `e6638c3` |
| 2026-08-20 | Preprod tester | "Need a way to easily copy transaction hashes from telemetry logs to verify on Midnight explorer." | Added in `11ddad3` |
| 2026-08-20 | Review feedback | "Provide the list of 50 verifiable preprod wallet addresses in a dedicated markdown document linked in the readme." | Added in `PREPROD-ADDRESSES.md` |

## Themes Observed

1. **Transaction Verifiability**: Users wanted seamless 1-click verification of every on-chain action on both 1AM Explorer (`explorer.1am.xyz`) and Midnight Explorer (`preprod.midnightexplorer.com`).
2. **Wallet Feedback & UX**: Real-time sync indicators and native 1AM popup confirmations gave testers confidence during zero-knowledge proof generation.
3. **Privacy-Preserving Telemetry**: Clear audit logs demonstrating that private parameters (stop-losses, position sizing, collateral balance) never leave local witness memory.

## What We Changed

| Change | Reason | Commit |
|:-------|:-------|:-------|
| Added real Preprod user analytics counter (X / 50) | Make user progress visible on Overview dashboard | `e5265e2` |
| Added `validateEvent()` privacy-strip for analytics | Ensure private fields (maxPositionPct, stopLossPct, tradeSizeUsd, portfolioValue) never reach Supabase | `e5265e2` |
| Deep-linked TX hashes to 1AM & Midnight Explorer | Users asked for direct verification links for Preprod & Preview | `044c154` |
| Integrated 1AM `makeTransfer` with ProofStation fee sponsorship | Trigger native 1AM `Balance & Sign Transaction` popup and log in wallet `TRANSACTIONS` tab | `2743b7c` |
| Fixed 1AM transfer output schema (recipient, type, value, kind) | Provide all 4 required fields with positive transfer value | `bc7957d`, `8c0236a` |
| Updated all explorer links to `explorer.1am.xyz` | Direct deep linking to 1AM explorer with network query parameter | Latest |