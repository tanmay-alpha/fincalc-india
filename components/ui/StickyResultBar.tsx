"use client";

import { useEffect, useState } from "react";
import { useCountUp } from "@/hooks/useCountUp";
import { formatCompact } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: number;
  prefix?: string;
  color?: "blue" | "green" | "red";
}

/**
 * Mobile-only sticky bottom bar for calculator results.
 *
 * UX enhancements:
 * - Respects safe-area-inset-bottom for notched mobile devices.
 * - Auto-hides when form inputs are focused to prevent keyboard occlusion.
 * - Auto-hides when the on-page ResultHero is fully visible in viewport to prevent redundant stacked numbers.
 * - Leaves room for action buttons when user reaches page end.
 */
const COLOR_TEXT: Record<string, string> = {
  green: "text-emerald-800 dark:text-emerald-300",
  red: "text-rose-700 dark:text-rose-300",
  blue: "text-primary",
};

export default function StickyResultBar({
  label,
  value,
  prefix,
  color = "blue",
}: Props) {
  const animatedValue = useCountUp(value);
  const [inputFocused, setInputFocused] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  // Monitor input focus
  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.tagName === "SELECT")
      ) {
        setInputFocused(true);
      }
    };
    const onFocusOut = (e: FocusEvent) => {
      const t = e.relatedTarget as HTMLElement | null;
      if (
        !t ||
        (t.tagName !== "INPUT" &&
          t.tagName !== "TEXTAREA" &&
          t.tagName !== "SELECT")
      ) {
        setInputFocused(false);
      }
    };

    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  // Monitor visibility of on-page ResultHero
  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;
    const heroEl = document.querySelector("[data-result-hero]");
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroVisible(entry.isIntersecting && entry.intersectionRatio > 0.4);
      },
      { threshold: [0, 0.4, 1.0] }
    );

    observer.observe(heroEl);
    return () => observer.disconnect();
  }, []);

  const isHidden = inputFocused || heroVisible;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 lg:hidden",
        "border-t border-border bg-card/95 text-card-foreground backdrop-blur-xl",
        "px-4 pt-2.5 pb-[calc(env(safe-area-inset-bottom,0px)+0.65rem)]",
        "flex items-center justify-between shadow-lg",
        "transition-transform duration-200 ease-out",
        isHidden ? "translate-y-full pointer-events-none" : "translate-y-0"
      )}
      aria-hidden={isHidden}
    >
      <div>
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <p className={cn("text-lg font-extrabold tabular-nums", COLOR_TEXT[color] || "text-foreground")}>
          {prefix && !formatCompact(animatedValue).startsWith(prefix) ? prefix : ""}
          {formatCompact(animatedValue)}
        </p>
      </div>

      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/60 text-[11px] font-medium text-muted-foreground">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Real-time</span>
      </div>
    </div>
  );
}
