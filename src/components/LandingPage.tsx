import React, { useState, useEffect } from 'react';
import { Clock, ArrowRight, Menu, X, Shield, Lock, ExternalLink } from 'lucide-react';
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
      {/* SECTION 1: HERO (Full viewport height)                                    */}
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
                <a href="#about" className="text-[14px] text-gray-900 hover:text-gray-500 transition-colors duration-300 font-medium">Projects</a>
                <a href="#about" className="text-[14px] text-gray-900 hover:text-gray-500 transition-colors duration-300 font-medium">Studio</a>
                <a href="#projects" className="text-[14px] text-gray-900 hover:text-gray-500 transition-colors duration-300 font-medium">Journal</a>
                <a href="#about" className="text-[14px] text-gray-900 hover:text-gray-500 transition-colors duration-300 font-medium">Connect</a>
              </div>
            </div>

            {/* Right Nav */}
            <div className="hidden md:flex items-center gap-4 sm:gap-5 pr-1">
              <span className="text-[13px] text-gray-600 hidden lg:block font-medium">Taking on projects for Q1 2026</span>

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
                    {walletConnected ? 'Launch Dashboard' : 'Book a strategy call'}
                  </span>
                  <span className="transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-full">
                    {walletConnected ? 'Enter Axiom Trade' : 'Connect Wallet'}
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
                {['Projects', 'Studio', 'Journal', 'Connect'].map((link) => (
                  <a
                    key={link}
                    href="#projects"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[28px] sm:text-[32px] font-medium text-gray-900 hover:text-orange-600 transition-colors"
                  >
                    {link}
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
                  <span>{walletConnected ? 'Launch Dashboard' : 'Start a project'}</span>
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5 text-[#F26522]" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Content (z-20, Bottom aligned) */}
        <div className="relative z-20 flex-1 flex flex-col justify-end max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-12 pb-14 sm:pb-16 lg:pb-20">
          {/* Small Label */}
          <div className="mb-5 sm:mb-8 flex items-center gap-2">
            <span className="text-[13px] sm:text-[14px] text-gray-900 tracking-wide font-medium">Axion Studio</span>
            <span className="text-gray-400">•</span>
            <span className="text-[12px] sm:text-[13px] text-gray-600 font-medium tracking-wide">Private moves. Public proof.</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 max-w-5xl">
            We craft digital experiences <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>for brands ready to dominate <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>their category online.
          </h1>

          {/* CTA Row */}
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
            {/* Orange Button */}
            <button
              onClick={walletConnected ? onEnterDashboard : onConnectWallet}
              className="bg-[#F26522] hover:bg-[#e05a1a] text-white text-[13px] sm:text-[14px] font-medium rounded-full pl-5 sm:pl-6 pr-2 py-2 group flex items-center gap-3.5 transition-all duration-300 shadow-md cursor-pointer"
            >
              <div className="flex flex-col overflow-hidden h-[20px]">
                <span className="transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-full">
                  {walletConnected ? 'Enter Trading App' : 'Start a project'}
                </span>
                <span className="transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-full">
                  {walletConnected ? 'Launch Axiom Studio' : 'Connect 1AM Wallet'}
                </span>
              </div>

              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45">
                <ArrowRight className="w-3.5 h-3.5 text-[#F26522]" />
              </div>
            </button>

            {/* Partner Badge */}
            <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] rounded-[4px] px-3 py-1.5 sm:px-3.5 sm:py-2 flex items-center gap-2.5 transition-shadow cursor-pointer">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-[#E8704E] shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z"/>
              </svg>
              <span className="text-[13px] sm:text-[14px] font-medium text-gray-900">Certified Partner</span>
              <span className="text-[10px] sm:text-[11px] bg-gray-900 text-white px-1.5 sm:px-2 py-0.5 rounded font-medium">Featured</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: ABOUT (White background)                                       */}
      {/* ========================================================================= */}
      <section id="about" className="bg-white pt-16 sm:pt-20 lg:pt-32 pb-12 sm:pb-16 lg:pb-24 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          {/* Badge Row */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center">
              1
            </div>
            <div className="text-[12px] sm:text-[13px] font-medium border border-gray-200 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-gray-900">
              Introducing Axion
            </div>
          </div>

          {/* Heading h2 */}
          <h2 className="text-[clamp(1.5rem,4vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 mb-12 sm:mb-16 lg:mb-28 max-w-4xl">
            Strategy-led creatives, delivering <br className="hidden sm:block" />
            results in digital and beyond.
          </h2>

          {/* Mobile / Tablet Content (Stacked) */}
          <div className="lg:hidden flex flex-col space-y-8">
            <p className="text-[15px] sm:text-[17px] leading-[1.6] font-medium text-gray-900 max-w-xl">
              Through research, creative thinking and iteration we help growing brands realize their digital full potential.
            </p>

            <div>
              <button
                onClick={walletConnected ? onEnterDashboard : onConnectWallet}
                className="bg-[#F26522] hover:bg-[#e05a1a] text-white text-[13px] sm:text-[14px] font-medium rounded-full pl-5 sm:pl-6 pr-2 py-2 group inline-flex items-center gap-3 transition-all duration-300 shadow-md cursor-pointer"
              >
                <div className="flex flex-col overflow-hidden h-[20px]">
                  <span className="transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-full">
                    About our studio
                  </span>
                  <span className="transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-full">
                    Enter Platform
                  </span>
                </div>
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45">
                  <ArrowRight className="w-3.5 h-3.5 text-[#F26522]" />
                </div>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 pt-4">
              <img
                src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090123_74be96d4-9c1b-40cf-932a-96f4f4babed3.png&w=1280&q=85"
                alt="Axion studio detail"
                className="w-full sm:w-[45%] aspect-[438/346] rounded-xl sm:rounded-2xl object-cover shadow-sm"
                loading="lazy"
              />
              <img
                src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090133_c157d30b-a99a-4477-bec1-a446149ec3f2.png&w=1280&q=85"
                alt="Axion design showcase"
                className="w-full sm:w-[55%] aspect-[900/600] rounded-xl sm:rounded-2xl object-cover shadow-sm"
                loading="lazy"
              />
            </div>
          </div>

          {/* Desktop Content (3-column asymmetric layout) */}
          <div className="hidden lg:grid grid-cols-[26%_1fr_48%] items-end gap-6 xl:gap-8">
            {/* Left Column (Small Image) */}
            <div className="self-end">
              <img
                src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090123_74be96d4-9c1b-40cf-932a-96f4f4babed3.png&w=1280&q=85"
                alt="Axion studio detail"
                className="w-full aspect-[438/346] rounded-2xl object-cover shadow-md"
                loading="lazy"
              />
            </div>

            {/* Center Column (Paragraph & Button) */}
            <div className="self-start flex flex-col justify-end items-start pl-2">
              <p className="text-[16px] xl:text-[18px] leading-[1.65] font-medium text-gray-900 whitespace-nowrap mb-8">
                Through research, creative thinking <br />
                and iteration we help growing brands <br />
                realize their digital full potential.
              </p>

              <button
                onClick={walletConnected ? onEnterDashboard : onConnectWallet}
                className="bg-[#F26522] hover:bg-[#e05a1a] text-white text-[13px] sm:text-[14px] font-medium rounded-full pl-5 sm:pl-6 pr-2 py-2 group inline-flex items-center gap-3 transition-all duration-300 shadow-md cursor-pointer"
              >
                <div className="flex flex-col overflow-hidden h-[20px]">
                  <span className="transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-full">
                    About our studio
                  </span>
                  <span className="transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-full">
                    Connect & Trade
                  </span>
                </div>
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45">
                  <ArrowRight className="w-3.5 h-3.5 text-[#F26522]" />
                </div>
              </button>
            </div>

            {/* Right Column (Large Image) */}
            <div className="self-end">
              <img
                src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090133_c157d30b-a99a-4477-bec1-a446149ec3f2.png&w=1280&q=85"
                alt="Axion design showcase"
                className="w-full aspect-[3/2] rounded-2xl object-cover shadow-md"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: CASE STUDIES (Light gray background)                           */}
      {/* ========================================================================= */}
      <section id="projects" className="bg-[#F5F5F5] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28">
        <div className="max-w-[1440px] mx-auto">
          {/* Badge Row */}
          <div className="px-5 sm:px-8 lg:px-12 flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center">
              2
            </div>
            <div className="text-[12px] sm:text-[13px] font-medium border border-gray-300 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-gray-900">
              Featured client work
            </div>
          </div>

          {/* Heading h2 */}
          <h2 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 px-5 sm:px-8 lg:px-12 mb-10 sm:mb-14 lg:mb-16">
            Our projects
          </h2>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7 px-5 sm:px-8 lg:px-12">
            {/* Card 1 (Narrativ) */}
            <div className="flex flex-col group">
              <div
                onClick={walletConnected ? onEnterDashboard : onConnectWallet}
                className="aspect-[329/246] rounded-2xl overflow-hidden bg-[#1a1d2e] relative cursor-pointer shadow-md transition-transform duration-300 group-hover:scale-[1.01]"
              >
                <video
                  src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_122702_390f5305-8719-41d5-ae80-d23ab3796c28.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Hover button (bottom-left) */}
                <div className="absolute bottom-4 left-4 flex items-center bg-white rounded-full h-9 w-9 group-hover:w-[148px] px-2.5 overflow-hidden transition-all duration-300 ease-in-out shadow-lg">
                  <span className="text-[13px] font-medium text-gray-900 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100 mr-2">
                    Learn more
                  </span>
                  <svg
                    className="w-3.5 h-3.5 text-gray-900 -rotate-45 group-hover:rotate-0 transition-transform duration-300 ml-auto shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </div>
              </div>

              <p className="text-[13px] sm:text-[14px] text-gray-600 mt-4 leading-relaxed">
                Winner of Site of the Month 2025 - an interactive 3D showcase driving record engagement
              </p>
              <h3 className="text-[14px] sm:text-[15px] font-semibold text-gray-900 mt-1">
                Narrativ
              </h3>
            </div>

            {/* Card 2 (Luminar) */}
            <div className="flex flex-col group">
              <div
                onClick={walletConnected ? onEnterDashboard : onConnectWallet}
                className="aspect-square rounded-2xl overflow-hidden bg-[#6b6b6b] relative cursor-pointer shadow-md transition-transform duration-300 group-hover:scale-[1.01]"
              >
                <video
                  src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_123323_f909c2b8-ff6c-4edf-882b-8ebcdbe389b5.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Hover button (bottom-left) */}
                <div className="absolute bottom-4 left-4 flex items-center bg-gray-900 rounded-full h-9 w-9 group-hover:w-[168px] px-2.5 overflow-hidden transition-all duration-300 ease-in-out shadow-lg">
                  <span className="text-[13px] font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100 mr-2">
                    View case study
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-white -rotate-45 group-hover:rotate-0 transition-transform duration-300 ml-auto shrink-0" />
                </div>
              </div>

              <p className="text-[13px] sm:text-[14px] text-gray-600 mt-4 leading-relaxed">
                Transforming a dated platform into a conversion-focused brand experience
              </p>
              <h3 className="text-[14px] sm:text-[15px] font-semibold text-gray-900 mt-1">
                Luminar
              </h3>
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
            <span>Midnight Testnet Enabled</span>
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
