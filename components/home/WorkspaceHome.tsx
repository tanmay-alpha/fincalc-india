"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { CALCULATOR_REGISTRY, CATEGORIES } from "@/lib/registry";
import CalculatorIcon, { CategoryIcon } from "@/components/ui/CategoryIcon";
import RecentCalculationsCard from "@/components/home/RecentCalculationsCard";

interface WorkspaceHomeProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function WorkspaceHome({ user }: WorkspaceHomeProps) {
  const firstName = user?.name ? user.name.split(" ")[0] : "there";
  // Maximum 6 frequently used tools initially
  const frequentlyUsed = CALCULATOR_REGISTRY.filter((c) => c.isPopular).slice(0, 6);

  const openSearch = () => {
    // Dispatches Cmd+K event for global CommandSearch
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        ctrlKey: true,
        bubbles: true,
      })
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10">
      {/* Workspace Header with Search */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Welcome, {firstName}.
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Statutory logic current for Tax Year 2026–27 · 31 calculators available
          </p>
        </div>

        {/* Quick Search Action */}
        <button
          type="button"
          onClick={openSearch}
          className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground text-xs sm:text-sm transition-colors text-left shadow-2xs group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
        >
          <Search className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span>Search calculators…</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium rounded border border-border bg-muted text-muted-foreground ml-2">
            ⌘K
          </kbd>
        </button>
      </section>

      {/* 1. Recent Calculations */}
      <RecentCalculationsCard />

      {/* 2. Browse by Category (compact links/rows, not 5 large cards) */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Browse by category
        </h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/calculators?category=${cat.id}`}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/70 bg-card hover:bg-muted text-xs font-medium text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <CategoryIcon category={cat.id} className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Frequently Used (restrained 4-6 tools, quiet items, 1-line description, no repeated Launch ->) */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Frequently used
          </h2>
          <Link
            href="/calculators"
            className="text-xs font-medium text-primary hover:underline"
          >
            View all 31 calculators →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {frequentlyUsed.map((calc) => (
            <Link
              key={calc.id}
              href={calc.route}
              className="p-3.5 rounded-xl border border-border/70 bg-card hover:border-border-strong hover:bg-muted/30 transition-all flex flex-col justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center text-foreground shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <CalculatorIcon id={calc.id} className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {calc.shortName || calc.name}
                    </h3>
                  </div>
                  {calc.badge && (
                    <span className="text-xs font-medium text-muted-foreground shrink-0">
                      {calc.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate leading-relaxed">
                  {calc.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
