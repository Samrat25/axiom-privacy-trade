import { useState } from "react";
import { ArrowRight, Check, Loader2, Lock, Pencil, ShieldCheck, Sparkles } from "lucide-react";
import {
  PROOF_PHASES,
  commitStrategy,
  parseStrategyText,
  type Commitment,
  type ParsedStrategy,
} from "@/utils/contract";
import { CopyHash, ErrorNote, Panel } from "@/components/primitives";
import { useWallet } from "@/lib/wallet";
import { cn } from "@/lib/utils";

const EXAMPLE = "only buy ADA, max 20% position, 8% stop-loss, run for 30 days";

type Phase = "idle" | "parsing" | "review" | "committing" | "committed" | "error";

export default function StrategyBuilder() {
  const { status: walletStatus } = useWallet();
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [parsed, setParsed] = useState<ParsedStrategy | null>(null);
  const [proofStep, setProofStep] = useState(0);
  const [commitment, setCommitment] = useState<Commitment | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleParse = async () => {
    setError(null);
    setPhase("parsing");
    await new Promise((r) => setTimeout(r, 900));
    const result = parseStrategyText(text);
    if (!result) {
      setError("Couldn't read a strategy from that. Mention an asset, a position cap, a stop-loss and a duration.");
      setPhase("error");
      return;
    }
    setParsed(result);
    setPhase("review");
  };

  const handleCommit = async () => {
    if (!parsed) return;
    setError(null);
    setProofStep(0);
    setPhase("committing");
    try {
      const result = await commitStrategy(parsed, setProofStep);
      setCommitment(result);
      setPhase("committed");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Commit failed.");
      setPhase("error");
    }
  };

  const reset = () => {
    setPhase("idle");
    setParsed(null);
    setCommitment(null);
    setError(null);
    setText("");
  };

  if (walletStatus !== "connected") {
    return (
      <Panel className="flex flex-col items-center gap-3 py-16 text-center">
        <Lock size={20} className="text-muted-foreground" />
        <p className="text-[14px] text-muted-foreground">
          Connect your wallet to build and commit a strategy.
        </p>
      </Panel>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
      {/* Composer */}
      <Panel className="relative overflow-hidden p-0">
        <div className="grid-field pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative p-6 sm:p-7">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <Sparkles size={13} className="text-primary" /> Describe your strategy
          </div>

          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (phase === "error") setPhase("idle");
            }}
            disabled={phase === "committing"}
            rows={5}
            placeholder={EXAMPLE}
            className="text-num mt-4 w-full resize-none rounded-xl border border-border bg-background/70 p-4 text-[15px] leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-ring"
          />

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setText(EXAMPLE)}
              className="rounded-full border border-border px-3 py-1.5 text-[12px] text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
            >
              Use example
            </button>
            <span className="text-[12px] text-muted-foreground">
              Parsed locally — this text never leaves your device.
            </span>
          </div>

          <button
            onClick={handleParse}
            disabled={!text.trim() || phase === "parsing" || phase === "committing"}
            className="group mt-6 inline-flex items-center gap-3 rounded-full bg-primary py-2.5 pl-5 pr-2 text-[13px] font-medium text-primary-foreground transition-all duration-300 hover:accent-glow disabled:cursor-not-allowed disabled:opacity-45"
          >
            {phase === "parsing" ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Reading intent…
              </>
            ) : (
              <>
                <span className="text-roll">
                  <span className="group-hover:-translate-y-full">Review &amp; Confirm</span>
                  <span className="group-hover:-translate-y-full">Review &amp; Confirm</span>
                </span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/15 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45">
                  <ArrowRight size={13} />
                </span>
              </>
            )}
          </button>

          {phase === "error" && error && !commitment && (
            <div className="mt-4">
              <ErrorNote message={error} onRetry={parsed ? handleCommit : handleParse} />
            </div>
          )}
        </div>
      </Panel>

      {/* Review / proof / commitment */}
      <Panel className="p-6 sm:p-7">
        {phase === "committed" && commitment ? (
          <CommitSuccess commitment={commitment} onReset={reset} />
        ) : phase === "committing" ? (
          <ProofProgress step={proofStep} />
        ) : parsed ? (
          <ReviewCard parsed={parsed} onChange={setParsed} onCommit={handleCommit} />
        ) : (
          <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-3 text-center">
            <ShieldCheck size={22} className="text-muted-foreground" />
            <p className="max-w-[280px] text-[13px] leading-relaxed text-muted-foreground">
              Your parsed strategy appears here as editable fields. Nothing is committed until you
              approve it.
            </p>
          </div>
        )}
      </Panel>
    </div>
  );
}

