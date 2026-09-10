"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface AppLayoutShellProps {
  children: React.ReactNode;
}

export default function AppLayoutShell({ children }: AppLayoutShellProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isPublicPage =
    pathname === "/login" || pathname === "/privacy" || pathname === "/terms";

  if (isPublicPage) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-foreground transition-colors">
        {/* Minimal Public Navigation Bar */}
        <header className="w-full border-b border-border/70 bg-background/80 backdrop-blur-md sticky top-0 z-30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
              aria-label="FinCalc India Home"
            >
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
                ₹
              </div>
              <span className="font-bold text-sm tracking-tight text-foreground">
                FinCalc <span className="text-primary font-extrabold">India</span>
              </span>
            </Link>

            <div className="flex items-center gap-3">
              {pathname !== "/login" && (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              )}

              {mounted ? (
                <button
                  type="button"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                >
                  {theme === "dark" ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-600" />
                  )}
                </button>
              ) : (
                <div className="w-7 h-7" aria-hidden="true" />
              )}
            </div>
          </div>
        </header>

        {/* Public Content */}
        <div className="flex-1 flex flex-col">{children}</div>

        {/* Minimal Public Footer */}
        <footer className="border-t border-border/60 bg-background/60 py-6 text-xs text-muted-foreground">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <p>
              © {new Date().getFullYear()} FinCalc India. Educational &
              estimation tools for Indian financial calculations.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/terms"
                className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
              >
                Terms of Service
              </Link>
              <span aria-hidden="true">·</span>
              <Link
                href="/privacy"
                className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
