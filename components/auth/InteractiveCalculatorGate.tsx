"use client";

import { useSession } from "next-auth/react";
import type { ReactNode } from "react";

interface InteractiveCalculatorGateProps {
  children: ReactNode;
  calcName?: string;
}

/**
 * Validates that a callback destination is a safe relative internal URL.
 * Kept as a shared utility for sign-in entry points even though calculators
 * themselves are now publicly interactive.
 */
export function getSafeCallbackUrl(
  pathname?: string | null,
  searchParams?: string | URLSearchParams | null,
  fallback = "/calculators"
): string {
  if (typeof pathname !== "string" || !pathname.trim()) {
    return fallback;
  }
  const cleanPath = pathname.trim();

  if (
    !cleanPath.startsWith("/") ||
    cleanPath.startsWith("//") ||
    cleanPath.includes("\\") ||
    /^[a-z0-9+.-]+:/i.test(cleanPath)
  ) {
    return fallback;
  }

  let queryString = "";
  if (typeof searchParams === "string") {
    const trimmed = searchParams.trim().replace(/^\?/, "");
    if (trimmed) {
      if (trimmed.includes("\\") || trimmed.includes("//") || /^[a-z0-9+.-]+:/i.test(trimmed)) {
        return fallback;
      }
      queryString = `?${trimmed}`;
    }
  } else if (searchParams && typeof searchParams.toString === "function") {
    const str = searchParams.toString();
    if (str) {
      if (str.includes("\\") || str.includes("//") || /^[a-z0-9+.-]+:/i.test(str)) {
        return fallback;
      }
      queryString = `?${str}`;
    }
  }

  const combined = `${cleanPath}${queryString}`;
  if (
    !combined.startsWith("/") ||
    combined.startsWith("//") ||
    combined.includes("\\") ||
    /^[a-z0-9+.-]+:/i.test(combined)
  ) {
    return fallback;
  }

  return combined;
}

/**
 * Public calculator surface.
 *
 * Calculator math and inputs are intentionally available to guests. Session
 * state is exposed only as metadata so account-aware child actions can decide
 * whether to offer persistence/history/share capabilities.
 */
export default function InteractiveCalculatorGate({
  children,
}: InteractiveCalculatorGateProps) {
  const { status } = useSession();
  const authState =
    status === "authenticated"
      ? "authenticated"
      : status === "loading"
        ? "loading"
        : "guest";

  return (
    <div
      data-testid="interactive-calculator-surface"
      data-auth-state={authState}
    >
      {children}
    </div>
  );
}
