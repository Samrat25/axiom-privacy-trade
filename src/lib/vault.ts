/**
 * Axiom — Shielded Vault (mintVaultBalance / burnVaultBalance)
 *
 * ASSUMPTION: This simulates the Midnight shield/unshield pattern for a
 * USDC-equivalent "vault balance." No actual USDC bridging, DEX routing,
 * or real custody occurs. The vault balance is a client-side shielded
 * state note, and the wallet popup is triggered via the existing
 * executeSignedTransaction gateway to demonstrate the ZK flow.
 */

import { executeSignedTransaction } from './midnight-api';

let _shieldedVaultBalance = 1000;

export function getLocalVaultBalance(): number {
  return _shieldedVaultBalance;
}

export function setLocalVaultBalance(balance: number): void {
  _shieldedVaultBalance = Math.max(0, balance);
}

export function addToLocalVaultBalance(amount: number): number {
  _shieldedVaultBalance += Math.max(0, amount);
  return _shieldedVaultBalance;
}

export function subtractFromLocalVaultBalance(amount: number): number {
  _shieldedVaultBalance = Math.max(0, _shieldedVaultBalance - amount);
  return _shieldedVaultBalance;
}

/**
 * Triggers 1AM wallet transaction signing to shield public tokens into the private vUSD vault.
 */
export async function mintVaultBalance(amountVusd: number): Promise<string> {
  const txHash = await executeSignedTransaction('mintVaultBalance', {
    amountVusd,
    timestamp: Date.now(),
  });
  addToLocalVaultBalance(amountVusd);
  return txHash;
}

/**
 * Triggers 1AM wallet transaction signing to unshield private vUSD vault balance into public tokens.
 */
export async function burnVaultBalance(amountVusd: number): Promise<string> {
  const current = getLocalVaultBalance();
  if (amountVusd > current) {
    throw new Error(`Insufficient vUSD vault balance. Current balance: $${current}`);
  }
  const txHash = await executeSignedTransaction('burnVaultBalance', {
    amountVusd,
    timestamp: Date.now(),
  });
  subtractFromLocalVaultBalance(amountVusd);
  return txHash;
}
