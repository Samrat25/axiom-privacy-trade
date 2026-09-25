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

  // WAAPI Motion Entrance Timeline
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const s = window.matchMedia('(max-width: 640px)').matches ? 0.86 : 1;
    const EXPO = 'cubic-bezier(.16,1,.3,1)';
    const SOFT = 'cubic-bezier(.22,.7,.25,1)';
    const GLASS = 'cubic-bezier(.2,.75,.28,1)';
    const running: Animation[] = [];

    const rise = (selector: string, delay: number, dur: number) => {
      const el = document.querySelector(selector) as HTMLElement;
      if (!el) return;
      const anim = el.animate(
        [
          { clipPath: 'inset(100% 0 -14% 0)', translate: '0 .16em' },
          { clipPath: 'inset(-18% 0 -14% 0)', translate: '0 0' }
        ],
        { duration: dur * s, delay: delay * s, easing: EXPO, fill: 'both' }
      );
      running.push(anim);
    };

    const lift = (selector: string, delay: number, dist = '.7em', dur = 560) => {
      const el = document.querySelector(selector) as HTMLElement;
      if (!el) return;
      const anim = el.animate(
        [
          { opacity: 0, translate: `0 ${dist}` },
          { opacity: 1, translate: '0 0' }
        ],
        { duration: dur * s, delay: delay * s, easing: SOFT, fill: 'both' }
      );
      running.push(anim);
    };

    const settle = (selector: string, delay: number, dur = 760, from = 0.985, dist = '1.1em') => {
      const el = document.querySelector(selector) as HTMLElement;
      if (!el) return;
      const anim = el.animate(
        [
          { opacity: 0, scale: from, translate: `0 ${dist}` },
          { opacity: 1, scale: 1, translate: '0 0' }
        ],
        { duration: dur * s, delay: delay * s, easing: GLASS, fill: 'both' }
      );
      running.push(anim);
    };

    const runAnim = (selector: string, keyframes: Keyframe[], delay: number, dur: number, easing = EXPO) => {
      const el = document.querySelector(selector) as HTMLElement;
      if (!el) return;
      const anim = el.animate(keyframes, {
        duration: dur * s,
        delay: delay * s,
        easing,
        fill: 'both'
      });
      running.push(anim);
    };

    lift('.hero-comp .brand', 60, '.55em', 600);
    settle('.hero-comp .nav', 150, 700, 0.99, '.5em');
    settle('.hero-comp .cta', 200, 700, 0.985, '.5em');
    settle('.hero-comp .burger', 150, 700, 0.9, '.4em');
    lift('.hero-comp .eyebrow', 300, '.8em', 520);

    const h1Spans = document.querySelectorAll('.hero-comp .hero-h1 .sx');
    if (h1Spans[0]) rise('.hero-comp .hero-h1 .sx:nth-of-type(1)', 380, 980);
    if (h1Spans[1]) rise('.hero-comp .hero-h1 .sx:nth-of-type(2)', 470, 980);

    settle('.hero-comp .play', 720, 640, 0.88, '.3em');
    lift('.hero-comp .tag', 770, '.7em', 560);
    settle('.hero-comp .panel', 800, 880, 0.982, '1.4em');

    runAnim('.hero-comp .shield', [{ scale: 0.86 }, { scale: 1 }], 700, 1020, EXPO);
    runAnim('.hero-comp .dot', [{ scale: 0 }, { scale: 1 }], 520, 1080, EXPO);
    runAnim('.hero-comp .track i', [{ scale: '0 1' }, { scale: '1 1' }], 820, 1120, EXPO);

    const nums = document.querySelectorAll('.hero-comp .num');
    if (nums[0]) rise('.hero-comp .stat:nth-of-type(1) .num', 920, 860);
    if (nums[1]) rise('.hero-comp .stat:nth-of-type(2) .num', 990, 860);

    const lbls = document.querySelectorAll('.hero-comp .lbl');
    if (lbls[0]) lift('.hero-comp .stat:nth-of-type(1) .lbl', 1030, '.6em', 520);
    if (lbls[1]) lift('.hero-comp .stat:nth-of-type(2) .lbl', 1075, '.6em', 520);

    runAnim('.hero-comp .slash', [{ scale: '1 0' }, { scale: '1 1' }], 700, 1010, EXPO);
    settle('.hero-comp .meet', 1140, 820, 0.985, '1.2em');

    return () => {
      running.forEach((a) => a.cancel());
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#E6EDF6] text-[#020C21] font-sans selection:bg-[#4A78B0] selection:text-white overflow-x-hidden">
      {/* ========================================================================= */}
      {/* SECTION 1: HERO SECTION — Pixel-Comp Design-Unit Experience               */}
      {/* ========================================================================= */}
      <section id="hero" className="hero-comp relative w-full h-screen min-h-screen overflow-hidden isolate select-none">
        <div className="card">
          <video
            ref={videoRef}
            className="bg"
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
          <div className="tint" />

          <div className="stack">
            {/* HEADER ROW */}
            <div className="row">
              <a className="brand l t" style={{ '--x': 68, '--y': 47 } as React.CSSProperties} href="#hero">
                <img className="mark" src="/axiom-logo.png" alt="Axiom Trade Logo" />
                <b className="sx" style={{ '--sx': 0.894 } as React.CSSProperties}>Axiom Trade</b>
              </a>

              <button
                className="burger"
                type="button"
                aria-label="Open menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="site-menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <i />
                <i />
              </button>

              <div className="menu" id="site-menu" data-open={mobileMenuOpen ? '' : undefined}>
                <nav className="nav">
                  <a href="#hero" className="n-home" aria-label="Home" onClick={() => setMobileMenuOpen(false)}>
                    <svg viewBox="0 0 20 21" fill="none" aria-hidden="true">
                      <path d="M2 8.4 10 2l8 6.4V18a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" stroke="#202940" strokeWidth="1.7" strokeLinejoin="round" />
                    </svg>
                  </a>
                  <a href="#architecture" className="n-explore" onClick={() => setMobileMenuOpen(false)}>
                    <span>Architecture</span>
                  </a>
                  <hr className="n-div" />
                  <a href="#modules" className="n-grid" aria-label="Modules" onClick={() => setMobileMenuOpen(false)}>
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <rect x="1" y="1" width="7.4" height="7.4" rx="1.7" stroke="#202940" strokeWidth="1.7" />
                      <rect x="11.6" y="1" width="7.4" height="7.4" rx="1.7" stroke="#202940" strokeWidth="1.7" />
                      <rect x="1" y="11.6" width="7.4" height="7.4" rx="1.7" stroke="#202940" strokeWidth="1.7" />
                      <rect x="11.6" y="11.6" width="7.4" height="7.4" rx="1.7" stroke="#202940" strokeWidth="1.7" />
                    </svg>
                  </a>
                  <a href="#circuits" className="n-product" onClick={() => setMobileMenuOpen(false)}>
                    <span>ZK Circuits</span>
                  </a>
                </nav>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    walletConnected ? onEnterDashboard() : onConnectWallet();
                  }}
                  className="cta l t r border-none cursor-pointer text-left"
                  style={{ '--x': 58, '--y': 30 } as React.CSSProperties}
                >
                  <span>{walletConnected ? 'Open Terminal' : 'Launch Protocol'}</span>
                  <span className="knob">
                    <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
                      <path d="m6.6 3.6 6 5.4-6 5.4" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            {/* HERO BLOCK */}
            <div className="hero-blk">
              <p className="eyebrow l c sx" style={{ '--x': 65.7, '--y': -209.2, '--sx': 0.9293 } as React.CSSProperties}>
                Confidential AI-Orchestrated Trading Protocol
              </p>
              <h1 className="hero-h1 l c" style={{ '--x': 62.6, '--y': -167.3 } as React.CSSProperties}>
                <span className="sx" style={{ '--sx': 0.9431 } as React.CSSProperties}>Confidential Trading</span>
                <br />
                <span className="sx" style={{ '--sx': 0.9792 } as React.CSSProperties}>Proven in Zero-Knowledge</span>
              </h1>

              <div className="tagrow">
                <button
                  onClick={onEnterDashboard}
                  className="play l c border-none cursor-pointer"
                  style={{ '--x': 66, '--y': 34 } as React.CSSProperties}
                  aria-label="Open Terminal"
                >
                  <svg viewBox="0 0 13 14" fill="none" aria-hidden="true">
                    <path d="M1.4 1.3 11.6 7 1.4 12.7z" fill="#0b1526" />
                  </svg>
                </button>
                <span className="tag l c sx" style={{ '--x': 131, '--y': 48.7, '--sx': 0.8973 } as React.CSSProperties}>
                  Zero Strategy Rules Exposed to Mempools. Protect What Matters.
                </span>
              </div>

              {/* GLASS PANEL */}
              <aside className="panel l c r" style={{ '--x': 58, '--y': -165 } as React.CSSProperties}>
                <span className="p-title sx" style={{ '--sx': 0.8707 } as React.CSSProperties}>AI-Driven</span>
                <span className="dot" />
                <div className="shield">
                  <img src="/axiom-icon-mark.png" alt="Axiom ZK Shield" style={{ width: 'calc(38 * var(--u))', height: 'calc(44 * var(--u))', objectFit: 'contain' }} />
                </div>
                <p className="p-sub sx" style={{ '--sx': 0.8899 } as React.CSSProperties}>
                  Autonomous<br />ZK Risk Engine<br />& Execution Guard
                </p>
                <div className="scale">
                  <span>1K</span>
                  <span>10K</span>
                  <span>50K</span>
                  <span>100K+</span>
                </div>
                <div className="track">
                  <i style={{ width: '75%' }} />
                </div>
              </aside>
            </div>

            {/* STATS & MEET ROW */}
            <div className="row">
              <div className="stats">
                <div className="stat">
                  <span className="num l b sx" style={{ '--x': 64, '--y': 60.4, '--sx': 1 } as React.CSSProperties}>
                    112+
                  </span>
                  <span className="lbl l b sx" style={{ '--x': 295, '--y': 73.2, '--sx': 0.9634 } as React.CSSProperties}>
                    Markets<br />Protected<br />Globally
                  </span>
                </div>
                <span className="slash l b" style={{ '--x': 418, '--y': 76 } as React.CSSProperties} />
                <div className="stat">
                  <span className="num l b sx" style={{ '--x': 480, '--y': 60.4, '--sx': 0.9858 } as React.CSSProperties}>
                    55K+
                  </span>
                  <span className="lbl l b sx" style={{ '--x': 716, '--y': 96.7, '--sx': 0.9209 } as React.CSSProperties}>
                    Trades<br />Secured
                  </span>
                </div>
              </div>

              <button
                onClick={onEnterDashboard}
                className="meet l b r border-none cursor-pointer text-left"
                style={{ '--x': 59, '--y': 66 } as React.CSSProperties}
              >
                <span className="thumb">
                  <img
                    alt="Axiom Core"
                    style={{ objectPosition: '60% 50%' }}
                    src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_105822_bf7c2d53-9957-4521-bbbf-7c1ab7a70130.png"
                  />
                </span>
                <b>Meet Axiom</b>
                <span className="knob">
                  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="m6.6 3.6 6 5.4-6 5.4" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            </div>
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
