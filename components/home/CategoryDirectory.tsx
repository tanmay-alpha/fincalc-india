"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { X, Search, ArrowRight } from "lucide-react";
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

// ─── Restrained Low-Border Tool Index Item ────────────────────────────────────
function CalculatorCard({ calc }: { calc: CalculatorMeta }) {
  return (
    <Link
      href={calc.route}
      className="group min-h-[108px] sm:min-h-[116px] p-4 rounded-xl border border-border/70 bg-card hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <CalculatorIcon id={calc.id} className="w-4 h-4" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {calc.shortName || calc.name}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {calc.badge && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {calc.badge}
              </span>
            )}
            <ArrowRight
              className="w-3.5 h-3.5 text-muted-foreground/60 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary transition-all duration-150"
              aria-hidden="true"
            />
          </div>
        </div>
        <p className="mt-2 text-xs sm:text-[13px] text-muted-foreground line-clamp-2 leading-relaxed">
          {calc.description}
        </p>
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
        className={`tabular-nums text-xs ${
          active ? "text-primary-foreground/85" : "text-muted-foreground"
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            All calculators
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            31 tools · statutory logic current for FY 2026–27
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
        className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-none sm:flex-wrap"
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

      {/* Results Grid - Low-border 3-column tool index */}
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5"
        >
          {displayedCalcs.map((calc) => (
            <CalculatorCard key={calc.id} calc={calc} />
          ))}
        </div>
      )}
    </div>
  );
}
