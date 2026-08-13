import React, { useState } from 'react';
import {
  Sparkles,
  Shield,
  Lock,
  Copy,
  CheckCircle,
  Cpu,
  HelpCircle,
  Sliders,
  Clock,
  Percent,
  Coins,
  Bot
} from 'lucide-react';
import { parseNaturalLanguageStrategy, StrategyParams } from '../utils/contract';
import { parseStrategyNode } from '../utils/agent';

interface StrategyBuilderProps {
  onCommit: (params: StrategyParams) => Promise<string>;
  isProofGenerating: boolean;
  proofStep: string;
  walletConnected: boolean;
  onConnectWallet: () => void;
}

const PRESET_PROMPTS = [
  'Only buy ADA, max 20% position size, 8% stop-loss, run for 30 days.',
  'Trade BTC momentum with max 15% position, 5% stop-loss for 14 days.',
  'Accumulate ETH with 10% max allocation, 12% trailing stop, 60 days duration.',
  'Swap tNIGHT with 25% max position size, 6% stop-loss for 7 days.'
];

export const StrategyBuilder: React.FC<StrategyBuilderProps> = ({
  onCommit,
  isProofGenerating,
  proofStep,
  walletConnected,
  onConnectWallet
}) => {
  const defaultPrompt = PRESET_PROMPTS[0] || 'Only buy ADA, max 20% position size, 8% stop-loss, run for 30 days.';
  const [promptText, setPromptText] = useState<string>(defaultPrompt);
  const [parsedParams, setParsedParams] = useState<StrategyParams>(() =>
    parseNaturalLanguageStrategy(defaultPrompt)
  );

  const [isParsingGemini, setIsParsingGemini] = useState<boolean>(false);
  const [committedHash, setCommittedHash] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const handlePromptChange = (text: string) => {
    setPromptText(text);
    const parsed = parseNaturalLanguageStrategy(text);
    setParsedParams(parsed);
    setIsConfirmed(false);
    setCommittedHash(null);
  };

  const handleSelectPreset = (preset: string) => {
    handlePromptChange(preset);
  };

  const handleGeminiParse = async () => {
    setIsParsingGemini(true);
    try {
      const res = await parseStrategyNode({ naturalLanguagePrompt: promptText } as any);
      if (res.strategyParams) {
        setParsedParams(res.strategyParams);
      }
    } finally {
      setIsParsingGemini(false);
    }
  };

  const handleChipChange = (field: keyof StrategyParams, value: any) => {
    setParsedParams((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCommitSubmit = async () => {
    if (!walletConnected) {
      onConnectWallet();
      return;
    }
    const hash = await onCommit(parsedParams);
    setCommittedHash(hash);
  };

  const copyToClipboard = () => {
    if (committedHash) {
      navigator.clipboard.writeText(committedHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/40 via-gray-900 to-indigo-950/40 border border-purple-800/30 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-medium">
              <Shield className="w-3.5 h-3.5" />
              <span>LangGraph Agent + Midnight Compact Core</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Natural-Language Strategy Builder
            </h1>
            <p className="text-gray-400 text-xs leading-relaxed max-w-2xl">
              Describe your algorithmic trading strategy in plain language. Axiom's Gemini LLM structured output engine parses text into bounded parameters, hashes them locally, and commits a zero-knowledge proof on-chain.
            </p>
          </div>
          <div className="hidden md:flex flex-col items-end text-right space-y-1">
            <span className="text-[11px] font-mono text-purple-400">LLM: Gemini 2.5 Flash</span>
            <span className="text-xs text-gray-400">Public: Commitment Hash Only</span>
            <span className="text-xs text-emerald-400 font-semibold">Private: Strategy Witnesses</span>
          </div>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Quick Presets
          </span>
          <span>Click to populate prompt</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESET_PROMPTS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(preset)}
              className="text-left text-xs bg-gray-900/60 hover:bg-purple-950/30 border border-gray-800 hover:border-purple-600/40 text-gray-300 hover:text-white p-3 rounded-xl transition-all cursor-pointer truncate"
            >
              "{preset}"
            </button>
          ))}
        </div>
      </div>

      {/* Main Prompt Input Box */}
      <div className="bg-gray-900/90 border border-gray-800 focus-within:border-purple-500/60 rounded-2xl p-4 shadow-xl transition-all">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            Strategy Input (Natural Language)
          </label>
          <button
            onClick={handleGeminiParse}
            disabled={isParsingGemini}
            className="text-[11px] font-mono text-purple-300 bg-purple-950 hover:bg-purple-900 px-2.5 py-1 rounded-lg border border-purple-800/50 flex items-center gap-1 cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5 text-purple-400" />
            <span>{isParsingGemini ? 'Gemini Parsing...' : 'Parse with Gemini LLM'}</span>
          </button>
        </div>

        <textarea
          value={promptText}
          onChange={(e) => handlePromptChange(e.target.value)}
          rows={3}
          placeholder="e.g. Only buy ADA, max 20% position size, 8% stop-loss, run for 30 days"
          className="w-full bg-gray-950/70 border border-gray-800 rounded-xl p-3.5 text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/40 resize-none font-sans"
        />

        <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400/90 text-[11px]">
              LANGCHAIN_TRACING_V2=false (Zero telemetry leaks)
            </span>
          </div>
          <span className="text-[11px] text-gray-500 font-mono">
            Length: {promptText.length} chars
          </span>
        </div>
      </div>

      {/* Confirm-Before-Commit Card (Section 4 Requirement) */}
      <div className="bg-gray-900/90 border border-purple-900/40 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-purple-400" />
              Review & Confirm Strategy Bounds
            </h3>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-950/30 px-2.5 py-1 rounded-full border border-amber-800/40">
            <HelpCircle className="w-3 h-3" />
            <span>Immutable Once Committed</span>
          </div>
        </div>

        <p className="text-xs text-gray-400">
          Verify the parsed parameters below. Once hashed and committed to the Compact circuit, these boundaries cannot be altered without creating a new agent commitment.
        </p>

        {/* Editable Chips Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Target Asset */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-3 flex flex-col justify-between space-y-1">
            <div className="flex items-center justify-between text-[11px] text-gray-400">
              <span className="flex items-center gap-1">
                <Coins className="w-3 h-3 text-purple-400" /> Asset
              </span>
              <span className="text-[10px] text-gray-500 font-mono">Witness 1</span>
            </div>
            <select
              value={parsedParams.asset}
              onChange={(e) => handleChipChange('asset', e.target.value)}
              className="bg-gray-900 text-white font-mono text-xs font-bold px-2 py-1.5 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="ADA">ADA</option>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
              <option value="SOL">SOL</option>
              <option value="tNIGHT">tNIGHT</option>
            </select>
          </div>

          {/* Max Position % */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-3 flex flex-col justify-between space-y-1">
            <div className="flex items-center justify-between text-[11px] text-gray-400">
              <span className="flex items-center gap-1">
                <Percent className="w-3 h-3 text-indigo-400" /> Max Position
              </span>
              <span className="text-[10px] text-gray-500 font-mono">Witness 2</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="1"
                max="100"
                value={parsedParams.maxPositionPct}
                onChange={(e) => handleChipChange('maxPositionPct', parseInt(e.target.value) || 1)}
                className="w-full bg-gray-900 text-white font-mono text-xs font-bold px-2 py-1.5 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
              />
              <span className="text-xs text-gray-400 font-mono">%</span>
            </div>
          </div>

          {/* Stop Loss % */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-3 flex flex-col justify-between space-y-1">
            <div className="flex items-center justify-between text-[11px] text-gray-400">
              <span className="flex items-center gap-1">
                <Percent className="w-3 h-3 text-red-400" /> Stop Loss
              </span>
              <span className="text-[10px] text-gray-500 font-mono">Witness 3</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="1"
                max="50"
                value={parsedParams.stopLossPct}
                onChange={(e) => handleChipChange('stopLossPct', parseInt(e.target.value) || 1)}
                className="w-full bg-gray-900 text-white font-mono text-xs font-bold px-2 py-1.5 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
              />
              <span className="text-xs text-gray-400 font-mono">%</span>
            </div>
          </div>

          {/* Timeline Expiry */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-3 flex flex-col justify-between space-y-1">
            <div className="flex items-center justify-between text-[11px] text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" /> Timeline
              </span>
              <span className="text-[10px] text-gray-500 font-mono">Witness 4</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="1"
                max="365"
                value={parsedParams.timelineDays}
                onChange={(e) => handleChipChange('timelineDays', parseInt(e.target.value) || 1)}
                className="w-full bg-gray-900 text-white font-mono text-xs font-bold px-2 py-1.5 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
              />
              <span className="text-xs text-gray-400 font-mono">Days</span>
            </div>
          </div>
        </div>

        {/* Confirmation Checkbox */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="confirm-bounds"
            checked={isConfirmed}
            onChange={(e) => setIsConfirmed(e.target.checked)}
            className="w-4 h-4 rounded bg-gray-950 border-gray-700 text-purple-600 focus:ring-purple-500 cursor-pointer"
          />
          <label htmlFor="confirm-bounds" className="text-xs text-gray-300 cursor-pointer select-none">
            I confirm these strategy bounds are correct and ready for zero-knowledge hash commitment.
          </label>
        </div>

        {/* Action Button & Proof Loading Indicator */}
        <div className="pt-2">
          {isProofGenerating ? (
            <div className="bg-purple-950/40 border border-purple-700/50 rounded-xl p-4 space-y-2 animate-pulse-subtle">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-purple-300 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-400 animate-spin" />
                  Generating Zero-Knowledge Circuit Proof...
                </span>
                <span className="text-gray-400 font-mono text-[11px]">compactc v0.24</span>
              </div>
              <p className="text-xs text-purple-200/90 font-mono bg-black/40 p-2 rounded border border-purple-900/40">
                {proofStep}
              </p>
            </div>
          ) : (
            <button
              onClick={handleCommitSubmit}
              disabled={!isConfirmed}
              className={`w-full py-3.5 px-6 rounded-xl font-medium text-xs sm:text-sm tracking-wide shadow-lg transition-all flex items-center justify-center gap-2 ${
                isConfirmed
                  ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-900/40 cursor-pointer border border-purple-400/40'
                  : 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>
                {walletConnected ? 'Commit Strategy On-Chain (commitStrategy)' : 'Connect 1AM Wallet to Commit'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Success State — Visible Commitment Hash (Section 4 Requirement) */}
      {committedHash && (
        <div className="bg-gradient-to-r from-emerald-950/50 via-gray-900 to-purple-950/40 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-4 font-mono">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle className="w-5 h-5" />
              <h4 className="text-sm font-bold tracking-tight">
                Strategy Committed Cryptographically On-Chain!
              </h4>
            </div>
            <span className="text-[11px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-2.5 py-0.5 rounded-full font-bold">
              LEDGER STATE RECORDED
            </span>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            Your strategy witnesses (<strong className="text-emerald-400">{parsedParams.asset}</strong>, <strong className="text-purple-300">{parsedParams.maxPositionPct}% max pos</strong>, <strong className="text-red-400">{parsedParams.stopLossPct}% stop-loss</strong>) have been hashed locally into a single ZK commitment and recorded on Midnight testnet. Raw bounds remain encrypted on your device.
          </p>

          <div className="bg-gray-950 border border-gray-800 rounded-xl p-3 flex items-center justify-between gap-3">
            <div className="space-y-0.5 overflow-hidden">
              <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider block">
                Public Commitment Hash (agentCommitment)
              </span>
              <span className="font-mono text-purple-300 text-xs sm:text-sm font-semibold truncate block">
                {committedHash}
              </span>
            </div>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 text-xs font-mono transition-all cursor-pointer shrink-0"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                  <span>Copy Hash</span>
                </>
              )}
            </button>
          </div>

          {/* Post-Commitment Action Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 border-t border-gray-800">
            <a
              href={`https://midnightexplorer.com/contracts/${committedHash}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-700 text-purple-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>View Midnight Explorer Log</span>
            </a>

            <button
              onClick={() => {
                onCommit(parsedParams);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Cpu className="w-4 h-4 text-emerald-300" />
              <span>Run AI Agent & Prove Compliance Trade</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
