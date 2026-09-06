"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { ArrowRight, ShieldCheck, Database, FileText, CheckCircle2 } from "lucide-react";
import GoogleIcon from "@/components/ui/GoogleIcon";

export default function GuestLanding() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20 space-y-16">
      {/* Editorial Header */}
      <section className="space-y-6 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/80 bg-muted/40 text-muted-foreground text-xs font-medium">
          <span>Tax Year 2026–27 · Statutory Indian Financial Standards</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
          Comprehensive, compliant financial calculation suite.
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
          FinCalc India provides 31 verified financial models spanning investments, income tax,
          loan amortization, derivative pricing, and corporate valuation. Built strictly to
          statutory provisions of the Income Tax Act, RBI guidelines, and SEBI regulations.
        </p>

        {/* Action Row */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/calculators" })}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <GoogleIcon className="w-4 h-4" />
            <span>Sign in with Google</span>
          </button>

          <Link
            href="/calculators"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border bg-card text-foreground font-medium text-sm hover:bg-muted/60 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span>Explore all 31 calculators</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          </Link>
        </div>

        <p className="text-xs text-muted-foreground pt-1">
          Google authentication enables private calculation persistence and shareable links.
          No ads, spam, or promotional outreach.
        </p>
      </section>

      {/* Structured Editorial Grid: What, Why, How */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-border/60">
        <div className="space-y-2.5 p-5 rounded-2xl border border-border/60 bg-card/40">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <FileText className="w-4 h-4" aria-hidden="true" />
          </div>
          <h2 className="text-sm font-semibold text-foreground">Verified Mathematical Engine</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Every formula is codified against official gazettes — including Finance Act 2026 rebate structures, Section 157 rules, reducing-balance loan amortization, and Black-Scholes Greeks.
          </p>
        </div>

        <div className="space-y-2.5 p-5 rounded-2xl border border-border/60 bg-card/40">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Database className="w-4 h-4" aria-hidden="true" />
          </div>
          <h2 className="text-sm font-semibold text-foreground">Cloud Sync & Persistence</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Signing in saves your calculation history securely to PostgreSQL, letting you revisit complex models across desktop and mobile without re-entering parameters.
          </p>
        </div>

        <div className="space-y-2.5 p-5 rounded-2xl border border-border/60 bg-card/40">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
          </div>
          <h2 className="text-sm font-semibold text-foreground">Privacy by Architecture</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Calculations run purely in your client browser. Your financial inputs are never sold, tracked, or monetized. Share tokens are revocable at any time.
          </p>
        </div>
      </section>

      {/* Coverage & Transparency Notice */}
      <section className="p-6 rounded-2xl border border-border/80 bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>Public Transparency Guarantee</span>
          </div>
          <p className="text-xs text-muted-foreground max-w-xl">
            All statutory assumptions, tax slab boundaries, and mathematical derivations remain completely public and open for review on every calculator page.
          </p>
        </div>
        <Link
          href="/calculators"
          className="text-xs font-semibold text-primary hover:underline shrink-0"
        >
          View Calculator Index →
        </Link>
      </section>
    </div>
  );
}
