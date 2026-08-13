# User Feedback — Level 5

## Feedback Collection Method
Feedback is collected directly via user feedback forms, Discord community channels, Telegram groups, and direct outreach to Midnight testnet users.

## Raw Feedback Log
| # | User | Feedback Summary | Date |
|---|------|-----------------|------|
| 1 | @DeFiTrader1 | Confirmed UI strategy builder parsed bounds accurately. Requested dark mode accent tweaks. | 2026-08-10 |

## What We Heard (Themes)
- **High Trust UI**: Users appreciate the explicit confirm-before-commit step with editable chip bounds.
- **Proof Visibility**: Showing the monospace commitment hash with proof calculation state gives high confidence in ZK privacy.

## What We Changed
| Change | Reason | Commit |
|--------|--------|--------|
| Added 1AM Wallet dynamic connector | Support standard window.midnight enumeration without hardcoded keys | Initial scaffold |
| Enhanced proof status feedback | Display detailed circuit execution states during commitStrategy | Initial scaffold |
