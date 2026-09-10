"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History, ArrowRight, X, Sparkles } from "lucide-react";
import {
  getRecentCalculations,
  clearRecentCalculations,
  RecentCalculation,
} from "@/lib/storage-workflow";
import CalculatorIcon from "@/components/ui/CalculatorIcon";

const POPULAR_STARTING_POINTS = [
  { id: "sip", name: "SIP", summary: "Compounding Growth", route: "/sip" },
  { id: "emi", name: "EMI", summary: "Loan Amortization", route: "/emi" },
  { id: "tax", name: "Income Tax", summary: "Tax Year 2026–27", route: "/tax" },
  { id: "fd", name: "FD", summary: "Fixed Deposit Returns", route: "/fd" },
  { id: "fire", name: "FIRE", summary: "Retirement Target", route: "/fire" },
];

export default function RecentCalculationsCard() {
  const [recents, setRecents] = useState<RecentCalculation[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setRecents(getRecentCalculations());
  }, []);

  // Before hydration, render nothing to avoid layout flash
  if (!mounted) {
    return null;
  }

  // First-run / Empty state: provide clean popular starting points
  if (recents.length === 0) {
    return (
      <section
        className="mb-8 p-5 rounded-2xl border border-border/80 bg-card shadow-xs"
        aria-label="Popular starting points"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground tracking-tight">
                Popular Starting Points
              </h2>
              <p className="text-xs text-muted-foreground">
                Your recent calculations will appear here. Choose a tool to begin:
              </p>
            </div>
          </div>
          <Link
            href="/calculators"
            className="text-xs font-semibold text-primary hover:underline self-start sm:self-auto shrink-0"
          >
            All 31 calculators →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {POPULAR_STARTING_POINTS.map((item) => (
            <Link
              key={item.id}
              href={item.route}
              className="group p-3 rounded-xl border border-border/70 bg-muted/20 hover:border-primary/40 hover:bg-card hover:shadow-xs transition-all flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="space-y-1.5">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                  <CalculatorIcon id={item.id} className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
                <h3 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <p className="text-[10px] text-muted-foreground line-clamp-1">
                  {item.summary}
                </p>
              </div>
              <div className="mt-2.5 flex items-center text-[10px] font-medium text-primary group-hover:translate-x-0.5 transition-transform">
                <span>Calculate</span>
                <ArrowRight className="w-2.5 h-2.5 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  const handleClear = () => {
    clearRecentCalculations();
    setRecents([]);
  };

  return (
    <section
      className="mb-8 p-5 rounded-2xl border border-border/80 bg-card shadow-xs"
      aria-label="Recent calculations"
    >
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-primary" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-foreground tracking-tight">
            Continue Calculating
          </h2>
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-muted/60"
          aria-label="Clear recent calculations"
        >
          <span>Clear</span>
          <X className="w-3 h-3" aria-hidden="true" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {recents.map((item) => (
          <Link
            key={item.id}
            href={item.route}
            className="group p-3 rounded-xl border border-border/70 bg-muted/20 hover:border-primary/40 hover:bg-card hover:shadow-xs transition-all flex items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <CalculatorIcon id={item.id} className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {item.name}
                </h3>
                {item.summary && (
                  <p className="text-[11px] text-muted-foreground truncate">
                    {item.summary}
                  </p>
                )}
              </div>
            </div>
            <ArrowRight
              className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
