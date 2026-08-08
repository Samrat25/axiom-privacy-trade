import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, FileLock2, Fingerprint, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import WalletConnect from "@/components/WalletConnect";
import { SectionLabel } from "@/components/primitives";
import { tickers } from "@/lib/mock-data";
import { useWallet } from "@/lib/wallet";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Axiom — Trade on your own rules. Provably." },
      {
        name: "description",
        content:
          "Axiom is a privacy-first AI trading agent on Midnight. Describe a strategy once; every trade after is proven to follow it, and nothing about the strategy is ever revealed.",
      },
      { property: "og:title", content: "Axiom — Trade on your own rules. Provably." },
      {
        property: "og:description",
        content:
          "Commit your strategy as a hash. Prove every trade complies. Disclose nothing.",
      },
    ],
  }),
  component: Landing,
});

const steps = [
  {
    n: "01",
    title: "Describe your strategy",
    body: "Plain language in, structured rules out. Parsing happens locally — the text never leaves your device.",
    icon: FileLock2,
  },
  {
    n: "02",
    title: "Commit the hash on-chain",
    body: "Axiom publishes a single 32-byte commitment to Midnight. The rules behind it stay sealed.",
    icon: Fingerprint,
  },
  {
    n: "03",
    title: "Every trade proven, nothing disclosed",
    body: "Each execution carries a zero-knowledge proof of compliance. Observers see executed or rejected — never why.",
    icon: FileLock2,
  },
];

function useLondonTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/London",
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function Landing() {
  const time = useLondonTime();
  const [menu, setMenu] = useState(false);
  const { status } = useWallet();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <div className="mx-auto max-w-[1440px] p-3">
        <nav className="relative z-20 flex items-center gap-4 rounded-full border border-border bg-surface/80 p-[5px] pl-[7px] backdrop-blur-xl">
          <div className="flex items-center gap-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-[11px] font-bold tracking-tight text-primary-foreground">
              AX
            </span>
            <div className="hidden items-center gap-6 text-[14px] text-muted-foreground md:flex">
              <a href="#how" className="transition-colors duration-300 hover:text-foreground">
                How it works
              </a>
              <a href="#privacy" className="transition-colors duration-300 hover:text-foreground">
                Privacy
              </a>
              <Link to="/app" className="transition-colors duration-300 hover:text-foreground">
                Dashboard
              </Link>
            </div>
          </div>

          <div className="ml-auto hidden items-center gap-5 pr-1 md:flex">
            <span className="hidden text-[13px] text-muted-foreground lg:inline">
              Midnight Testnet-02 live
            </span>
            <span className="text-num flex items-center gap-2 text-[13px] text-muted-foreground">
              <Clock size={14} /> {time} in London
            </span>
            <WalletConnect redirectTo="/app" />
          </div>

          <button
            onClick={() => setMenu(true)}
            className="ml-auto rounded-full bg-muted p-2.5 text-foreground md:hidden"
            aria-label="Open menu"
          >
            <Menu size={16} />
          </button>
        </nav>
      </div>

      {menu && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMenu(false)} />
          <div className="absolute inset-x-3 bottom-3 rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-center justify-between">
              <span className="text-num text-[13px] text-muted-foreground">{time} London</span>
              <button onClick={() => setMenu(false)} aria-label="Close menu">
                <X size={18} />
              </button>
            </div>
            <div className="mt-6 flex flex-col gap-4 text-[28px] font-medium">
              <a href="#how" onClick={() => setMenu(false)}>
                How it works
              </a>
              <a href="#privacy" onClick={() => setMenu(false)}>
                Privacy
              </a>
              <Link to="/app" onClick={() => setMenu(false)}>
                Dashboard
              </Link>
            </div>
            <div className="mt-6">
              <WalletConnect redirectTo="/app" />
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="grid-field pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(80%_60%_at_50%_10%,black,transparent)]" />
        <div
          className="pointer-events-none absolute left-1/2 top-[-18rem] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full opacity-30 blur-[130px]"
          style={{ background: "var(--gradient-accent)" }}
        />

        <div className="relative mx-auto max-w-[1440px] px-5 pb-20 pt-20 sm:px-8 sm:pt-28 lg:px-12 lg:pb-28">
          <p className="text-[13px] tracking-wide text-muted-foreground">
            Axiom · Privacy-first AI trading agent
          </p>
          <h1 className="mt-6 max-w-[16ch] text-[clamp(2.2rem,7vw,5.2rem)] font-medium leading-[1.02] tracking-[-0.035em]">
            Trade on your own rules.{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-accent)" }}>
              Provably.
            </span>
          </h1>
          <p className="mt-7 max-w-[60ch] text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
            Describe a strategy once. Every trade after it is proven to follow that strategy — and
            nothing about the strategy is ever revealed. Not the asset, not the sizing, not the exit.
          </p>

          <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <WalletConnect variant="hero" redirectTo="/app" />
            {status === "connected" && (
              <Link
                to="/app"
                className="group inline-flex items-center gap-2 rounded-full border border-border-strong px-5 py-3 text-[14px] transition-colors hover:bg-muted"
              >
                Open dashboard
                <ArrowRight
                  size={15}
                  className="transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45"
                />
              </Link>
            )}
          </div>
        </div>

        {/* Ticker strip */}
        <div className="relative border-y border-border bg-surface/50">
          <div className="flex overflow-hidden py-3">
            <div className="marquee flex shrink-0 gap-10 pr-10">
              {[...tickers, ...tickers, ...tickers, ...tickers].map((t, i) => (
                <span key={i} className="text-num flex items-center gap-2 text-[12px] whitespace-nowrap">
                  <span className="text-muted-foreground">{t.symbol}</span>
                  <span>{t.price.toLocaleString()}</span>
                  <span className={t.change >= 0 ? "text-success" : "text-destructive"}>
                    {t.change >= 0 ? "+" : ""}
                    {t.change.toFixed(2)}%
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <SectionLabel index="1">How it works</SectionLabel>
        <h2 className="max-w-[20ch] text-[clamp(1.6rem,4vw,3rem)] font-medium leading-[1.12] tracking-[-0.02em]">
          Three steps between an idea and a verifiable track record.
        </h2>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="group bg-surface p-7 transition-colors hover:bg-surface-raised">
              <div className="flex items-center justify-between">
                <span className="text-num text-[12px] text-primary">{s.n}</span>
                <s.icon size={16} className="text-muted-foreground transition-colors group-hover:text-primary" />
              </div>
              <h3 className="mt-8 text-[17px] font-medium leading-snug">{s.title}</h3>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy */}
      <section id="privacy" className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <SectionLabel index="2">What the chain sees</SectionLabel>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <h2 className="text-[clamp(1.6rem,4vw,3rem)] font-medium leading-[1.12] tracking-[-0.02em]">
              A public record of compliance. A private record of intent.
            </h2>
            <div className="space-y-px overflow-hidden rounded-2xl border border-border bg-border">
              {[
                ["Commitment hash", "public", true],
                ["Proof of compliance", "public", true],
                ["Executed / rejected status", "public", true],
                ["Asset and direction", "private", false],
                ["Position sizing", "private", false],
                ["Stop-loss and timeline", "private", false],
              ].map(([label, kind, isPublic]) => (
                <div
                  key={label as string}
                  className="flex items-center justify-between bg-background px-5 py-4"
                >
                  <span className="text-[14px]">{label}</span>
                  <span
                    className={`text-num rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-wider ${
                      isPublic
                        ? "border-border-strong text-muted-foreground"
                        : "border-primary/30 bg-primary/10 text-primary"
                    }`}
                  >
                    {kind}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 flex flex-col items-start gap-6 rounded-2xl border border-border bg-background p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-[20px] font-medium tracking-tight">Commit your first strategy</h3>
              <p className="mt-1.5 text-[13px] text-muted-foreground">
                Connect Lace to open the dashboard. Testnet only — no real funds at risk.
              </p>
            </div>
            <WalletConnect redirectTo="/app" />
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-8 text-[12px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <span>© 2026 Axiom · Built on Midnight</span>
          <span className="text-num">testnet-02 · block 4,812,337</span>
        </div>
      </footer>
    </div>
  );
}
