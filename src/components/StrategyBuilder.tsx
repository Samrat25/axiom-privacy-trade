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
  Bot,
  ExternalLink
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
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-800 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 text-orange-500" />
              <span>Compact ZK Core • Gemini Structured Parsing</span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Natural-Language Strategy Builder
            </h1>
            <p className="text-gray-600 text-xs leading-relaxed max-w-2xl">
              Describe your algorithmic trading strategy in plain language. Axiom's Gemini LLM structured output engine parses text into bounded parameters, hashes them locally, and commits a zero-knowledge proof on Midnight.
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1 font-mono text-xs">
            <span className="text-[11px] font-bold text-orange-600">LLM: Gemini 2.5 Flash</span>
            <span className="text-gray-500">Public: Commitment Hash Only</span>
            <span className="text-emerald-700 font-bold">Private: Shielded Witnesses</span>
          </div>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-600 font-medium">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            Quick Presets
          </span>
          <span>Click to populate strategy</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {PRESET_PROMPTS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(preset)}
              className="text-left text-xs bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 hover:text-gray-900 p-3.5 rounded-xl transition-all cursor-pointer truncate shadow-xs font-medium"
            >
              "{preset}"
            </button>
          ))}
        </div>
      </div>

      {/* Main Prompt Input Box */}
      <div className="bg-white border border-gray-200/90 focus-within:border-orange-500 rounded-2xl p-5 shadow-sm transition-all">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-orange-500" />
            Strategy Intent (Natural Language)
          </label>
          <button
            onClick={handleGeminiParse}
            disabled={isParsingGemini}
            className="text-xs font-semibold text-white bg-gray-900 hover:bg-black px-3 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Bot className="w-3.5 h-3.5 text-orange-400" />
            <span>{isParsingGemini ? 'Gemini Parsing...' : 'Parse with Gemini LLM'}</span>
          </button>
        </div>

        <textarea
          value={promptText}
          onChange={(e) => handlePromptChange(e.target.value)}
          rows={3}
          placeholder="e.g. Only buy ADA, max 20% position size, 8% stop-loss, run for 30 days"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:bg-white resize-none font-sans"
        />

        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700 text-xs font-medium">
              Zero telemetry leaks — parsed and hashed on client
            </span>
          </div>
          <span className="font-mono text-gray-400">
            {promptText.length} chars
          </span>
        </div>
      </div>

      {/* Confirm-Before-Commit Card */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-orange-500" />
              Review & Confirm Strategy Bounds
            </h3>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium">
            <HelpCircle className="w-3 h-3 text-orange-500" />
            <span>Immutable Once Committed</span>
          </div>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">
          Verify the parsed parameters below. Once hashed and committed to the Compact circuit, these boundaries cannot be altered without creating a new agent commitment.
        </p>

        {/* Editable Chips Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Target Asset */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col justify-between space-y-1">
            <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
              <span className="flex items-center gap-1">
                <Coins className="w-3 h-3 text-orange-500" /> Asset
              </span>
              <span className="text-[10px] text-gray-400 font-mono">Witness 1</span>
            </div>
            <select
              value={parsedParams.asset}
              onChange={(e) => handleChipChange('asset', e.target.value)}
              className="bg-white text-gray-900 font-bold text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="ADA">ADA</option>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
              <option value="SOL">SOL</option>
              <option value="tNIGHT">tNIGHT</option>
            </select>
          </div>

          {/* Max Position % */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col justify-between space-y-1">
            <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
              <span className="flex items-center gap-1">
                <Percent className="w-3 h-3 text-indigo-500" /> Max Position
              </span>
              <span className="text-[10px] text-gray-400 font-mono">Witness 2</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="1"
                max="100"
                value={parsedParams.maxPositionPct}
                onChange={(e) => handleChipChange('maxPositionPct', parseInt(e.target.value) || 1)}
                className="w-full bg-white text-gray-900 font-bold text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-500 font-mono"
              />
              <span className="text-xs text-gray-500 font-bold">%</span>
            </div>
          </div>

          {/* Stop Loss % */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col justify-between space-y-1">
            <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
              <span className="flex items-center gap-1">
                <Percent className="w-3 h-3 text-red-500" /> Stop Loss
              </span>
              <span className="text-[10px] text-gray-400 font-mono">Witness 3</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="1"
                max="50"
                value={parsedParams.stopLossPct}
                onChange={(e) => handleChipChange('stopLossPct', parseInt(e.target.value) || 1)}
                className="w-full bg-white text-gray-900 font-bold text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-500 font-mono"
              />
              <span className="text-xs text-gray-500 font-bold">%</span>
            </div>
          </div>

          {/* Timeline Expiry */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col justify-between space-y-1">
            <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-600" /> Duration
              </span>
              <span className="text-[10px] text-gray-400 font-mono">Witness 4</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="1"
                max="365"
                value={parsedParams.timelineDays}
                onChange={(e) => handleChipChange('timelineDays', parseInt(e.target.value) || 1)}
                className="w-full bg-white text-gray-900 font-bold text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-500 font-mono"
              />
              <span className="text-xs text-gray-500 font-bold">Days</span>
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
            className="w-4 h-4 rounded bg-white border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
          />
          <label htmlFor="confirm-bounds" className="text-xs text-gray-800 font-medium cursor-pointer select-none">
            I confirm these strategy bounds are correct and ready for zero-knowledge hash commitment.
          </label>
        </div>

        {/* Action Button & Proof Loading Indicator */}
        <div className="pt-2">
          {isProofGenerating ? (
            <div className="bg-gray-50 border border-orange-200 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-900 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-orange-500 animate-spin" />
                  Generating Zero-Knowledge Circuit Proof...
                </span>
                <span className="text-gray-500 font-mono text-[11px]">compact v0.24</span>
              </div>
              <p className="text-xs text-gray-700 font-mono bg-white p-3 rounded-xl border border-gray-200">
                {proofStep}
              </p>
            </div>
          ) : (
            <button
              onClick={handleCommitSubmit}
              disabled={!isConfirmed}
              className={`w-full py-3.5 px-6 rounded-full font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 ${
                isConfirmed
                  ? 'bg-[#F26522] hover:bg-[#e05a1a] text-white cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
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

      {/* Success State — Visible Commitment Hash */}
      {committedHash && (
        <div className="bg-white border border-emerald-300 rounded-2xl p-6 shadow-sm space-y-4 font-sans">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-800">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <h4 className="text-sm font-extrabold tracking-tight">
                Strategy Committed Cryptographically On-Chain!
              </h4>
            </div>
            <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-3 py-0.5 rounded-full">
              LEDGER STATE RECORDED
            </span>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed font-sans">
            Your strategy witnesses (<strong className="text-emerald-700">{parsedParams.asset}</strong>, <strong className="text-gray-900">{parsedParams.maxPositionPct}% max pos</strong>, <strong className="text-red-700">{parsedParams.stopLossPct}% stop-loss</strong>) have been hashed locally into a single ZK commitment and recorded on Midnight testnet.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 flex items-center justify-between gap-3 font-mono">
            <div className="space-y-0.5 overflow-hidden">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">
                Public Commitment Hash
              </span>
              <span className="text-gray-900 text-xs sm:text-sm font-semibold truncate block">
                {committedHash}
              </span>
            </div>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold transition-all cursor-pointer shrink-0"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-500" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Post-Commitment Action Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 border-t border-gray-200">
            <a
              href="https://preview.midnightexplorer.com/transactions"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-gray-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <span>View Midnight Transactions Explorer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
