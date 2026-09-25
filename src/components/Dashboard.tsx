import React from 'react';
import {
  Clock,
  Blocks,
  Lock,
  AlertTriangle,
  Bot
} from 'lucide-react';
import { formatISTDate, formatISTTime } from '../utils/time';
import { MarketChart } from './MarketChart';
import { OverviewStrategies } from './OverviewStrategies';
import { PreprodCounter } from './PreprodCounter';
import { ProtocolLog } from './ProtocolLog';

interface DashboardProps {
  displayGreetingAddr: string;
  networkId: string;
  isSyncing: boolean;
  error: string | null;
  unshieldedBalance: string;
  shieldedBalance: string;
  dustBalance: string;
  vaultBalance: number;
  latestBlock: { height: number; hash: string } | null;
  activeStrategies: any[];
  protocolLogs: any[];
  clearLogs: () => void;
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  displayGreetingAddr,
  networkId,
  isSyncing,
  error,
  unshieldedBalance,
  shieldedBalance,
  dustBalance,
  vaultBalance,
  latestBlock,
  activeStrategies,
  protocolLogs,
  clearLogs,
  setActiveTab
}) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* Top Greeting Header (Indian Standard Time - IST) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-14 px-3.5 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-center shrink-0">
            <img
              src="/axiom-logo.png"
              alt="Axiom Trade Logo"
              className="h-9 w-auto object-contain"
            />
          </div>
          <div>
            <div className="text-[11px] text-[#59627E] uppercase tracking-wider flex items-center gap-2 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#3C1868]" />
              <span>{formatISTDate()} • {formatISTTime()}</span>
              {latestBlock && (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  • <Blocks className="w-3.5 h-3.5" /> Block #{latestBlock.height.toLocaleString()}
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#020C21] tracking-tight">
              Welcome back, <span className="text-[#3C1868]">{displayGreetingAddr}</span>
            </h1>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-gray-200 text-[#020C21] text-xs font-semibold shrink-0 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="uppercase font-bold">{networkId} TESTNET (IST)</span>
        </div>
      </div>

      {/* Wallet Syncing Banner */}
      {isSyncing && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-900 text-xs flex items-center gap-3 shadow-xs">
          <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin shrink-0" />
          <div>
            <span className="font-bold text-amber-800 block">1AM Wallet Syncing</span>
            <p className="leading-relaxed text-amber-700">
              Your wallet is syncing with Midnight Preprod. Open the 1AM extension and wait for sync to finish before transacting. Balance will update automatically.
            </p>
          </div>
        </div>
      )}

      {/* Error Banner for ZK Risk Model or Wallet Errors */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-red-900 text-xs flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-red-800 block">Notice / Risk Restriction</span>
            <p className="leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Top Balance Cards: Public Wallet vs Shielded Vault */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 space-y-1 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">WALLET TNIGHT (UNSHIELDED)</span>
          <div className="flex items-baseline gap-2 pt-1 min-w-0">
            <span className="text-xl sm:text-2xl font-extrabold text-gray-900 truncate">{unshieldedBalance}</span>
          </div>
          <span className="text-[11px] text-gray-500 font-medium block pt-1">↑ Public 1AM Wallet</span>
        </div>

        <div className="bg-white border border-orange-200/80 rounded-2xl p-5 space-y-1 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <span className="text-[11px] text-orange-600 font-semibold uppercase tracking-wider flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-orange-500" /> SHIELDED VAULT (vUSD)
          </span>
          <div className="flex items-baseline gap-2 pt-1 min-w-0">
            <span className="text-xl sm:text-2xl font-extrabold text-gray-900 truncate">${vaultBalance.toLocaleString()}</span>
            <span className="text-xs text-orange-600 font-bold shrink-0">vUSD</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium block pt-1">
            {vaultBalance > 0 ? '↑ Active Trading Capital' : '↑ Mint via Vault Tab'}
          </span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 space-y-1 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">SHIELDED TNIGHT NOTE</span>
          <div className="flex items-baseline gap-2 pt-1 min-w-0">
            <span className="text-xl sm:text-2xl font-extrabold text-gray-900 truncate">{shieldedBalance}</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium block pt-1">↑ Private ZK Note</span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 space-y-1 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">TDUST FUEL RESERVE</span>
          <div className="flex items-baseline gap-2 pt-1 min-w-0">
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-700 truncate">{dustBalance}</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium block pt-1">↑ ProofStation Ready</span>
        </div>
      </div>

      {/* Main Overview Grid: Market Chart & Strategies Matrix + Live Protocol Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Live Market Interactive Chart + Active Strategies & Position Matrix */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interactive Live Market Price & Analytics Graph */}
          <MarketChart
            onNavigateTab={setActiveTab}
            vaultBalance={vaultBalance}
          />

          {/* Active Strategy Commitments & Position Bounds Matrix */}
          <OverviewStrategies
            activeStrategies={activeStrategies}
            vaultBalance={vaultBalance}
            networkId={networkId}
            onNavigateTab={setActiveTab}
          />

          <PreprodCounter />

          <div className="bg-white border border-orange-200/80 rounded-2xl p-4 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-extrabold text-xs">
                L6
              </div>
              <div>
                <span className="text-xs font-extrabold text-gray-900 block">Level 6 Launch Users Hub</span>
                <span className="text-[11px] text-gray-500">27 distinct launch users • 77 active directory</span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('launch-hub')}
              className="px-3.5 py-1.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              Open Hub →
            </button>
          </div>

          <div className="bg-white border border-purple-200/80 rounded-2xl p-4 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-extrabold text-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-gray-900 block">Autonomous ZK Execution Bot</span>
                <span className="text-[11px] text-gray-500">Algorithmic runner • 4 stress tests • Institutional audit</span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('zk-bot')}
              className="px-3.5 py-1.5 rounded-full bg-gray-900 hover:bg-black text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              Launch Bot →
            </button>
          </div>
        </div>

        {/* Right 1 Column: Live Real-Time Protocol Event Log in IST */}
        <div className="lg:col-span-1">
          <ProtocolLog logs={protocolLogs} networkId={networkId} onClearLogs={clearLogs} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
