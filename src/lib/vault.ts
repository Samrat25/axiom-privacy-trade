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

const VAULT_STORAGE_KEY = 'axiom_shielded_vault_balance';

export function getLocalVaultBalance(): number {
  if (typeof window === 'undefined') return 1000;
  const stored = localStorage.getItem(VAULT_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(VAULT_STORAGE_KEY, '1000');
    return 1000;
  }
  return parseFloat(stored) || 0;
}

export function addToLocalVaultBalance(amount: number): number {
  const current = getLocalVaultBalance();
  const next = current + amount;
  localStorage.setItem(VAULT_STORAGE_KEY, next.toString());
  return next;
}

export function subtractFromLocalVaultBalance(amount: number): number {
  const current = getLocalVaultBalance();
  const next = Math.max(0, current - amount);
  localStorage.setItem(VAULT_STORAGE_KEY, next.toString());
  return next;
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
