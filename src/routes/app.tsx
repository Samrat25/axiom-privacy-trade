import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useWallet } from "@/lib/wallet";
import WalletConnect from "@/components/WalletConnect";

export const Route = createFileRoute("/app")({
  component: AppGate,
});

function AppGate() {
  const { status } = useWallet();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        <Loader2 size={18} className="animate-spin" />
      </div>
    );
  }

  if (status !== "connected") {
    return (
      <div className="relative flex min-h-screen items-center justify-center px-5">
        <div className="grid-field pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(60%_50%_at_50%_40%,black,transparent)]" />
        <div className="panel relative w-full max-w-md p-8 text-center">
          <h1 className="text-[20px] font-medium tracking-tight">Wallet required</h1>
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
            Axiom's dashboard reads your shielded balance and strategy commitments. Connect Lace to
            continue.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            <WalletConnect variant="hero" />
            <Link to="/" className="text-[12px] text-muted-foreground underline underline-offset-4">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
