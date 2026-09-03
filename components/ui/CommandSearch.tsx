"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  TrendingUp,
  FileText,
  LineChart,
  Building2,
  Scale,
  ArrowRight,
  Command,
} from "lucide-react";
import { CALCULATOR_REGISTRY, CalculatorCategory } from "@/lib/calculators";
import { cn } from "@/lib/utils";

interface CommandSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<CalculatorCategory, { label: string; icon: typeof TrendingUp }> = {
  investments: { label: "Invest & Grow", icon: TrendingUp },
  taxation: { label: "Tax & Compliance", icon: FileText },
  trading: { label: "Trading & Risk", icon: LineChart },
  loans: { label: "Loans & Credit", icon: Building2 },
  corporate: { label: "Corporate & Valuation", icon: Scale },
};

export default function CommandSearch({ isOpen, onClose }: CommandSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global keyboard shortcut: Cmd+K / Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filter calculators by query and category
  const filteredCalculators = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CALCULATOR_REGISTRY.filter((calc) => {
      const matchesCategory =
        selectedCategory === "all" || calc.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!q) return true;
      return (
        calc.name.toLowerCase().includes(q) ||
        calc.shortName.toLowerCase().includes(q) ||
        calc.description.toLowerCase().includes(q) ||
        calc.route.toLowerCase().includes(q)
      );
    });
  }, [query, selectedCategory]);

  // Reset selectedIndex if list shrinks
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, selectedCategory]);

  // Keyboard navigation within list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredCalculators.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCalculators.length - 1
      );
    } else if (e.key === "Enter" && filteredCalculators[selectedIndex]) {
      e.preventDefault();
      const target = filteredCalculators[selectedIndex];
      onClose();
      router.push(target.route);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Calculator Search"
    >
      <div
        className="w-full max-w-2xl bg-card rounded-xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border gap-3">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 31 calculators (SIP, tax, EMI, XIRR, DCF...)"
            className="flex-1 bg-transparent border-0 outline-none text-base text-card-foreground placeholder:text-muted-foreground focus:ring-0"
            aria-label="Search financial calculators"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border overflow-x-auto scrollbar-none bg-muted/30">
          <button
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "text-xs px-2.5 py-1 rounded-md transition-colors shrink-0",
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            All (31)
          </button>
          {Object.entries(CATEGORY_LABELS).map(([catKey, { label }]) => (
            <button
              key={catKey}
              onClick={() => setSelectedCategory(catKey)}
              className={cn(
                "text-xs px-2.5 py-1 rounded-md transition-colors shrink-0",
                selectedCategory === catKey
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto flex-1 p-2 divide-y divide-border/40">
          {filteredCalculators.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-medium text-foreground">No calculators found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Try searching for keywords like &quot;tax&quot;, &quot;sip&quot;, &quot;brokerage&quot;, or &quot;cagr&quot;.
              </p>
            </div>
          ) : (
            filteredCalculators.map((calc, idx) => {
              const CategoryIcon =
                CATEGORY_LABELS[calc.category]?.icon || TrendingUp;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={calc.id}
                  onClick={() => {
                    onClose();
                    router.push(calc.route);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
                    isSelected
                      ? "bg-accent/60 text-accent-foreground"
                      : "hover:bg-muted/50 text-card-foreground"
                  )}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                        isSelected ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                      )}
                    >
                      <CategoryIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold truncate">{calc.name}</span>
                        {calc.badge && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary shrink-0">
                            {calc.badge}
                          </span>
                        )}
                        {calc.isPopular && !calc.badge && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {calc.description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    className={cn(
                      "w-4 h-4 shrink-0 transition-transform",
                      isSelected ? "translate-x-0.5 text-primary" : "opacity-0"
                    )}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-border bg-muted/20 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>
              Use <kbd className="px-1 py-0.5 bg-muted rounded border border-border font-mono">↑</kbd> <kbd className="px-1 py-0.5 bg-muted rounded border border-border font-mono">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="px-1 py-0.5 bg-muted rounded border border-border font-mono">↵</kbd> to select
            </span>
          </div>
          <span>
            <kbd className="px-1 py-0.5 bg-muted rounded border border-border font-mono">esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}
