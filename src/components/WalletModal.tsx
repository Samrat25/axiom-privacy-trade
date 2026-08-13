import React from 'react';
import { X, Copy, Check, ExternalLink, ShieldCheck, RefreshCw } from 'lucide-react';
import type { MidnightNetwork } from '../lib/lace-wallet';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  connected: boolean;
  isConnecting: boolean;
  unshieldedAddress: string | null;
  shieldedAddress: string | null;
  shieldedBalance: string;
  unshieldedBalance: string;
  dustBalance: string;
  networkId: MidnightNetwork;
  onSelectNetwork: (net: MidnightNetwork) => void;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  connected,
  isConnecting,
  unshieldedAddress,
  shieldedAddress,
  shieldedBalance,
  unshieldedBalance,
  dustBalance,
  networkId,
  onSelectNetwork,
  onConnect,
  onDisconnect
}) => {
  const [copiedAddr, setCopiedAddr] = React.useState<boolean>(false);
  const [copiedShielded, setCopiedShielded] = React.useState<boolean>(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, isShielded: boolean) => {
    navigator.clipboard.writeText(text);
    if (isShielded) {
      setCopiedShielded(true);
      setTimeout(() => setCopiedShielded(false), 2000);
    } else {
      setCopiedAddr(true);
      setTimeout(() => setCopiedAddr(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#0F141C] border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-6 relative text-gray-100 font-sans">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/60 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-mono font-bold text-xs">
              1AM
            </div>
            <h2 className="text-lg font-bold tracking-tight text-white font-mono">1AM Wallet</h2>
          </div>
          <p className="text-[11px] font-mono tracking-wider uppercase text-gray-400">
            MIDNIGHT NETWORK • REAL EXTENSION SIGNING
          </p>
        </div>

        {/* CONNECTED STATE */}
        {connected ? (
          <div className="space-y-5">
            {/* Status Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider">ACTIVE</span>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/50 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                REAL SIGNING
              </span>
            </div>

            {/* UNSHIELDED ADDRESS CARD */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
                UNSHIELDED ADDRESS
              </label>
              <div className="flex items-center justify-between bg-[#080B10] border border-gray-800/90 rounded-xl p-3 font-mono text-xs text-gray-200">
                <span className="truncate max-w-[360px] text-purple-300">
                  {unshieldedAddress || '—'}
                </span>
                <button
                  onClick={() => copyToClipboard(unshieldedAddress || '', false)}
                  className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  {copiedAddr ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* SHIELDED KEY COMMITMENT CARD */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <span>SHIELDED KEY COMMITMENT</span>
              </label>
              <div className="flex items-center justify-between bg-[#080B10] border border-gray-800/90 rounded-xl p-3 font-mono text-xs text-gray-200">
                <span className="truncate max-w-[360px] text-emerald-400">
                  {shieldedAddress || '—'}
                </span>
                <button
                  onClick={() => copyToClipboard(shieldedAddress || '', true)}
                  className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  {copiedShielded ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* BALANCE CARDS GRID */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#080B10] border border-gray-800/90 rounded-xl p-3.5 space-y-1 font-mono">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">TNIGHT</div>
                <div className="text-sm font-bold text-white">
                  {shieldedBalance} <span className="text-[11px] font-normal text-emerald-400">shielded</span>
                </div>
                <div className="text-xs text-purple-300">
                  {unshieldedBalance} <span className="text-[10px] font-normal text-gray-400">unshielded</span>
                </div>
              </div>

              <div className="bg-[#080B10] border border-gray-800/90 rounded-xl p-3.5 space-y-1 font-mono">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">TDUST FUEL</div>
                <div className="text-sm font-bold text-emerald-400">{dustBalance}</div>
                <div className="text-[10px] text-gray-500">ProofStation Reserve</div>
              </div>
            </div>

            {/* NETWORK SELECTOR */}
            <div className="space-y-2 pt-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <span>SELECT NETWORK</span>
              </label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-[#080B10] border border-gray-800 rounded-xl">
                {(['preview', 'preprod', 'undeployed'] as MidnightNetwork[]).map((net) => (
                  <button
                    key={net}
                    onClick={() => onSelectNetwork(net)}
                    className={`py-2 rounded-lg text-xs font-mono capitalize transition-all cursor-pointer ${
                      networkId === net
                        ? 'bg-[#182030] text-amber-300 border border-amber-500/40 font-bold shadow-md'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {net}
                  </button>
                ))}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="space-y-2 pt-2">
              <a
                href="https://faucet.preview.midnight.network"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-200 hover:text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Get Testnet Tokens (Faucet)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => {
                  onDisconnect();
                  onClose();
                }}
                className="w-full py-3 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-800/80 text-red-300 hover:text-red-100 font-mono text-xs font-bold transition-all cursor-pointer"
              >
                Disconnect Wallet
              </button>
            </div>
          </div>
        ) : (
          /* DISCONNECTED / CONNECTING STATE */
          <div className="space-y-5">
            <div className="bg-[#080B10] border border-gray-800 rounded-xl p-5 text-center space-y-4">
              {isConnecting ? (
                <div className="space-y-3 py-4">
                  <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                  <div className="space-y-1">
                    <p className="text-xs font-mono font-bold text-white">1AM / Lace Wallet (Midnight)</p>
                    <p className="text-[11px] font-mono text-amber-300">Opening extension popup...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-700/60 flex items-center justify-center mx-auto text-purple-300">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white font-mono">Connect 1AM Extension</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Clicking connect will trigger your 1AM / Lace Wallet browser extension popup to authorize your session on Midnight Preview Testnet.
                    </p>
                  </div>
                </div>
              )}

              {/* NETWORK SELECTOR */}
              <div className="space-y-2 text-left pt-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
                  SELECT NETWORK
                </label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-[#0F141C] border border-gray-800 rounded-xl">
                  {(['preview', 'preprod', 'undeployed'] as MidnightNetwork[]).map((net) => (
                    <button
                      key={net}
                      onClick={() => onSelectNetwork(net)}
                      className={`py-2 rounded-lg text-xs font-mono capitalize transition-all cursor-pointer ${
                        networkId === net
                          ? 'bg-[#182030] text-amber-300 border border-amber-500/40 font-bold'
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {net}
                    </button>
                  ))}
                </div>
              </div>

              {!isConnecting && (
                <button
                  onClick={onConnect}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white font-mono font-bold text-xs shadow-lg shadow-purple-950 transition-all cursor-pointer"
                >
                  Connect 1AM Wallet Extension
                </button>
              )}
            </div>

            <p className="text-[10px] font-mono text-gray-500 text-center">
              Clicking connect opens your browser extension popup.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
