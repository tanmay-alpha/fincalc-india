import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, UserCheck, Database, Share2, Trash2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How FinCalc India collects, uses, stores, and protects your data during Google authentication and calculation workflows.",
};

export default function PrivacyPage() {
  return (
    <main
      id="main-content"
      className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8"
    >
      <div className="space-y-2 border-b border-border/70 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Last updated: September 2026 · Truthful disclosure of real application behavior
        </p>
      </div>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-primary" />
          <h2 className="text-base font-semibold text-foreground">
            1. Information We Collect via Google Authentication
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          FinCalc India uses Google OAuth exclusively for secure identity verification.
          When you authenticate with Google, we receive only:
        </p>
        <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-1 pl-2">
          <li>Your full name and display name</li>
          <li>Your primary email address</li>
          <li>Your Google profile picture (avatar)</li>
        </ul>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          We do <strong>not</strong> request, access, read, or store access to your Gmail
          inbox, Google Drive, Google Contacts, or any other Google account services.
        </p>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-primary" />
          <h2 className="text-base font-semibold text-foreground">
            2. Saved Financial Calculations & History
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          When you model financial calculations (e.g. SIP, EMI, Income Tax, Valuation),
          your calculation inputs and mathematical outputs are stored in our secure database
          and associated with your authenticated account ID.
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          This data allows you to view your calculation history, retrieve prior models across
          sessions, and maintain continuity within your workspace. We do not sell, rent, or
          monetize your financial calculation data to third-party advertisers or brokers.
        </p>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-primary" />
          <h2 className="text-base font-semibold text-foreground">
            3. Calculation Sharing & Privacy
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Calculations are private to your account by default. If you choose to publish a share
          link for a calculation, a unique cryptographically random token is generated.
          Shared results only expose the calculation parameters and outputs; your user identity,
          email, and account ID are never exposed on shared result pages.
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Under our authentication-first architecture, viewing a shared result requires signing
          in to FinCalc India. You can revoke or rotate share links at any time from your history,
          which immediately disables access to that link.
        </p>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <h2 className="text-base font-semibold text-foreground">
            4. Session Security & Cookies
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          We use server-side database sessions managed via NextAuth. Session tokens are stored in
          HTTP-only, secure cookies to maintain your login state. These tokens are encrypted,
          cannot be read by client-side JavaScript, and can be invalidated immediately upon sign-out.
        </p>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-primary" />
          <h2 className="text-base font-semibold text-foreground">
            5. Data Retention & Account Deletion
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Your calculation data is retained as long as your account remains active.
          You have full rights to request complete deletion of your data under applicable data
          protection principles.
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          The application implements a programmatic deletion endpoint (<code>DELETE /api/account</code>)
          that cascades to permanently delete your user record, OAuth tokens, and all associated
          saved calculations from our database.
        </p>
      </section>

      <div className="pt-6 border-t border-border/70 flex items-center justify-between">
        <Link
          href="/login"
          className="text-xs font-semibold text-primary hover:underline"
        >
          ← Return to Sign In
        </Link>
        <Link
          href="/terms"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          View Terms of Service →
        </Link>
      </div>
    </main>
  );
}
