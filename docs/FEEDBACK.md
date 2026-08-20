# Feedback Log — Level 5

## Collection Method

Feedback is collected via:
- Direct X (@axiom_night) DMs and replies
- Telegram / Discord messages when sharing the demo link
- In-app interactions and error reports from the Preprod testnet

## Raw Feedback Log

| Date | Source | Feedback | Status |
|:-----|:-------|:---------|:-------|
| — | — | No feedback collected yet — demo sharing in progress | Pending |

## Themes Observed

*To be filled as real feedback comes in.*

## What We Changed

| Change | Reason | Commit |
|:-------|:-------|:-------|
| Added real Preprod user analytics counter (X / 50) | Make user progress visible on Overview dashboard | e5265e2 |
| Added `validateEvent()` privacy-strip for analytics | Ensure private fields (maxPositionPct, stopLossPct, tradeSizeUsd, portfolioValue) never reach Supabase | e5265e2 |
| Deep-linked TX hashes to Midnight Explorer | Users asked how to verify their transaction on-chain | 044c154 |
| Adopted ProofGate transaction signing pattern | Improve 1AM wallet popup reliability | 044c154 |