"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  ShieldCheck,
  Calculator,
  Lock,
  Scale,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { getSafeCallbackUrl } from "@/lib/url";

function getErrorMessage(errorCode: string | null): string | null {
  if (!errorCode) return null;
  switch (errorCode) {
    case "OAuthSignin":
      return "Could not initialize Google sign-in. Please check your network and try again.";
    case "OAuthCallbackError":
      return "Google authentication was cancelled or interrupted. Please try again.";
    case "OAuthCreateAccount":
      return "Could not complete account setup. Please try again.";
    case "OAuthAccountNotLinked":
      return "An account is already linked with this email address.";
    case "SessionRequired":
      return "Your previous session has expired. Please sign in again to access your calculations.";
    case "AccessDenied":
      return "Access was denied. Please allow permissions to continue.";
    case "Verification":
      return "The sign-in link is no longer valid. Please try again.";
    default:
      return "Unable to complete sign-in at this moment. Please try again.";
  }
}

function LoginForm() {
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams.get("callbackUrl");
  const errorCode = searchParams.get("error");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const safeCallbackUrl = getSafeCallbackUrl(rawCallbackUrl, null, "/");
  const errorMessage = getErrorMessage(errorCode);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signIn("google", { callbackUrl: safeCallbackUrl });
    } catch {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Main Authentication Card */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm transition-all">
        {/* Brand Icon & Heading */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl mx-auto border border-primary/20 shadow-2xs">
            ₹
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Your financial workspace, built for India.
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Sign in securely to access your private financial workspace and keep
            your calculations connected to your account.
          </p>
        </div>

        {/* Error Alert with Retry */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-5 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs space-y-2 animate-in fade-in-50"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-destructive" />
              <p className="leading-snug">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="inline-flex items-center gap-1.5 font-semibold text-destructive hover:underline pt-1 text-[11px]"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry Google Sign-In</span>
            </button>
          </div>
        )}

        {/* Primary Call to Action: Continue with Google */}
        <div className="space-y-3">
          <button
            type="button"
            id="google-login-button"
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="w-full relative flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-border bg-background hover:bg-muted text-foreground font-medium text-sm transition-all shadow-2xs hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60 disabled:cursor-not-allowed group"
            aria-label="Continue with Google"
          >
            {isSigningIn ? (
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            ) : (
              <svg
                className="w-4 h-4 shrink-0"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span className="font-semibold text-sm">
              {isSigningIn ? "Connecting to Google…" : "Continue with Google"}
            </span>
          </button>

          <p className="text-[11px] text-center text-muted-foreground">
            New users are registered automatically. No separate sign-up form.
          </p>
        </div>

        {/* Legal Acknowledgment */}
        <div className="mt-5 pt-4 border-t border-border/60 text-center">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            By continuing, you agree to the{" "}
            <Link
              href="/terms"
              className="text-primary hover:underline font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
            >
              Terms of Service
            </Link>{" "}
            and acknowledge the{" "}
            <Link
              href="/privacy"
              className="text-primary hover:underline font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Concise Trust Pillars */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-center sm:flex-col sm:text-center gap-2.5 sm:gap-1.5 p-3 rounded-xl bg-card/60 border border-border/60">
          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Calculator className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">31 Calculators</p>
            <p className="text-[10px] text-muted-foreground">
              Tax, compounding, debt & valuation
            </p>
          </div>
        </div>

        <div className="flex items-center sm:flex-col sm:text-center gap-2.5 sm:gap-1.5 p-3 rounded-xl bg-card/60 border border-border/60">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Private Workspace</p>
            <p className="text-[10px] text-muted-foreground">
              Calculations tied to your account
            </p>
          </div>
        </div>

        <div className="flex items-center sm:flex-col sm:text-center gap-2.5 sm:gap-1.5 p-3 rounded-xl bg-card/60 border border-border/60">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Scale className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Tax Year 2026–27</p>
            <p className="text-[10px] text-muted-foreground">
              Income-tax Act, 2025 ready
            </p>
          </div>
        </div>
      </div>

      {/* Trust Guarantee */}
      <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
        <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
        <span>We only request basic profile identity. No access to Gmail or Drive.</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main
      id="main-content"
      className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12"
    >
      <Suspense
        fallback={
          <div className="w-full max-w-md mx-auto h-96 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
