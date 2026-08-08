import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { CopyHash, ErrorNote, Panel } from "@/components/primitives";
import { strategies } from "@/lib/mock-data";
import { expireStrategy, withdraw } from "@/utils/contract";
import { useWallet } from "@/lib/wallet";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Withdraw & Settings — Axiom" },
      { name: "description", content: "Withdraw shielded funds and manage active strategy commitments." },
      { property: "og:title", content: "Withdraw & Settings — Axiom" },
      { property: "og:description", content: "Withdraw shielded funds and manage strategy commitments." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { balance } = useWallet();
  const [amount, setAmount] = useState("");
  const [state, setState] = useState<"idle" | "pending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const [expiring, setExpiring] = useState<string | null>(null);
  const [expireError, setExpireError] = useState<string | null>(null);
  const [expired, setExpired] = useState<string[]>([]);
  const [revealed, setRevealed] = useState<string | null>(null);

  const submit = async () => {
    setState("pending");
    setError(null);
    try {
      const res = await withdraw(Number(amount));
      setTxHash(res.txHash);
      setState("done");
      toast.success("Withdrawal submitted");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Withdrawal failed.");
      setState("idle");
    }
  };

  const handleExpire = async (id: string, hash: string) => {
    setExpiring(id);
    setExpireError(null);
    try {
      await expireStrategy(hash);
      setExpired((p) => [...p, id]);
      toast.success("Strategy expired on-chain");
    } catch (e) {
      setExpireError(e instanceof Error ? e.message : "Could not expire strategy.");
    } finally {
      setExpiring(null);
    }
  };

  return (
    <Layout title="Withdraw & Settings" subtitle="Move shielded funds and retire strategy commitments">
      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        <Panel className="space-y-4 p-6">
          <div>
            <h2 className="text-[14px] font-medium">Withdraw</h2>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Shielded balance:{" "}
              <span className="text-num text-foreground">{balance.toLocaleString()}</span> tDUST
            </p>
          </div>

          <div className="relative">
            <input
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value.replace(/[^0-9.]/g, ""));
                setState("idle");
                setError(null);
              }}
              inputMode="decimal"
              placeholder="0.00"
              disabled={state === "pending"}
              className="text-num w-full rounded-xl border border-border bg-background/70 py-3.5 pl-4 pr-20 text-[18px] outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={() => setAmount(String(balance))}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground"
            >
              MAX
            </button>
          </div>

          {error && <ErrorNote message={error} onRetry={submit} />}

          {state === "done" && txHash ? (
            <div className="space-y-3 rounded-xl border border-primary/25 bg-primary/5 p-4">
              <div className="flex items-center gap-2 text-[13px] text-primary">
                <Check size={14} /> Withdrawal submitted
              </div>
              <CopyHash value={txHash} head={12} tail={8} />
            </div>
          ) : (
            <button
              onClick={submit}
              disabled={!amount || state === "pending"}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-[13px] font-semibold text-primary-foreground transition-all duration-300 hover:accent-glow disabled:cursor-not-allowed disabled:opacity-45"
            >
              {state === "pending" && <Loader2 size={14} className="animate-spin" />}
              {state === "pending" ? "Signing in Lace…" : "Confirm withdrawal"}
            </button>
          )}
        </Panel>

        <Panel className="p-0">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="text-[14px] font-medium">Active strategies</h2>
            <span className="text-num text-[12px] text-muted-foreground">
              {strategies.length - expired.length} live
            </span>
          </div>

          {expireError && (
            <div className="px-6 pt-4">
              <ErrorNote message={expireError} />
            </div>
          )}

          <div className="divide-y divide-border">
            {strategies.map((s) => {
              const isExpired = expired.includes(s.id);
              return (
                <div key={s.id} className="space-y-3 px-6 py-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-[14px] font-medium">
                        {s.label}
                        {isExpired && (
                          <span className="text-num ml-2 rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                            expired
                          </span>
                        )}
                      </div>
                      <div className="text-[12px] text-muted-foreground">
                        <span className="text-num">{s.trades}</span> proven trades ·{" "}
                        <span className="text-num">{s.daysLeft}d</span> remaining
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setRevealed(revealed === s.id ? null : s.id)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Eye size={13} /> View
                      </button>
                      <button
                        onClick={() => handleExpire(s.id, s.hash)}
                        disabled={isExpired || expiring === s.id}
                        className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 px-3 py-1.5 text-[12px] text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-40"
                      >
                        {expiring === s.id && <Loader2 size={12} className="animate-spin" />}
                        {expiring === s.id ? "Expiring…" : "Expire"}
                      </button>
                    </div>
                  </div>

                  <CopyHash value={s.hash} head={12} tail={10} />

                  {revealed === s.id && (
                    <div className="rounded-lg border border-border bg-background/60 p-4 text-[12px] leading-relaxed text-muted-foreground">
                      Decrypted locally from your wallet: max{" "}
                      <span className="text-num text-foreground">
                        {20 - Number(s.id.slice(1)) * 2}%
                      </span>{" "}
                      position on <span className="text-num text-foreground">{s.asset}</span>, stop-loss{" "}
                      <span className="text-num text-foreground">8%</span>. This view never leaves
                      your device.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </Layout>
  );
}
