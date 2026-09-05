"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, X, TrendingUp, FileText, LineChart, Building2, Scale } from "lucide-react";
import { searchCalculators, CalculatorCategory, CATEGORY_MAP } from "@/lib/registry";

const CATEGORY_ICONS: Record<CalculatorCategory, typeof TrendingUp> = {
  investments: TrendingUp,
  taxation: FileText,
  trading: LineChart,
  loans: Building2,
  corporate: Scale,
};

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter matching calculators using centralized alias & keyword matching
  const matches = useMemo(() => {
    if (!query.trim()) return [];
    return searchCalculators(query).slice(0, 6);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (matches.length > 0) {
      router.push(matches[0].route);
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto mt-6">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search SIP, tax, EMI, XIRR, DCF..."
            className="w-full h-13 pl-12 pr-12 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base transition-all"
            aria-label="Search financial calculators"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setIsOpen(false);
              }}
              className="absolute right-4 p-1 rounded-md text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && matches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border border-border shadow-xl p-2 z-30 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between px-3 py-1 mb-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Matching Calculators
            </p>
            <span className="text-[10px] text-muted-foreground">Press Enter to open first</span>
          </div>
          <div className="divide-y divide-border/40">
            {matches.map((calc) => {
              const Icon = CATEGORY_ICONS[calc.category] || TrendingUp;
              return (
                <Link
                  key={calc.id}
                  href={calc.route}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/60 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                          {calc.name}
                        </span>
                        {calc.badge && (
                          <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-primary/10 text-primary rounded">
                            {calc.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {CATEGORY_MAP[calc.category]?.label} &bull; {calc.description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1 shrink-0 ml-2" />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
