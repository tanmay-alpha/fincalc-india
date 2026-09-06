"use client";

import { useSession, signIn } from "next-auth/react";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import GoogleIcon from "@/components/ui/GoogleIcon";
import { Lock, BookmarkCheck, Share2, Sparkles } from "lucide-react";

interface InteractiveCalculatorGateProps {
  children: ReactNode;
  calcName?: string;
  category?: string;
}

/**
 * Validates that callback destination is a safe relative internal URL to prevent open-redirect attacks.
 */
export function getSafeCallbackUrl(
  pathname?: string | null,
  fallback = "/calculators"
): string {
  if (typeof pathname !== "string") {
    return fallback;
  }
  const trimmed = pathname.trim();
  if (
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.includes("\\") ||
    /^[a-z0-9+.-]+:/i.test(trimmed)
  ) {
    return fallback;
  }
  return trimmed;
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

  if (status === "authenticated") {
    return <div data-auth-state="authenticated">{children}</div>;
  }

  const safeCallback = getSafeCallbackUrl(pathname || "/");

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

        <div className="pt-2 pb-1">
          <button
            type="button"
            onClick={handleSignIn}
            data-testid="gate-signin-btn"
            className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <GoogleIcon size={18} />
            <span>Continue with Google</span>
          </button>
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
            <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <span>Instant calculations, no ads</span>
          </div>
        </div>
      </div>
    </div>
  );
}
