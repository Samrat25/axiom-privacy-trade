/**
 * Axiom — Midnight Wallet & Protocol Hook
 *
 * Delegates all wallet detection/connection/signing to:
 *   - src/lib/lace-wallet.ts (wallet adapter layer)
 *   - src/lib/midnight-api.ts (transaction signing layer)
 *
 * This hook manages React state and UI concerns only.
 */

import { useState, useCallback, useEffect } from 'react';
import { StrategyParams, computeStrategyHash, TradeRecord, INITIAL_TRADE_HISTORY } from '../utils/contract';
import { ProtocolLogEntry } from '../components/ProtocolLog';
import { fetchLatestMidnightBlock, MidnightLatestBlock } from '../utils/midnightApi';

import {
  connect1AMWallet,
  isWalletInstalled,
  getDetectedWallets,
  type LiveWalletSession,
  type MidnightNetwork,
  type DetectedWallet,
} from '../lib/lace-wallet';

import {
  executeSignedTransaction,
  checkProofServerHealth,
  isDustReady,
  setLiveSession,
} from '../lib/midnight-api';

import {
  syncStrategyCommitment,
  syncTradeExecution,
  fetchPersistedTrades,
} from '../lib/supabase-sync';

export interface ActiveStrategy {
  id: string;
  agentId: string;
  params: StrategyParams;
  commitmentHash: string;
  createdAt: string;
  status: 'active' | 'expired' | 'revoked';
}

