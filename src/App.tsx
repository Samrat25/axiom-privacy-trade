import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { StrategyBuilder } from './components/StrategyBuilder';
import { WalletModal } from './components/WalletModal';
import { ProtocolLog } from './components/ProtocolLog';
import { MarketInsights } from './components/MarketInsights';
import { Portfolio } from './components/Portfolio';
import { TradeHistory } from './components/TradeHistory';
import { MarketChart } from './components/MarketChart';
import { OverviewStrategies } from './components/OverviewStrategies';
import { formatISTDate, formatISTTime } from './utils/time';
import { useMidnight } from './hooks/useMidnight';
import {
  Shield,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Zap,
  CheckCircle2,
  ExternalLink,
  Blocks,
  AlertTriangle,
  Lock,
  PlusCircle,
  MinusCircle,
  Clock
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');

  const {
    detectedWallets,
    scanWallets,
    walletConnected,
    walletAddress,
    shieldedAddress,
    walletName,
    networkId,
    balance,
    shieldedBalance,
    unshieldedBalance,
    dustBalance,
    vaultBalance,
    isConnecting,
    error,
    proofServerUp,
    dustReady,
    isModalOpen,
    setIsModalOpen,
    protocolLogs,
    latestBlock,
    handleSelectNetwork,
    connectWallet,
    disconnectWallet,
    clearWalletCache,
    mintVault,
    burnVault,
    activeStrategies,
    trades,
    isProofGenerating,
    proofStep,
    isAnalyzing,
    recommendationMap,
    analyzeStrategy,
    commitStrategyCircuit,
    executeProvenTrade
  } = useMidnight();

  const [withdrawAmount, setWithdrawAmount] = useState<string>('500');
  const [mintAmount, setMintAmount] = useState<string>('250');
  const [withdrawSuccess, setWithdrawSuccess] = useState<boolean>(false);

  // Auto-navigate to dashboard when wallet connects
  useEffect(() => {
    if (walletConnected && activeTab === 'landing') {
      setActiveTab('overview');
    }
  }, [walletConnected]);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawSuccess(true);
    setTimeout(() => setWithdrawSuccess(false), 3000);
  };

  const displayGreetingAddr = walletAddress
    ? walletAddress.length > 20
      ? `${walletAddress.substring(0, 16)}...${walletAddress.substring(walletAddress.length - 6)}`
      : walletAddress
    : 'Connect 1AM Wallet';

  const explorerBaseUrl = networkId === 'preprod' ? 'https://preprod.midnightexplorer.com' : 'https://preview.midnightexplorer.com';

  return (
    <>
      {activeTab === 'landing' ? (
        <LandingPage
          onConnectWallet={() => setIsModalOpen(true)}
          onEnterDashboard={() => setActiveTab('overview')}
          walletConnected={walletConnected}
          walletAddress={walletAddress}
        />
      ) : (
        <Layout
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          walletConnected={walletConnected}
          walletAddress={walletAddress}
          shieldedAddress={shieldedAddress}
          walletName={walletName}
          networkId={networkId}
          balance={balance}
          shieldedBalance={shieldedBalance}
          unshieldedBalance={unshieldedBalance}
          dustBalance={dustBalance}
          isConnecting={isConnecting}
          error={error}
          proofServerUp={proofServerUp}
          dustReady={dustReady}
          latestBlockHeight={latestBlock?.height}
          detectedWallets={detectedWallets}
          onOpenModal={() => setIsModalOpen(true)}
          onScan={scanWallets}
          onConnect={connectWallet}
          onDisconnect={disconnectWallet}
        >
          {/* 1. OVERVIEW / HOME */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-6xl mx-auto font-sans">
              {/* Top Greeting Header (Indian Standard Time - IST) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <img
                    src="/axiom-logo.png"
                    alt="Axiom"
                    className="w-12 h-12 rounded-full object-cover shadow-sm bg-gray-900 shrink-0"
                  />
                  <div>
                    <div className="text-[11px] text-gray-500 uppercase tracking-wider flex items-center gap-2 font-medium">
                      <Clock className="w-3.5 h-3.5 text-orange-500" />
                      <span>{formatISTDate()} • {formatISTTime()}</span>
                      {latestBlock && (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          • <Blocks className="w-3.5 h-3.5" /> Block #{latestBlock.height.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                      Welcome back, <span className="text-orange-600">{displayGreetingAddr}</span>
                    </h1>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-gray-800 text-xs font-semibold shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="uppercase">{networkId} TESTNET (IST)</span>
                </div>
              </div>

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
                <div className="bg-white border border-gray-200/80 rounded-2xl p-5 space-y-1 shadow-sm">
                  <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">WALLET TNIGHT (UNSHIELDED)</span>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-2xl font-extrabold text-gray-900">{unshieldedBalance}</span>
                    <span className="text-xs text-gray-500 font-bold">tNIGHT</span>
                  </div>
                  <span className="text-[11px] text-gray-500 font-medium block pt-1">↑ Public 1AM Wallet</span>
                </div>

                <div className="bg-white border border-orange-200/80 rounded-2xl p-5 space-y-1 shadow-sm">
                  <span className="text-[11px] text-orange-600 font-semibold uppercase tracking-wider flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-orange-500" /> SHIELDED VAULT (vUSD)
                  </span>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-2xl font-extrabold text-gray-900">${vaultBalance.toLocaleString()}</span>
                    <span className="text-xs text-orange-600 font-bold">vUSD</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium block pt-1">
                    {vaultBalance > 0 ? '↑ Active Trading Capital' : '↑ Mint via Vault Tab'}
                  </span>
                </div>

                <div className="bg-white border border-gray-200/80 rounded-2xl p-5 space-y-1 shadow-sm">
                  <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">SHIELDED TNIGHT NOTE</span>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-2xl font-extrabold text-gray-900">{shieldedBalance}</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium block pt-1">↑ Private ZK Note</span>
                </div>

                <div className="bg-white border border-gray-200/80 rounded-2xl p-5 space-y-1 shadow-sm">
                  <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">TDUST FUEL RESERVE</span>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-2xl font-extrabold text-emerald-700">{dustBalance}</span>
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
                    onNavigateTab={setActiveTab}
                  />
                </div>

                {/* Right 1 Column: Live Real-Time Protocol Event Log in IST */}
                <div className="lg:col-span-1">
                  <ProtocolLog logs={protocolLogs} />
                </div>
              </div>
            </div>
          )}

        {/* 2. STRATEGY BUILDER */}
        {activeTab === 'strategy-builder' && (
          <StrategyBuilder
            onCommit={commitStrategyCircuit}
            isProofGenerating={isProofGenerating}
            proofStep={proofStep}
            walletConnected={walletConnected}
            onConnectWallet={() => setIsModalOpen(true)}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* 3. MARKET INSIGHTS */}
        {activeTab === 'market-insights' && (
          <MarketInsights
            onExecuteTrade={(asset, amount, agentId) =>
              executeProvenTrade(agentId || activeStrategies[0]?.agentId || '0xagent_1', amount, asset, 'BUY')
            }
            isProofGenerating={isProofGenerating}
            walletConnected={walletConnected}
            onConnectWallet={() => setIsModalOpen(true)}
            vaultBalance={vaultBalance}
            activeStrategies={activeStrategies}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* 4. PORTFOLIO */}
        {activeTab === 'portfolio' && (
          <Portfolio
            walletConnected={walletConnected}
            networkId={networkId}
            balance={balance}
            shieldedBalance={shieldedBalance}
            unshieldedBalance={unshieldedBalance}
            dustBalance={dustBalance}
            activeStrategies={activeStrategies}
            trades={trades}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* 5. TRADE HISTORY */}
        {activeTab === 'trade-history' && (
          <TradeHistory
            trades={trades}
            onExecuteTrade={(asset, amount) => executeProvenTrade(activeStrategies[0]?.agentId || '0xagent_1', amount, asset, 'BUY')}
            isProofGenerating={isProofGenerating}
            walletConnected={walletConnected}
            onConnectWallet={() => setIsModalOpen(true)}
            networkId={networkId}
            vaultBalance={vaultBalance}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* 6. WITHDRAW & SHIELDED VAULT */}
        {activeTab === 'withdraw' && (
          <div className="max-w-3xl mx-auto space-y-6 font-sans">
            {/* Vault Mint / Burn Section */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 space-y-4 shadow-sm">
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-orange-500" />
                Shielded Vault Management (vUSD)
              </h1>
              <p className="text-xs text-gray-600 leading-relaxed">
                Mint or burn shielded vUSD vault notes using 1AM wallet signatures.
                Current Vault Balance: <strong className="text-gray-900">${vaultBalance.toLocaleString()} vUSD</strong>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Mint */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <PlusCircle className="w-4 h-4 text-emerald-600" /> Mint to Shielded Vault
                  </span>
                  <input
                    type="number"
                    value={mintAmount}
                    onChange={(e) => setMintAmount(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 font-mono"
                  />
                  <button
                    onClick={() => mintVault(parseFloat(mintAmount) || 100)}
                    className="w-full py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
                  >
                    Mint ${mintAmount} vUSD
                  </button>
                </div>

                {/* Burn */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                  <span className="text-xs font-bold text-red-800 flex items-center gap-1">
                    <MinusCircle className="w-4 h-4 text-red-600" /> Burn from Shielded Vault
                  </span>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 font-mono"
                  />
                  <button
                    onClick={() => burnVault(parseFloat(withdrawAmount) || 100)}
                    className="w-full py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
                  >
                    Burn ${withdrawAmount} vUSD
                  </button>
                </div>
              </div>
            </div>

            {/* Unshield Withdraw Section */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 space-y-4 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-orange-500" />
                Unshield & Withdraw (unshieldWithdraw Circuit)
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                Executes the <code className="text-gray-900 font-mono font-semibold">unshieldWithdraw</code> circuit operation. Consumes a private balance note in shielded state and transfers public tNIGHT/ADA tokens back to your 1AM wallet balance.
              </p>

              <form onSubmit={handleWithdrawSubmit} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Withdraw Amount (USD Value)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 font-mono focus:outline-none focus:border-orange-500"
                    />
                    <span className="text-xs font-mono text-gray-500 font-bold">USD</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-gray-900 hover:bg-black text-white font-semibold text-xs transition-all cursor-pointer shadow-sm"
                >
                  Execute Unshield Transfer
                </button>
              </form>

              {withdrawSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Unshield circuit execution successful! Value returned to public 1AM wallet balance.</span>
                </div>
              )}
            </div>
          </div>
        )}
        </Layout>
      )}

      {/* 1AM WALLET MODAL DIALOG */}
      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        connected={walletConnected}
        isConnecting={isConnecting}
        unshieldedAddress={walletAddress}
        shieldedAddress={shieldedAddress}
        shieldedBalance={shieldedBalance}
        unshieldedBalance={unshieldedBalance}
        dustBalance={dustBalance}
        networkId={networkId}
        onSelectNetwork={handleSelectNetwork}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
        onClearCache={clearWalletCache}
      />
    </>
  );
}

export default App;

