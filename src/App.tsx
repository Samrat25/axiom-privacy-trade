import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { VaultPanel } from './components/VaultPanel';
import { StrategyBuilder } from './components/StrategyBuilder';
import { WalletModal } from './components/WalletModal';
import { MarketInsights } from './components/MarketInsights';
import { Portfolio } from './components/Portfolio';
import { TradeHistory } from './components/TradeHistory';
import { LaunchUsersHub } from './components/LaunchUsersHub';
import { ZKExecutionBot } from './components/ZKExecutionBot';
import { useMidnight } from './hooks/useMidnight';

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
    detected1AMNetwork,
    isNetworkAligned,
    balance,
    shieldedBalance,
    unshieldedBalance,
    dustBalance,
    vaultBalance,
    isConnecting,
    error,
    proofServerUp,
    dustReady,
    isSyncing,
    isModalOpen,
    setIsModalOpen,
    protocolLogs,
    clearLogs,
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
    commitStrategyCircuit,
    executeProvenTrade
  } = useMidnight();

  // Auto-navigate to dashboard when wallet connects
  useEffect(() => {
    if (walletConnected && activeTab === 'landing') {
      setActiveTab('overview');
    }
  }, [walletConnected]);

  const displayGreetingAddr = walletAddress
    ? walletAddress.length > 20
      ? `${walletAddress.substring(0, 16)}...${walletAddress.substring(walletAddress.length - 6)}`
      : walletAddress
    : 'Connect 1AM Wallet';

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
          detected1AMNetwork={detected1AMNetwork}
          isNetworkAligned={isNetworkAligned}
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
          {/* 1. OVERVIEW / DASHBOARD */}
          {activeTab === 'overview' && (
            <Dashboard
              displayGreetingAddr={displayGreetingAddr}
              networkId={networkId}
              isSyncing={isSyncing}
              error={error}
              unshieldedBalance={unshieldedBalance}
              shieldedBalance={shieldedBalance}
              dustBalance={dustBalance}
              vaultBalance={vaultBalance}
              latestBlock={latestBlock}
              activeStrategies={activeStrategies}
              protocolLogs={protocolLogs}
              clearLogs={clearLogs}
              setActiveTab={setActiveTab}
            />
          )}

          {/* 2. STRATEGY BUILDER */}
          {activeTab === 'strategy-builder' && (
            <StrategyBuilder
              onCommit={commitStrategyCircuit}
              isProofGenerating={isProofGenerating}
              proofStep={proofStep}
              walletConnected={walletConnected}
              onConnectWallet={() => setIsModalOpen(true)}
              networkId={networkId}
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
              onExecuteTrade={(asset, amount) =>
                executeProvenTrade(activeStrategies[0]?.agentId || '0xagent_1', amount, asset, 'BUY')
              }
              isProofGenerating={isProofGenerating}
              walletConnected={walletConnected}
              onConnectWallet={() => setIsModalOpen(true)}
              networkId={networkId}
              vaultBalance={vaultBalance}
              onNavigateTab={setActiveTab}
            />
          )}

          {/* 6. SHIELDED VAULT & WITHDRAW */}
          {activeTab === 'withdraw' && (
            <VaultPanel
              displayGreetingAddr={displayGreetingAddr}
              networkId={networkId}
              unshieldedBalance={unshieldedBalance}
              shieldedBalance={shieldedBalance}
              dustBalance={dustBalance}
              vaultBalance={vaultBalance}
              mintVault={mintVault}
              burnVault={burnVault}
            />
          )}

          {/* 7. LEVEL 6 LAUNCH USERS & COMMUNITY HUB */}
          {activeTab === 'launch-hub' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <LaunchUsersHub />
            </div>
          )}

          {/* 8. AUTONOMOUS ZK EXECUTION BOT & INSTITUTIONAL BACKTEST STUDIO */}
          {activeTab === 'zk-bot' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <ZKExecutionBot
                walletConnected={walletConnected}
                walletAddress={walletAddress}
                onNavigateToBuilder={() => setActiveTab('strategy-builder')}
              />
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
        detected1AMNetwork={detected1AMNetwork}
        isNetworkAligned={isNetworkAligned}
        onSelectNetwork={handleSelectNetwork}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
        onClearCache={clearWalletCache}
      />
    </>
  );
}

export default App;
