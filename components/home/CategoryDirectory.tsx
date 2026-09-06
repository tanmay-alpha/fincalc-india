"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import {
  PiggyBank, TrendingUp, Banknote, Landmark, Shield, Flame,
  Briefcase, BarChart3, CreditCard, ArrowLeftRight, AlertTriangle,
  Car, RefreshCw, Receipt, SlidersHorizontal, ArrowUpRight, Home,
  Store, Building, Globe, DollarSign, Wallet, Tag, Activity,
  FlaskConical, Target, Gauge, ShieldAlert, Calculator, Percent,
  Layers, LucideIcon, ArrowRight, X, Search,
} from "lucide-react";
import {
  CATEGORIES,
  CALCULATOR_REGISTRY,
  CalculatorMeta,
  CalculatorCategory,
  searchCalculators,
  type CalculatorIconName,
} from "@/lib/registry";

// ─── Icon resolve map ───────────────────────────────────────────────────────
const ICON_MAP: Record<CalculatorIconName, LucideIcon> = {
  PiggyBank, TrendingUp, Banknote, Landmark, Shield, Flame, Briefcase,
  BarChart3, CreditCard, ArrowLeftRight, AlertTriangle, Car, RefreshCw,
  Receipt, SlidersHorizontal, ArrowUpRight, Home, Store, Building, Globe,
  DollarSign, Wallet, Tag, Activity, FlaskConical, Target, Gauge,
  ShieldAlert, Calculator, Percent, Layers,
};

// ─── Calculator Card ─────────────────────────────────────────────────────────
function CalculatorCard({ calc }: { calc: CalculatorMeta }) {
  const Icon = ICON_MAP[calc.iconName] ?? Calculator;

  return (
    <Link
      href={calc.route}
      className="group relative p-4 rounded-xl border border-border/70 bg-card hover:border-primary/40 hover:shadow-sm transition-all flex flex-col gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-2">
        {/* Per-calculator unique icon */}
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors shrink-0">
          <Icon className="w-4 h-4" aria-hidden="true" />
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
        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </div>
    </Link>
  );
}

// ─── Tab filter button ───────────────────────────────────────────────────────
const ALL_TAB = "all" as const;
type TabId = CalculatorCategory | typeof ALL_TAB;

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
            ? "bg-primary text-primary-foreground shadow-xs"
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

// ─── Main CategoryDirectory ──────────────────────────────────────────────────
export default function CategoryDirectory() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>(ALL_TAB);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTabChange = useCallback((id: TabId) => {
    setActiveTab(id);
    setQuery(""); // clear search when switching tabs
  }, []);

  // Category counts (excluding filter)
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = { all: CALCULATOR_REGISTRY.length };
    for (const c of CATEGORIES) {
      map[c.id] = CALCULATOR_REGISTRY.filter((calc) => calc.category === c.id).length;
    }
    return map;
  }, []);

  // Filtered results
  const displayedCalcs = useMemo(() => {
    const catFilter = activeTab === ALL_TAB ? "all" : activeTab;
    return searchCalculators(query, catFilter);
  }, [query, activeTab]);

  return (
    <div id="calculators" className="scroll-mt-20 space-y-6">
      {/* ── Header row ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Calculator Directory
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-0.5">
            All 31 calculators
          </h2>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search calculators…"
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

      {/* ── Category tabs ─────────────────────────────────────── */}
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

      {/* ── Results ───────────────────────────────────────────── */}
      {displayedCalcs.length === 0 ? (
        <p className="text-sm text-muted-foreground py-10 text-center">
          No calculators match &ldquo;{query}&rdquo;. Try &ldquo;SIP&rdquo;, &ldquo;Tax&rdquo;,
          &ldquo;EMI&rdquo;, or &ldquo;XIRR&rdquo;.
        </p>
      ) : (
        <div
          role="tabpanel"
          aria-label={`${activeTab === "all" ? "All" : CATEGORIES.find((c) => c.id === activeTab)?.label} calculators`}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {displayedCalcs.map((calc) => (
            <CalculatorCard key={calc.id} calc={calc} />
          ))}
        </div>
      )}
    </div>
  );
}
