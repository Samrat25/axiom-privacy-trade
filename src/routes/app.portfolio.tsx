import { createFileRoute } from "@tanstack/react-router";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import { Panel } from "@/components/primitives";
import { portfolioSeries, positions } from "@/lib/mock-data";

export const Route = createFileRoute("/app/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Axiom" },
      { name: "description", content: "Live P&L, portfolio value over time and open positions with entry versus current price." },
      { property: "og:title", content: "Portfolio — Axiom" },
      { property: "og:description", content: "Live P&L, value chart and open positions." },
    ],
  }),
  component: Portfolio,
});

function Portfolio() {
  const value = 46_128;
  const pnl = 12.03;

  return (
    <Layout title="Portfolio" subtitle="Shielded balances resolved locally from your wallet">
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <Panel className="relative overflow-hidden p-7">
            <div className="grid-field pointer-events-none absolute inset-0 opacity-30" />
            <div className="relative">
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Unrealized P&amp;L
              </div>
              <div className="text-num mt-3 text-[46px] font-semibold leading-none text-success">
                +{pnl.toFixed(2)}%
              </div>
              <div className="text-num mt-3 text-[14px] text-muted-foreground">
                ${value.toLocaleString()} total value
              </div>
              <div className="mt-6 flex items-start gap-2 rounded-lg border border-primary/25 bg-primary/5 p-3 text-[12px] leading-relaxed text-primary">
                <Sparkles size={13} className="mt-0.5 shrink-0" />
                Up 12% over 18 days — steady accumulation, no drawdown beyond 3.4%.
              </div>
            </div>
          </Panel>

          <Panel className="p-6">
            <h2 className="text-[14px] font-medium">Portfolio value</h2>
            <div className="mt-4 h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioSeries} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
                  <defs>
                    <linearGradient id="pv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="d"
                    stroke="var(--muted-foreground)"
                    tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
                    tickLine={false}
                    axisLine={false}
                    domain={["dataMin - 1500", "dataMax + 1500"]}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border-strong)",
                      borderRadius: 10,
                      fontSize: 12,
                      fontFamily: "var(--font-mono)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fill="url(#pv)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <Panel className="p-0">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-[14px] font-medium">Positions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-3 text-left font-normal">Asset</th>
                  <th className="px-6 py-3 text-right font-normal">Size</th>
                  <th className="px-6 py-3 text-right font-normal">Entry</th>
                  <th className="px-6 py-3 text-right font-normal">Current</th>
                  <th className="px-6 py-3 text-right font-normal">P&amp;L</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((p) => {
                  const change = ((p.current - p.entry) / p.entry) * 100;
                  return (
                    <tr key={p.asset} className="border-t border-border">
                      <td className="text-num px-6 py-4">{p.asset}</td>
                      <td className="text-num px-6 py-4 text-right text-muted-foreground">
                        {p.size.toLocaleString()}
                      </td>
                      <td className="text-num px-6 py-4 text-right text-muted-foreground">
                        {p.entry.toLocaleString()}
                      </td>
                      <td className="text-num px-6 py-4 text-right">{p.current.toLocaleString()}</td>
                      <td
                        className={`text-num px-6 py-4 text-right ${
                          change >= 0 ? "text-success" : "text-destructive"
                        }`}
                      >
                        {change >= 0 ? "+" : ""}
                        {change.toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </Layout>
  );
}
