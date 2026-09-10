"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { formatCompact } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: number;
  prefix?: string;
  color?: "blue" | "green" | "red";
  formatValue?: (val: number) => string;
}

/**
 * Mobile-only floating dock for calculator results.
 *
 * UX enhancements:
 * - Hidden at the top of the page (scrollY <= 220) to prevent initial visual clutter.
 * - Smoothly hides when on-page ResultHero is visible to eliminate duplicate numbers.
 * - Auto-hides when form inputs are focused to prevent keyboard occlusion.
 * - User-dismissable (X button) to allow completely unobstructed inspection of tables & charts.
 * - Non-intrusive floating island style instead of an edge-to-edge block.
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
  formatValue,
}: Props) {
  const animatedValue = useCountUp(value);
  const [inputFocused, setInputFocused] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [scrolledPastHeader, setScrolledPastHeader] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Monitor scroll position to avoid showing at the very top of the page
  useEffect(() => {
    const handleScroll = () => {
      setScrolledPastHeader(window.scrollY > 220);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Monitor input focus to prevent keyboard occlusion
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

  // Monitor visibility of actual on-page ResultHero card
  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;
    const heroEl =
      document.querySelector("[data-result-hero-card]") ||
      document.querySelector("[data-result-hero]");
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroVisible(entry.isIntersecting && entry.intersectionRatio > 0.05);
      },
      { threshold: [0, 0.05, 0.2] }
    );

    observer.observe(heroEl);
    return () => observer.disconnect();
  }, []);

  const isHidden = !scrolledPastHeader || inputFocused || heroVisible || isDismissed;

  const rawDisplayValue = formatValue
    ? formatValue(animatedValue)
    : formatCompact(animatedValue);
  const cleanPrefix = prefix && !rawDisplayValue.startsWith(prefix) ? prefix : "";

  return (
    <div className="fixed bottom-3.5 inset-x-0 z-40 px-3 pointer-events-none lg:hidden">
      {/* Floating Island Result Bar */}
      <div
        className={cn(
          "pointer-events-auto mx-auto max-w-sm sm:max-w-md",
          "rounded-2xl border border-border/80 bg-card/95 text-card-foreground backdrop-blur-xl shadow-xl",
          "px-4 py-2.5 flex items-center justify-between gap-3",
          "transition-all duration-300 ease-out",
          isHidden
            ? "translate-y-16 opacity-0 pointer-events-none scale-95"
            : "translate-y-0 opacity-100 scale-100"
        )}
        aria-hidden={isHidden}
      >
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
            {label}
          </p>
          <p
            className={cn(
              "text-base font-extrabold tabular-nums truncate",
              COLOR_TEXT[color] || "text-foreground"
            )}
          >
            {cleanPrefix}
            {rawDisplayValue}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live</span>
          </div>

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            aria-label="Dismiss sticky result bar"
            title="Dismiss bar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Floating reopen pill if user dismissed bar while scrolling detailed content */}
      {isDismissed && scrolledPastHeader && !heroVisible && (
        <div className="pointer-events-auto mx-auto w-fit mt-1 animate-fade-in">
          <button
            type="button"
            onClick={() => setIsDismissed(false)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/80 bg-card/90 text-foreground backdrop-blur-md shadow-md text-xs font-semibold hover:bg-muted transition-all"
            aria-label="Show result summary"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>
              {label}: {cleanPrefix}
              {rawDisplayValue}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
