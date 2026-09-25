import React from 'react';
import {
  LayoutDashboard,
  LineChart,
  Cpu,
  PieChart,
  History,
  ArrowUpRight,
  Sparkles,
  Blocks,
  Clock,
  Users,
  Bot
} from 'lucide-react';
import { WalletConnect } from './WalletConnect';
import type { DetectedWallet } from '../lib/lace-wallet';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  walletConnected: boolean;
  walletAddress: string | null;
  shieldedAddress?: string | null;
  walletName: string;
  networkId?: string;
  detected1AMNetwork?: string;
  isNetworkAligned?: boolean;
  balance: string;
  shieldedBalance?: string;
  unshieldedBalance?: string;
  dustBalance?: string;
  isConnecting: boolean;
  error: string | null;
  proofServerUp?: boolean | null;
  dustReady?: boolean;
  latestBlockHeight?: number;
  detectedWallets?: DetectedWallet[];
  onOpenModal: () => void;
  onScan?: () => void;
  onConnect: (wallet?: unknown) => void;
  onDisconnect: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  walletConnected,
  walletAddress,
  shieldedAddress,
  walletName,
  networkId = 'preview',
  detected1AMNetwork,
  isNetworkAligned = true,
  balance,
  shieldedBalance,
  unshieldedBalance,
  dustBalance,
  isConnecting,
  error,
  proofServerUp,
  dustReady,
  latestBlockHeight,
  detectedWallets = [],
  onOpenModal,
  onScan,
  onConnect,
  onDisconnect
}) => {
  const navItems = [
    { id: 'landing', label: 'Studio Home', icon: Sparkles },
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'strategy-builder', label: 'Strategy Builder', icon: Cpu, highlight: true },
    { id: 'zk-bot', label: 'ZK Execution Bot', icon: Bot, highlight: true },
    { id: 'market-insights', label: 'Market Insights', icon: LineChart },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart },
    { id: 'trade-history', label: 'Trade History', icon: History },
    { id: 'withdraw', label: 'Vault & Withdraw', icon: ArrowUpRight },
    { id: 'launch-hub', label: 'Launch Hub (77)', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-[var(--frame,#E6EDF6)] text-[var(--ink,#020C21)] flex flex-col font-sans selection:bg-[#4A78B0] selection:text-white">
      {/* Top Navbar — Luxury Glass Pill Shape Matching Landing Page */}
      <header className="w-full max-w-[1440px] mx-auto p-2 sm:p-3 sticky top-0 z-50">
        <nav className="bg-white/90 backdrop-blur-xl rounded-full p-[6px] pl-3.5 pr-2 flex items-center justify-between shadow-sm border border-white/80">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('landing')}
              className="flex items-center gap-3 group cursor-pointer text-left"
            >
              <div className="h-11 sm:h-12 px-3 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-center shrink-0 group-hover:border-[#3C1868]/40 transition-colors">
                <img
                  src="/axiom-logo.png"
                  alt="Axiom Trade Logo"
                  className="h-8 sm:h-9 w-auto object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-extrabold text-[#020C21] tracking-tight leading-none">
                    AXIOM TRADE
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#0F1B31] text-white uppercase tracking-wider">
                    {networkId}
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 font-medium hidden sm:block">
                  Confidential AI-Orchestrated Protocol
                </span>
              </div>
            </button>
          </div>

          {/* Header Center: Clean Breadcrumb / Active Module Indicator */}
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full bg-white/70 border border-gray-200/80 shadow-2xs">
            <span className="text-gray-400">/</span>
            <span className="text-[#020C21] font-bold capitalize">
              {navItems.find((n) => n.id === activeTab)?.label || activeTab}
            </span>
          </div>

          {/* Header Right: Wallet Connect */}
          <div className="flex items-center gap-3">
            <WalletConnect
              connected={walletConnected}
              address={walletAddress}
              shieldedAddress={shieldedAddress}
              walletName={walletName}
              networkId={networkId}
              detected1AMNetwork={detected1AMNetwork}
              isNetworkAligned={isNetworkAligned}
              balance={balance}
              shieldedBalance={shieldedBalance}
              unshieldedBalance={unshieldedBalance}
              isConnecting={isConnecting}
              error={error}
              proofServerUp={proofServerUp}
              dustReady={dustReady}
              detectedWallets={detectedWallets}
              onOpenModal={onOpenModal}
              onScan={onScan}
              onConnect={onConnect}
              onDisconnect={onDisconnect}
            />
          </div>
        </nav>
      </header>

      {/* Mobile Horizontal Navigation Strip (only visible on mobile where sidebar is hidden) */}
      <div className="md:hidden w-full max-w-[1440px] mx-auto px-2 sm:px-4 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-200/80 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-400' : 'text-gray-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container with Sidebar + Content */}
      <div className="w-full max-w-[1440px] mx-auto flex-1 flex overflow-hidden px-2 sm:px-4 pb-4 gap-4">
        {/* Sidebar (Desktop) */}
        <aside className="w-64 bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl hidden md:flex flex-col justify-between p-4 shrink-0 shadow-sm">
          <div className="space-y-1.5">
            <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Protocol Modules
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0F1B31] text-white shadow-md'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-white/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#A070D6]' : 'text-gray-500'}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.highlight && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3C1868] shadow-xs"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer Info */}
          <div className="bg-gradient-to-br from-white to-[#F5F8FC] border border-gray-200/80 rounded-2xl p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between font-medium">
              <span className="text-gray-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#3C1868]" /> ZK Engine
              </span>
              <span className="text-[#020C21] font-bold text-[10px] bg-white px-2 py-0.5 rounded-full border border-gray-200 shadow-2xs">
                Compact v1.3.0
              </span>
            </div>
            <div className="text-[11px] text-gray-500 space-y-1 pt-1 border-t border-gray-200/60">
              <div className="flex items-center justify-between">
                <span>Active Network:</span>
                <span className="font-semibold text-gray-800 uppercase">{networkId}</span>
              </div>
              {latestBlockHeight && (
                <div className="flex items-center justify-between text-emerald-600 font-semibold">
                  <span className="flex items-center gap-1 text-gray-500 font-normal">
                    <Blocks className="w-3.5 h-3.5" /> Block:
                  </span>
                  <span>#{latestBlockHeight.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto space-y-6">
          {children}
        </main>
      </div>

      {/* Footer Ticker Matching Landing Page */}
      <footer className="bg-white/90 backdrop-blur-md border-t border-white/80 py-2.5 px-4 sm:px-6 text-xs text-gray-600 font-mono">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2">
              <img src="/axiom-logo.png" alt="Axiom Trade Logo" className="h-4.5 w-auto object-contain" />
              <span className="font-bold text-[#020C21]">AXIOM TRADE</span>
            </div>
            <span className="text-gray-300">•</span>
            {latestBlockHeight && (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                BLOCK #{latestBlockHeight.toLocaleString()}
              </span>
            )}
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1.5">
              <span>ADA/USD:</span>
              <span className="text-[#020C21] font-bold">$0.421</span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">+2.4%</span>
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1.5">
              <span>BTC/USD:</span>
              <span className="text-[#020C21] font-bold">$61,250</span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">+1.1%</span>
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1.5">
              <span>tNIGHT:</span>
              <span className="text-[#020C21] font-bold">$1.00</span>
              <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-1.5 py-0.5 rounded">ZK Pegged</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-gray-700 font-medium">Midnight {networkId === 'preprod' ? 'Preprod' : 'Preview'} Explorer API Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

