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
import {
  CATEGORIES,
  CATEGORY_MAP,
  CalculatorCategory,
  searchCalculators,
} from "@/lib/registry";
import { cn } from "@/lib/utils";
import DialogPrimitive from "@/components/ui/DialogPrimitive";

interface CommandSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_ICONS: Record<CalculatorCategory, typeof TrendingUp> = {
  investments: TrendingUp,
  taxation: FileText,
  trading: LineChart,
  loans: Building2,
  corporate: Scale,
};

export default function CommandSearch({ isOpen, onClose }: CommandSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CalculatorCategory | "all">("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Centralized search with tokenized alias matching
  const filteredCalculators = useMemo(() => {
    return searchCalculators(query, selectedCategory);
  }, [query, selectedCategory]);

  // Reset selectedIndex if list shrinks
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, selectedCategory]);

  // Auto scroll active element into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector<HTMLElement>("[aria-selected='true']");
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

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

  const activeDescendantId = filteredCalculators[selectedIndex]
    ? `cmd-option-${filteredCalculators[selectedIndex].id}`
    : undefined;

  return (
    <DialogPrimitive
      isOpen={isOpen}
      onClose={onClose}
      title="Calculator Search"
      initialFocusRef={inputRef}
      overlayClassName="items-start p-4 sm:p-6 md:p-20"
      className="max-w-2xl flex flex-col max-h-[85vh]"
    >
      <div onKeyDown={handleKeyDown} className="flex flex-col h-full overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border gap-3">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-results"
            aria-activedescendant={activeDescendantId}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 31 calculators (SIP, tax, EMI, XIRR, DCF...)"
            className="flex-1 bg-transparent border-0 outline-none text-base text-card-foreground placeholder:text-muted-foreground focus:ring-0"
            aria-label="Search financial calculators"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="text-muted-foreground hover:text-foreground p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
              "text-xs px-2.5 py-1 rounded-md transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            All (31)
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "text-xs px-2.5 py-1 rounded-md transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          id="command-results"
          role="listbox"
          className="overflow-y-auto flex-1 p-2 divide-y divide-border/40"
        >
          {filteredCalculators.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-medium text-foreground">No calculators found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Try searching for keywords like &quot;tax&quot;, &quot;sip&quot;, &quot;brokerage&quot;, or &quot;cagr&quot;.
              </p>
            </div>
          ) : (
            filteredCalculators.map((calc, idx) => {
              const CategoryIcon = CATEGORY_ICONS[calc.category] || TrendingUp;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={calc.id}
                  id={`cmd-option-${calc.id}`}
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
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-800 dark:text-amber-300 shrink-0">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {CATEGORY_MAP[calc.category]?.label} &bull; {calc.description}
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
    </DialogPrimitive>
  );
}
