import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Layout from "@/components/Layout";
import { Panel } from "@/components/primitives";
import { insights, priceSeries } from "@/lib/mock-data";

export const Route = createFileRoute("/app/insights")({
  head: () => ({
    meta: [
      { title: "Market Insights — Axiom" },
      { name: "description", content: "AI-generated market read per asset, with tone and short reasoning." },
      { property: "og:title", content: "Market Insights — Axiom" },
      { property: "og:description", content: "AI-generated market read per asset, with tone and reasoning." },
    ],
  }),
  component: Insights,
});

const toneStyles: Record<string, string> = {
  bullish: "border-success/30 bg-success/10 text-success",
  neutral: "border-border-strong bg-muted text-muted-foreground",
  bearish: "border-destructive/30 bg-destructive/10 text-destructive",
};

function Insights() {
  const [asset, setAsset] = useState<"ADA" | "BTC" | "ETH">("ADA");

  return (
    <Layout title="Market Insights" subtitle="Agent read on each tracked asset — advisory, never automatic">
      <div className="space-y-6">
        <Panel className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-[14px] font-medium">Price</h2>
              <p className="text-[12px] text-muted-foreground">Last 8 hours · indexed</p>
            </div>
            <div className="flex gap-1 rounded-full border border-border p-1">
              {(["ADA", "BTC", "ETH"] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setAsset(a)}
                  className={`text-num rounded-full px-3 py-1.5 text-[12px] transition-colors ${
                    asset === a
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceSeries} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
                <XAxis
                  dataKey="t"
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
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border-strong)",
                    borderRadius: 10,
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                  }}
                  labelStyle={{ color: "var(--muted-foreground)" }}
                />
                <Line
                  type="monotone"
                  dataKey={asset}
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <div className="grid gap-4 md:grid-cols-2">
          {insights.map((i) => (
            <Panel key={i.asset} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-num text-[15px] font-medium">{i.asset}</span>
                <span
                  className={`rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-wider ${toneStyles[i.tone]}`}
                >
                  {i.tone}
                </span>
              </div>
              <p className="text-[13px] leading-relaxed text-muted-foreground">{i.reasoning}</p>
              <div className="flex items-center gap-3">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${i.confidence * 100}%` }}
                  />
                </div>
                <span className="text-num text-[11px] text-muted-foreground">
                  {(i.confidence * 100).toFixed(0)}% conf.
                </span>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </Layout>
  );
}
