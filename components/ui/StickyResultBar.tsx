"use client";

import { clsx } from "clsx";
import { useCountUp } from "@/hooks/useCountUp";
import { formatCompact } from "@/lib/format";

interface Props {
  label: string;
  value: number;
  color?: "blue" | "green";
}

export default function StickyResultBar({ label, value }: Props) {
  const animatedValue = useCountUp(value);

  return (
    <div
      className={clsx(
        "fixed bottom-0 left-0 right-0 z-40",
        "lg:hidden",
        "bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800",
        "px-4 py-3",
        "flex items-center justify-between",
        "shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      )}
    >
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {formatCompact(animatedValue)}
        </p>
      </div>
      <div className="text-right">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Updates in real-time
        </p>
        <div className="flex items-center gap-1 justify-end mt-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-green-600 font-medium">Live</span>
        </div>
      </div>
    </div>
  );
}
