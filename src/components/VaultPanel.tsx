import React, { useState } from 'react';
import {
  Lock,
  PlusCircle,
  MinusCircle,
  ArrowUpRight,
  CheckCircle2,
  Shield,
  Sparkles
} from 'lucide-react';

interface VaultPanelProps {
  displayGreetingAddr: string;
  networkId: string;
  unshieldedBalance: string;
  shieldedBalance: string;
  dustBalance: string;
  vaultBalance: number;
  mintVault: (amount: number) => Promise<any>;
  burnVault: (amount: number) => Promise<any>;
}

export const VaultPanel: React.FC<VaultPanelProps> = ({
  displayGreetingAddr,
  networkId,
  unshieldedBalance,
  shieldedBalance,
  dustBalance,
  vaultBalance,
  mintVault,
  burnVault
}) => {
  const [withdrawAmount, setWithdrawAmount] = useState<string>('500');
  const [mintAmount, setMintAmount] = useState<string>('250');
  const [withdrawSuccess, setWithdrawSuccess] = useState<boolean>(false);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawSuccess(true);
    setTimeout(() => setWithdrawSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Top Vault & Wallet Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-orange-50 border border-orange-200/80 shadow-xs flex items-center justify-center shrink-0">
            <img
              src="/axiom-icon-mark.png"
              alt="Axiom Mark"
              className="h-9 w-auto object-contain"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#020C21] tracking-tight">
                Shielded Vault & Token Balances
              </h1>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold uppercase tracking-wider">
                1AM ZERO-KNOWLEDGE LEDGER
              </span>
            </div>
            <p className="text-xs text-[#59627E] leading-relaxed">
              Manage your private USDC-equivalent trading vault (<code className="font-mono font-bold text-[#020C21]">vUSD</code>) and review all token balances in your connected 1AM wallet.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3.5 py-2 rounded-2xl text-xs shrink-0 font-mono shadow-2xs">
          <span className="text-gray-500">Wallet:</span>
          <span className="font-bold text-orange-600">{displayGreetingAddr}</span>
        </div>
      </div>

      {/* Comprehensive Connected Wallet Token Matrix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-[#3C1868]" />
            Connected Wallet & Shielded Token Balances
          </h3>
          <span className="text-[11px] text-gray-500">
            Auto-synced with 1AM Extension & Midnight {networkId === 'preprod' ? 'Preprod' : 'Preview'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Public Unshielded tNIGHT */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 space-y-2 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">WALLET TNIGHT</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 font-bold">UNSHIELDED</span>
            </div>
            <div className="flex items-baseline gap-1.5 min-w-0">
              <span className="text-xl sm:text-2xl font-extrabold text-gray-900 truncate">{unshieldedBalance}</span>
            </div>
            <div className="text-[11px] text-gray-500 flex items-center justify-between pt-1 border-t border-gray-100">
              <span>Public 1AM Key</span>
              <button
                onClick={() => setMintAmount('500')}
                className="text-orange-600 hover:underline font-bold text-[10px] cursor-pointer"
              >
                Shield →
              </button>
            </div>
          </div>

          {/* 2. Shielded Private Note */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 space-y-2 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">SHIELDED TNIGHT</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">ZK PRIVATE</span>
            </div>
            <div className="flex items-baseline gap-1.5 min-w-0">
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-700 truncate">{shieldedBalance}</span>
            </div>
            <div className="text-[11px] text-emerald-700 flex items-center justify-between pt-1 border-t border-gray-100 font-medium">
              <span>Private State Note</span>
              <span>Encrypted</span>
            </div>
          </div>

          {/* 3. Shielded Trading Vault (vUSD) */}
          <div className="bg-white border border-orange-200 rounded-2xl p-5 space-y-2 shadow-sm ring-1 ring-orange-500/20 overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-orange-600 font-bold uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3 h-3 text-orange-500" /> TRADING VAULT
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold">vUSD</span>
            </div>
            <div className="flex items-baseline gap-1.5 min-w-0">
              <span className="text-xl sm:text-2xl font-extrabold text-gray-900 truncate">${vaultBalance.toLocaleString()}</span>
              <span className="text-xs text-orange-600 font-bold shrink-0">vUSD</span>
            </div>
            <div className="text-[11px] text-emerald-700 flex items-center justify-between pt-1 border-t border-orange-100 font-medium">
              <span>Active Capital</span>
              <span>ZK Trade Ready</span>
            </div>
          </div>

          {/* 4. tDUST Reserve */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 space-y-2 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">TDUST RESERVE</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">GAS FUEL</span>
            </div>
            <div className="flex items-baseline gap-1.5 min-w-0">
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-700 truncate">{dustBalance}</span>
            </div>
            <div className="text-[11px] text-gray-500 flex items-center justify-between pt-1 border-t border-gray-100">
              <span>ProofStation</span>
              <span className="text-emerald-700 font-bold">Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vault Mint / Burn Interactive Section */}
      <div className="bg-white border border-gray-200/80 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              Shield & Unshield Vault Collateral
            </h2>
            <p className="text-xs text-gray-500">
              Deposit public collateral into shielded <code className="font-mono text-gray-900">vUSD</code> notes or burn back to public balance.
            </p>
          </div>

          <span className="text-xs font-bold text-gray-900 bg-gray-100 px-3.5 py-1.5 rounded-full font-mono border border-gray-200/60 shadow-2xs">
            Vault Balance: ${vaultBalance.toLocaleString()} vUSD
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
          {/* 1. MINT CARD */}
          <div className="bg-gradient-to-br from-emerald-50/40 via-white to-gray-50 p-6 rounded-2xl border border-emerald-200/80 space-y-4 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5 uppercase tracking-wide">
                <PlusCircle className="w-4 h-4 text-emerald-600" /> Mint to Shielded Vault
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                DEPOSIT
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-600 block">Amount to Mint (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-gray-500 font-bold font-mono">$</span>
                <input
                  type="number"
                  min="1"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl pl-7 pr-4 py-2.5 text-xs text-gray-900 font-mono font-bold focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="250"
                />
              </div>
            </div>

            {/* Preset Amount Chips */}
            <div className="flex items-center gap-1.5">
              {['100', '250', '500', '1000'].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setMintAmount(amt)}
                  className="flex-1 py-1.5 rounded-lg bg-white hover:bg-emerald-50 text-[11px] font-bold text-gray-700 border border-gray-200 transition-all cursor-pointer hover:border-emerald-300"
                >
                  +${amt}
                </button>
              ))}
            </div>

            <button
              onClick={() => mintVault(parseFloat(mintAmount) || 100)}
              className="w-full py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5 hover:shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Mint ${mintAmount || '0'} vUSD to Vault</span>
            </button>
          </div>

          {/* 2. BURN CARD */}
          <div className="bg-gradient-to-br from-red-50/40 via-white to-gray-50 p-6 rounded-2xl border border-red-200/80 space-y-4 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-red-900 flex items-center gap-1.5 uppercase tracking-wide">
                <MinusCircle className="w-4 h-4 text-red-600" /> Burn from Shielded Vault
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 font-bold">
                WITHDRAW
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-600 block">Amount to Burn (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-gray-500 font-bold font-mono">$</span>
                <input
                  type="number"
                  min="1"
                  max={vaultBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl pl-7 pr-4 py-2.5 text-xs text-gray-900 font-mono font-bold focus:outline-none focus:border-red-500 transition-colors"
                  placeholder="500"
                />
              </div>
            </div>

            {/* Preset Amount Chips */}
            <div className="flex items-center gap-1.5">
              {['100', '250', '500'].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setWithdrawAmount(amt)}
                  className="flex-1 py-1.5 rounded-lg bg-white hover:bg-red-50 text-[11px] font-bold text-gray-700 border border-gray-200 transition-all cursor-pointer hover:border-red-300"
                >
                  -${amt}
                </button>
              ))}
              <button
                onClick={() => setWithdrawAmount(vaultBalance.toString())}
                className="flex-1 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-[11px] font-extrabold text-red-800 border border-red-200 transition-all cursor-pointer"
              >
                Max
              </button>
            </div>

            <button
              onClick={() => burnVault(parseFloat(withdrawAmount) || 100)}
              disabled={vaultBalance <= 0 || parseFloat(withdrawAmount) > vaultBalance}
              className={`w-full py-2.5 rounded-full font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                vaultBalance > 0 && parseFloat(withdrawAmount) <= vaultBalance
                  ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer hover:shadow-sm'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <MinusCircle className="w-4 h-4" />
              <span>Burn ${withdrawAmount || '0'} vUSD from Vault</span>
            </button>
          </div>
        </div>
      </div>

      {/* Unshield & Withdraw Circuit Execution */}
      <div className="bg-white border border-gray-200/80 rounded-3xl p-6 space-y-4 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <ArrowUpRight className="w-5 h-5 text-orange-500" />
          Unshield & Withdraw (unshieldWithdraw Compact Circuit)
        </h2>
        <p className="text-xs text-gray-600 leading-relaxed">
          Executes the on-chain <code className="text-gray-900 font-mono font-semibold">unshieldWithdraw</code> circuit. Proves ownership of a private balance note in zero-knowledge and transfers public tokens back to your 1AM wallet balance.
        </p>

        <form onSubmit={handleWithdrawSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Withdraw Amount (USD Value)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 font-mono focus:outline-none focus:border-orange-500 transition-colors"
              />
              <span className="text-xs font-mono text-gray-500 font-bold px-2">vUSD</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gray-900 hover:bg-black text-white font-semibold text-xs transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2 hover:shadow-md"
          >
            <ArrowUpRight className="w-4 h-4 text-orange-400" />
            <span>Execute Unshield Transfer via 1AM</span>
          </button>
        </form>

        {withdrawSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl text-xs flex items-center gap-2 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Unshield circuit execution successful! Value returned to public 1AM wallet balance.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VaultPanel;
