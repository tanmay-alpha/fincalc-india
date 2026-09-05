"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import {
  TrendingUp,
  FileText,
  LineChart,
  Building2,
  Scale,
  ArrowRight,
  Search,
  X,
  Star,
} from "lucide-react";
import {
  CATEGORIES,
  CALCULATOR_REGISTRY,
  CalculatorMeta,
  CalculatorCategory,
  getPopularCalculators,
  searchCalculators,
} from "@/lib/registry";

const CATEGORY_ICON_MAP: Record<CalculatorCategory, typeof TrendingUp> = {
  investments: TrendingUp,
  taxation: FileText,
  loans: Building2,
  trading: LineChart,
  corporate: Scale,
};

// ─── Unified CalculatorCard ─────────────────────────────────────────────────
function CalculatorCard({ calc }: { calc: CalculatorMeta }) {
  const Icon = CATEGORY_ICON_MAP[calc.category] || TrendingUp;

  return (
    <Link
      href={calc.route}
      className="group relative p-4 rounded-xl border border-border/70 bg-card hover:border-primary/40 hover:shadow-sm transition-all flex flex-col gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        {calc.badge && (
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shrink-0">
            {calc.badge}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
          {calc.name}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
          {calc.description}
        </p>
      </div>

      <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground group-hover:text-primary transition-colors">
        <span>Open</span>
        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

// ─── Section header ─────────────────────────────────────────────────────────
function SectionHeader({
  icon: Icon,
  label,
  count,
}: {
  icon: typeof TrendingUp;
  label: string;
  count: number;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center text-muted-foreground shrink-0">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <h2 className="text-sm font-bold text-foreground tracking-tight">{label}</h2>
      <span className="text-[11px] text-muted-foreground tabular-nums">({count})</span>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────
export default function CategoryDirectory() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const popularTools = useMemo(() => getPopularCalculators(8), []);

  const filteredResults = useMemo(() => {
    if (!query.trim()) return null;
    return searchCalculators(query);
  }, [query]);

  return (
    <div id="calculators" className="scroll-mt-20 space-y-10">
      {/* Directory header + filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Calculator Directory
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-0.5">
            31 tools, organized below
          </h2>
        </div>

        {/* Inline name filter */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by name or alias…"
            aria-label="Filter calculators by name"
            className="w-full h-9 pl-9 pr-8 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear filter"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filtered flat list */}
      {filteredResults !== null ? (
        <div>
          {filteredResults.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No calculators match &ldquo;{query}&rdquo;. Try searching for &ldquo;SIP&rdquo;, &ldquo;Tax&rdquo;, &ldquo;EMI&rdquo;, or &ldquo;XIRR&rdquo;.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredResults.map((calc) => (
                <CalculatorCard key={calc.id} calc={calc} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* ── Popular Section ──────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Star className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-sm font-bold text-foreground tracking-tight">Popular</h2>
              <span className="text-[11px] text-muted-foreground tabular-nums">({popularTools.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {popularTools.map((calc) => (
                <CalculatorCard key={calc.id} calc={calc} />
              ))}
            </div>
          </section>

          {/* ── Category Sections ───────────────────────────────── */}
          {CATEGORIES.map(({ id, label }) => {
            const Icon = CATEGORY_ICON_MAP[id] || TrendingUp;
            const tools = CALCULATOR_REGISTRY.filter((c) => c.category === id);
            return (
              <section key={id}>
                <SectionHeader icon={Icon} label={label} count={tools.length} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {tools.map((calc) => (
                    <CalculatorCard key={calc.id} calc={calc} />
                  ))}
                </div>
              </section>
            );
          })}
        </>
      )}
    </div>
  );
}
