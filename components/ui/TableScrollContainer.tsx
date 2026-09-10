"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TableScrollContainerProps {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  showScrollHint?: boolean;
}

export default function TableScrollContainer({
  children,
  className,
  ariaLabel = "Scrollable data table",
  showScrollHint = true,
}: TableScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const checkScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    // Allow a 2px tolerance for fractional subpixel rendering
    const hasOverflow = scrollWidth > clientWidth + 2;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(hasOverflow && scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    checkScroll();

    // Listen to scroll events
    el.addEventListener("scroll", checkScroll, { passive: true });

    // Listen to container or window resizes
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        checkScroll();
      });
      resizeObserver.observe(el);
    }

    window.addEventListener("resize", checkScroll, { passive: true });

    return () => {
      el.removeEventListener("scroll", checkScroll);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Scrollable table container */}
      <div
        ref={containerRef}
        tabIndex={0}
        role="region"
        aria-label={ariaLabel}
        className={cn(
          "overflow-x-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/40",
          className
        )}
      >
        {children}
      </div>

      {/* Right fade gradient hint when overflow exists */}
      {showScrollHint && canScrollRight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-10 bg-gradient-to-l from-card via-card/70 to-transparent z-10 transition-opacity duration-200"
        />
      )}

      {/* Left fade gradient hint when scrolled right */}
      {showScrollHint && canScrollLeft && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-card via-card/70 to-transparent z-10 transition-opacity duration-200"
        />
      )}

      {/* Mobile-only subtle scroll helper text */}
      {showScrollHint && canScrollRight && !canScrollLeft && (
        <div
          aria-hidden="true"
          className="sm:hidden flex items-center justify-end gap-1 px-3 py-1 bg-muted/40 text-[11px] text-muted-foreground font-medium border-t border-border/40"
        >
          <span>Scroll table</span>
          <ArrowRight className="w-3 h-3 text-muted-foreground animate-pulse" />
        </div>
      )}
    </div>
  );
}
