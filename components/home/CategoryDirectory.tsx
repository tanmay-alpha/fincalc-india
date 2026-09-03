"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  FileText,
  LineChart,
  Building2,
  Scale,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { CALCULATOR_REGISTRY, CalculatorCategory } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const CATEGORIES: Array<{ id: "all" | CalculatorCategory; label: string; icon: typeof TrendingUp }> = [
  { id: "all", label: "All Calculators", icon: Sparkles },
  { id: "investments", label: "Invest & Grow", icon: TrendingUp },
  { id: "taxation", label: "Tax & Compliance", icon: FileText },
  { id: "loans", label: "Loans & Credit", icon: Building2 },
  { id: "trading", label: "Trading & Risk", icon: LineChart },
  { id: "corporate", label: "Corporate & Valuation", icon: Scale },
];

const ICONS_BY_CATEGORY: Record<CalculatorCategory, typeof TrendingUp> = {
  investments: TrendingUp,
  taxation: FileText,
  loans: Building2,
  trading: LineChart,
  corporate: Scale,
};

export default function CategoryDirectory() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | CalculatorCategory>("all");

  const filteredTools = useMemo(() => {
    if (selectedCategory === "all") return CALCULATOR_REGISTRY;
    return CALCULATOR_REGISTRY.filter((c) => c.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div id="calculators" className="mt-16 space-y-8 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Explore Directory
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
            All 31 Financial Engines
          </h2>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((calc) => {
          const Icon = ICONS_BY_CATEGORY[calc.category] || TrendingUp;

          return (
            <Link
              key={calc.id}
              href={calc.route}
              className="group p-5 rounded-xl border border-border/80 bg-card hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  {calc.badge && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 shrink-0">
                      {calc.badge}
                    </span>
                  )}
                  {calc.isPopular && !calc.badge && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                      Popular
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  {calc.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                  {calc.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                <span>Launch calculator</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
