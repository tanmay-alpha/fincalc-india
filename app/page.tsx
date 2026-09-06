"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import {
  Calendar,
  Lock,
  ShieldCheck,
  FileCode2,
  ArrowRight,
  PiggyBank,
  Receipt,
  CreditCard,
} from "lucide-react";
import RecentCalculationsCard from "@/components/home/RecentCalculationsCard";
import CategoryDirectory from "@/components/home/CategoryDirectory";

/** Google logo for the sign-in CTA */
function GoogleLogo() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

/** Featured calculator entry (for guest hero — only 3 shown) */
const FEATURED = [
  {
    href: "/sip",
    icon: PiggyBank,
    name: "SIP Calculator",
    tag: "Most popular",
  },
  {
    href: "/tax",
    icon: Receipt,
    name: "Income Tax 2026-27",
    tag: "Finance Act 2026",
  },
  {
    href: "/emi",
    icon: CreditCard,
    name: "Loan EMI Calculator",
    tag: "Amortization schedule",
  },
];

// ─── Trust signals (shared between both states) ─────────────────────────────
const TRUST = [
  {
    icon: FileCode2,
    title: "31 Calculators",
    body: "Investments, tax, loans, trading, and valuation.",
  },
  {
    icon: Calendar,
    title: "Tax Year 2026–27",
    body: "Finance Act 2026, Section 157 rebate, updated STT.",
  },
  {
    icon: Lock,
    title: "Private by Default",
    body: "Instant browser calculations. No server needed.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent Assumptions",
    body: "Statutory citations and assumption drawers on every page.",
  },
];

// ─── Guest (unauthenticated) view ────────────────────────────────────────────
function GuestHero() {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-border/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Tax year badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
          <span>Updated for Tax Year 2026–27 (Income Tax Act, 2025)</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
          India&apos;s most precise{" "}
          <span className="text-primary">financial calculators.</span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          31 calculators for investing, tax, loans, trading and valuation — built for India.{" "}
          <span className="text-foreground/60 font-medium">Free · No ads · No tracking.</span>
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => signIn("google")}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <GoogleLogo />
            Sign in with Google — it&apos;s free
          </button>
          <Link
            href="/calculators"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-muted/70 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Browse calculators
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {/* 3 featured calculators */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left">
          {FEATURED.map(({ href, icon: Icon, name, tag }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-3 p-3.5 rounded-xl border border-border/70 bg-card hover:border-primary/40 hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/15 transition-colors">
                <Icon className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {name}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">{tag}</p>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-5 text-xs text-muted-foreground">
          Sign in to save results, access history, and share calculations.{" "}
          <Link href="/calculators" className="text-primary underline font-medium hover:opacity-80">
            Or browse without signing in →
          </Link>
        </p>
      </div>
    </section>
  );
}

// ─── Authenticated workspace view ────────────────────────────────────────────
function WorkspaceView({ name }: { name?: string | null }) {
  const firstName = name?.split(" ")[0] ?? "there";

  return (
    <section className="pt-10 pb-6 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Your Workspace
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Welcome back, {firstName}.
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              All 31 calculators ready — pick up where you left off.
            </p>
          </div>
          <Link
            href="/calculators"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm font-semibold text-foreground hover:bg-muted/70 transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            All calculators
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <main id="main-content" className="min-h-screen">
      {isAuthenticated ? (
        <>
          {/* Authenticated: compact workspace header */}
          <WorkspaceView name={session?.user?.name} />

          {/* Authenticated body: recent calcs + popular directory */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-2">
            <RecentCalculationsCard />
            <CategoryDirectory />
          </div>
        </>
      ) : (
        <>
          {/* Guest: full landing hero */}
          <GuestHero />

          {/* Guest body: trust signals only — directory lives at /calculators */}
          <div className="border-t border-border/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {TRUST.map(({ icon: Icon, title, body }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                        {body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
