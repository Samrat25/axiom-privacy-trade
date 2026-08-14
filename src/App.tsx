import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { StrategyBuilder } from './components/StrategyBuilder';
import { WalletModal } from './components/WalletModal';
import { ProtocolLog } from './components/ProtocolLog';
import { MarketInsights } from './components/MarketInsights';
import { Portfolio } from './components/Portfolio';
import { TradeHistory } from './components/TradeHistory';
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
  MinusCircle
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
  const [confirmedTradeMap, setConfirmedTradeMap] = useState<Record<string, boolean>>({});

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

  const explorerBaseUrl = networkId === 'preprod' ? 'https://preprod.midnightexplorer.com' : 'https://midnightexplorer.com';

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
            {/* Top Greeting Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <img
                  src="/axiom-logo.png"
                  alt="Axiom"
                  className="w-12 h-12 rounded-full object-cover shadow-sm bg-gray-900 shrink-0"
                />
                <div>
                  <div className="text-[11px] text-gray-500 uppercase tracking-wider flex items-center gap-2 font-medium">
                    <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
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
                <span className="uppercase">{networkId} TESTNET</span>
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

            {/* Top Balance Cards including Shielded Vault */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200/80 rounded-2xl p-5 space-y-1 shadow-sm">
                <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">SHIELDED TOKEN BALANCE</span>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-2xl font-extrabold text-gray-900">{shieldedBalance}</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-medium block pt-1">↑ Private ZK Note</span>
              </div>

              <div className="bg-white border border-orange-200/80 rounded-2xl p-5 space-y-1 shadow-sm">
                <span className="text-[11px] text-orange-600 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-orange-500" /> SHIELDED VAULT (vUSD)
                </span>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-2xl font-extrabold text-gray-900">${vaultBalance.toLocaleString()}</span>
                  <span className="text-xs text-orange-600 font-bold">vUSD</span>
                </div>
                <span className="text-[11px] text-gray-500 font-medium block pt-1">↑ Shielded Collateral Vault</span>
              </div>

              <div className="bg-white border border-gray-200/80 rounded-2xl p-5 space-y-1 shadow-sm">
                <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">UNSHIELDED BALANCE</span>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-2xl font-extrabold text-gray-900">{unshieldedBalance}</span>
                </div>
                <span className="text-[11px] text-gray-500 font-medium block pt-1">↑ Public Ledger Balance</span>
              </div>

              <div className="bg-white border border-gray-200/80 rounded-2xl p-5 space-y-1 shadow-sm">
                <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">TDUST FUEL RESERVE</span>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-2xl font-extrabold text-emerald-700">{dustBalance}</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-medium block pt-1">↑ ProofStation Ready</span>
              </div>
            </div>

            {/* Active Commitments + LIVE PROTOCOL LOG Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Strategy Commitments */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-orange-500" />
                    Active Agent Commitments
                  </h3>
                  <span className="text-xs text-gray-500">Human Confirmation Required</span>
                </div>

                {activeStrategies.length === 0 ? (
                  <div className="bg-white border border-gray-200/80 rounded-2xl p-8 text-center space-y-4 shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-600">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <p className="text-xs text-gray-600 max-w-md mx-auto">No active strategy commitment created yet. Build your first shielded trading strategy with AI natural-language parsing.</p>
                    <button
                      onClick={() => setActiveTab('strategy-builder')}
                      className="px-5 py-2.5 rounded-full bg-gray-900 hover:bg-black text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
                    >
                      + Create Shielded Strategy
                    </button>
                  </div>
                ) : (
                  activeStrategies.map((strat) => {
                    const rec = recommendationMap[strat.agentId];
                    const isConfirmed = confirmedTradeMap[strat.agentId] || false;

                    return (
                      <div key={strat.id} className="bg-white border border-gray-200/80 rounded-2xl p-5 space-y-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-900 border border-gray-200">
                              {strat.params.asset}
                            </span>
                            <span className="text-xs font-semibold text-gray-900">
                              Agent: <code className="text-gray-600 font-mono">{strat.agentId}</code>
                            </span>
                          </div>
                          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase tracking-wider">
                            {strat.status}
                          </span>
                        </div>

                        <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-xs space-y-1 text-gray-800">
                          <div className="flex items-center justify-between text-[11px] text-gray-500 uppercase tracking-wider font-semibold">
                            <span>Public Commitment Hash</span>
                            <a
                              href="https://preview.midnightexplorer.com/contract/0x62a27ceda5eb600263e208768d5d285c659d47f2cd6b14a20c62b160f4da46f3"
                              target="_blank"
                              rel="noreferrer"
                              className="text-orange-600 hover:underline flex items-center gap-1 font-bold"
                            >
                              <span>Axiom Contract Explorer</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                          <div className="text-gray-900 font-mono font-medium truncate">{strat.commitmentHash}</div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 pt-1 font-medium">
                          <div>Max Position: <span className="text-gray-900 font-bold">{strat.params.maxPositionPct}%</span></div>
                          <div>Stop Loss: <span className="text-gray-900 font-bold">{strat.params.stopLossPct}%</span></div>
                          <div>Duration: <span className="text-gray-900 font-bold">{strat.params.timelineDays} Days</span></div>
                        </div>

                        {/* STEP 1: Analyze Button */}
                        {!rec && (
                          <div className="pt-2">
                            <button
                              onClick={() => analyzeStrategy(strat.agentId)}
                              disabled={isAnalyzing}
                              className="w-full py-2.5 rounded-full bg-gray-900 hover:bg-black text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                            >
                              <Zap className="w-4 h-4 text-orange-400" />
                              <span>{isAnalyzing ? 'Running Gemini AI Analysis...' : 'Analyze Market & Strategy Bounds'}</span>
                            </button>
                          </div>
                        )}

                        {/* STEP 2: Recommendation & Human Agreement Box */}
                        {rec && (
                          <div className="bg-gray-50 border border-orange-200 rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                              <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                                <Cpu className="w-3.5 h-3.5 text-orange-500" /> AI Trade Recommendation
                              </span>
                              <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-white text-gray-900 border border-gray-200">
                                Action: {rec.suggestedAction}
                              </span>
                            </div>

                            <p className="text-xs text-gray-700 leading-relaxed font-sans">{rec.recommendation}</p>

                            {/* Shielded Vault Balance Requirement Check */}
                            <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600 font-medium">Shielded Vault Available:</span>
                                <span className={`font-extrabold ${vaultBalance >= rec.suggestedTradeSizeUsd ? 'text-emerald-700' : 'text-amber-600'}`}>
                                  ${vaultBalance.toLocaleString()} vUSD
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600 font-medium">Required Trade Size:</span>
                                <span className="font-extrabold text-gray-900">${rec.suggestedTradeSizeUsd.toLocaleString()} vUSD</span>
                              </div>
                            </div>

                            {vaultBalance < rec.suggestedTradeSizeUsd && (
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                                <span className="font-medium">
                                  ⚠️ Insufficient Shielded Vault Balance (${vaultBalance.toLocaleString()} available). You must have at least ${rec.suggestedTradeSizeUsd.toLocaleString()} vUSD in your vault to trade.
                                </span>
                                <button
                                  onClick={() => setActiveTab('withdraw')}
                                  className="text-xs font-bold text-amber-900 hover:underline cursor-pointer shrink-0"
                                >
                                  Mint in Vault →
                                </button>
                              </div>
                            )}

                            <div className="flex items-center gap-2 pt-1 border-t border-gray-200">
                              <input
                                type="checkbox"
                                id={`agree_${strat.agentId}`}
                                checked={isConfirmed}
                                onChange={(e) =>
                                  setConfirmedTradeMap((prev) => ({ ...prev, [strat.agentId]: e.target.checked }))
                                }
                                className="w-4 h-4 rounded bg-white border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                              />
                              <label htmlFor={`agree_${strat.agentId}`} className="text-xs text-gray-800 cursor-pointer select-none font-medium">
                                <strong>Human Confirmation:</strong> Yes, I agree to execute this trade recommendation with ZK proof.
                              </label>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 pt-1">
                              <button
                                onClick={() =>
                                  executeProvenTrade(strat.agentId, rec.suggestedTradeSizeUsd, strat.params.asset, 'BUY')
                                }
                                disabled={!isConfirmed || isProofGenerating || vaultBalance < rec.suggestedTradeSizeUsd}
                                className={`flex-1 py-2.5 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
                                  isConfirmed && !isProofGenerating && vaultBalance >= rec.suggestedTradeSizeUsd
                                    ? 'bg-[#F26522] hover:bg-[#e05a1a] text-white cursor-pointer'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>
                                  {isProofGenerating
                                    ? 'Proving EZKL ZK Trade...'
                                    : vaultBalance < rec.suggestedTradeSizeUsd
                                    ? `Insufficient Vault Balance ($${vaultBalance}/$${rec.suggestedTradeSizeUsd})`
                                    : `Confirm & Execute Trade ($${rec.suggestedTradeSizeUsd})`}
                                </span>
                              </button>

                              {/* Button to test Reckless Trade ZK Risk Model failure */}
                              <button
                                onClick={() =>
                                  executeProvenTrade(strat.agentId, 8500, strat.params.asset, 'BUY', true)
                                }
                                disabled={isProofGenerating}
                                className="px-3.5 py-2.5 rounded-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[11px] font-bold transition-all cursor-pointer shrink-0"
                                title="Tests EZKL Risk Model failure blocking"
                              >
                                Test Reckless Trade (Risk Fail)
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* LIVE PROTOCOL LOG Panel */}
              <ProtocolLog logs={protocolLogs} />
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
          />
        )}

        {/* 3. MARKET INSIGHTS */}
        {activeTab === 'market-insights' && (
          <MarketInsights
            onExecuteTrade={(asset, amount) => executeProvenTrade(activeStrategies[0]?.agentId || '0xagent_1', amount, asset, 'BUY')}
            isProofGenerating={isProofGenerating}
            walletConnected={walletConnected}
            onConnectWallet={() => setIsModalOpen(true)}
            vaultBalance={vaultBalance}
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
      />
    </>
  );
}

export default App;

