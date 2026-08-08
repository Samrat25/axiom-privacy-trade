import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  History,
  LayoutDashboard,
  LineChart,
  Menu,
  Settings,
  Sparkles,
  Wallet,
  X,
} from "lucide-react";
import WalletConnect from "@/components/WalletConnect";
import { cn } from "@/lib/utils";

const nav: Array<{
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}> = [
  { to: "/app", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/app/insights", label: "Market Insights", icon: Sparkles },
  { to: "/app/strategy", label: "Strategy Builder", icon: Activity },
  { to: "/app/portfolio", label: "Portfolio", icon: LineChart },
  { to: "/app/history", label: "Trade History", icon: History },
  { to: "/app/settings", label: "Withdraw & Settings", icon: Settings },
];

export default function Layout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const sidebar = (
    <div className="flex h-full flex-col gap-8 p-5">
      <Link to="/" className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-[12px] font-bold text-primary-foreground">
          AX
        </span>
        <span className="text-[15px] font-semibold tracking-tight">Axiom</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {nav.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-colors",
                active
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
            >
              <item.icon size={16} className={active ? "text-primary" : ""} />
              {item.label}
              {active && <span className="ml-auto h-4 w-[2px] rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-xl border border-border bg-background/50 p-4">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
          <Wallet size={13} className="text-primary" /> Shielded session
        </div>
        <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
          Strategy contents stay local. Only commitments and proofs reach the chain.
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar lg:block">
        <div className="sticky top-0 h-screen">{sidebar}</div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-border bg-sidebar">
            {sidebar}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-background/80 px-5 py-4 backdrop-blur-xl sm:px-8">
          <button
            className="rounded-lg border border-border p-2 text-muted-foreground lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-[17px] font-semibold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="truncate text-[12px] text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="ml-auto">
            <WalletConnect />
          </div>
        </header>

        <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
