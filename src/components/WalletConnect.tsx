import React from 'react';
import { Wallet, ShieldCheck, RefreshCw, AlertTriangle, LogOut, Search, Fuel, Server } from 'lucide-react';
import type { DetectedWallet } from '../lib/lace-wallet';

interface WalletConnectProps {
  connected: boolean;
  address: string | null;
  shieldedAddress?: string | null;
  walletName: string;
  networkId?: string;
  balance: string;
  shieldedBalance?: string;
  unshieldedBalance?: string;
  isConnecting: boolean;
  error: string | null;
  proofServerUp?: boolean | null;
  dustReady?: boolean;
  detectedWallets?: DetectedWallet[];
  onOpenModal: () => void;
  onScan?: () => void;
  onConnect: (wallet?: unknown) => void;
  onDisconnect: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  connected,
  address,
  walletName,
  networkId = 'preview',
  balance,
  isConnecting,
  error,
  proofServerUp,
  dustReady,
  detectedWallets = [],
  onOpenModal,
  onScan,
  onDisconnect
}) => {
  const displayAddress =
    typeof address === 'string' && address.length > 0
      ? `${address.substring(0, 14)}…${address.substring(address.length - 6)}`
      : '';

  if (connected) {
    return (
      <div className="flex items-center gap-3 font-mono">
        {/* Proof server indicator */}
        {proofServerUp !== null && (
          <div title={proofServerUp ? 'Proof server running' : 'Proof server NOT running — start Docker'}>
            <Server className={`w-4 h-4 ${proofServerUp ? 'text-emerald-400' : 'text-red-400 animate-pulse'}`} />
          </div>
        )}

        <button
          onClick={onOpenModal}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#0F141C] hover:bg-[#182030] border border-gray-800 text-left transition-all cursor-pointer shadow-md"
        >
          <div className="flex flex-col items-end text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{walletName}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-200 font-bold">{String(balance)}</span>
            </div>
            {displayAddress && (
              <span className="text-purple-300 text-[11px] truncate max-w-[150px]" title={address || ''}>
                {displayAddress}
              </span>
            )}
          </div>
        </button>

        <button
          onClick={onDisconnect}
          title="Disconnect Wallet"
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span className="font-mono text-emerald-400 capitalize hidden sm:inline">{networkId}</span>
          <LogOut className="w-3.5 h-3.5 text-gray-400 hover:text-red-400 ml-1" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1 font-mono">
      <div className="flex items-center gap-2">
        {/* Proof server indicator */}
        {proofServerUp !== null && (
          <div
            title={proofServerUp ? 'Proof server running' : 'Proof server NOT running'}
            className={`p-2 rounded-xl border ${proofServerUp ? 'border-emerald-800 bg-emerald-950/50' : 'border-red-800 bg-red-950/50'}`}
          >
            <Server className={`w-4 h-4 ${proofServerUp ? 'text-emerald-400' : 'text-red-400'}`} />
          </div>
        )}

        {onScan && (
          <button
            onClick={onScan}
            title="Scan for wallet extensions"
            className="p-2 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-400 hover:text-purple-300 transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onOpenModal}
          disabled={isConnecting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs shadow-lg shadow-purple-950 border border-purple-400/40 transition-all cursor-pointer disabled:opacity-50"
        >
          {isConnecting ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-200" />
              <span>Opening 1AM Wallet…</span>
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4 text-purple-200" />
              <span>Connect 1AM Wallet</span>
              {detectedWallets.length > 0 && (
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-800/50">
                  {detectedWallets.length} found
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className="flex flex-col items-end gap-0.5 mt-1 max-w-sm text-right">
          <div className="flex items-center gap-1.5 text-[11px] text-red-300 bg-red-950/90 px-3 py-1.5 rounded-lg border border-red-800/80">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Proof server warning */}
      {proofServerUp === false && (
        <div className="flex items-center gap-1.5 text-[11px] text-amber-300 bg-amber-950/80 px-3 py-1.5 rounded-lg border border-amber-800/60 mt-1">
          <Server className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Proof server not running — start Docker first</span>
        </div>
      )}
    </div>
  );
};
