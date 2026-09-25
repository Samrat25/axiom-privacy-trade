import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Lock,
  Cpu,
  Zap,
  ArrowRight,
  ExternalLink,
  Activity,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  Menu,
  X,
  Play
} from 'lucide-react';
import { formatISTDate, formatISTTime } from '../utils/time';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync video playback with reduced-motion preference & visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleSync = () => {
      if (mediaQuery.matches) {
        video.pause();
        video.currentTime = 0;
      } else {
        video.play().catch(() => {});
      }
    };

    mediaQuery.addEventListener('change', handleSync);
    const handleVisibility = () => {
      if (!document.hidden) handleSync();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    handleSync();

    return () => {
      mediaQuery.removeEventListener('change', handleSync);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#E6EDF6] text-[#020C21] font-sans selection:bg-[#4A78B0] selection:text-white overflow-x-hidden">
      {/* ========================================================================= */}
      {/* SECTION 1: HERO SECTION — Full Viewport Luxury Caustics Experience        */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden isolate select-none">
        {/* Background Video Plate with Traveling Caustics */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover object-center z-0 filter brightness-[1.01] saturate-[0.98] pointer-events-none"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
          poster="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_105822_bf7c2d53-9957-4521-bbbf-7c1ab7a70130.png"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_105953_21ad8049-9088-4a00-bad3-aee6b5575a2b.mp4"
        />
        {/* Soft Ambient Tint */}
        <div className="absolute inset-0 bg-white/20 z-1 pointer-events-none backdrop-blur-[0.5px]" />

        {/* ── HEADER NAVBAR ── */}
        <header className="relative z-20 w-full max-w-[1400px] mx-auto px-5 sm:px-8 pt-5 sm:pt-7">
          <div className="flex items-center justify-between gap-4">
            {/* BRAND: Big Custom Logo */}
            <a href="#hero" className="flex items-center gap-4 group text-left">
              <div className="h-16 sm:h-20 px-4 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/90 shadow-md flex items-center justify-center shrink-0 group-hover:shadow-lg group-hover:border-[#3C1868]/40 transition-all">
                <img
                  src="/axiom-logo.png"
                  alt="Axiom Trade Logo"
                  className="h-11 sm:h-15 w-auto object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="hidden sm:flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-xl font-black text-[#020C21] tracking-tight leading-none">
                    AXIOM TRADE
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#0F1B31] text-white uppercase tracking-wider">
                    Preprod Live
                  </span>
                </div>
                <span className="text-xs text-[#59627E] font-medium pt-1">
                  Confidential AI-Orchestrated Protocol
                </span>
              </div>
            </a>

            {/* NAV PILL — Centered Frosted Glass Capsule */}
            <nav className="hidden lg:flex items-center gap-7 px-7 py-3 rounded-full bg-white/85 backdrop-blur-xl border border-white/90 shadow-md text-sm font-semibold text-[#020C21]">
              <a href="#hero" className="hover:text-[#3C1868] transition-colors flex items-center gap-1.5">
                <span>Home</span>
              </a>
              <span className="text-gray-300">/</span>
              <a href="#architecture" className="hover:text-[#3C1868] transition-colors">
                Architecture
              </a>
              <span className="text-gray-300">/</span>
              <a href="#modules" className="hover:text-[#3C1868] transition-colors">
                Modules
              </a>
              <span className="text-gray-300">/</span>
              <a href="#circuits" className="hover:text-[#3C1868] transition-colors">
                ZK Circuits
              </a>
              <span className="text-gray-300">/</span>
              <a
                href="https://explorer.1am.xyz/contract/2428cd4ae7c2cd0bb501e1e9162de3003b103c1063c220e0d5cfc3f0b438e524?network=preprod"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#3C1868] transition-colors flex items-center gap-1 text-[#3C1868]"
              >
                <span>1AM Explorer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </nav>

            {/* PRIMARY CTA: Executive Glass Knob Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={walletConnected ? onEnterDashboard : onConnectWallet}
                className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#0F1B31] hover:bg-black text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-3 group cursor-pointer"
              >
                <span>{walletConnected ? 'Open Terminal' : 'Launch Protocol'}</span>
                <span className="w-7 h-7 rounded-full bg-[#384B64] flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </span>
              </button>

              {/* Mobile Burger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-11 h-11 rounded-full bg-white/90 backdrop-blur-md border border-white/80 shadow-md flex items-center justify-center text-[#020C21] cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 p-5 rounded-3xl bg-white/95 backdrop-blur-2xl border border-white/90 shadow-2xl space-y-4 animate-fadeIn">
              <div className="flex flex-col space-y-3 font-semibold text-sm text-[#020C21]">
                <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#3C1868] py-1">Home</a>
                <a href="#architecture" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#3C1868] py-1">Architecture</a>
                <a href="#modules" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#3C1868] py-1">Modules</a>
                <a href="#circuits" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#3C1868] py-1">ZK Circuits</a>
                <a
                  href="https://explorer.1am.xyz/contract/2428cd4ae7c2cd0bb501e1e9162de3003b103c1063c220e0d5cfc3f0b438e524?network=preprod"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#3C1868] py-1 flex items-center gap-1.5"
                >
                  <span>1AM Preprod Explorer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onEnterDashboard();
                }}
                className="w-full py-3.5 rounded-full bg-[#0F1B31] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Enter Trading Terminal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </header>

        {/* ── HERO CENTER CONTENT ── */}
        <div id="hero" className="relative z-10 w-full max-w-[1400px] mx-auto px-5 sm:px-8 py-10 sm:py-16 my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Big Headline & Taglines */}
            <div className="lg:col-span-8 space-y-7 sm:space-y-9">
              {/* Eyebrow Badge — Prominent & Bold */}
              <div className="inline-flex items-center gap-2.5 px-5 sm:px-6 py-2.5 rounded-full bg-white/95 backdrop-blur-xl border border-white/90 shadow-sm text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#3C1868]">
                <Shield className="w-4 h-4 text-[#3C1868]" />
                <span>Confidential AI-Orchestrated Trading Protocol</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ml-1"></span>
              </div>

              {/* Massive Commanding Headline ("Front") */}
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[5.75rem] font-light leading-[1.02] tracking-[-0.035em] text-[#020C21]">
                <span>Confidential Trading</span><br />
                <span className="font-semibold bg-gradient-to-r from-[#3C1868] via-[#5B2B9D] to-[#020C21] bg-clip-text text-transparent">
                  Proven in Zero-Knowledge.
                </span>
              </h1>

              {/* Tagline & Value Proposition — Big, Legible, Impactful */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2 max-w-3xl">
                <button
                  onClick={onEnterDashboard}
                  className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-white/95 backdrop-blur-xl shadow-lg border border-white/90 flex items-center justify-center shrink-0 hover:scale-105 transition-transform cursor-pointer group/btn"
                  aria-label="Launch Video / Demo"
                >
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 text-[#0F1B31] fill-current ml-0.5 group-hover/btn:text-[#3C1868] transition-colors" />
                </button>
                <p className="text-xl sm:text-2xl md:text-[1.75rem] font-medium text-[#0F182F] leading-snug tracking-tight">
                  Zero strategy rules exposed to mempools. <span className="text-[#3C1868] font-bold">Protect what matters.</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onEnterDashboard}
                  className="px-8 py-4 rounded-full bg-[#0F1B31] hover:bg-black text-white text-sm sm:text-base font-bold shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 cursor-pointer group"
                >
                  <span>Launch Trading Terminal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="#architecture"
                  className="px-7 py-4 rounded-full bg-white/90 hover:bg-white text-[#020C21] text-sm sm:text-base font-bold shadow-md border border-white/90 transition-all cursor-pointer"
                >
                  Explore Architecture ↓
                </a>
              </div>
            </div>

            {/* Right Column: Frosted Glass Panel (AI Risk Guard & Scale Meter) */}
            <div className="lg:col-span-4 flex justify-end">
              <aside className="w-full max-w-[340px] rounded-3xl bg-white/85 backdrop-blur-2xl border border-white/90 p-7 shadow-xl space-y-6 text-[#020C21]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight text-[#020C21]">AI-Driven</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4A78B0] animate-pulse"></span>
                  </div>
                  <div className="w-13 h-13 rounded-2xl bg-white shadow-md border border-gray-100 p-2 flex items-center justify-center shrink-0">
                    <img src="/axiom-icon-mark.png" alt="Axiom ZK Mark" className="w-full h-full object-contain" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#59627E]">Protection Guard</span>
                  <p className="text-base font-semibold text-[#0F182F] leading-snug">
                    Autonomous ZK Risk Engine & Execution Verifier
                  </p>
                </div>

                {/* Meter Scale */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                    <span>1K</span>
                    <span>10K</span>
                    <span>50K</span>
                    <span className="text-[#3C1868] font-bold">100K+</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#DDE4EE] overflow-hidden p-0.5">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#4A78B0] to-[#3C1868] w-[75%] transition-all duration-1000"></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Midnight Contract:</span>
                  <span className="font-mono font-bold text-[#3C1868]">v1.3.0 Verified</span>
                </div>
              </aside>
            </div>
          </div>
        </div>

        {/* ── STATS ROW & MEET AXIOM PILL ── */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-5 sm:px-8 pb-8 sm:pb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 border-t border-white/40">
            {/* Live Metrics */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-10">
              {/* Stat 1 */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-6xl font-extralight text-[#020C21] tracking-tight">
                  112+
                </span>
                <span className="text-xs sm:text-sm font-medium text-[#39455F] leading-tight">
                  Markets<br />Protected<br />Globally
                </span>
              </div>

              {/* Slash Divider */}
              <div className="hidden sm:block w-[1.5px] h-12 bg-gradient-to-b from-transparent via-[#A7B4C6] to-transparent rotate-12"></div>

              {/* Stat 2 */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-6xl font-extralight text-[#020C21] tracking-tight">
                  55K+
                </span>
                <span className="text-xs sm:text-sm font-medium text-[#39455F] leading-tight">
                  Trades<br />Secured in<br />Zero-Knowledge
                </span>
              </div>

              {/* Slash Divider */}
              <div className="hidden sm:block w-[1.5px] h-12 bg-gradient-to-b from-transparent via-[#A7B4C6] to-transparent rotate-12"></div>

              {/* Stat 3 */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-6xl font-extralight text-[#020C21] tracking-tight">
                  77+
                </span>
                <span className="text-xs sm:text-sm font-medium text-[#39455F] leading-tight">
                  Verified<br />Preprod<br />Testers
                </span>
              </div>
            </div>

            {/* Meet Axiom Capsule */}
            <button
              onClick={onEnterDashboard}
              className="px-5 py-3 rounded-full bg-white/80 hover:bg-white backdrop-blur-xl border border-white/90 shadow-md flex items-center gap-3.5 transition-all cursor-pointer group shrink-0 w-fit"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-xs border border-white shrink-0">
                <img
                  alt="Axiom Crystal Core"
                  className="w-full h-full object-cover"
                  src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_105822_bf7c2d53-9957-4521-bbbf-7c1ab7a70130.png"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-[#1B2A44] group-hover:text-[#3C1868] transition-colors">
                  Meet Axiom
                </span>
                <span className="text-[10px] text-gray-500">Autonomous Protocol</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#1A2B45] flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: ARCHITECTURE & ZERO-KNOWLEDGE FOUNDATION                       */}
      {/* ========================================================================= */}
      <section id="architecture" className="relative bg-white/90 backdrop-blur-xl border-t border-white/60 py-20 sm:py-28 px-6 sm:px-10 lg:px-16">
        <div className="max-w-[1320px] mx-auto space-y-12">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-gray-200/80">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E6EDF6] text-[#020C21] text-xs font-semibold uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5 text-[#3C1868]" />
                <span>Zero-Knowledge Architecture</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-[#020C21]">
                Confidential strategy execution, <br />
                <span className="font-semibold text-[#3C1868]">mathematically proven on Midnight.</span>
              </h2>
            </div>

            <div className="text-sm text-gray-500 max-w-sm leading-relaxed">
              Traders define boundaries in natural language. Strategy parameters stay encrypted in local browser memory while execution integrity is verified by Compact ZK circuits.
            </div>
          </div>

          {/* 3 Pillar Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white to-[#F5F8FC] border border-gray-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-[#3C1868]">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#020C21]">Client-Side AI Strategy Synthesis</h3>
              <p className="text-xs sm:text-sm text-[#59627E] leading-relaxed">
                Gemini 2.5 Flash compiles natural language trading risk parameters into deterministic mathematical constraints without exposing your proprietary alpha to RPC nodes.
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-[#020C21] bg-white border border-gray-200 px-3 py-1 rounded-full shadow-2xs">
                  Zero Prompt Leakage
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white to-[#F5F8FC] border border-gray-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-[#3C1868]">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#020C21]">Compact v1.3.0 Smart Contracts</h3>
              <p className="text-xs sm:text-sm text-[#59627E] leading-relaxed">
                Dual-shielded state machine running natively on Midnight Preprod. Enforces emergency circuit breakers, batch rebalancing, and MEV slippage protection in zero-knowledge.
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-[#020C21] bg-white border border-gray-200 px-3 py-1 rounded-full shadow-2xs">
                  Midnight Compact v0.24 ZKIR
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white to-[#F5F8FC] border border-gray-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-[#3C1868]">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#020C21]">EZKL Halo2 Risk Boundary</h3>
              <p className="text-xs sm:text-sm text-[#59627E] leading-relaxed">
                Client-side Halo2 zero-knowledge ML proofs ensure every trade respects strict volatility, drawdown, and position size ceilings before submitting transactions to the wallet.
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-[#020C21] bg-white border border-gray-200 px-3 py-1 rounded-full shadow-2xs">
                  ZK-ML Proof Verification
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: LIVE MODULES & PROTOCOL CAPABILITIES                           */}
      {/* ========================================================================= */}
      <section id="modules" className="py-20 sm:py-28 px-6 sm:px-10 lg:px-16 bg-[#E6EDF6]">
        <div className="max-w-[1320px] mx-auto space-y-12">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-gray-300">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white text-[#020C21] text-xs font-semibold uppercase tracking-wider border border-gray-200 shadow-2xs">
                <Layers className="w-3.5 h-3.5 text-[#3C1868]" />
                <span>Live Preprod Modules</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-[#020C21]">
                Institutional-grade <br />
                <span className="font-semibold text-[#3C1868]">protocol capabilities.</span>
              </h2>
            </div>

            <button
              onClick={onEnterDashboard}
              className="px-6 py-3 rounded-full bg-[#0F1B31] hover:bg-black text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer w-fit"
            >
              <span>Explore All Modules in Terminal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Module 1: Shielded Strategy Builder */}
            <div className="p-8 rounded-3xl bg-white border border-gray-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#E6EDF6] flex items-center justify-center text-[#3C1868]">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#020C21]">Shielded Strategy Builder</h4>
                    <span className="text-[11px] text-gray-500">Natural Language ZK Compilation</span>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-gray-100 font-bold uppercase text-gray-700">
                  MODULE 01
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#59627E] leading-relaxed">
                Synthesize high-frequency risk bounds from prompts. Strategy hashes are committed to Midnight's ledger while threshold witnesses remain decrypted strictly on your device.
              </p>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-mono text-gray-700 space-y-1">
                <div>Commitment Hash: <span className="text-[#3C1868] font-bold">0x811c9dc5…d9</span></div>
                <div>Witness Storage: <span className="text-emerald-700 font-bold">Client-Side Encrypted</span></div>
              </div>
            </div>

            {/* Module 2: 1AM Wallet & ProofStation */}
            <div className="p-8 rounded-3xl bg-white border border-gray-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#E6EDF6] flex items-center justify-center text-[#3C1868]">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#020C21]">1AM Wallet & ProofStation</h4>
                    <span className="text-[11px] text-gray-500">Zero-Gas Sponsored Proving</span>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-gray-100 font-bold uppercase text-gray-700">
                  MODULE 02
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#59627E] leading-relaxed">
                Direct integration with Midnight's 1AM wallet. Execute zero-gas sponsored transactions via ProofStation and track real-time confirmations on 1AM Preprod Explorer.
              </p>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-mono text-gray-700 space-y-1">
                <div>Gas Model: <span className="text-emerald-700 font-bold">ProofStation Sponsored</span></div>
                <div>Explorer Link: <span className="text-[#3C1868] font-bold">explorer.1am.xyz/tx/…</span></div>
              </div>
            </div>

            {/* Module 3: Shielded Vault (vUSD) */}
            <div className="p-8 rounded-3xl bg-white border border-gray-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#E6EDF6] flex items-center justify-center text-[#3C1868]">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#020C21]">Shielded Vault (vUSD)</h4>
                    <span className="text-[11px] text-gray-500">Confidential Stablecoin Notes</span>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-gray-100 font-bold uppercase text-gray-700">
                  MODULE 03
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#59627E] leading-relaxed">
                Convert public tNIGHT collateral into private USDC-equivalent vault notes. Deposit, trade, and withdraw without linking your public wallet address to trading history.
              </p>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-mono text-gray-700 space-y-1">
                <div>Circuits: <span className="text-gray-900 font-bold">mintVaultBalance • burnVaultBalance</span></div>
                <div>Privacy Layer: <span className="text-emerald-700 font-bold">Zero Address Linkability</span></div>
              </div>
            </div>

            {/* Module 4: Autonomous ZK Execution Bot */}
            <div className="p-8 rounded-3xl bg-white border border-gray-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#E6EDF6] flex items-center justify-center text-[#3C1868]">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#020C21]">Autonomous ZK Execution Bot</h4>
                    <span className="text-[11px] text-gray-500">Algorithmic Runner & Audit Studio</span>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-gray-100 font-bold uppercase text-gray-700">
                  MODULE 04
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#59627E] leading-relaxed">
                Algorithmic trading engine with 4 institutional stress scenarios, real-time MEV sandwich attack immunity tests, and cryptographically verifiable audit certificates.
              </p>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-mono text-gray-700 space-y-1">
                <div>Scenarios: <span className="text-gray-900 font-bold">Flash Crash • Bull Surge • Choppy • MEV</span></div>
                <div>Certificates: <span className="text-[#3C1868] font-bold">Compact v1.3.0 Verified</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER BAR WITH NEW CUSTOM LOGO                                           */}
      {/* ========================================================================= */}
      <footer className="bg-white border-t border-gray-200 py-10 px-6 sm:px-10 lg:px-16 text-xs text-[#59627E]">
        <div className="max-w-[1320px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <div className="h-13 px-3.5 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-center shrink-0">
              <img src="/axiom-logo.png" alt="Axiom Trade" className="h-9 w-auto object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[#020C21] tracking-tight text-sm">AXIOM TRADE</span>
              <span className="text-[10px] text-gray-500">Confidential AI-Orchestrated Trading Protocol • Midnight Preprod</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://explorer.1am.xyz/contract/2428cd4ae7c2cd0bb501e1e9162de3003b103c1063c220e0d5cfc3f0b438e524?network=preprod"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#020C21] transition-colors flex items-center gap-1 font-medium"
            >
              <span>1AM Preprod Explorer</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </a>
            <a
              href="https://docs.google.com/forms/d/1N8tk4NR4at56WroUt_5jyger578DWpgcueMCqPD2HEw"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#020C21] transition-colors font-medium"
            >
              Feedback Form
            </a>
            <button
              onClick={onEnterDashboard}
              className="px-5 py-2.5 rounded-full bg-[#0F1B31] text-white font-bold hover:bg-black transition-all cursor-pointer shadow-sm"
            >
              Launch Dashboard →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
