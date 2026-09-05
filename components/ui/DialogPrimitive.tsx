"use client";

import React, { useEffect, useRef, useId, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface DialogPrimitiveProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  role?: "dialog" | "alertdialog";
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  closeOnBackdropClick?: boolean;
  className?: string;
  overlayClassName?: string;
  titleId?: string;
  descriptionId?: string;
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]):not([aria-hidden="true"]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function DialogPrimitive({
  isOpen,
  onClose,
  title,
  description,
  children,
  role = "dialog",
  initialFocusRef,
  closeOnBackdropClick = true,
  className,
  overlayClassName,
  titleId: customTitleId,
  descriptionId: customDescriptionId,
}: DialogPrimitiveProps) {
  const generatedId = useId();
  const titleId = customTitleId || `dialog-title-${generatedId}`;
  const descriptionId = customDescriptionId || (description ? `dialog-desc-${generatedId}` : undefined);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  // 1. Capture opener and lock body scroll on open; restore on close
  useEffect(() => {
    if (isOpen) {
      openerRef.current = document.activeElement as HTMLElement | null;
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = prevOverflow;
        // Restore focus to exact opener
        if (openerRef.current && typeof openerRef.current.focus === "function") {
          openerRef.current.focus();
        }
      };
    }
  }, [isOpen]);

  // 2. Initial focus inside modal
  useEffect(() => {
    if (!isOpen) return;

    const timer = requestAnimationFrame(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
        return;
      }

      if (containerRef.current) {
        const focusables = containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusables.length > 0) {
          focusables[0].focus();
        } else {
          containerRef.current.focus();
        }
      }
    });

    return () => cancelAnimationFrame(timer);
  }, [isOpen, initialFocusRef]);

  // 3. Tab trapping and Escape key
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === "Tab" && containerRef.current) {
        const focusables = Array.from(
          containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter((el) => el.offsetParent !== null || el === document.activeElement);

        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const firstEl = focusables[0];
        const lastEl = focusables[focusables.length - 1];
        const activeEl = document.activeElement;

        if (e.shiftKey) {
          if (activeEl === firstEl || !containerRef.current.contains(activeEl)) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (activeEl === lastEl || !containerRef.current.contains(activeEl)) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    },
    [onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in",
        overlayClassName
      )}
      onClick={() => {
        if (closeOnBackdropClick) {
          onClose();
        }
      }}
      onKeyDown={handleKeyDown}
      role={role}
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      tabIndex={-1}
    >
      <div
        ref={containerRef}
        className={cn(
          "w-full max-w-lg bg-card text-card-foreground border border-border rounded-2xl shadow-2xl overflow-hidden focus:outline-none animate-zoom-in-95",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <span id={titleId} className="sr-only">
          {title}
        </span>
        {description && (
          <span id={descriptionId} className="sr-only">
            {description}
          </span>
        )}
        {children}
      </div>
    </div>
  );
}
