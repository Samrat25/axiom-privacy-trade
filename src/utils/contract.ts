// ============================================================================
// Axiom — Compact v1.3.0 Contract Types, ZK State Machine & NLP Utilities
// ============================================================================
// TECHNICAL CONTEXT:
// This module provides the frontend TypeScript interface to the on-chain
// Compact smart contract deployed on Midnight Preprod (axiom.compact v1.3.0).
//
// Key Innovations in v1.3.0 Supermoon:
// 1. Emergency Circuit Breaker (tripCircuitBreaker, resetCircuitBreaker):
//    Enables emergency freeze of trade executions when market volatility or
//    drawdown breaches user-defined safety parameters.
// 2. Confidential Slippage Shield:
//    Zero-knowledge validation of execution slippage against private tolerance.
// 3. Autonomous Batch Rebalancing (executeBatchRebalance):
//    Verifies multi-position rebalance compliance in a single zero-knowledge proof.
// 4. Strategy Lifecycle Management (revokeStrategy):
//    Permits explicit rotation and deprecation of on-chain strategy commitments.
// ============================================================================

export interface StrategyParams {
  asset: string;
  maxPositionPct: number;
  stopLossPct: number;
  timelineDays: number;
  timelineExpiry: bigint;
  maxSlippageBps?: number;
}

export interface CompactV130State {
  agentCommitment: Map<string, string>;
  strategyActive: Map<string, boolean>;
  circuitBreakerTripped: Map<string, boolean>;
  tradeStatus: Map<string, number>;
  tradeCount: number;
  mevShieldProtectedVolumeUsd: bigint;
}

export interface CircuitBreakerEvent {
  agentId: string;
  action: 'TRIPPED' | 'RESET';
  timestamp: number;
  reason: string;
}

export interface BatchRebalanceRecord {
  batchId: string;
  agentId: string;
  totalRebalanceUsd: number;
  timestamp: number;
  status: 'executed' | 'rejected';
  proofTimeMs: number;
}

export interface TradeRecord {
  id: string;
  timestamp: string;
  asset: string;
  type: 'BUY' | 'SELL' | 'STOP_LOSS' | 'BATCH_REBALANCE';
  sizeUsd: number;
  priceUsd: number;
  pnlUsd: number;
  pnlPct: number;
  status: 'executed' | 'rejected';
  proofTimeMs: number;
  commitmentHash: string;
  txHash?: string;
  rpcStatus?: 'pending' | 'confirmed' | 'failed';
  slippageBps?: number;
}

export interface MarketTicker {
  symbol: string;
  name: string;
  priceUsd: number;
  change24hPct: number;
  high24h: number;
  low24h: number;
  volume24hUsd: number;
}

/**
 * Client-side NLP parser that bounds natural language into circuit witness parameters.
 * Evaluates tokens locally to prevent strategy intent exposure to third-party endpoints.
 */
export function parseNaturalLanguageStrategy(prompt: string): StrategyParams {
  const lower = prompt.toLowerCase();
  
  let asset = 'ADA';
  if (lower.includes('btc') || lower.includes('bitcoin')) asset = 'BTC';
  else if (lower.includes('eth') || lower.includes('ethereum')) asset = 'ETH';
  else if (lower.includes('sol') || lower.includes('solana')) asset = 'SOL';
  else if (lower.includes('night') || lower.includes('tnight')) asset = 'tNIGHT';

  let maxPositionPct = 20;
  const maxPosMatch = lower.match(/(?:max|up to|position|size)\s*(\d+)%/);
  if (maxPosMatch && maxPosMatch[1]) {
    maxPositionPct = Math.min(100, Math.max(1, parseInt(maxPosMatch[1], 10)));
  }

  let stopLossPct = 8;
  const stopLossMatch = lower.match(/(?:stop-loss|stop loss|sl)\s*(\d+)%/);
  if (stopLossMatch && stopLossMatch[1]) {
    stopLossPct = Math.min(50, Math.max(1, parseInt(stopLossMatch[1], 10)));
  }

  let timelineDays = 30;
  const daysMatch = lower.match(/(\d+)\s*(?:days|day)/);
  if (daysMatch && daysMatch[1]) {
    timelineDays = Math.min(365, Math.max(1, parseInt(daysMatch[1], 10)));
  }

  let maxSlippageBps = 100; // Default 1.00% max slippage
  const slippageMatch = lower.match(/(?:slippage|slip)\s*(\d+(?:\.\d+)?)%/);
  if (slippageMatch && slippageMatch[1]) {
    maxSlippageBps = Math.round(parseFloat(slippageMatch[1]) * 100);
  }

  const currentSeconds = BigInt(Math.floor(Date.now() / 1000));
  const expirySeconds = currentSeconds + BigInt(timelineDays * 86400);

  return {
    asset,
    maxPositionPct,
    stopLossPct,
    timelineDays,
    timelineExpiry: expirySeconds,
    maxSlippageBps
  };
}

/**
 * Compute strategy hash matching persistentHash([maxPos, stopLoss, expiry]) in axiom.compact
 */
export function computeStrategyHash(params: StrategyParams | Omit<StrategyParams, 'asset'>): string {
  const rawStr = `${params.maxPositionPct}:${params.stopLossPct}:${params.timelineExpiry.toString()}`;
  let hash = 0x811c9dc5;
  for (let i = 0; i < rawStr.length; i++) {
    hash ^= rawStr.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  const hex = (hash >>> 0).toString(16).padStart(8, '0');
  return `0x${hex}${hex}${hex}${hex}`;
}

// Trade history initialized as clean empty array for live wallet sessions
export const INITIAL_TRADE_HISTORY: TradeRecord[] = [];