function Chip({
  label,
  value,
  suffix,
  onChange,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  onChange: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3">
      <span className="text-[12px] uppercase tracking-wider text-muted-foreground">{label}</span>
      {editing ? (
        <input
          autoFocus
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setEditing(false)}
          onKeyDown={(e) => e.key === "Enter" && setEditing(false)}
          className="text-num w-24 rounded-md border border-primary/50 bg-background px-2 py-1 text-right text-[14px] outline-none"
        />
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="text-num group flex items-center gap-2 text-[14px] text-foreground"
        >
          {value}
          {suffix}
          <Pencil size={12} className="text-muted-foreground group-hover:text-primary" />
        </button>
      )}
    </div>
  );
}

function ReviewCard({
  parsed,
  onChange,
  onCommit,
}: {
  parsed: ParsedStrategy;
  onChange: (p: ParsedStrategy) => void;
  onCommit: () => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-[15px] font-semibold">Review &amp; Confirm</h2>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Edit any field. Only the hash of these values is published.
        </p>
      </div>

      <div className="space-y-2.5">
        <Chip
          label="Asset"
          value={parsed.asset}
          onChange={(v) => onChange({ ...parsed, asset: v.toUpperCase() })}
        />
        <Chip
          label="Max position"
          value={parsed.maxPosition}
          suffix="%"
          onChange={(v) => onChange({ ...parsed, maxPosition: Number(v) || 0 })}
        />
        <Chip
          label="Stop-loss"
          value={parsed.stopLoss}
          suffix="%"
          onChange={(v) => onChange({ ...parsed, stopLoss: Number(v) || 0 })}
        />
        <Chip
          label="Timeline"
          value={parsed.timelineDays}
          suffix="d"
          onChange={(v) => onChange({ ...parsed, timelineDays: Number(v) || 0 })}
        />
      </div>

      <button
        onClick={onCommit}
        className="group mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-[13px] font-semibold text-primary-foreground transition-all duration-300 hover:accent-glow"
      >
        <Lock size={14} /> Commit Strategy
      </button>
      <p className="text-center text-[11px] text-muted-foreground">
        Generates a zero-knowledge proof locally, then writes one 32-byte commitment on Midnight.
      </p>
    </div>
  );
}

function ProofProgress({ step }: { step: number }) {
  return (
    <div className="space-y-5">
      <div className="scanline relative overflow-hidden rounded-xl border border-primary/25 bg-background/70 p-5">
        <div className="grid-field pointer-events-none absolute inset-0 opacity-50" />
        <div className="text-num relative space-y-1 text-[11px] leading-relaxed text-primary/80">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="truncate opacity-[calc(0.35+0.1*var(--i))]">
              {generateNoise(i, step)}
            </div>
          ))}
        </div>
      </div>

      <ol className="space-y-3">
        {PROOF_PHASES.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li key={label} className="flex items-center gap-3 text-[13px]">
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border text-[10px]",
                  done && "border-primary bg-primary text-primary-foreground",
                  active && "border-primary text-primary",
                  !done && !active && "border-border text-muted-foreground",
                )}
              >
                {done ? <Check size={11} /> : active ? <Loader2 size={11} className="animate-spin" /> : i + 1}
              </span>
              <span className={cn(done || active ? "text-foreground" : "text-muted-foreground")}>
                {label}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="text-num text-[11px] text-muted-foreground">
        do not close this tab — witness data is held in memory only
      </p>
    </div>
  );
}

function generateNoise(row: number, step: number) {
  const chars = "0123456789abcdef";
  let out = "";
  for (let i = 0; i < 44; i++) {
    out += chars[(row * 7 + i * 13 + step * 29 + i * row) % 16];
  }
  return `${(row + step * 6).toString().padStart(3, "0")}  ${out}`;
}

function CommitSuccess({ commitment, onReset }: { commitment: Commitment; onReset: () => void }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
          <span className="pulse-ring absolute inset-0 rounded-full border border-primary/50" />
          <ShieldCheck size={17} />
        </span>
        <div>
          <h2 className="text-[15px] font-semibold">Strategy committed</h2>
          <p className="text-[12px] text-muted-foreground">
            Proof verified in <span className="text-num">{(commitment.proofMs / 1000).toFixed(1)}s</span>{" "}
            at block <span className="text-num">{commitment.blockHeight.toLocaleString()}</span>
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-primary/25 bg-primary/5 p-4">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
          Commitment hash
        </div>
        <div className="mt-2">
          <CopyHash value={commitment.hash} head={14} tail={10} />
        </div>
      </div>

      <ul className="space-y-2 text-[12px] text-muted-foreground">
        <li className="flex gap-2">
          <Check size={13} className="mt-0.5 shrink-0 text-primary" /> Every future trade is checked
          against this commitment.
        </li>
        <li className="flex gap-2">
          <Check size={13} className="mt-0.5 shrink-0 text-primary" /> Asset, sizing, stop-loss and
          timeline were never published.
        </li>
      </ul>

      <button
        onClick={onReset}
        className="w-full rounded-full border border-border-strong py-2.5 text-[13px] transition-colors hover:bg-muted"
      >
        Build another strategy
      </button>
    </div>
  );
}
