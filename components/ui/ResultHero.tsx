"use client";

import { clsx } from "clsx";
import { useCountUp } from "@/hooks/useCountUp";
import { formatCompact } from "@/lib/format";

interface ResultHeroProps {
  label: string;
  value: number;
  breakdown: Array<{
    label: string;
    value: number;
    color: "blue" | "green" | "red" | "purple";
  }>;
}

const colorMap = {
  blue: "bg-chart-1",
  green: "bg-chart-2",
  red: "bg-destructive",
  purple: "bg-chart-5",
};

export default function ResultHero({ label, value, breakdown }: ResultHeroProps) {
  const animatedValue = useCountUp(value);
  const total = breakdown.reduce((sum, item) => sum + Math.max(0, item.value), 0);

  return (
    <div className="surface-card p-6">
      <p className="text-sm font-medium text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-4xl font-bold tracking-tight text-card-foreground">
        {formatCompact(animatedValue)}
      </p>

      <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-muted">
        {breakdown.map((item, i) => (
          <div
            key={i}
            className={clsx(
              "h-full transition-all duration-700",
              colorMap[item.color]
            )}
            style={{
              width: total > 0 ? `${(Math.max(0, item.value) / total) * 100}%` : "0%",
            }}
          />
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-4">
        {breakdown.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className={clsx(
                "w-2.5 h-2.5 rounded-full",
                colorMap[item.color]
              )}
            />
            <span className="text-xs text-muted-foreground">
              {item.label}
            </span>
            <span className="text-xs font-semibold text-card-foreground">
              {formatCompact(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
