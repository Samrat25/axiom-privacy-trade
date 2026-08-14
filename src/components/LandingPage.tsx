import React, { useState, useEffect } from 'react';
import { Clock, ArrowRight, Menu, X, Shield, Lock, ExternalLink, Cpu, Activity, Zap, CheckCircle2, ChevronRight, Layers } from 'lucide-react';
import { Shader, Swirl, ChromaFlow, FlutedGlass, FilmGrain } from 'shaders/react';

interface LandingPageProps {
  onConnectWallet: () => void;
  onEnterDashboard: () => void;
  walletConnected: boolean;
  walletAddress: string | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onConnectWallet,
  onEnterDashboard,
  walletConnected,
  walletAddress,
}) => {
  const [londonTime, setLondonTime] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [hasShaderError, setHasShaderError] = useState<boolean>(false);

  // Live London Time (HH:MM format)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(now);
      setLondonTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#EFEFEF] text-gray-900 font-sans selection:bg-orange-500 selection:text-white">
      {/* ========================================================================= */}
      {/* SECTION 1: HERO (Full viewport height with Animated Shaders)               */}
      {/* ========================================================================= */}
      <section className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#EFEFEF]">
        {/* Animated Shader Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {!hasShaderError ? (
            <Shader
              className="w-full h-full"
              onUnavailable={() => setHasShaderError(true)}
            >
              <Swirl colorA="#ffffff" colorB="#f0f0f0" detail={1.7} />
              <ChromaFlow
                baseColor="#ffffff"
                downColor="#ff5f03"
                leftColor="#ff5f03"
                rightColor="#ff5f03"
                upColor="#ff5f03"
                momentum={13}
                radius={3.5}
              />
              <FlutedGlass
                aberration={0.61}
                angle={31}
                frequency={8}
                highlight={0.12}
                highlightSoftness={0}
                lightAngle={-90}
                refraction={4}
                shape="rounded"
                softness={1}
                speed={0.15}
              />
              <FilmGrain strength={0.05} />
            </Shader>
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-[#EFEFEF] via-[#F8F8F8] to-[#ff5f03]/10 opacity-70" />
          )}
        </div>

        {/* Navigation (z-20, relative) */}
        <header className="relative z-20 w-full max-w-[1440px] mx-auto p-2 sm:p-3">
          <nav className="bg-white rounded-full p-[5px] flex items-center justify-between shadow-sm border border-gray-100/80">
            {/* Left Nav */}
            <div className="flex items-center gap-6 pl-1">
              <a href="#hero" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden shadow-xs border border-gray-200 bg-gray-900 flex items-center justify-center shrink-0">
                  <img
                    src="/axiom-logo.png"
                    alt="Axiom Trade"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-extrabold text-gray-900 tracking-tight leading-none">AXIOM</span>
                  <span className="text-[9px] text-gray-600 font-semibold tracking-wider uppercase">TRADE</span>
                </div>
              </a>

              <div className="hidden md:flex items-center gap-6">
                <a href="#architecture" className="text-[14px] text-gray-900 hover:text-gray-500 transition-colors duration-300 font-medium">Architecture</a>
                <a href="#modules" className="text-[14px] text-gray-900 hover:text-gray-500 transition-colors duration-300 font-medium">Modules</a>
                <a href="#circuits" className="text-[14px] text-gray-900 hover:text-gray-500 transition-colors duration-300 font-medium">ZK Circuits</a>
                <a href="https://preview.midnightexplorer.com/transactions" target="_blank" rel="noreferrer" className="text-[14px] text-gray-900 hover:text-gray-500 transition-colors duration-300 font-medium flex items-center gap-1">
                  <span>Explorer</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </div>
            </div>

            {/* Right Nav */}
            <div className="hidden md:flex items-center gap-4 sm:gap-5 pr-1">
              <div className="flex items-center gap-2 text-[12px] font-semibold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200/80">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Midnight Preview Live</span>
              </div>

              <div className="flex items-center gap-1.5 text-[13px] text-gray-600 font-medium">
                <Clock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                <span>{londonTime ? `${londonTime} in London` : 'London'}</span>
              </div>

              {/* CTA Button with Text Roll */}
              <button
                onClick={walletConnected ? onEnterDashboard : onConnectWallet}
                className="bg-gray-900 hover:bg-black text-white text-[13px] font-medium rounded-full pl-5 pr-2 py-2 group flex items-center gap-3 transition-all duration-300 shadow-sm cursor-pointer"
              >
                <div className="flex flex-col overflow-hidden h-[20px]">
                  <span className="transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-full">
                    {walletConnected ? 'Launch Dashboard' : 'Launch Axiom Trade'}
                  </span>
                  <span className="transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-full">
                    {walletConnected ? 'Enter Protocol' : 'Connect 1AM Wallet'}
                  </span>
                </div>

                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45">
                  <ArrowRight className="w-3 h-3 text-gray-900" />
                </div>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden pr-1">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>
          </nav>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-fadeIn">
            <div className="bg-white rounded-2xl mx-3 mb-3 p-6 space-y-6 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
                  <Clock className="w-3 h-3 text-gray-600" />
                  <span>{londonTime ? `${londonTime} in London` : 'London'}</span>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col space-y-3 pt-2">
                {[
                  { name: 'Architecture', href: '#architecture' },
                  { name: 'Modules', href: '#modules' },
                  { name: 'ZK Circuits', href: '#circuits' },
                  { name: 'Midnight Explorer', href: 'https://preview.midnightexplorer.com/transactions' }
                ].map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[28px] sm:text-[32px] font-medium text-gray-900 hover:text-orange-600 transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (walletConnected) onEnterDashboard();
                    else onConnectWallet();
                  }}
                  className="w-full bg-[#F26522] hover:bg-[#e05a1a] text-white text-[15px] font-medium rounded-full py-3.5 px-6 flex items-center justify-between cursor-pointer transition-colors shadow-lg"
                >
                  <span>{walletConnected ? 'Launch Dashboard' : 'Connect 1AM Wallet'}</span>
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5 text-[#F26522]" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Content (z-20, Bottom aligned) */}
        <div id="hero" className="relative z-20 flex-1 flex flex-col justify-end max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-12 pb-14 sm:pb-16 lg:pb-20">
          {/* Small Label */}
          <div className="mb-5 sm:mb-8 flex items-center gap-2">
            <span className="text-[13px] sm:text-[14px] text-gray-900 tracking-wide font-bold">Axiom Trade</span>
            <span className="text-gray-400">•</span>
            <span className="text-[12px] sm:text-[13px] text-gray-700 font-medium tracking-wide">Private moves. Public proof.</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 max-w-5xl">
            Autonomous trading with <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>zero-knowledge privacy <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>on Midnight Network.
          </h1>

          <p className="mt-4 sm:mt-6 text-[15px] sm:text-[17px] text-gray-700 max-w-2xl leading-relaxed font-normal">
            Axiom combines client-side Gemini AI strategy synthesis, Compact smart contracts, and EZKL risk verification. Your trade secrets stay private — execution is proven on-chain.
          </p>

          {/* CTA Row */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
            {/* Orange Button */}
            <button
              onClick={walletConnected ? onEnterDashboard : onConnectWallet}
              className="bg-[#F26522] hover:bg-[#e05a1a] text-white text-[13px] sm:text-[14px] font-medium rounded-full pl-5 sm:pl-6 pr-2 py-2 group flex items-center gap-3.5 transition-all duration-300 shadow-md cursor-pointer"
            >
              <div className="flex flex-col overflow-hidden h-[20px]">
                <span className="transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-full">
                  {walletConnected ? 'Enter Trading App' : 'Launch Axiom Protocol'}
                </span>
                <span className="transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-full">
                  {walletConnected ? 'Launch Dashboard' : 'Connect 1AM Wallet'}
                </span>
              </div>

              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45">
                <ArrowRight className="w-3.5 h-3.5 text-[#F26522]" />
              </div>
            </button>

            {/* Midnight Featured Partner Badge */}
            <a
              href="https://midnight.network"
              target="_blank"
              rel="noreferrer"
              className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] rounded-full px-4 py-2 flex items-center gap-2.5 transition-shadow cursor-pointer border border-gray-200/60"
            >
              <Shield className="w-4 h-4 text-[#F26522]" />
              <span className="text-[13px] sm:text-[14px] font-semibold text-gray-900">Featured by Midnight Network</span>
              <span className="text-[10px] sm:text-[11px] bg-gray-900 text-white px-2 py-0.5 rounded-full font-medium">Preprod & Preview</span>
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: ARCHITECTURE (White background)                                */}
      {/* ========================================================================= */}
      <section id="architecture" className="bg-white pt-16 sm:pt-20 lg:pt-32 pb-16 sm:pb-20 lg:pb-28 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          {/* Badge Row */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center">
              1
            </div>
            <div className="text-[12px] sm:text-[13px] font-medium border border-gray-200 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-gray-900">
              The Axiom ZK Architecture
            </div>
          </div>

          {/* Heading h2 */}
          <h2 className="text-[clamp(1.5rem,4vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 mb-12 sm:mb-16 lg:mb-20 max-w-4xl">
            Confidential strategy execution, <br className="hidden sm:block" />
            mathematically proven on-chain.
          </h2>

          {/* 3 Pillar Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Pillar 1 */}
            <div className="bg-[#F9F9F9] border border-gray-200/80 rounded-2xl p-6 sm:p-8 space-y-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-xs">
                <Cpu className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Client-Side AI Synthesis</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                Gemini 2.5 Flash compiles natural language trading logic into local cryptographic parameters without exposing your alpha to external oracles or RPC nodes.
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-gray-900 bg-white border border-gray-200 px-2.5 py-1 rounded-full">
                  Zero Prompt Exposure
                </span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#F9F9F9] border border-gray-200/80 rounded-2xl p-6 sm:p-8 space-y-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-xs">
                <Shield className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Compact ZK Smart Contracts</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                Dual-shielded state machine running natively on Midnight. Enforces risk rules and executes trades via <code className="text-gray-900 font-semibold">commitStrategy</code> and <code className="text-gray-900 font-semibold">executeTrade</code>.
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-gray-900 bg-white border border-gray-200 px-2.5 py-1 rounded-full">
                  Midnight Compact v0.24
                </span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#F9F9F9] border border-gray-200/80 rounded-2xl p-6 sm:p-8 space-y-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-xs">
                <Lock className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">EZKL Verifiable Risk Boundary</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                Client-side halo2 zero-knowledge ML proofs ensure every trade respects strict volatility and drawdown limits before submitting transactions to the wallet.
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-gray-900 bg-white border border-gray-200 px-2.5 py-1 rounded-full">
                  ZK-ML Proof Verification
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: LIVE MODULES (Light gray background)                           */}
      {/* ========================================================================= */}
      <section id="modules" className="bg-[#F5F5F5] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28">
        <div className="max-w-[1440px] mx-auto">
          {/* Badge Row */}
          <div className="px-5 sm:px-8 lg:px-12 flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center">
              2
            </div>
            <div className="text-[12px] sm:text-[13px] font-medium border border-gray-300 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-gray-900">
              Live Midnight Modules
            </div>
          </div>

          {/* Heading h2 */}
          <h2 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 px-5 sm:px-8 lg:px-12 mb-10 sm:mb-14 lg:mb-16">
            Protocol capabilities
          </h2>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7 px-5 sm:px-8 lg:px-12">
            {/* Card 1: Shielded Strategy Builder */}
            <div className="flex flex-col bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <Layers className="w-5 h-5 text-orange-500" />
                  <span>Shielded Strategy Builder</span>
                </div>
                <span className="text-[10px] bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full font-bold">MODULE 01</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                Synthesize high-frequency parameters from natural language prompts. Strategy hashes are committed to Midnight's ledger while threshold witnesses remain decrypted strictly on your device.
              </p>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs font-mono text-gray-700 space-y-1">
                <div>Commitment Hash: <span className="text-orange-600 font-bold">0x811c9dc5…d9</span></div>
                <div>Witness Storage: <span className="text-emerald-700 font-bold">Client-Side Encrypted</span></div>
              </div>
            </div>

            {/* Card 2: 1AM Wallet & Midnight Explorer */}
            <div className="flex flex-col bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <Zap className="w-5 h-5 text-orange-500" />
                  <span>1AM Wallet & ProofStation</span>
                </div>
                <span className="text-[10px] bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full font-bold">MODULE 02</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                Direct integration with Midnight's 1AM wallet. Execute zero-gas sponsored transactions via ProofStation and track real-time confirmations on <a href="https://preview.midnightexplorer.com/transactions" target="_blank" rel="noreferrer" className="text-orange-600 underline font-medium">preview.midnightexplorer.com/transactions</a>.
              </p>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs font-mono text-gray-700 space-y-1">
                <div>Gas Model: <span className="text-emerald-700 font-bold">ProofStation Sponsored</span></div>
                <div>Explorer Link: <span className="text-orange-600 font-bold">preview.midnightexplorer.com/transactions/…</span></div>
              </div>
            </div>

            {/* Card 3: Shielded Vault (vUSD) */}
            <div className="flex flex-col bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <Shield className="w-5 h-5 text-orange-500" />
                  <span>Shielded Vault (vUSD)</span>
                </div>
                <span className="text-[10px] bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full font-bold">MODULE 03</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                Convert public tNIGHT collateral into private USDC-equivalent vault notes. Deposit, trade, and withdraw without linking your public wallet address to trading history.
              </p>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs font-mono text-gray-700 space-y-1">
                <div>Circuits: <span className="text-gray-900 font-bold">mintVaultBalance • burnVaultBalance</span></div>
                <div>Privacy Layer: <span className="text-emerald-700 font-bold">Zero Address Linkability</span></div>
              </div>
            </div>

            {/* Card 4: Gemini Market Intelligence */}
            <div className="flex flex-col bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <Activity className="w-5 h-5 text-orange-500" />
                  <span>Gemini Technical Signals</span>
                </div>
                <span className="text-[10px] bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full font-bold">MODULE 04</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                Live cryptocurrency price feeds and automated technical analysis generated by Gemini 2.5 Flash with custom prompt queries and risk metrics.
              </p>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs font-mono text-gray-700 space-y-1">
                <div>Live Feeds: <span className="text-gray-900 font-bold">ADA • BTC • ETH • SOL • tNIGHT</span></div>
                <div>Model: <span className="text-orange-600 font-bold">Gemini 2.5 Flash</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer minimal branding bar */}
      <footer className="bg-white border-t border-gray-200 py-8 px-5 sm:px-8 lg:px-12 text-xs text-gray-500 font-sans">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img src="/axiom-logo.png" alt="Axiom Trade" className="w-6 h-6 rounded-full object-cover shadow-2xs" />
            <span className="font-bold text-gray-900">AXIOM TRADE</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600 font-medium">Private moves. Public proof.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="https://preview.midnightexplorer.com/transactions" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
              Midnight Explorer
            </a>
            <a href="https://faucet.preview.midnight.network" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
              Testnet Faucet
            </a>
            <button
              onClick={walletConnected ? onEnterDashboard : onConnectWallet}
              className="text-orange-600 hover:text-orange-700 font-bold underline cursor-pointer"
            >
              {walletConnected ? 'Launch Dashboard →' : 'Connect 1AM Wallet →'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
