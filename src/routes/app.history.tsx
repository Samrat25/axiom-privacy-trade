import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import { ErrorNote, Panel, StatusPill } from "@/components/primitives";
import { trades } from "@/lib/mock-data";

export const Route = createFileRoute("/app/history")({
  head: () => ({
    meta: [
      { title: "Trade History — Axiom" },
      { name: "description", content: "Timestamped record of every trade attempt with executed or rejected status only." },
      { property: "og:title", content: "Trade History — Axiom" },
      { property: "og:description", content: "Every trade attempt, status only — no strategy details by design." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [filter, setFilter] = useState<"all" | "executed" | "rejected">("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState(trades);

  const loadMore = async () => {
    setLoading(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 1200));
    if (Math.random() < 0.25) {
      setError("Indexer timed out while fetching older proofs.");
      setLoading(false);
      return;
    }
    setRows((prev) => [
      ...prev,
      ...trades.map((t, i) => ({
        ...t,
        id: `${t.id}-${prev.length + i}`,
        timestamp: t.timestamp.replace("2026-08-0", "2026-07-2"),
      })),
    ]);
    setLoading(false);
  };

  const visible = rows.filter((r) => filter === "all" || r.status === filter);

  return (
    <Layout title="Trade History" subtitle="Status only — strategy contents are deliberately absent">
      <div className="space-y-4">
        <div className="flex gap-1 rounded-full border border-border p-1 w-fit">
          {(["all", "executed", "rejected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-[12px] capitalize transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <Panel className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-3.5 text-left font-normal">Timestamp (UTC)</th>
                  <th className="px-6 py-3.5 text-left font-normal">Proof</th>
                  <th className="px-6 py-3.5 text-right font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((t) => (
                  <tr key={t.id} className="border-t border-border transition-colors hover:bg-muted/40">
                    <td className="text-num px-6 py-4">{t.timestamp}</td>
                    <td className="text-num px-6 py-4 text-muted-foreground">{t.proof}</td>
                    <td className="px-6 py-4 text-right">
                      <StatusPill status={t.status} />
                    </td>
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-[13px] text-muted-foreground">
                      No trades with this status yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 border-t border-border px-6 py-4">
            {error && <ErrorNote message={error} onRetry={loadMore} />}
            <button
              onClick={loadMore}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full border border-border-strong px-4 py-2 text-[12px] transition-colors hover:bg-muted disabled:opacity-60"
            >
              {loading && <Loader2 size={13} className="animate-spin" />}
              {loading ? "Fetching older proofs…" : "Load older trades"}
            </button>
          </div>
        </Panel>
      </div>
    </Layout>
  );
}
