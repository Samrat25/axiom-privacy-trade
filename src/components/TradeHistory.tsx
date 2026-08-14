import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  ExternalLink,
  Zap,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  Shield,
  Filter,
  Globe,
  Layers,
  RefreshCw,
  Terminal
} from 'lucide-react';
import type { TradeRecord } from '../utils/contract';
import {
  getMidnightExplorerTxUrl,
  getMidnightExplorerContractUrl,
  fetchRecentMidnightTransactions,
  type MidnightApiTransaction
} from '../utils/midnightApi';

interface TradeHistoryProps {
  trades: TradeRecord[];
  onExecuteTrade: (asset: string, amountUsd: number) => Promise<unknown>;
  isProofGenerating: boolean;
  walletConnected: boolean;
  onConnectWallet: () => void;
  networkId: string;
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({
  trades,
  onExecuteTrade,
  isProofGenerating,
  walletConnected,
  onConnectWallet,
  networkId
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'executed' | 'rejected'>('all');
  const [viewMode, setViewMode] = useState<'zk-circuits' | '1am-explorer'>('zk-circuits');
  const [explorerTxs, setExplorerTxs] = useState<MidnightApiTransaction[]>([]);
  const [isLoadingExplorer, setIsLoadingExplorer] = useState<boolean>(false);

  const net = networkId === 'mainnet' ? 'preview' : (networkId as 'preview' | 'preprod');

  const loadExplorerTxs = () => {
    setIsLoadingExplorer(true);
    fetchRecentMidnightTransactions(net).then((txs) => {
      setExplorerTxs(txs);
      setIsLoadingExplorer(false);
    });
  };

  useEffect(() => {
    if (viewMode === '1am-explorer') {
      loadExplorerTxs();
    }
  }, [viewMode, net]);

  const filteredTrades = trades.filter((trade) => {
    const matchesSearch =
      trade.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.commitmentHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (trade.txHash && trade.txHash.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || trade.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-mono text-gray-100">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0F141C] border border-gray-800/90 rounded-2xl p-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl font-extrabold text-white">Midnight Explorer Transaction Logs</h1>
            <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800/50 px-2.5 py-0.5 rounded-full font-bold uppercase">
              {networkId} TESTNET LOGS
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Real-time on-chain transaction hashes & strategy commitments logged via Midnight Explorer API (`m9ex_d9...`).
          </p>
        </div>

        {/* View Mode Toggle & Execute Button */}
        <div className="flex items-center gap-3">
          <div className="flex bg-[#080B10] border border-gray-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('zk-circuits')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'zk-circuits'
                  ? 'bg-purple-950 text-purple-300 border border-purple-800/50 shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>ZK Circuits</span>
            </button>
            <button
              onClick={() => setViewMode('1am-explorer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === '1am-explorer'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50 shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Midnight Explorer Feed</span>
            </button>
          </div>

          <button
            onClick={() => {
              if (!walletConnected) {
                onConnectWallet();
              } else {
                onExecuteTrade('ADA', 1200);
              }
            }}
            disabled={isProofGenerating}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-950 transition-all cursor-pointer shrink-0 disabled:opacity-50"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>{isProofGenerating ? 'Proving ZK Circuit...' : 'Simulate & Sign ZK Trade'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0F141C] border border-gray-800/90 rounded-2xl p-4 shadow-md">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Trade ID, Asset, or Hash..."
            className="w-full bg-[#080B10] border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-400">Status:</span>
          <div className="flex bg-[#080B10] border border-gray-800 rounded-xl p-1">
            {(['all', 'executed', 'rejected'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-purple-950 text-purple-300 border border-purple-800/50 shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: ZK CIRCUIT TRADES TABLE */}
      {viewMode === 'zk-circuits' && (
        <div className="bg-[#0F141C] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#080B10] text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="p-4">Trade ID</th>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Asset & Type</th>
                  <th className="p-4">Size & Price</th>
                  <th className="p-4">P&L</th>
                  <th className="p-4">1AM Transaction Hash</th>
                  <th className="p-4">Proof Time</th>
                  <th className="p-4 font-bold text-amber-300">RPC Status</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80 text-gray-200">
                {filteredTrades.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-gray-500 font-mono">
                      No trade records matching filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTrades.map((trade) => {
                    const isExecuted = trade.status === 'executed';
                    const isProfit = (trade.pnlUsd || 0) >= 0;
                    const txHashDisplay = trade.txHash || trade.commitmentHash;
                    const explorerUrl = getMidnightExplorerTxUrl(txHashDisplay, net);

                    return (
                      <tr key={trade.id} className="hover:bg-[#141A26] transition-colors">
                        {/* Trade ID */}
                        <td className="p-4 font-bold text-white flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span>{trade.id}</span>
                        </td>

                        {/* Timestamp */}
                        <td className="p-4 text-gray-400">{trade.timestamp}</td>

                        {/* Asset & Type */}
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-purple-300">{trade.asset}</span>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                trade.type === 'BUY'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                                  : trade.type === 'STOP_LOSS'
                                  ? 'bg-red-950 text-red-400 border border-red-800/40'
                                  : 'bg-gray-900 text-gray-300'
                              }`}
                            >
                              {trade.type || 'BUY'}
                            </span>
                          </div>
                        </td>

                        {/* Size & Price */}
                        <td className="p-4">
                          <div className="font-bold text-white">${trade.sizeUsd ? trade.sizeUsd.toLocaleString() : '1,200'}</div>
                          <div className="text-[10px] text-gray-400">@ ${trade.priceUsd ? trade.priceUsd.toLocaleString() : '0.421'}</div>
                        </td>

                        {/* P&L */}
                        <td className="p-4">
                          {isExecuted ? (
                            <div className={`font-bold flex items-center gap-0.5 ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                              {isProfit ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              <span>{isProfit ? '+' : ''}${trade.pnlUsd?.toFixed(2) || '0.00'}</span>
                              <span className="text-[10px] opacity-80">({isProfit ? '+' : ''}{trade.pnlPct || 0}%)</span>
                            </div>
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </td>

                        {/* Midnight Explorer Link */}
                        <td className="p-4">
                          <div className="flex flex-col gap-1 font-mono">
                            <a
                              href={getMidnightExplorerTxUrl(txHashDisplay, net)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-purple-400 hover:text-purple-300 hover:underline flex items-center gap-1 text-[11px] font-bold"
                              title={`Open Midnight Explorer for transaction ${txHashDisplay}`}
                            >
                              <span>Tx: {txHashDisplay.substring(0, 12)}…</span>
                              <ExternalLink className="w-3 h-3 shrink-0 text-purple-400" />
                            </a>
                            <a
                              href={getMidnightExplorerContractUrl(trade.commitmentHash, net)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-gray-400 hover:text-gray-200 hover:underline flex items-center gap-1 text-[10px]"
                              title={`Open Midnight Explorer contract commitment ${trade.commitmentHash}`}
                            >
                              <span>Commitment: {trade.commitmentHash.substring(0, 10)}…</span>
                              <ExternalLink className="w-2.5 h-2.5 shrink-0 text-gray-500" />
                            </a>
                          </div>
                        </td>

                        {/* Proof Time */}
                        <td className="p-4 text-gray-400 font-mono">{trade.proofTimeMs} ms</td>

                        {/* RPC Status */}
                        <td className="p-4">
                          {trade.rpcStatus === 'confirmed' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Confirmed
                            </span>
                          ) : trade.rpcStatus === 'failed' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800/40">
                              <XCircle className="w-3 h-3 text-red-400" /> Failed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800/40">
                              <RefreshCw className="w-3 h-3 animate-spin text-amber-400" /> Pending
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          {isExecuted ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                              <CheckCircle2 className="w-3 h-3" />
                              Executed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-950 text-red-400 border border-red-800/50">
                              <XCircle className="w-3 h-3" />
                              Rejected
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: 1AM EXPLORER LIVE NETWORK FEED */}
      {viewMode === '1am-explorer' && (
        <div className="bg-[#0F141C] border border-gray-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                Live 1AM Midnight Explorer Stream ({net})
              </h2>
              <p className="text-xs text-gray-400">
                Direct RPC feed from Midnight Explorer API key <code className="text-purple-300">m9ex_d9...</code>
              </p>
            </div>

            <button
              onClick={loadExplorerTxs}
              disabled={isLoadingExplorer}
              className="p-2 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 hover:text-white transition-all cursor-pointer"
              title="Refresh 1AM Explorer Feed"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingExplorer ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>

          <div className="bg-[#080B10] border border-gray-800/90 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#0F141C] text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="p-3.5">Transaction Hash</th>
                  <th className="p-3.5">Block Height</th>
                  <th className="p-3.5">Circuit Action</th>
                  <th className="p-3.5">Network Fee</th>
                  <th className="p-3.5">Midnight Explorer Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80 text-gray-200">
                {explorerTxs.map((tx) => {
                  const url = getMidnightExplorerTxUrl(tx.txHash, net);
                  return (
                    <tr key={tx.txHash} className="hover:bg-[#141A26] transition-colors font-mono">
                      <td className="p-3.5 font-bold text-purple-300 truncate max-w-[200px]">
                        {tx.txHash}
                      </td>
                      <td className="p-3.5 text-emerald-400 font-bold">
                        #{tx.blockHeight.toLocaleString()}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800/40">
                          {tx.circuitName}
                        </span>
                      </td>
                      <td className="p-3.5 text-amber-300 font-semibold">{tx.fee}</td>
                      <td className="p-3.5">
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-400 hover:underline font-bold text-[11px]"
                        >
                          <span>Open in Midnight Explorer</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
