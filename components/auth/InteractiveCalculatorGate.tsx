"use client";

import { useSession, signIn } from "next-auth/react";
import { ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import GoogleSignInButton from "@/components/ui/GoogleSignInButton";
import { Lock, BookmarkCheck, Share2, ShieldCheck } from "lucide-react";

interface InteractiveCalculatorGateProps {
  children: ReactNode;
  calcName?: string;
}

/**
 * Validates that callback destination is a safe relative internal URL to prevent open-redirect attacks.
 * Preserves safe search params (e.g. /tax?regime=new) without allowing protocol-relative or backslash escape attacks.
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

  // Path must begin with exactly one '/' and not '//', and contain no backslashes or protocol escapes
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

  // Double check combined URL safety
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
 * InteractiveCalculatorGate
 *
 * An intentional, high-contrast inline card that gates interactive calculator controls.
 * Authenticated: renders children with full functionality.
 * Unauthenticated: renders a clean, accessible sign-in CTA with clear explanation of benefits.
 */
export default function InteractiveCalculatorGate({
  children,
  calcName = "Calculator",
}: InteractiveCalculatorGateProps) {
  const { status } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (status === "authenticated") {
    return <div data-auth-state="authenticated">{children}</div>;
  }

  const safeCallback = getSafeCallbackUrl(pathname || "/", searchParams);

  const handleSignIn = () => {
    signIn("google", { callbackUrl: safeCallback });
  };

  return (
    <div
      data-testid="interactive-auth-gate"
      className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm transition-all"
    >
      <div className="max-w-xl mx-auto text-center space-y-5">
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary mx-auto flex items-center justify-center shadow-xs">
          <Lock className="w-6 h-6" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Sign in to use {calcName}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Run calculations, save personalized scenarios, and generate shareable links. Free with your Google account.
          </p>
        </div>

        <div className="pt-2 pb-1 flex justify-center">
          <GoogleSignInButton
            onClick={handleSignIn}
            testId="gate-signin-btn"
            text="Continue with Google"
            size="lg"
            className="w-full sm:w-auto"
          />
        </div>

        {/* Quiet, factual benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border/60 text-left text-xs text-muted-foreground">
          <div className="flex items-start gap-2">
            <BookmarkCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <span>Save scenarios to your workspace</span>
          </div>
          <div className="flex items-start gap-2">
            <Share2 className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <span>Generate secure share links</span>
          </div>
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <span>Visible statutory assumptions</span>
          </div>
        </div>
      </div>
    </div>
  );
}
