import { useState } from 'react';
import { Layout } from './components/Layout';
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
  Blocks
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');

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
    activeStrategies,
    trades,
    isProofGenerating,
    proofStep,
    commitStrategyCircuit,
    executeProvenTrade
  } = useMidnight();

  const [withdrawAmount, setWithdrawAmount] = useState<string>('500');
  const [withdrawSuccess, setWithdrawSuccess] = useState<boolean>(false);
  const [simulatingTrade, setSimulatingTrade] = useState<boolean>(false);

  const handleSimulateTrade = async (asset: string = 'ADA', amountUsd: number = 1200) => {
    const targetAgentId = activeStrategies[0]?.agentId || '0xagent_1am_01';
    setSimulatingTrade(true);
    await executeProvenTrade(targetAgentId, amountUsd, asset, 'BUY');
    setSimulatingTrade(false);
  };

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
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Top Greeting Header matching FreightVeil screenshot */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
              <div>
                <div className="text-[11px] text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  {latestBlock && (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      • <Blocks className="w-3.5 h-3.5" /> Block #{latestBlock.height.toLocaleString()}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Good evening, <span className="text-amber-300 font-bold">{displayGreetingAddr}</span>.
                </h1>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-bold font-mono tracking-wider shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="uppercase">{networkId} NETWORK</span>
              </div>
            </div>

            {/* Top 4 Balance Cards matching FreightVeil screenshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
              <div className="bg-[#0F141C] border border-gray-800/90 rounded-2xl p-4 space-y-1 shadow-lg">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">SHIELDED TOKEN BALANCE</span>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-2xl font-extrabold text-white">{shieldedBalance}</span>
                </div>
                <span className="text-[10px] text-emerald-400 block pt-1">↑ Private ZK Ledger</span>
              </div>

              <div className="bg-[#0F141C] border border-gray-800/90 rounded-2xl p-4 space-y-1 shadow-lg">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">UNSHIELDED TOKEN BALANCE</span>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-2xl font-extrabold text-purple-300">{unshieldedBalance}</span>
                </div>
                <span className="text-[10px] text-gray-400 block pt-1">↑ Public Cardano/Midnight Ledger</span>
              </div>

              <div className="bg-[#0F141C] border border-gray-800/90 rounded-2xl p-4 space-y-1 shadow-lg">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">TDUST BALANCE</span>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-2xl font-extrabold text-emerald-400">{dustBalance}</span>
                </div>
                <span className="text-[10px] text-emerald-400 block pt-1">↑ Transaction Fee Reserve</span>
              </div>

              <div className="bg-[#0F141C] border border-gray-800/90 rounded-2xl p-4 space-y-1 shadow-lg">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">TOTAL ACTIVE STRATEGIES</span>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-2xl font-extrabold text-amber-300">{activeStrategies.length}</span>
                </div>
                <span className="text-[10px] text-amber-400 block pt-1">↑ Live Audit Velocity</span>
              </div>
            </div>

            {/* Active Commitments + LIVE PROTOCOL LOG Grid matching FreightVeil screenshot */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Strategy Commitments */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                    <Cpu className="w-4 h-4 text-purple-400" />
                    Active Agent Commitments
                  </h3>
                  <button
                    onClick={() => handleSimulateTrade('ADA', 1200)}
                    disabled={simulatingTrade}
                    className="text-xs px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-purple-300 border border-purple-800/40 flex items-center gap-1.5 transition-all cursor-pointer font-mono"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>{simulatingTrade ? 'Proving...' : 'Simulate Proven Trade'}</span>
                  </button>
                </div>

                {activeStrategies.length === 0 ? (
                  <div className="bg-[#0F141C] border border-gray-800 rounded-2xl p-8 text-center space-y-3 font-mono">
                    <p className="text-xs text-gray-400">No active strategy created yet. Click "Create Strategy" to lock your first shielded strategy witness.</p>
                    <button
                      onClick={() => setActiveTab('strategy-builder')}
                      className="px-4 py-2 rounded-xl bg-purple-950 text-purple-300 border border-purple-800/60 text-xs font-bold hover:bg-purple-900 transition-all cursor-pointer"
                    >
                      + Create Strategy
                    </button>
                  </div>
                ) : (
                  activeStrategies.map((strat) => (
                    <div key={strat.id} className="bg-[#0F141C] border border-purple-900/40 rounded-2xl p-5 space-y-3 shadow-xl font-mono">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-950 text-purple-300 border border-purple-800/40">
                            {strat.params.asset}
                          </span>
                          <span className="text-xs font-semibold text-white">
                            Agent ID: <code className="text-gray-300">{strat.agentId}</code>
                          </span>
                        </div>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40 font-bold uppercase tracking-wider">
                          {strat.status}
                        </span>
                      </div>

                      <div className="bg-[#080B10] p-3 rounded-xl border border-gray-800/90 text-xs space-y-1 text-gray-300">
                        <div className="flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-wider">
                          <span>Public Commitment Hash</span>
                          <a
                            href={`${explorerBaseUrl}/contracts/${strat.commitmentHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-purple-400 hover:underline flex items-center gap-1"
                          >
                            <span>Explorer</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                        <div className="text-purple-300 font-bold truncate">{strat.commitmentHash}</div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 pt-1">
                        <div>Max Position: <span className="text-white font-bold">{strat.params.maxPositionPct}%</span></div>
                        <div>Stop Loss: <span className="text-white font-bold">{strat.params.stopLossPct}%</span></div>
                        <div>Duration: <span className="text-white font-bold">{strat.params.timelineDays} Days</span></div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* LIVE PROTOCOL LOG Panel matching FreightVeil screenshot */}
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
            onExecuteTrade={handleSimulateTrade}
            isProofGenerating={isProofGenerating}
            walletConnected={walletConnected}
            onConnectWallet={() => setIsModalOpen(true)}
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
            onExecuteTrade={handleSimulateTrade}
            isProofGenerating={isProofGenerating}
            walletConnected={walletConnected}
            onConnectWallet={() => setIsModalOpen(true)}
            networkId={networkId}
          />
        )}

        {/* 6. WITHDRAW & SETTINGS */}
        {activeTab === 'withdraw' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-[#0F141C] border border-gray-800 rounded-2xl p-6 space-y-4 font-mono">
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-purple-400" />
                Unshield & Withdraw (unshieldWithdraw)
              </h1>
              <p className="text-xs text-gray-400 leading-relaxed">
                Executes the <code className="text-purple-300 font-mono">unshieldWithdraw</code> circuit operation. Consumes a private balance note in shielded state and transfers public tNIGHT/ADA tokens back to your 1AM wallet balance.
              </p>

              <form onSubmit={handleWithdrawSubmit} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Withdraw Amount (USD Value)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full bg-[#080B10] border border-gray-800 rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:border-purple-500"
                    />
                    <span className="text-xs font-mono text-gray-400">USD</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs font-mono shadow-lg transition-all cursor-pointer"
                >
                  Execute Unshield Transfer
                </button>
              </form>

              {withdrawSuccess && (
                <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 p-3 rounded-xl text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Unshield circuit execution successful! Value returned to public 1AM wallet balance.</span>
                </div>
              )}
            </div>
          </div>
        )}
      </Layout>

      {/* 1AM WALLET MODAL DIALOG matching FreightVeil screenshot */}
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
