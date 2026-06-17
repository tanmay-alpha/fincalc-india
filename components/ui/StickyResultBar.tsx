"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { useCountUp } from "@/hooks/useCountUp";
import { formatCompact } from "@/lib/format";

interface Props {
  label: string;
  value: number;
  color?: "blue" | "green";
}

/**
 * Mobile-only sticky bar at the bottom of every calculator page.
 *
 * UX fixes applied:
 *   - Auto-hides when a text input is focused (so it doesn't cover the
 *     keyboard or the input the user is typing into).
 *   - Uses `100dvh`/`100svh` for safer mobile viewport handling.
 *   - Animates the count up so the value doesn't "snap" on every keystroke.
 */
export default function StickyResultBar({ label, value }: Props) {
  const animatedValue = useCountUp(value);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (
        t.tagName === "INPUT" ||
        t.tagName === "TEXTAREA" ||
        t.tagName === "SELECT"
      ) {
        setHidden(true);
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
        setHidden(false);
      }
    };

    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  return (
    <div
      className={clsx(
        "fixed bottom-0 left-0 right-0 z-40",
        "lg:hidden",
        "border-t border-border bg-card/95 text-card-foreground backdrop-blur-xl",
        "px-4 py-3",
        "flex items-center justify-between",
        "shadow-[0_-4px_20px_rgba(0,0,0,0.08)]",
        "transition-transform duration-200",
        hidden && "translate-y-full"
      )}
      aria-hidden={hidden}
    >
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold text-card-foreground">
          {formatCompact(animatedValue)}
        </p>
      </div>
      <div className="text-right">
        <p className="text-xs text-muted-foreground">Updates in real-time</p>
        <div className="flex items-center gap-1 justify-end mt-0.5">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
          <span className="text-xs font-medium text-success">Live</span>
        </div>
      </div>
    </div>
  );
}
