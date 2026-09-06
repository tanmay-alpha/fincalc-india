"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GoogleSignInButton from "@/components/ui/GoogleSignInButton";
import { CALCULATOR_REGISTRY, CATEGORIES } from "@/lib/registry";
import CalculatorIcon, { CategoryIcon } from "@/components/ui/CategoryIcon";

export default function GuestLanding() {
  // 6 canonical high-utility tools
  const popularTools = CALCULATOR_REGISTRY.filter((c) => c.isPopular).slice(0, 6);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-14">
      {/* Editorial Hero Header */}
      <section className="space-y-6 max-w-3xl">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            FinCalc India
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
            Financial calculations for India.
          </h1>
        </div>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Model investments, taxes, loans, trading costs and valuation with visible statutory assumptions
          and source references. Updated for Tax Year 2026–27.
        </p>

        {/* Action Row */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-md sm:max-w-none">
          <GoogleSignInButton
            text="Continue with Google"
            callbackUrl="/calculators"
            size="lg"
            className="w-full sm:w-auto"
          />

          <Link
            href="/calculators"
            className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg border border-border bg-card text-foreground font-medium text-sm hover:bg-muted/60 hover:border-border-strong transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span>Browse calculators</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          </Link>
        </div>

        <p className="text-xs text-muted-foreground pt-1">
          Google authentication enables private calculation persistence and shareable links.
          Calculation logic and source assumptions remain public.
        </p>
      </section>

      {/* Popular Tools Preview */}
      <section className="space-y-4 pt-4 border-t border-border/60">
        <div className="flex items-baseline justify-between gap-3">
          <div className="space-y-0.5">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Core Financial Tools
            </h2>
            <p className="text-xs text-muted-foreground">
              Most frequently used calculation models
            </p>
          </div>
          <Link
            href="/calculators"
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
          >
            <span>View all 31 tools</span>
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {popularTools.map((calc) => (
            <Link
              key={calc.id}
              href={calc.route}
              className="p-3.5 rounded-xl border border-border/70 bg-card hover:border-border-strong hover:bg-muted/30 transition-all flex flex-col justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center text-foreground shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <CalculatorIcon id={calc.id} className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {calc.shortName || calc.name}
                    </h3>
                  </div>
                  {calc.badge && (
                    <span className="text-[11px] text-muted-foreground shrink-0 font-medium">
                      {calc.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {calc.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Category Discovery Strip */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Browse by Category
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

      {/* Editorial Supporting Section: 3 concise factual points using typography & whitespace */}
      <section className="pt-8 border-t border-border/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-foreground tracking-tight">
              Statutory alignment
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Updated for Tax Year 2026–27 income tax provisions, standard deduction thresholds,
              reducing-balance amortisation schedules, and notified small-savings rates.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-foreground tracking-tight">
              Visible assumptions
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every formula discloses its statutory basis, compounding frequency, marginal relief
              thresholds, and regulatory limits directly alongside the calculated output.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-foreground tracking-tight">
              Private persistence
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Interactive calculations run locally in your browser. Signing in lets you save
              scenarios, maintain history, and generate revocable share links.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
