import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import Layout from "@/components/Layout";
import { CopyHash, Panel, StatusPill } from "@/components/primitives";
import { strategies, tickers, trades } from "@/lib/mock-data";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Overview — Axiom" },
      { name: "description", content: "Active strategies, aggregate P&L and recent proof-verified trade activity." },
      { property: "og:title", content: "Overview — Axiom" },
      { property: "og:description", content: "Active strategies, aggregate P&L and recent trade activity." },
    ],
  }),
  component: Overview,
});

function Overview() {
  const aggregate = 4.71;

  return (
    <Layout title="Overview" subtitle="Aggregate performance across all committed strategies">
      <div className="space-y-6">
        {/* Ticker strip */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tickers.map((t) => (
            <div
              key={t.symbol}
              className="flex min-w-[150px] items-center justify-between gap-4 rounded-lg border border-border bg-surface px-3.5 py-2.5"
            >
              <span className="text-num text-[12px] text-muted-foreground">{t.symbol}</span>
              <span className="text-num text-[13px]">{t.price.toLocaleString()}</span>
              <span
                className={`text-num text-[12px] ${t.change >= 0 ? "text-success" : "text-destructive"}`}
              >
                {t.change >= 0 ? "+" : ""}
                {t.change.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {/* Aggregate */}
            <Panel className="relative overflow-hidden p-7">
              <div className="grid-field pointer-events-none absolute inset-0 opacity-30" />
              <div className="relative">
                <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Aggregate P&amp;L · 30d
                </div>
                <div className="mt-3 flex items-end gap-4">
                  <span className="text-num text-[44px] font-semibold leading-none text-success">
                    +{aggregate.toFixed(2)}%
                  </span>
                  <span className="text-num mb-1 text-[13px] text-muted-foreground">
                    +$2,174.40
                  </span>
                </div>
                <div className="mt-6 flex flex-wrap gap-6 text-[12px] text-muted-foreground">
                  <span>
                    Proven trades <span className="text-num text-foreground">68</span>
                  </span>
                  <span>
                    Rejected by circuit <span className="text-num text-foreground">3</span>
                  </span>
                  <span>
                    Disclosure events <span className="text-num text-primary">0</span>
                  </span>
                </div>
              </div>
            </Panel>

            {/* Strategy cards */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[14px] font-medium">Active strategies</h2>
                <Link
                  to="/app/strategy"
                  className="inline-flex items-center gap-1 text-[12px] text-primary hover:underline"
                >
                  New strategy <ArrowUpRight size={13} />
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {strategies.map((s) => (
                  <Panel key={s.id} className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[14px] font-medium">{s.label}</div>
                        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                          {s.status === "expiring" ? "Expires soon" : "Active"} ·{" "}
                          <span className="text-num">{s.daysLeft}d</span> left
                        </div>
                      </div>
                      <span
                        className={`text-num flex items-center gap-1 text-[14px] ${
                          s.pnl >= 0 ? "text-success" : "text-destructive"
                        }`}
                      >
                        {s.pnl >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                        {s.pnl > 0 ? "+" : ""}
                        {s.pnl}%
                      </span>
                    </div>
                    <CopyHash value={s.hash} head={8} tail={6} className="w-full justify-between" />
                    <div className="flex items-center justify-between text-[12px] text-muted-foreground">
                      <span>
                        Proven trades <span className="text-num text-foreground">{s.trades}</span>
                      </span>
                      <span className="text-primary">Rules sealed</span>
                    </div>
                  </Panel>
                ))}
              </div>
            </div>
          </div>

          {/* Feed */}
          <Panel className="h-fit">
            <h2 className="text-[14px] font-medium">Recent trade status</h2>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Status only — strategy details are never attached.
            </p>
            <div className="mt-4 space-y-3">
              {trades.slice(0, 7).map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-num text-[12px] text-muted-foreground">{t.timestamp}</span>
                  <StatusPill status={t.status} />
                </div>
              ))}
            </div>
            <Link
              to="/app/history"
              className="mt-4 inline-flex items-center gap-1 text-[12px] text-primary hover:underline"
            >
              Full history <ArrowUpRight size={13} />
            </Link>
          </Panel>
        </div>
      </div>
    </Layout>
  );
}
