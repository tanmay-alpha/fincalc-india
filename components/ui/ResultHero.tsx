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
  blue: "bg-blue-500",
  green: "bg-green-500",
  red: "bg-red-500",
  purple: "bg-violet-500",
};

export default function ResultHero({ label, value, breakdown }: ResultHeroProps) {
  const animatedValue = useCountUp(value);
  const total = breakdown.reduce((sum, item) => sum + Math.max(0, item.value), 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-[var(--shadow-card)]">
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
        {label}
      </p>

      <p className="text-4xl font-bold text-slate-900 dark:text-slate-100 mt-1 tracking-tight">
        {formatCompact(animatedValue)}
      </p>

      <div className="mt-4 h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden flex">
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
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {item.label}
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {formatCompact(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
