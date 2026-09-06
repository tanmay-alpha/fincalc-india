"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { X, Search } from "lucide-react";
import {
  CATEGORIES,
  CALCULATOR_REGISTRY,
  CalculatorMeta,
  CalculatorCategory,
  searchCalculators,
} from "@/lib/registry";
import CalculatorIcon from "@/components/ui/CalculatorIcon";

const ALL_TAB = "all" as const;
type TabId = CalculatorCategory | typeof ALL_TAB;

// ─── Calculator Card ─────────────────────────────────────────────────────────
function CalculatorCard({ calc }: { calc: CalculatorMeta }) {
  return (
    <Link
      href={calc.route}
      className="group p-4 rounded-xl border border-border/70 bg-card hover:border-primary/40 hover:shadow-xs transition-all flex flex-col justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
            <CalculatorIcon id={calc.id} className="w-4 h-4" aria-hidden="true" />
          </div>
          {calc.badge && (
            <span className="text-[10px] font-medium tracking-wide px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">
              {calc.badge}
            </span>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
            {calc.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {calc.description}
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-border/30 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="capitalize">{calc.category}</span>
        <span className="group-hover:text-primary group-hover:translate-x-0.5 transition-all">
          Launch →
        </span>
      </div>
    </Link>
  );
}

// ─── Tab filter button ───────────────────────────────────────────────────────
function TabButton({
  label,
  count,
  active,
  onClick,
}: {
  id: TabId;
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="tab"
      aria-selected={active}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        ${
          active
            ? "bg-primary text-primary-foreground shadow-2xs"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }
      `}
    >
      {label}
      <span
        className={`tabular-nums text-[10px] ${
          active ? "text-primary-foreground/80" : "text-muted-foreground"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

// ─── Main CategoryDirectory Inner ───────────────────────────────────────────
export default function CategoryDirectory() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as TabId | null;

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>(
    initialCategory && (initialCategory === ALL_TAB || CATEGORIES.some((c) => c.id === initialCategory))
      ? initialCategory
      : ALL_TAB
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const cat = searchParams.get("category") as TabId | null;
    if (cat && (cat === ALL_TAB || CATEGORIES.some((c) => c.id === cat))) {
      setActiveTab(cat);
    }
  }, [searchParams]);

  const handleTabChange = useCallback((id: TabId) => {
    setActiveTab(id);
    setQuery("");
  }, []);

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = { all: CALCULATOR_REGISTRY.length };
    for (const c of CATEGORIES) {
      map[c.id] = CALCULATOR_REGISTRY.filter((calc) => calc.category === c.id).length;
    }
    return map;
  }, []);

  const displayedCalcs = useMemo(() => {
    const catFilter = activeTab === ALL_TAB ? "all" : activeTab;
    return searchCalculators(query, catFilter);
  }, [query, activeTab]);

  return (
    <div id="calculators" className="scroll-mt-20 space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Calculators
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-0.5">
            Directory & Search
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Browse all 31 mathematical models across investments, taxation, loans, trading, and valuation.
          </p>
        </div>

        {/* Filter Search */}
        <div className="relative w-full sm:w-72 shrink-0">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all 31 calculators…"
            aria-label="Search calculators by name or alias"
            className="w-full h-9 pl-9 pr-8 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div
        role="tablist"
        aria-label="Filter by category"
        className="flex flex-wrap gap-2"
      >
        <TabButton
          id={ALL_TAB}
          label="All"
          count={categoryCounts.all}
          active={activeTab === ALL_TAB}
          onClick={() => handleTabChange(ALL_TAB)}
        />
        {CATEGORIES.map((cat) => (
          <TabButton
            key={cat.id}
            id={cat.id}
            label={cat.label}
            count={categoryCounts[cat.id] ?? 0}
            active={activeTab === cat.id}
            onClick={() => handleTabChange(cat.id)}
          />
        ))}
      </div>

      {/* Results Grid */}
      {displayedCalcs.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-xl">
          <p className="text-sm text-muted-foreground">
            No calculators match &ldquo;{query}&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveTab(ALL_TAB);
            }}
            className="mt-2 text-xs font-semibold text-primary hover:underline"
          >
            Reset search and filters
          </button>
        </div>
      ) : (
        <div
          role="tabpanel"
          aria-label={`${activeTab === "all" ? "All" : CATEGORIES.find((c) => c.id === activeTab)?.label} calculators`}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5"
        >
          {displayedCalcs.map((calc) => (
            <CalculatorCard key={calc.id} calc={calc} />
          ))}
        </div>
      )}
    </div>
  );
}
