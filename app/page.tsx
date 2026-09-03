import {
  Calendar,
  Lock,
  ShieldCheck,
  FileCode2,
} from "lucide-react";
import HeroSearch from "@/components/home/HeroSearch";
import CategoryDirectory from "@/components/home/CategoryDirectory";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-border/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Tax year badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>Updated for Tax Year 2026–27 (Income Tax Act, 2025)</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
            Make smarter <span className="text-primary">financial decisions.</span>
          </h1>

          {/* Single, canonical trust line */}
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            31 calculators for investing, tax, loans, trading and valuation — built for India.{" "}
            <span className="text-foreground/60 font-medium">Free · No ads · No tracking.</span>
          </p>

          {/* Inline hero search */}
          <HeroSearch />

          {/* CTA buttons — primary solid, secondary ghost */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#calculators"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm"
            >
              Explore calculators
            </a>
            <a
              href="/tax"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-muted/70 transition-all"
            >
              Open Income Tax Calculator
            </a>
          </div>
        </div>
      </section>

      {/* ── CALCULATOR DIRECTORY ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <CategoryDirectory />
      </div>

      {/* ── PLATFORM TRUST SIGNALS (compact, once) ───────────────── */}
      <div className="border-t border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                <FileCode2 className="w-4 h-4" />
              </div>
              <div>
                <dt className="text-sm font-semibold text-foreground">31 Calculators</dt>
                <dd className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                  Investments, tax, loans, trading, and valuation.
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <dt className="text-sm font-semibold text-foreground">Tax Year 2026–27</dt>
                <dd className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                  Finance Act 2026, Section 157 rebate, updated STT.
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <dt className="text-sm font-semibold text-foreground">Private by Default</dt>
                <dd className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                  Instant browser calculations. Sign-in optional.
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <dt className="text-sm font-semibold text-foreground">Transparent Assumptions</dt>
                <dd className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                  Statutory citations and assumption drawers on every page.
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
