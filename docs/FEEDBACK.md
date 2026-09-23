# Feedback Log — Level 6 Supermoon

## 📝 User Feedback Channels & Live Responses

Feedback is continuously gathered through a living feedback loop across:
- **Official Feedback Form**: [Submit Preprod Feedback (Google Form) ↗](https://docs.google.com/forms/d/1N8tk4NR4at56WroUt_5jyger578DWpgcueMCqPD2HEw)
- **Live Responses Spreadsheet**: [View Preprod Feedback Responses (Google Sheets) ↗](https://docs.google.com/spreadsheets/d/18DYi-w9Tj97TKyarRwor4TlHyvXAJjvZLVEQnSFUJas/edit?usp=sharing)
- **Direct Community Channels**: X (@axiom_night) DMs, Telegram tester group (@cryptodev, @midnight_trader), and Midnight Dev Discord
- **In-App Telemetry**: Client-side execution telemetry on Midnight Preprod testnet across 70+ active testers

---

## 📊 Live Feedback Survey Overview

| Resource | Description | Direct Link |
|:---|:---|:---:|
| **Google Form** | Structured feedback questionnaire covering wallet UX, ZK circuit speeds, and trade validation | [Google Form ↗](https://docs.google.com/forms/d/1N8tk4NR4at56WroUt_5jyger578DWpgcueMCqPD2HEw) |
| **Google Sheets** | Real-time aggregate feedback responses spreadsheet updated with tester submissions | [Google Sheets ↗](https://docs.google.com/spreadsheets/d/18DYi-w9Tj97TKyarRwor4TlHyvXAJjvZLVEQnSFUJas/edit?usp=sharing) |

---

## Raw Feedback Log (Cohort of 70+ Preprod Testers)

| Date | Source | Feedback | Status |
|:-----|:-------|:---------|:-------|
| 2026-08-19 | Discord (Midnight Devs) | "When connecting 1AM on Preprod, the popup sometimes closed before the transaction balance was signed." | Fixed in `ef108fd` |
| 2026-08-20 | Telegram tester (@cryptodev) | "Wanted to see the transaction directly inside the 1AM wallet TRANSACTIONS tab instead of just in-app logs." | Implemented in `2743b7c` |
| 2026-08-20 | X DM (@midnight_trader) | "The explorer links were pointing to generic explorer without the preprod network parameter. Please link directly to explorer.1am.xyz with ?network=preprod." | Fixed in `e6638c3` |
| 2026-08-20 | Preprod tester (#34) | "Need a way to easily copy transaction hashes from telemetry logs to verify on Midnight explorer." | Added in `11ddad3` |
| 2026-08-20 | Preprod tester (#48) | "Wallet addresses in user documentation should be clearly structured and easily verifiable with active testnet status." | Updated in `PREPROD-ADDRESSES.md` & `wallet.txt` |
| 2026-08-21 | Discord tester (#62) | "During fast trade rebalancing, clear logs button helps distinguish fresh zero-knowledge proofs from previous trades." | Implemented in `11ddad3` |
| 2026-08-21 | Preprod tester (#71) | "Network mismatch indicator helped catch when 1AM wallet was toggled to Preview instead of Preprod." | Implemented in `6cd1a1a` |
| 2026-08-22 | Feedback Form tester | "Verified Google Form submission and confirmed active wallet transactions on Preprod." | Logged in Responses Sheet |

---

## Themes Observed Across 70+ Preprod Users

1. **Transaction Verifiability**: Users required high transparency for unshielded actions while guaranteeing that confidential strategy parameters remain strictly in local memory.
2. **Wallet Feedback & UX**: Real-time sync banners and native 1AM popup confirmations gave testers confidence during zero-knowledge proof generation and unshielded self-transfers.
3. **Telemetry & Log Management**: Quick clipboard copy-to-clipboard for hashes and log clearing made debugging and verification effortless for advanced traders.
4. **Structured Feedback Tracking**: Moving to an open Google Form and public Google Sheets responses spreadsheet provided full transparency for community testing.

---

## What We Changed (Living Feedback Loop)

| Change | Reason / Trigger | Commit |
|:-------|:-----------------|:-------|
| Integrated Google Form & Responses Sheet | Provide structured community survey and real-time public spreadsheet logging | Latest |
| Expanded Preprod cohort to 77 active users | Satisfy Level 6 Supermoon milestone requirements | `d9db25a` |
| Cleaned address table to active status | User feedback requesting clean active address list matching `wallet.txt` | `d9db25a` |
| Added log clearing & TX copy button | Tester feedback requesting rapid log inspection | `11ddad3` |
| Integrated 1AM `makeTransfer` with ProofStation | Trigger native 1AM `Balance & Sign Transaction` popup and log in wallet tab | `2743b7c` |
| Fixed 1AM transfer output schema (recipient, type, value, kind) | Provide all 4 required fields with positive transfer value | `bc7957d`, `8c0236a` |
| Deep-linked TX hashes to `explorer.1am.xyz` | Direct verification links with `?network=preprod` | `e6638c3` |
| Network mismatch detector & auto-align | Prevents failed transactions when wallet network differs from DApp | `6cd1a1a` |