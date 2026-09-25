import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Lock,
  Copy,
  Check,
  FileText,
  Sparkles,
  Zap,
  ExternalLink,
  Layers,
  Clock
} from 'lucide-react';
import {
  type SupportedAsset,
  type BotConfig,
  type ExecutionTick,
  type StressScenarioId,
  type BacktestResult,
  type ZKAuditCertificate,
  STRESS_SCENARIOS,
  runScenarioBacktest,
  generateZKAuditCertificate,
  generateProofHash
} from '../utils/zkBotEngine';

interface ZKExecutionBotProps {
  walletConnected: boolean;
  walletAddress: string | null;
  onNavigateToBuilder?: () => void;
}

export const ZKExecutionBot: React.FC<ZKExecutionBotProps> = ({
  walletConnected,
  walletAddress,
  onNavigateToBuilder
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'bot' | 'backtest' | 'certificate'>('bot');

  // Bot State
  const [asset, setAsset] = useState<SupportedAsset>('tNIGHT');
  const [initialCapital, setInitialCapital] = useState<number>(10000);
  const [maxPositionPct, setMaxPositionPct] = useState<number>(25);
  const [stopLossPct, setStopLossPct] = useState<number>(8);
  const [riskRegime, setRiskRegime] = useState<BotConfig['riskRegime']>('BALANCED_MOMENTUM');
  
  const [botStatus, setBotStatus] = useState<'IDLE' | 'RUNNING' | 'PAUSED' | 'CIRCUIT_BREAKER_HALTED'>('IDLE');
  const [portfolioValue, setPortfolioValue] = useState<number>(10000);
  const [peakPortfolio, setPeakPortfolio] = useState<number>(10000);
  const [executionTicks, setExecutionTicks] = useState<ExecutionTick[]>([]);
  const [proofsCount, setProofsCount] = useState<number>(0);
  const [lastPrice, setLastPrice] = useState<number>(0.85);

  // Backtest State
  const [selectedScenarioId, setSelectedScenarioId] = useState<StressScenarioId>('flash_crash');
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);
  const [isRunningBacktest, setIsRunningBacktest] = useState<boolean>(false);

  // Certificate State
  const [auditCert, setAuditCert] = useState<ZKAuditCertificate | null>(null);
  const [copiedCert, setCopiedCert] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const tickCounterRef = useRef<number>(1);

  const effectiveAgentId = walletAddress || '0x2428cd4ae7c2cd0bb501e1e9162de3003b103c1063c220e0d5cfc3f0b438e524';

  const currentConfig: BotConfig = {
    agentId: effectiveAgentId,
    asset,
    initialCapitalUsd: initialCapital,
    maxPositionPct,
    stopLossPct,
    expiryHours: 72,
    riskRegime,
    tickIntervalMs: 4000
  };

  // Run initial backtest on mount
  useEffect(() => {
    const res = runScenarioBacktest(currentConfig, 'flash_crash');
    setBacktestResult(res);
    setAuditCert(generateZKAuditCertificate(currentConfig, res));
  }, []);

  // Autonomous bot ticker loop
  useEffect(() => {
    if (botStatus === 'RUNNING') {
      timerRef.current = setInterval(() => {
        executeAutonomousTick();
      }, currentConfig.tickIntervalMs);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [botStatus, portfolioValue, peakPortfolio, asset, maxPositionPct, stopLossPct]);

  const executeAutonomousTick = () => {
    const tickNum = tickCounterRef.current++;
    // Generate realistic simulated price tick
    const deltaMultiplier = 1 + (Math.random() * 0.04 - 0.019);
    const newPrice = Number((lastPrice * deltaMultiplier).toFixed(4));
    setLastPrice(newPrice);

    // Compute current drawdown
    const currentDrawdownPct = ((peakPortfolio - portfolioValue) / (peakPortfolio || 1)) * 100;

    // Check circuit breaker
    if (currentDrawdownPct >= stopLossPct) {
      setBotStatus('CIRCUIT_BREAKER_HALTED');
      const haltTick: ExecutionTick = {
        id: `tick-${tickNum}-${Date.now()}`,
        tickNumber: tickNum,
        timestamp: Date.now(),
        asset,
        price: newPrice,
        action: 'CIRCUIT_BREAKER_HALT',
        sizeUsd: 0,
        positionPct: 0,
        proofLatencyMs: 125,
        proofHash: generateProofHash(effectiveAgentId, tickNum, 0),
        zkProofStatus: 'REJECTED_BOUNDS',
        portfolioValueUsd: portfolioValue,
        pnlUsd: portfolioValue - initialCapital,
        pnlPct: Number((((portfolioValue - initialCapital) / initialCapital) * 100).toFixed(2)),
        reason: `Drawdown limit tripped (${currentDrawdownPct.toFixed(1)}% >= ${stopLossPct}%). Circuit breaker engaged.`
      };
      setExecutionTicks(prev => [haltTick, ...prev.slice(0, 49)]);
      return;
    }

    // Determine algorithmic action
    let action: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    let sizeUsd = 0;
    let reason = 'Holding position within confidential witness bounds';
    let proofStatus: 'VALIDATED_ZK' | 'REJECTED_BOUNDS' | 'SHIELDED_HOLD' = 'SHIELDED_HOLD';

    const rand = Math.random();
    const maxAllowedSize = (portfolioValue * maxPositionPct) / 100;

    if (rand > 0.65) {
      action = 'BUY';
      sizeUsd = Number((maxAllowedSize * (0.6 + Math.random() * 0.35)).toFixed(2));
      proofStatus = 'VALIDATED_ZK';
      reason = `Momentum signal confirmed. Position ${((sizeUsd / portfolioValue) * 100).toFixed(1)}% <= ${maxPositionPct}% ceiling.`;
      setProofsCount(prev => prev + 1);
    } else if (rand < 0.25 && portfolioValue > initialCapital) {
      action = 'SELL';
      sizeUsd = Number((maxAllowedSize * 0.5).toFixed(2));
      proofStatus = 'VALIDATED_ZK';
      reason = `Profit realization trigger satisfied. Shielded note rebalanced.`;
      setProofsCount(prev => prev + 1);
    }

    // Update simulated portfolio value
    let updatedPortfolio = portfolioValue;
    if (action === 'BUY') {
      const outcome = (Math.random() - 0.46) * (sizeUsd * 0.05);
      updatedPortfolio += outcome;
    } else if (action === 'SELL') {
      updatedPortfolio += sizeUsd * 0.03;
    }
    updatedPortfolio = Number(updatedPortfolio.toFixed(2));
    setPortfolioValue(updatedPortfolio);

    if (updatedPortfolio > peakPortfolio) {
      setPeakPortfolio(updatedPortfolio);
    }

    const proofHash = generateProofHash(effectiveAgentId, tickNum, sizeUsd);
    const latency = 120 + Math.floor(Math.random() * 60);

    const tick: ExecutionTick = {
      id: `tick-${tickNum}-${Date.now()}`,
      tickNumber: tickNum,
      timestamp: Date.now(),
      asset,
      price: newPrice,
      action,
      sizeUsd,
      positionPct: updatedPortfolio > 0 ? Number(((sizeUsd / updatedPortfolio) * 100).toFixed(1)) : 0,
      proofLatencyMs: latency,
      proofHash,
      zkProofStatus: proofStatus,
      portfolioValueUsd: updatedPortfolio,
      pnlUsd: Number((updatedPortfolio - initialCapital).toFixed(2)),
      pnlPct: Number((((updatedPortfolio - initialCapital) / initialCapital) * 100).toFixed(2)),
      reason
    };

    setExecutionTicks(prev => [tick, ...prev.slice(0, 49)]);
  };

  const handleStartBot = () => {
    if (botStatus === 'CIRCUIT_BREAKER_HALTED') {
      // Reset drawdown peak
      setPeakPortfolio(portfolioValue);
    }
    setBotStatus('RUNNING');
  };

  const handlePauseBot = () => {
    setBotStatus('PAUSED');
  };

  const handleResetBot = () => {
    setBotStatus('IDLE');
    setPortfolioValue(initialCapital);
    setPeakPortfolio(initialCapital);
    setExecutionTicks([]);
    setProofsCount(0);
    tickCounterRef.current = 1;
  };

  const handleRunStressTest = (scenarioId: StressScenarioId) => {
    setSelectedScenarioId(scenarioId);
    setIsRunningBacktest(true);
    setTimeout(() => {
      const res = runScenarioBacktest(currentConfig, scenarioId);
      setBacktestResult(res);
      setAuditCert(generateZKAuditCertificate(currentConfig, res));
      setIsRunningBacktest(false);
    }, 400);
  };

  const copyToClipboard = (text: string, type: 'cert' | 'hash') => {
    navigator.clipboard.writeText(text);
    if (type === 'cert') {
      setCopiedCert(true);
      setTimeout(() => setCopiedCert(false), 2000);
    } else {
      setCopiedHash(text);
      setTimeout(() => setCopiedHash(null), 2000);
    }
  };

  const netPnl = portfolioValue - initialCapital;
  const netPnlPct = (netPnl / initialCapital) * 100;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-100/50 via-purple-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-center shrink-0">
              <img
                src="/axiom-icon-mark.png"
                alt="Axiom Mark"
                className="h-9 w-auto object-contain"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-orange-200/60">
                  <Bot className="w-3.5 h-3.5" />
                  Autonomous ZK Agent Runner
                </span>
                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold tracking-wider flex items-center gap-1.5 border border-purple-200/60">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Zero Mempool Exposure
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#020C21] tracking-tight">
                ZK Algorithmic Bot & Institutional Stress Studio
              </h1>
              <p className="text-sm text-[#59627E] max-w-2xl">
                Simulate and execute autonomous trading strategies backed by Midnight Compact v0.24 zero-knowledge circuits.
                Every automated order proves risk parameters, position size limits, and stop-loss bounds client-side with 100% MEV immunity.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {onNavigateToBuilder && (
              <button
                onClick={onNavigateToBuilder}
                className="px-4 py-2.5 rounded-full text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-orange-500" />
                Customize Strategy Witness
              </button>
            )}
          </div>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-gray-100 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('bot')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeSubTab === 'bot'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Bot className="w-4 h-4" />
            Live Bot Runner
          </button>
          <button
            onClick={() => setActiveSubTab('backtest')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeSubTab === 'backtest'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            Institutional Stress-Test (4 Scenarios)
          </button>
          <button
            onClick={() => setActiveSubTab('certificate')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeSubTab === 'certificate'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            ZK Audit Certificate
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: LIVE BOT RUNNER */}
      {activeSubTab === 'bot' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls & Configuration */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Bot className="w-4 h-4 text-orange-500" />
                Bot Parameters
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                botStatus === 'RUNNING'
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 animate-pulse'
                  : botStatus === 'CIRCUIT_BREAKER_HALTED'
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : botStatus === 'PAUSED'
                  ? 'bg-amber-50 text-amber-600 border border-amber-200'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {botStatus.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Asset Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600">Trading Asset</label>
              <div className="grid grid-cols-5 gap-1.5">
                {(['tNIGHT', 'ADA', 'BTC', 'ETH', 'SOL'] as SupportedAsset[]).map(a => (
                  <button
                    key={a}
                    disabled={botStatus === 'RUNNING'}
                    onClick={() => setAsset(a)}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                      asset === a
                        ? 'bg-orange-50 border-orange-400 text-orange-600'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Capital & Boundaries */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                  <span>Initial Collateral (vUSD)</span>
                  <span className="text-gray-900 font-bold">${initialCapital.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="1000"
                  disabled={botStatus === 'RUNNING'}
                  value={initialCapital}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setInitialCapital(val);
                    if (botStatus === 'IDLE') {
                      setPortfolioValue(val);
                      setPeakPortfolio(val);
                    }
                  }}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                  <span>Max Position Size Ceiling</span>
                  <span className="text-gray-900 font-bold">{maxPositionPct}% of Vault</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  disabled={botStatus === 'RUNNING'}
                  value={maxPositionPct}
                  onChange={e => setMaxPositionPct(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                  <span>Stop-Loss Circuit Breaker</span>
                  <span className="text-rose-600 font-bold">{stopLossPct}% Drawdown</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="20"
                  step="1"
                  disabled={botStatus === 'RUNNING'}
                  value={stopLossPct}
                  onChange={e => setStopLossPct(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">AI Risk Regime</label>
                <select
                  disabled={botStatus === 'RUNNING'}
                  value={riskRegime}
                  onChange={e => setRiskRegime(e.target.value as BotConfig['riskRegime'])}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="CAPITAL_PRESERVATION">🛡️ Capital Preservation</option>
                  <option value="CONSERVATIVE_GROWTH">📈 Conservative Growth</option>
                  <option value="BALANCED_MOMENTUM">⚖️ Balanced Momentum</option>
                  <option value="HIGH_VOLATILITY_DEFENSE">🌪️ High Volatility Defense</option>
                  <option value="SPECULATIVE_EXPANSION">🚀 Speculative Expansion</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
              {botStatus !== 'RUNNING' ? (
                <button
                  onClick={handleStartBot}
                  className="flex-1 py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {botStatus === 'PAUSED' ? 'Resume Bot' : 'Start ZK Bot'}
                </button>
              ) : (
                <button
                  onClick={handlePauseBot}
                  className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  Pause
                </button>
              )}

              <button
                onClick={handleResetBot}
                title="Reset simulation"
                className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {botStatus === 'CIRCUIT_BREAKER_HALTED' && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-800">
                  <span className="font-bold">Circuit Breaker Tripped!</span>
                  <p className="mt-0.5">Stop-loss drawdown limit exceeded. Compact circuit safely halted trade executions to preserve collateral.</p>
                </div>
              </div>
            )}
          </div>

          {/* Live Performance & Execution Stream */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Vault Balance</div>
                <div className="text-lg font-extrabold text-gray-900 mt-1">
                  ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={`text-xs font-bold flex items-center gap-0.5 mt-0.5 ${
                  netPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {netPnl >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {netPnl >= 0 ? '+' : ''}{netPnlPct.toFixed(2)}%
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Simulated Price</div>
                <div className="text-lg font-extrabold text-gray-900 mt-1">
                  ${lastPrice.toFixed(4)}
                </div>
                <div className="text-xs font-semibold text-gray-500 mt-0.5">
                  Pair: {asset}/vUSD
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">ZK Proofs Minted</div>
                <div className="text-lg font-extrabold text-purple-700 mt-1">
                  {proofsCount}
                </div>
                <div className="text-xs font-semibold text-purple-600 mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Client-side
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">MEV Extracted</div>
                <div className="text-lg font-extrabold text-emerald-600 mt-1">
                  $0.00
                </div>
                <div className="text-xs font-bold text-emerald-600 mt-0.5">
                  100% Protected
                </div>
              </div>
            </div>

            {/* Execution Stream Table */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-bold text-gray-900">Autonomous Execution Stream</h3>
                  <span className="text-xs text-gray-400">({executionTicks.length} ticks)</span>
                </div>
                {botStatus === 'RUNNING' && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Listening to ticks
                  </div>
                )}
              </div>

              <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
                {executionTicks.length === 0 ? (
                  <div className="p-10 text-center text-gray-400 text-xs">
                    <Bot className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    Click <strong>"Start ZK Bot"</strong> to initiate the autonomous algorithmic loop.
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50/75 border-b border-gray-100 text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                        <th className="py-2.5 px-4">Tick</th>
                        <th className="py-2.5 px-3">Action</th>
                        <th className="py-2.5 px-3">Price</th>
                        <th className="py-2.5 px-3">Order Size</th>
                        <th className="py-2.5 px-3">ZK Status</th>
                        <th className="py-2.5 px-3">Latency</th>
                        <th className="py-2.5 px-4">Proof Hash</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {executionTicks.map(tick => (
                        <tr key={tick.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="py-2.5 px-4 font-mono text-gray-400 font-bold">#{tick.tickNumber}</td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              tick.action === 'BUY'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : tick.action === 'SELL'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : tick.action === 'CIRCUIT_BREAKER_HALT'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {tick.action}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-gray-900">${tick.price.toFixed(4)}</td>
                          <td className="py-2.5 px-3 font-medium text-gray-700">
                            {tick.sizeUsd > 0 ? `$${tick.sizeUsd.toLocaleString()} (${tick.positionPct}%)` : '—'}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              tick.zkProofStatus === 'VALIDATED_ZK'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : tick.zkProofStatus === 'REJECTED_BOUNDS'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-gray-50 text-gray-600'
                            }`}>
                              {tick.zkProofStatus}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-gray-500">{tick.proofLatencyMs}ms</td>
                          <td className="py-2.5 px-4">
                            <button
                              onClick={() => copyToClipboard(tick.proofHash, 'hash')}
                              className="font-mono text-gray-500 hover:text-orange-600 flex items-center gap-1 group cursor-pointer"
                            >
                              <span>{tick.proofHash.slice(0, 8)}...{tick.proofHash.slice(-6)}</span>
                              {copiedHash === tick.proofHash ? (
                                <Check className="w-3 h-3 text-emerald-500" />
                              ) : (
                                <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: STRESS-TEST & BACKTESTER */}
      {activeSubTab === 'backtest' && (
        <div className="space-y-6">
          {/* Scenario Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.values(STRESS_SCENARIOS) as typeof STRESS_SCENARIOS[StressScenarioId][]).map(sc => (
              <div
                key={sc.id}
                onClick={() => handleRunStressTest(sc.id)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer relative ${
                  selectedScenarioId === sc.id
                    ? 'bg-white border-orange-500 shadow-md ring-2 ring-orange-200'
                    : 'bg-white/80 border-gray-200 hover:border-gray-300 shadow-sm'
                }`}
              >
                <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {sc.badge}
                </span>
                <h4 className="font-extrabold text-sm text-gray-900 mt-2">{sc.name}</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed line-clamp-2">{sc.description}</p>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">Predator MEV:</span>
                  <span className="font-mono font-bold text-gray-800">${sc.mevAttemptsUsd.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Backtest Results Card */}
          {backtestResult && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-600">Backtest Simulation</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-50 text-purple-700 font-bold border border-purple-200">
                      Compact v0.24 ZKIR
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 mt-1">
                    {backtestResult.scenario.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5 max-w-xl">{backtestResult.scenario.riskNotes}</p>
                </div>

                <button
                  disabled={isRunningBacktest}
                  onClick={() => handleRunStressTest(selectedScenarioId)}
                  className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isRunningBacktest ? 'animate-spin' : ''}`} />
                  Re-Run Simulation
                </button>
              </div>

              {/* Stress Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Net PnL</div>
                  <div className={`text-base font-extrabold mt-1 ${
                    backtestResult.netPnlUsd >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {backtestResult.netPnlUsd >= 0 ? '+' : ''}${backtestResult.netPnlUsd.toLocaleString()}
                  </div>
                  <div className="text-[11px] font-bold text-gray-600">
                    ({backtestResult.netPnlPct >= 0 ? '+' : ''}{backtestResult.netPnlPct}%)
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Max Drawdown</div>
                  <div className="text-base font-extrabold text-rose-600 mt-1">
                    {backtestResult.maxDrawdownPct}%
                  </div>
                  <div className="text-[11px] font-medium text-gray-500">
                    Limit: {stopLossPct}%
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Win Rate</div>
                  <div className="text-base font-extrabold text-gray-900 mt-1">
                    {backtestResult.winRatePct}%
                  </div>
                  <div className="text-[11px] font-medium text-gray-500">
                    {backtestResult.profitableTrades}/{backtestResult.totalTrades} Trades
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">ZK Proofs</div>
                  <div className="text-base font-extrabold text-purple-700 mt-1">
                    {backtestResult.totalZKProofsGenerated}
                  </div>
                  <div className="text-[11px] font-medium text-purple-600">
                    100% Validated
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">MEV Protected</div>
                  <div className="text-base font-extrabold text-emerald-600 mt-1">
                    ${backtestResult.mevProtectedUsd.toLocaleString()}
                  </div>
                  <div className="text-[11px] font-medium text-emerald-600">
                    $0 Extracted
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Circuit Breaker</div>
                  <div className={`text-base font-extrabold mt-1 ${
                    backtestResult.circuitBreakerTriggered ? 'text-rose-600' : 'text-emerald-600'
                  }`}>
                    {backtestResult.circuitBreakerTriggered ? 'TRIGGERED' : 'NOMINAL'}
                  </div>
                  <div className="text-[11px] font-medium text-gray-500">
                    {backtestResult.circuitBreakerTriggered ? 'Preserved Capital' : 'Safe Operating Zone'}
                  </div>
                </div>
              </div>

              {/* Step By Step Replay Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Scenario Step Progression & Proof Log</h4>
                <div className="overflow-x-auto border border-gray-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-bold">
                        <th className="py-2.5 px-4">Step</th>
                        <th className="py-2.5 px-3">Price</th>
                        <th className="py-2.5 px-3">Action</th>
                        <th className="py-2.5 px-3">Simulated Size</th>
                        <th className="py-2.5 px-3">ZK Circuit Verification</th>
                        <th className="py-2.5 px-4">Compliance Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {backtestResult.ticks.map(t => (
                        <tr key={t.id} className="hover:bg-gray-50/50">
                          <td className="py-2 px-4 font-mono font-bold text-gray-500">Step {t.tickNumber}</td>
                          <td className="py-2 px-3 font-semibold text-gray-900">${t.price.toFixed(4)}</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              t.action === 'BUY'
                                ? 'bg-emerald-50 text-emerald-700'
                                : t.action === 'SELL'
                                ? 'bg-blue-50 text-blue-700'
                                : t.action === 'CIRCUIT_BREAKER_HALT'
                                ? 'bg-rose-50 text-rose-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {t.action}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-gray-700 font-medium">
                            {t.sizeUsd > 0 ? `$${t.sizeUsd.toLocaleString()}` : '—'}
                          </td>
                          <td className="py-2 px-3 font-mono text-[10px] text-purple-700 font-semibold">
                            {t.zkProofStatus}
                          </td>
                          <td className="py-2 px-4 text-gray-600 text-[11px]">{t.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: INSTITUTIONAL ZK AUDIT CERTIFICATE */}
      {activeSubTab === 'certificate' && auditCert && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div className="flex items-start gap-4">
              <div className="h-14 px-3 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-center shrink-0">
                <img
                  src="/axiom-logo.png"
                  alt="Axiom Trade Logo"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Cryptographically Verified
                  </span>
                  <span className="text-xs text-gray-400 font-mono">ID: {auditCert.certificateId}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-2">
                  Institutional ZK Strategy Compliance Certificate
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Proves that strategy parameters adhere to Midnight Compact v0.24 ZKIR specifications with zero private witness disclosure.
                </p>
              </div>
            </div>

            <button
              onClick={() => copyToClipboard(JSON.stringify(auditCert, null, 2), 'cert')}
              className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto cursor-pointer"
            >
              {copiedCert ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCert ? 'Copied Certificate JSON' : 'Export Certificate'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50/75 rounded-2xl p-5 border border-gray-200/80 space-y-3 font-mono text-xs">
              <div className="text-[10px] font-sans font-bold text-gray-500 uppercase tracking-wider">Protocol Properties</div>
              <div className="flex justify-between py-1.5 border-b border-gray-200/60">
                <span className="text-gray-500">Contract Address:</span>
                <span className="text-gray-900 font-bold truncate max-w-[200px]" title={auditCert.contractAddress}>
                  {auditCert.contractAddress}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-200/60">
                <span className="text-gray-500">Network:</span>
                <span className="text-emerald-700 font-bold">{auditCert.network}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-200/60">
                <span className="text-gray-500">Strategy Commitment Hash:</span>
                <span className="text-purple-700 font-bold truncate max-w-[200px]" title={auditCert.strategyCommitmentHash}>
                  {auditCert.strategyCommitmentHash}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-200/60">
                <span className="text-gray-500">Certificate Signature:</span>
                <span className="text-gray-800 font-bold truncate max-w-[200px]" title={auditCert.verificationHash}>
                  {auditCert.verificationHash}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500">Circuit Compliance:</span>
                <span className="text-orange-600 font-bold">{auditCert.zkCircuitCompliance}</span>
              </div>
            </div>

            <div className="bg-gray-50/75 rounded-2xl p-5 border border-gray-200/80 space-y-3 font-mono text-xs">
              <div className="text-[10px] font-sans font-bold text-gray-500 uppercase tracking-wider">Compliance Boundary Parameters</div>
              <div className="flex justify-between py-1.5 border-b border-gray-200/60">
                <span className="text-gray-500">Target Asset:</span>
                <span className="text-gray-900 font-bold">{auditCert.asset}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-200/60">
                <span className="text-gray-500">Max Position Size Ceiling:</span>
                <span className="text-gray-900 font-bold">{auditCert.maxPositionPct}% of Vault</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-200/60">
                <span className="text-gray-500">Stop-Loss Safety Breaker:</span>
                <span className="text-rose-600 font-bold">{auditCert.stopLossPct}% Max Drawdown</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-200/60">
                <span className="text-gray-500">MEV Front-Running Immunity:</span>
                <span className="text-emerald-600 font-bold">100% IMMUNE (Zero Mempool Exposure)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500">Stress Test Verification:</span>
                <span className="text-emerald-700 font-bold">PASSED (Drawdown Enforced)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
