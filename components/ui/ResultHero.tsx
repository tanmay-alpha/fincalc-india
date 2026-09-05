"use client";

import { useCountUp } from "@/hooks/useCountUp";
import { formatCompact } from "@/lib/format";
import { cn } from "@/lib/utils";

export type ResultSemanticTone = "positive" | "negative" | "neutral" | "warning" | "informational";
export type BreakdownMode = "composition" | "metrics";

export interface BreakdownItem {
  label: string;
  value: number;
  color?: "blue" | "green" | "red" | "purple" | "amber";
  formattedValue?: string;
}

export interface ResultHeroProps {
  label: string;
  value: number;
  tone?: ResultSemanticTone;
  statusBadge?: string;
  prefix?: string;
  formatValue?: (val: number) => string;
  interpretation?: string;
  secondaryMetrics?: Array<{ label: string; value: string | number }>;
  breakdown?: BreakdownItem[];
  breakdownMode?: BreakdownMode;
  className?: string;
}

const COLOR_MAP: Record<string, string> = {
  blue: "bg-blue-600 dark:bg-blue-500",
  green: "bg-emerald-600 dark:bg-emerald-500",
  red: "bg-rose-600 dark:bg-rose-500",
  purple: "bg-purple-600 dark:bg-purple-500",
  amber: "bg-amber-600 dark:bg-amber-500",
};

export default function ResultHero({
  label,
  value,
  tone = "neutral",
  statusBadge,
  prefix,
  formatValue,
  interpretation,
  secondaryMetrics,
  breakdown = [],
  breakdownMode,
  className,
}: ResultHeroProps) {
  const animatedValue = useCountUp(value);

  const rawDisplayValue = formatValue
    ? formatValue(animatedValue)
    : formatCompact(animatedValue);

  // If displayValue already starts with prefix (e.g. ₹), strip it from main digits to avoid duplicate
  const cleanPrefix = prefix || (rawDisplayValue.startsWith("₹") ? "₹" : undefined);
  const cleanDisplayValue = cleanPrefix && rawDisplayValue.startsWith(cleanPrefix)
    ? rawDisplayValue.slice(cleanPrefix.length).trim()
    : rawDisplayValue;

  // Breakdown analysis:
  // For breakdownMode="composition", all items must be non-negative (>= 0) and represent parts of a whole.
  // Mixed-sign, all-negative, or independent metrics do not render proportional stacked bars.
  const hasNegative = breakdown.some((item) => item.value < 0);
  const totalBreakdown = breakdown.reduce(
    (sum, item) => sum + (item.value >= 0 ? item.value : 0),
    0
  );

  const isComposition =
    breakdownMode !== "metrics" &&
    !hasNegative &&
    totalBreakdown > 0 &&
    (breakdownMode === "composition" || breakdown.length > 0);

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm transition-all relative overflow-hidden",
        tone === "negative" && "border-rose-300/50 dark:border-rose-900/40",
        tone === "positive" && "border-emerald-300/50 dark:border-emerald-900/40",
        tone === "warning" && "border-amber-300/50 dark:border-amber-900/40",
        tone === "informational" && "border-blue-300/50 dark:border-blue-900/40",
        className
      )}
    >
      {/* Eyebrow Label & Optional Explicit Status Badge */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {statusBadge && (
          <span
            className={cn(
              "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border",
              tone === "negative" && "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
              tone === "positive" && "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
              tone === "warning" && "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
              (tone === "neutral" || tone === "informational") && "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
            )}
          >
            {statusBadge}
          </span>
        )}
      </div>

      {/* Primary Hero Financial Number */}
      <div className="mt-2 flex items-baseline gap-1">
        {cleanPrefix && (
          <span className="text-2xl sm:text-3xl font-bold text-muted-foreground">
            {cleanPrefix}
          </span>
        )}
        <span
          className={cn(
            "text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums",
            tone === "negative"
              ? "text-rose-700 dark:text-rose-300"
              : tone === "positive"
              ? "text-emerald-700 dark:text-emerald-300"
              : "text-foreground"
          )}
        >
          {cleanDisplayValue}
        </span>
      </div>

      {/* Optional Short Financial Interpretation */}
      {interpretation && (
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {interpretation}
        </p>
      )}

      {/* Optional Secondary Metrics Grid */}
      {secondaryMetrics && secondaryMetrics.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/60 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {secondaryMetrics.map((metric, idx) => (
            <div key={idx} className="min-w-0">
              <span className="block text-[11px] text-muted-foreground font-medium truncate">
                {metric.label}
              </span>
              <span className="block text-sm font-bold text-foreground tabular-nums truncate">
                {metric.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Breakdown Section */}
      {breakdown.length > 0 && (
        <div className="mt-5 space-y-3">
          {/* Proportional bar is strictly rendered ONLY for genuine non-negative compositions */}
          {isComposition && (
            <div
              data-testid="breakdown-bar"
              className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted/60 p-0.5"
            >
              {breakdown.map((item, i) => {
                const pct = (item.value / totalBreakdown) * 100;
                const colorClass = item.color
                  ? COLOR_MAP[item.color] || "bg-primary"
                  : "bg-primary";
                return (
                  <div
                    key={i}
                    style={{ width: `${Math.max(pct, 0.5)}%` }}
                    className={cn("h-full transition-all rounded-sm", colorClass)}
                    title={`${item.label}: ${item.formattedValue || formatCompact(item.value)}`}
                  />
                );
              })}
            </div>
          )}

          {/* Breakdown Legend / Metric rows */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
            {breakdown.map((item, i) => {
              const colorClass = item.color
                ? COLOR_MAP[item.color] || "bg-primary"
                : "bg-primary";
              const legendValue = item.formattedValue || formatCompact(item.value);
              return (
                <div key={i} className="flex items-center gap-1.5">
                  <span className={cn("w-2 h-2 rounded-full", colorClass)} />
                  <span className="text-muted-foreground">{item.label}:</span>
                  <span className="font-semibold text-foreground tabular-nums">
                    {legendValue}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
