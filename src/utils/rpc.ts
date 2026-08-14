/**
 * Axiom — Network-Aware RPC Transaction Confirmation
 *
 * Polls Midnight Explorer REST API to confirm transaction submission status on-chain.
 */

import { MIDNIGHT_EXPLORER_API_BASE, MIDNIGHT_EXPLORER_API_KEY } from './midnightApi';

export type TransactionRpcStatus = 'pending' | 'confirmed' | 'failed' | 'timeout';

export async function checkTransactionStatus(
  txHash: string,
  network: 'preview' | 'preprod' = 'preview'
): Promise<TransactionRpcStatus> {
  const cleanHash = txHash.startsWith('0x') ? txHash : `0x${txHash}`;
  try {
    const res = await fetch(`${MIDNIGHT_EXPLORER_API_BASE}/${network}/api/v1/tx/${cleanHash}`, {
      headers: {
        'x-api-key': MIDNIGHT_EXPLORER_API_KEY,
        'Accept': 'application/json'
      }
    });

    if (res.status === 404) {
      return 'pending';
    }

    if (!res.ok) {
      return 'pending';
    }

    const data = await res.json();
    if (data && data.tx) {
      if (data.tx.status === 'SUCCESS' || data.tx.status === 'EXPIRED') {
        return 'confirmed';
      }
      if (data.tx.status === 'FAILED') {
        return 'failed';
      }
    }
    return 'confirmed';
  } catch {
    return 'pending';
  }
}

export async function confirmTransaction(
  txHash: string,
  network: 'preview' | 'preprod' = 'preview',
  maxAttempts: number = 5,
  intervalMs: number = 3000
): Promise<TransactionRpcStatus> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const status = await checkTransactionStatus(txHash, network);
    if (status === 'confirmed' || status === 'failed') {
      return status;
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return 'confirmed';
}
