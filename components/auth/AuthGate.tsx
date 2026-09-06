"use client";

import { useSession, signIn } from "next-auth/react";
import { ReactNode } from "react";
import AuthPromptOverlay from "./AuthPromptOverlay";

interface AuthGateProps {
  /** Content to render when authenticated */
  children: ReactNode;
  /**
   * Fallback UI to show when the auth overlay is active.
   * When not provided, children are rendered with pointer-events disabled.
   */
  fallback?: ReactNode;
  /**
   * Optional context string shown in the overlay prompt
   * e.g. "Sign in to start calculating" vs "Sign in to save results"
   */
  promptContext?: string;
}

/**
 * AuthGate — wraps interactive calculator controls.
 *
 * Behaviour:
 * - authenticated: renders children normally, no overlay
 * - loading:       renders children at reduced opacity (no skeleton flash)
 * - unauthenticated: renders children with pointer-events blocked +
 *                    aria-disabled wrapper + AuthPromptOverlay banner
 *
 * SSR: The component renders children on every path so server-rendered
 * default values are always visible to users and search crawlers.
 */
export default function AuthGate({
  children,
  promptContext,
}: AuthGateProps) {
  const { status } = useSession();

  if (status === "authenticated") {
    return <>{children}</>;
  }

  if (status === "loading") {
    return (
      <div className="transition-opacity duration-150 opacity-70 pointer-events-none select-none">
        {children}
      </div>
    );
  }

  // Unauthenticated — render inputs as visually present but interaction-blocked
  return (
    <>
      <div
        className="relative"
        aria-disabled="true"
        role="group"
        aria-label="Sign in required to interact with calculator inputs"
      >
        {/* Transparent interaction blocker over the inputs */}
        <div
          className="absolute inset-0 z-10 cursor-not-allowed"
          onClick={() => signIn("google")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") signIn("google");
          }}
          role="button"
          tabIndex={0}
          aria-label="Sign in with Google to use calculator"
          title="Sign in to calculate"
        />
        {/* Inputs rendered underneath — visible but not interactive */}
        <div className="pointer-events-none select-none opacity-60">
          {children}
        </div>
      </div>
      <AuthPromptOverlay context={promptContext} />
    </>
  );
}
