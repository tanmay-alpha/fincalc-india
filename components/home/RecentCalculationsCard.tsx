"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History, ArrowRight, X } from "lucide-react";
import { getRecentCalculations, clearRecentCalculations, RecentCalculation } from "@/lib/storage-workflow";
import { getCategoryIcon } from "@/components/ui/CategoryIcon";

export default function RecentCalculationsCard() {
  const [recents, setRecents] = useState<RecentCalculation[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setRecents(getRecentCalculations());
  }, []);

  if (!mounted || recents.length === 0) {
    return null;
  }

  const handleClear = () => {
    clearRecentCalculations();
    setRecents([]);
  };

  return (
    <section className="mb-10 p-5 rounded-2xl border border-primary/20 bg-primary/5 shadow-sm" aria-label="Recent calculations">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground tracking-tight">
            Continue Calculating
          </h2>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 bg-primary/10 text-primary rounded">
            Local History
          </span>
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          aria-label="Clear recent calculations"
        >
          <span>Clear</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {recents.map((item) => {
          const Icon = getCategoryIcon(item.id);
          return (
            <Link
              key={item.id}
              href={item.route}
              className="group p-3 rounded-xl border border-border/70 bg-card hover:border-primary/40 hover:shadow-sm transition-all flex items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
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
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
