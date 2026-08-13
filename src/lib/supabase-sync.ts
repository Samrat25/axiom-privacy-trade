/**
 * Axiom — Supabase Off-Chain Persistence & Public Ledger Sync
 * Mirrors freight-veil's proven Supabase sync architecture.
 *
 * PRIVACY SECURITY MODEL:
 *   Private witness data (strategy bounds, trade sizes, portfolio value, stop-loss %)
 *   NEVER touch Supabase. Only PUBLIC ledger state is synced off-chain:
 *   - agentId
 *   - commitmentHash
 *   - txHash
 *   - walletAddress (shielded key commitment)
 *   - status (executed / rejected)
 *   - timestamp
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { TradeRecord } from '../utils/contract';

const SUPABASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.['VITE_SUPABASE_URL']) || '';
const SUPABASE_ANON_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.['VITE_SUPABASE_ANON_KEY']) || '';

let _supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (_supabaseClient) return _supabaseClient;
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      _supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      return _supabaseClient;
    } catch (err) {
      console.warn('[Axiom Supabase] Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return null;
}

// ─── Local Storage Fallback Key ───────────────────────────────────────────────

const LOCAL_STORAGE_STRATEGIES_KEY = 'axiom_active_strategies_v1';
const LOCAL_STORAGE_TRADES_KEY = 'axiom_trades_history_v1';

// ─── Sync Functions ───────────────────────────────────────────────────────────

export interface PublicStrategyCommitmentRecord {
  agent_id: string;
  commitment_hash: string;
  wallet_address: string;
  tx_hash: string;
  created_at: string;
  status: string;
}

export interface PublicTradeExecutionRecord {
  trade_id: string;
  agent_id: string;
  commitment_hash: string;
  tx_hash: string;
  asset: string;
  status: string;
  proof_time_ms: number;
  timestamp: string;
}

/**
 * Sync public strategy commitment to Supabase (and localStorage)
 */
export async function syncStrategyCommitment(record: PublicStrategyCommitmentRecord): Promise<void> {
  // 1. Browser LocalStorage Persistence (Always succeeds)
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_STRATEGIES_KEY) || '[]');
    localStorage.setItem(LOCAL_STORAGE_STRATEGIES_KEY, JSON.stringify([record, ...existing]));
  } catch (e) {
    console.warn('[Axiom LocalStorage] Strategy sync warning:', e);
  }

  // 2. Supabase Cloud Sync (Non-blocking)
  const client = getSupabaseClient();
  if (!client) return;

  try {
    const { error } = await client.from('strategy_commitments').insert([record]);
    if (error) {
      console.warn('[Axiom Supabase] syncStrategyCommitment warning:', error.message);
    } else {
      console.info('[Axiom Supabase] ✅ Strategy commitment synced off-chain:', record.commitment_hash);
    }
  } catch (err) {
    console.warn('[Axiom Supabase] syncStrategyCommitment failed:', err);
  }
}

/**
 * Sync public trade execution to Supabase (and localStorage)
 */
export async function syncTradeExecution(record: PublicTradeExecutionRecord): Promise<void> {
  // 1. Browser LocalStorage Persistence
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TRADES_KEY) || '[]');
    localStorage.setItem(LOCAL_STORAGE_TRADES_KEY, JSON.stringify([record, ...existing]));
  } catch (e) {
    console.warn('[Axiom LocalStorage] Trade sync warning:', e);
  }

  // 2. Supabase Cloud Sync
  const client = getSupabaseClient();
  if (!client) return;

  try {
    const { error } = await client.from('trade_executions').insert([record]);
    if (error) {
      console.warn('[Axiom Supabase] syncTradeExecution warning:', error.message);
    } else {
      console.info('[Axiom Supabase] ✅ Trade execution synced off-chain:', record.trade_id);
    }
  } catch (err) {
    console.warn('[Axiom Supabase] syncTradeExecution failed:', err);
  }
}

/**
 * Fetch persisted trade history from Supabase (or localStorage fallback)
 */
export async function fetchPersistedTrades(): Promise<TradeRecord[]> {
  const client = getSupabaseClient();

  if (client) {
    try {
      const { data, error } = await client
        .from('trade_executions')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((d: any) => ({
          id: d.trade_id || `0xtrade_${Math.random().toString(16).substring(2, 7)}`,
          timestamp: d.timestamp || new Date().toLocaleString(),
          asset: d.asset || 'ADA',
          type: 'BUY',
          sizeUsd: 1200,
          priceUsd: 0.421,
          pnlUsd: 114.50,
          pnlPct: 9.54,
          status: d.status === 'rejected' ? 'rejected' : 'executed',
          proofTimeMs: d.proof_time_ms || 390,
          commitmentHash: d.commitment_hash || d.tx_hash,
          txHash: d.tx_hash,
        }));
      }
    } catch {
      /* fallback below */
    }
  }

  // Fallback to LocalStorage
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_TRADES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((d: any) => ({
          id: d.trade_id || d.id || `0xtrade_${Math.random().toString(16).substring(2, 7)}`,
          timestamp: d.timestamp || new Date().toLocaleString(),
          asset: d.asset || 'ADA',
          type: d.type || 'BUY',
          sizeUsd: d.sizeUsd || 1200,
          priceUsd: d.priceUsd || 0.421,
          pnlUsd: d.pnlUsd || 0,
          pnlPct: d.pnlPct || 0,
          status: d.status === 'rejected' ? 'rejected' : 'executed',
          proofTimeMs: d.proof_time_ms || d.proofTimeMs || 390,
          commitmentHash: d.commitment_hash || d.commitmentHash || d.tx_hash,
          txHash: d.tx_hash || d.txHash,
        }));
      }
    }
  } catch {
    /* return empty array */
  }

  return [];
}
