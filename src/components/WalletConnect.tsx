import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, LogOut, Loader2, Wallet } from "lucide-react";
import { useWallet, truncate } from "@/lib/wallet";
import { ErrorNote } from "@/components/primitives";
import { cn } from "@/lib/utils";

/**
 * Wallet surface. Replace `mockConnect` in src/lib/wallet.tsx with the real
 * Lace/Midnight enable() call — this component needs no changes.
 */
export default function WalletConnect({
  variant = "compact",
  redirectTo,
}: {
  variant?: "compact" | "hero";
  redirectTo?: string;
}) {
  const { status, address, balance, network, error, connect, disconnect } = useWallet();
  const navigate = useNavigate();

  const handleConnect = async () => {
    await connect();
    if (redirectTo) {
      // Navigate only once the context has flipped to connected.
      setTimeout(() => {
        if (localStorage.getItem("axiom.wallet.connected") === "1") {
          navigate({ to: redirectTo });
        }
      }, 0);
    }
  };

  if (status === "connected" && address) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-full border border-border bg-surface px-3 py-1.5",
          variant === "hero" && "px-4 py-2",
        )}
      >
        <span className="relative flex h-2 w-2">
          <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-primary" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        <div className="leading-tight">
          <div className="text-num text-[12px] text-foreground">{truncate(address)}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {network} · <span className="text-num">{balance.toLocaleString()}</span> tDUST
          </div>
        </div>
        <button
          onClick={disconnect}
          aria-label="Disconnect wallet"
          className="ml-1 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut size={14} />
        </button>
      </div>
    );
  }

  const connecting = status === "connecting";

  return (
    <div className={cn(variant === "hero" ? "w-full max-w-md space-y-3" : "space-y-2")}>
      <button
        onClick={handleConnect}
        disabled={connecting}
        className={cn(
          "group inline-flex items-center gap-3 rounded-full bg-primary font-medium text-primary-foreground transition-all duration-300 disabled:opacity-70",
          variant === "hero" ? "py-3 pl-6 pr-2.5 text-[15px]" : "py-2 pl-4 pr-2 text-[13px]",
          !connecting && "hover:accent-glow",
        )}
      >
        {connecting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Waiting for Lace…</span>
            <span className="w-1" />
          </>
        ) : (
          <>
            <Wallet size={16} />
            <span className="text-roll">
              <span className="group-hover:-translate-y-full">Connect Lace wallet</span>
              <span className="group-hover:-translate-y-full">Connect Lace wallet</span>
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-foreground/15 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45">
              <ArrowRight size={14} />
            </span>
          </>
        )}
      </button>

      {status === "error" && error && <ErrorNote message={error} onRetry={handleConnect} />}
      {variant === "hero" && status !== "error" && (
        <p className="text-[12px] text-muted-foreground">
          Read-only session. Axiom never sees your strategy — only its commitment.
        </p>
      )}
    </div>
  );
}
