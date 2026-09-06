"use client";

import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";
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
  const popularCalculators = CALCULATOR_REGISTRY.filter((c) => c.isPopular).slice(0, 8);

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10">
      {/* Workspace Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
            <span>Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {firstName}.
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Access your recent calculations, popular tools, or browse the complete suite.
          </p>
        </div>

        {/* Quick Search Action */}
        <button
          type="button"
          onClick={openSearch}
          className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-border/80 bg-card hover:bg-muted/50 text-muted-foreground text-sm transition-colors text-left shadow-2xs group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Search className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span>Search 31 calculators...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium rounded border border-border bg-muted text-muted-foreground ml-2">
            ⌘K
          </kbd>
        </button>
      </section>

      {/* Continue Calculating / Recent Calculations */}
      <RecentCalculationsCard />

      {/* Category Navigation Shortcuts */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground tracking-tight">
            Explore by Category
          </h2>
          <Link
            href="/calculators"
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
          >
            <span>All 31 tools</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/calculators?category=${cat.id}`}
              className="p-3.5 rounded-xl border border-border/70 bg-card hover:border-primary/40 hover:shadow-xs transition-all flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                <CategoryIcon category={cat.id} className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {cat.label}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Tools (Curated 8, not 31-card wall) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
            <h2 className="text-sm font-semibold text-foreground tracking-tight">
              Frequently Used Calculators
            </h2>
          </div>
          <Link
            href="/calculators"
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
          >
            <span>View directory</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {popularCalculators.map((calc) => (
            <Link
              key={calc.id}
              href={calc.route}
              className="p-4 rounded-xl border border-border/70 bg-card hover:border-primary/40 hover:shadow-xs transition-all flex flex-col justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                    <CalculatorIcon id={calc.id} className="w-4 h-4" />
                  </div>
                  {calc.badge && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {calc.badge}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {calc.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                    {calc.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground group-hover:text-primary font-medium transition-colors">
                <span>Launch calculator</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Directory Teaser Card */}
      <section className="p-6 rounded-2xl border border-border/70 bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">
            Looking for something specific?
          </h3>
          <p className="text-xs text-muted-foreground max-w-xl">
            Browse the full directory of all 31 specialized calculators, filtered by category and statutory requirements.
          </p>
        </div>
        <Link
          href="/calculators"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span>Open Full Directory</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </div>
  );
}
