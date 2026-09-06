"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const DISMISS_KEY = "fincalc-auth-prompt-dismissed";

/** Google "G" SVG logo (official colours) */
function GoogleLogo({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

interface AuthPromptOverlayProps {
  /** Optional contextual copy: e.g., "Save and recalculate" */
  context?: string;
}

/**
 * AuthPromptOverlay — a non-blocking fixed bottom banner.
 *
 * Shows only when the user is unauthenticated.
 * Dismissable per session (stored in sessionStorage).
 * Does NOT block or blur the page.
 */
export default function AuthPromptOverlay({ context }: AuthPromptOverlayProps) {
  const { status } = useSession();
  const [dismissed, setDismissed] = useState(true); // start hidden to prevent flash
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const wasDismissed = sessionStorage.getItem(DISMISS_KEY) === "1";
    setDismissed(wasDismissed);
  }, []);

  if (!mounted || status !== "unauthenticated" || dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  const handleSignIn = () => {
    signIn("google");
  };

  const promptText = context ?? "Sign in to calculate, save, and share your results";

  return (
    <div
      role="banner"
      aria-label="Sign in prompt"
      className="fixed bottom-0 inset-x-0 z-50 border-t border-border/80 bg-card/95 backdrop-blur-sm shadow-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: message */}
        <p className="text-sm text-muted-foreground hidden sm:block truncate">
          {promptText}
        </p>
        <p className="text-sm text-muted-foreground sm:hidden truncate text-center flex-1">
          Sign in to calculate
        </p>

        {/* Right: CTA + dismiss */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSignIn}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-white dark:bg-slate-800 text-sm font-semibold text-foreground hover:bg-muted/60 transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <GoogleLogo size={16} />
            <span className="hidden xs:inline">Sign in with Google</span>
            <span className="xs:hidden">Sign in</span>
          </button>

          <button
            onClick={handleDismiss}
            aria-label="Dismiss sign in prompt"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
