"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { formatCompact } from "@/lib/format";

// ─── Types ────────────────────────────────────────────────────

export interface SubItem {
  label: string;
  value: number;
  color: string; // any valid CSS color
}

export interface ResultHeroProps {
  label: string;
  value: number;
  subItems?: SubItem[];
  className?: string;
}

// ─── Easing ───────────────────────────────────────────────────

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// ─── Animated Counter Hook ────────────────────────────────────

function useAnimatedValue(target: number, duration = 600): number {
  const [display, setDisplay] = useState(target);
  const prevRef = useRef(target);
  const rafRef = useRef<number>();

  useEffect(() => {
    const from = prevRef.current;
    const to = target;
    prevRef.current = to;

    if (from === to) return;

    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = from + (to - from) * eased;
      setDisplay(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return display;
}

// ─── Component ────────────────────────────────────────────────

export default function ResultHero({
  label,
  value,
  subItems = [],
  className,
}: ResultHeroProps) {
  const animatedValue = useAnimatedValue(value);
  const total = subItems.reduce((sum, item) => sum + item.value, 0);

  return (
    <div
      className={cn(
        "rounded-2xl p-6 bg-gradient-to-br from-[var(--accent-light)] to-white",
        "dark:from-blue-950/40 dark:to-slate-800",
        "border border-blue-100 dark:border-blue-900/40",
        "transition-all duration-300",
        className
      )}
    >
      {/* Label */}
      <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">
        {label}
      </p>

      {/* Animated big number */}
      <p className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--accent)] mb-4">
        {formatCompact(Math.round(animatedValue))}
      </p>

      {/* Mini proportional bar */}
      {subItems.length >= 2 && total > 0 && (
        <div className="flex rounded-full overflow-hidden h-2 mb-4 bg-slate-100 dark:bg-slate-700">
          {subItems.map((item, i) => {
            const widthPct = (item.value / total) * 100;
            return (
              <div
                key={i}
                className="h-full transition-all duration-500"
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: item.color,
                  borderRadius:
                    i === 0
                      ? "9999px 0 0 9999px"
                      : i === subItems.length - 1
                        ? "0 9999px 9999px 0"
                        : "0",
                }}
              />
            );
          })}
        </div>
      )}

      {/* Sub-items row */}
      {subItems.length > 0 && (
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {subItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-[var(--text-muted)]">
                {item.label}
              </span>
              <span className="text-xs font-semibold text-[var(--text-primary)]">
                {formatCompact(item.value)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