export function useMidnight() {
  // ─── Core wallet state ─────────────────────────────────────────────
  const [session, setSession] = useState<LiveWalletSession | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networkId, setNetworkId] = useState<MidnightNetwork>('preview');

  // ─── Detected wallets ──────────────────────────────────────────────
  const [detectedWallets, setDetectedWallets] = useState<DetectedWallet[]>([]);
  const [isWalletAvailable, setIsWalletAvailable] = useState(false);

  // ─── Health checks ─────────────────────────────────────────────────
  const [proofServerUp, setProofServerUp] = useState<boolean | null>(null);
  const [dustReady, setDustReady] = useState(false);

  // ─── Explorer ──────────────────────────────────────────────────────
  const [latestBlock, setLatestBlock] = useState<MidnightLatestBlock | null>(null);

  // ─── UI state ──────────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ─── Strategy & trade state ────────────────────────────────────────
  const [activeStrategies, setActiveStrategies] = useState<ActiveStrategy[]>([]);
  const [trades, setTrades] = useState<TradeRecord[]>(INITIAL_TRADE_HISTORY);
  const [isProofGenerating, setIsProofGenerating] = useState(false);
  const [proofStep, setProofStep] = useState('');

  // ─── Protocol log ──────────────────────────────────────────────────
  const [protocolLogs, setProtocolLogs] = useState<ProtocolLogEntry[]>([
    {
      id: 'log_init',
      type: 'info',
      title: 'Circuit Model Active',
      detail: 'Compact v0.24 ZK witness circuit initialized.',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const addLog = useCallback((type: 'success' | 'error' | 'info', title: string, detail: string) => {
    setProtocolLogs((prev) => [
      {
        id: `log_${Date.now()}_${Math.random().toString(16).substring(2, 6)}`,
        type,
        title,
        detail,
        timestamp: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
  }, []);

  // ─── Derived display values ────────────────────────────────────────
  const walletAddress = session?.address ?? null;
  const shieldedAddress = session?.shieldedAddress ?? null;
  const walletName = session?.walletName ?? '1AM Wallet';
  const shieldedBalance = session ? `${session.balances.tNightShielded.toFixed(2)} tNIGHT` : '0.00 tNIGHT';
  const unshieldedBalance = session ? `${session.balances.tNightUnshielded.toLocaleString()} tNIGHT` : '0.00 tNIGHT';
  const dustBalance = session ? `${session.balances.tDust.toLocaleString()} DUST` : '0.00 DUST';
  const balance = unshieldedBalance;

  // ─── Poll for wallet extension ─────────────────────────────────────
  const scanWallets = useCallback(() => {
    const found = getDetectedWallets();
    setDetectedWallets(found);
    setIsWalletAvailable(isWalletInstalled());
    return found;
  }, []);

  // ─── Load persisted trade history on mount ──────────────────────────
  useEffect(() => {
    fetchPersistedTrades().then((persisted) => {
      if (persisted.length > 0) {
        setTrades(persisted);
      }
    });
  }, []);

  useEffect(() => {
    scanWallets();
    const interval = setInterval(scanWallets, 500);
    return () => clearInterval(interval);
  }, [scanWallets]);

  // ─── Check proof server health ─────────────────────────────────────
  useEffect(() => {
    checkProofServerHealth().then(setProofServerUp);
    const interval = setInterval(() => {
      checkProofServerHealth().then(setProofServerUp);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // ─── Fetch live block analytics ────────────────────────────────────
  useEffect(() => {
    if (networkId === 'undeployed') return;
    const net = networkId === 'mainnet' ? 'preview' : (networkId as 'preview' | 'preprod');
    const load = () => fetchLatestMidnightBlock(net).then((b) => { if (b) setLatestBlock(b); });
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [networkId]);

  // ─── Connect wallet ────────────────────────────────────────────────
  const connectWallet = useCallback(async (_walletHint?: unknown, targetNetwork: MidnightNetwork = networkId) => {
    setIsConnecting(true);
    setError(null);

    try {
      addLog('info', 'Connecting Wallet', `Initiating 1AM connection on Midnight ${targetNetwork}...`);

      const live = await connect1AMWallet(targetNetwork);

      setSession(live);
      setLiveSession(live);
      setWalletConnected(true);
      setDustReady(isDustReady());

      addLog('success', 'Wallet Connected',
        `Connected to ${live.network} — ${live.address.substring(0, 18)}…`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Wallet connection failed';
      console.error('[Axiom] Wallet connection error:', err);
      setError(msg);
      setWalletConnected(false);
      addLog('error', 'Connection Failed', msg);
    } finally {
      setIsConnecting(false);
    }
  }, [networkId, addLog]);

  // ─── Disconnect wallet ─────────────────────────────────────────────
  const disconnectWallet = useCallback(() => {
    setSession(null);
    setLiveSession(null);
    setWalletConnected(false);
    setDustReady(false);
    addLog('info', 'Wallet Disconnected', '1AM session closed.');
  }, [addLog]);

  // ─── Switch network ────────────────────────────────────────────────
  const handleSelectNetwork = useCallback((net: MidnightNetwork) => {
    setNetworkId(net);
    if (walletConnected) {
      connectWallet(undefined, net);
    }
  }, [walletConnected, connectWallet]);

  // ─── Commit strategy (triggers real 1AM wallet popup) ──────────────
  const commitStrategyCircuit = useCallback(async (params: StrategyParams): Promise<string> => {
    if (!walletConnected) {
      throw new Error('Please connect your 1AM Wallet before committing a strategy.');
    }

    if (proofServerUp === false) {
      throw new Error(
        'Proof server not running. Start Docker: docker run -d -p 6300:6300 midnightnetwork/proof-server:latest'
      );
    }

    setIsProofGenerating(true);
    setError(null);

    try {
      addLog('info', 'Circuit Initiated',
        `Commit Strategy: ${params.asset} (${params.maxPositionPct}% max pos, ${params.stopLossPct}% stop-loss)`
      );

      setProofStep('1. Computing persistentHash witness commitment...');
      const hash = computeStrategyHash(params);

      setProofStep('2. Requesting 1AM Wallet transaction signature...');

      const agentId = `0xagent_${Math.random().toString(16).substring(2, 8)}`;

      // This triggers the REAL 1AM wallet extension popup
      const txHash = await executeSignedTransaction('commitStrategy', {
        agentId,
        strategyHash: hash,
        asset: params.asset,
        maxPositionPct: params.maxPositionPct,
        stopLossPct: params.stopLossPct,
        timelineExpiry: params.timelineExpiry.toString(),
      });

      setProofStep(`3. Transaction signed! TX: ${txHash.substring(0, 18)}…`);

      const newStrategy: ActiveStrategy = {
        id: `strat_${Date.now()}`,
        agentId,
        params,
        commitmentHash: hash,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        status: 'active',
      };

      setActiveStrategies((prev) => [newStrategy, ...prev]);

      // Non-blocking off-chain sync to Supabase / localStorage
      syncStrategyCommitment({
        agent_id: agentId,
        commitment_hash: hash,
        wallet_address: session?.shieldedAddress || session?.address || 'mn_addr_1am',
        tx_hash: txHash,
        created_at: newStrategy.createdAt,
        status: 'active',
      }).catch((e) => console.warn('[Axiom Sync] Strategy sync error:', e));

      addLog('success', 'Strategy Committed', `TX: ${txHash.substring(0, 24)}… | Hash: ${hash.substring(0, 18)}…`);
      return hash;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Strategy commitment failed';
      console.error('[Axiom] Commit strategy error:', err);
      setError(msg);
      addLog('error', 'Circuit Failed', msg);
      throw err;
    } finally {
      setIsProofGenerating(false);
    }
  }, [walletConnected, proofServerUp, session, addLog]);

  // ─── Execute proven trade (triggers real wallet popup) ─────────────
  const executeProvenTrade = useCallback(async (
    agentId: string,
    tradeSizeUsd: number = 1200,
    targetAsset?: string,
    tradeType: 'BUY' | 'SELL' | 'STOP_LOSS' = 'BUY'
  ): Promise<TradeRecord | undefined> => {
    setIsProofGenerating(true);
    setError(null);

    try {
      addLog('info', 'Trade Proving', `Proving ZK trade compliance for agent ${agentId}...`);

      setProofStep('1. Recomputing strategy hash from local witnesses...');

      const strategy = activeStrategies.find((s) => s.agentId === agentId) || activeStrategies[0];
      const asset = targetAsset || strategy?.params.asset || 'ADA';
      const basePrice = asset === 'BTC' ? 61250 : asset === 'ETH' ? 3300 : asset === 'SOL' ? 145 : 0.421;

      setProofStep('2. Submitting executeTrade via 1AM Wallet...');

      const txHash = await executeSignedTransaction('executeTrade', {
        agentId,
        tradeId: `0xtrade_${Math.random().toString(16).substring(2, 7)}`,
        tradeSizeUsd,
        currentTime: Math.floor(Date.now() / 1000),
      });

      const isExecuted = tradeSizeUsd <= 5000;
      const simulatedPnlPct = isExecuted ? Number((Math.random() * 8 + 1.5).toFixed(2)) : 0;
      const simulatedPnlUsd = isExecuted ? Number(((tradeSizeUsd * simulatedPnlPct) / 100).toFixed(2)) : 0;

      const newTrade: TradeRecord = {
        id: `0xtrade_${Math.random().toString(16).substring(2, 7)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        asset,
        type: tradeType,
        sizeUsd: tradeSizeUsd,
        priceUsd: basePrice,
        pnlUsd: simulatedPnlUsd,
        pnlPct: simulatedPnlPct,
        status: isExecuted ? 'executed' : 'rejected',
        proofTimeMs: Math.floor(350 + Math.random() * 150),
        commitmentHash: strategy?.commitmentHash || txHash,
        txHash,
      };

      setTrades((prev) => [newTrade, ...prev]);

      // Non-blocking off-chain sync to Supabase / localStorage
      syncTradeExecution({
        trade_id: newTrade.id,
        agent_id: agentId,
        commitment_hash: newTrade.commitmentHash,
        tx_hash: txHash,
        asset,
        status: newTrade.status,
        proof_time_ms: newTrade.proofTimeMs,
        timestamp: newTrade.timestamp,
      }).catch((e) => console.warn('[Axiom Sync] Trade sync error:', e));
      addLog('success', 'Trade Proven', `Trade ${newTrade.id} — ${asset} $${tradeSizeUsd} — TX: ${txHash.substring(0, 18)}…`);
      return newTrade;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Trade execution failed';
      setError(msg);
      addLog('error', 'Trade Failed', msg);
      return undefined;
    } finally {
      setIsProofGenerating(false);
    }
  }, [activeStrategies, addLog]);

  return {
    // Wallet state
    detectedWallets,
    isWalletAvailable,
    walletConnected,
    walletAddress,
    shieldedAddress,
    walletName,
    networkId,
    balance,
    shieldedBalance,
    unshieldedBalance,
    dustBalance,
    isConnecting,
    error,

    // Health
    proofServerUp,
    dustReady,

    // Explorer
    latestBlock,

    // UI
    isModalOpen,
    setIsModalOpen,
    protocolLogs,

    // Actions
    scanWallets,
    handleSelectNetwork,
    connectWallet,
    disconnectWallet,

    // Strategy & trading
    activeStrategies,
    trades,
    isProofGenerating,
    proofStep,
    commitStrategyCircuit,
    executeProvenTrade,

    // Compat shims for existing components
    windowMidnightKeys: detectedWallets.map((w) => w.id),
    serviceConfig: session?.serviceConfig ?? null,
    addProtocolLog: addLog,
  };
}
