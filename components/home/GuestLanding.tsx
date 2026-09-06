"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GoogleSignInButton from "@/components/ui/GoogleSignInButton";

export default function GuestLanding() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20 space-y-16">
      {/* Editorial Header */}
      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            FinCalc India
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
            Financial calculations for India.
          </h1>
        </div>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Model investments, taxes, loans, trading costs and valuation with visible assumptions
          and source references.
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
