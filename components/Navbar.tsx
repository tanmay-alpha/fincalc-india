"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { useSession, signOut } from "next-auth/react";
import {
  History,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
  X,
  Command,
  Calculator,
  Receipt,
} from "lucide-react";
import CommandSearch from "@/components/ui/CommandSearch";
import { cn } from "@/lib/utils";
import DialogPrimitive from "@/components/ui/DialogPrimitive";
import GoogleSignInButton from "@/components/ui/GoogleSignInButton";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();

  const [mounted, setMounted] = useState(false);
  const [isCommandSearchOpen, setIsCommandSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  // Click outside user menu handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut (Escape to close open menus, Cmd+K / Ctrl+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Body scroll lock on mobile drawer open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const isAuthenticated = status === "authenticated";

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-200",
          isScrolled
            ? "border-b border-border bg-card/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs"
            : "border-b border-border/60 bg-background"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
              aria-label="FinCalc India Home"
            >
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-xs group-hover:scale-105 transition-transform">
                ₹
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight text-foreground leading-tight">
                  FinCalc <span className="text-primary font-extrabold">India</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">
                  Financial Workspace
                </span>
              </div>
            </Link>

            {/* Streamlined Desktop Navigation Links (4 core items) */}
            <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
              <Link
                href="/calculators"
                className={cn(
                  "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  pathname.startsWith("/calculators")
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-foreground/80 hover:text-foreground hover:bg-muted/60"
                )}
              >
                Calculators
              </Link>

              <Link
                href="/tax"
                className={cn(
                  "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  pathname === "/tax"
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-foreground/80 hover:text-foreground hover:bg-muted/60"
                )}
              >
                Tax
              </Link>

              {isAuthenticated && (
                <Link
                  href="/history"
                  className={cn(
                    "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    pathname === "/history"
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-foreground/80 hover:text-foreground hover:bg-muted/60"
                  )}
                >
                  History
                </Link>
              )}
            </nav>
          </div>

          {/* Right Action Controls: Search, Theme, Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Search Button (Cmd+K) */}
            <button
              type="button"
              onClick={() => setIsCommandSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Search calculators (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-background text-muted-foreground rounded border border-border">
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            </button>

            {/* Theme Toggle Button */}
            {mounted ? (
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600" />
                )}
              </button>
            ) : (
              <div className="w-8 h-8 rounded-lg" aria-hidden="true" />
            )}

            {/* Account CTA / User Menu */}
            {isAuthenticated && session ? (
              <div ref={userMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="User menu"
                  aria-expanded={isUserMenuOpen}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs border border-primary/20">
                    {session.user?.name ? session.user.name[0].toUpperCase() : "U"}
                  </div>
                </button>

                {/* User Profile Popover */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-card rounded-xl border border-border shadow-lg p-2 z-50 animate-zoom-in-95">
                    <div className="px-3 py-2 border-b border-border/80">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {session.user?.name || "Investor"}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {session.user?.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/history"
                        className="flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <History className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>Calculation History</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 rounded-lg transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:inline-flex">
                <GoogleSignInButton
                  text="Sign in with Google"
                  callbackUrl="/calculators"
                  size="sm"
                />
              </div>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg md:hidden text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Streamlined Mobile Navigation Drawer */}
      <DialogPrimitive
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        title="Navigation Menu"
        overlayClassName="md:hidden justify-end p-0"
        className="w-full max-w-xs h-full max-h-screen rounded-none border-l border-r-0 border-y-0 p-5 flex flex-col justify-between overflow-y-auto animate-slide-down"
      >
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-base">
                ₹
              </div>
              <span className="font-bold text-base text-foreground">
                FinCalc India
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search Action */}
          <div className="py-4 border-b border-border/80 space-y-2">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsCommandSearchOpen(true);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/60 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search 31 calculators...</span>
            </button>

            {mounted && (
              <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-muted/40">
                <span className="text-xs font-medium text-foreground">Theme</span>
                <button
                  type="button"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-card border border-border text-foreground hover:bg-muted transition-colors"
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-slate-600" />
                      <span>Dark</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Main Links */}
          <nav className="py-4 space-y-1" aria-label="Mobile Navigation">
            <Link
              href="/calculators"
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname.startsWith("/calculators")
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <Calculator className="w-4 h-4" />
              <span>All Calculators</span>
            </Link>

            <Link
              href="/tax"
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname === "/tax"
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <Receipt className="w-4 h-4" />
              <span>Income Tax 2026-27</span>
            </Link>

            {isAuthenticated && (
              <Link
                href="/history"
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === "/history"
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <History className="w-4 h-4" />
                <span>Saved Calculations</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Drawer Footer / Account */}
        <div className="pt-4 border-t border-border">
          {isAuthenticated && session ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 px-2">
                <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs">
                  {session.user?.name ? session.user.name[0].toUpperCase() : "U"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {session.user?.name || "Investor"}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {session.user?.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => signOut()}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 rounded-lg transition-colors font-medium border border-destructive/20"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <GoogleSignInButton
              text="Sign in with Google"
              callbackUrl="/calculators"
              size="md"
              className="w-full"
            />
          )}
        </div>
      </DialogPrimitive>

      {/* Global Command Search Dialog */}
      <CommandSearch
        isOpen={isCommandSearchOpen}
        onClose={() => setIsCommandSearchOpen(false)}
      />
    </>
  );
}
