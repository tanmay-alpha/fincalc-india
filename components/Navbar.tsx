"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  Building2,
  ChevronDown,
  FileText,
  History,
  LineChart,
  LogOut,
  Menu,
  Moon,
  Scale,
  Search,
  Sun,
  TrendingUp,
  X,
  Command,
} from "lucide-react";
import {
  CATEGORIES,
  CALCULATOR_REGISTRY,
  CalculatorCategory,
  getPopularCalculators,
} from "@/lib/registry";
import CommandSearch from "@/components/ui/CommandSearch";
import { cn } from "@/lib/utils";

const CATEGORY_ICON_MAP: Record<CalculatorCategory, typeof TrendingUp> = {
  investments: TrendingUp,
  taxation: FileText,
  loans: Building2,
  trading: LineChart,
  corporate: Scale,
};

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();

  const [mounted, setMounted] = useState(false);
  const [isCalculatorsOpen, setIsCalculatorsOpen] = useState(false);
  const [isCommandSearchOpen, setIsCommandSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CalculatorCategory>("investments");

  const calcDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsCalculatorsOpen(false);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        calcDropdownRef.current &&
        !calcDropdownRef.current.contains(e.target as Node)
      ) {
        setIsCalculatorsOpen(false);
      }
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
        setIsCalculatorsOpen(false);
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
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

  // Filter calculators by active category in mega menu
  const categoryCalculators = CALCULATOR_REGISTRY.filter(
    (c) => c.category === activeCategory
  );

  const popularCalculators = getPopularCalculators(6);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo Brand */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
              aria-label="FinCalc India Home"
            >
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
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

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
              {/* Calculators Dropdown */}
              <div ref={calcDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsCalculatorsOpen(!isCalculatorsOpen)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isCalculatorsOpen
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground/80 hover:text-foreground hover:bg-muted/60"
                  )}
                  aria-expanded={isCalculatorsOpen}
                  aria-haspopup="true"
                >
                  <span>Calculators</span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      isCalculatorsOpen && "rotate-180"
                    )}
                  />
                </button>

                {/* Calculators Mega Menu Popover */}
                {isCalculatorsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-[720px] bg-card rounded-xl border border-border shadow-xl p-4 animate-in fade-in zoom-in-95 duration-150 z-50">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Calculator Directory
                        </span>
                        <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded">
                          31 Tools
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setIsCalculatorsOpen(false);
                          setIsCommandSearchOpen(true);
                        }}
                        className="text-xs text-primary hover:underline flex items-center gap-1 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>Search all calculators</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                      {/* Category Sidebar */}
                      <div className="col-span-4 border-r border-border pr-2 space-y-1">
                        {CATEGORIES.map((cat) => {
                          const Icon = CATEGORY_ICON_MAP[cat.id] || TrendingUp;
                          const isActive = activeCategory === cat.id;

                          return (
                            <button
                              key={cat.id}
                              onClick={() => setActiveCategory(cat.id)}
                              className={cn(
                                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                isActive
                                  ? "bg-primary text-primary-foreground"
                                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <Icon className="w-3.5 h-3.5" />
                                <span>{cat.label}</span>
                              </div>
                            </button>
                          );
                        })}

                        {/* Quick View Popular Tools */}
                        <div className="pt-3 border-t border-border/60">
                          <p className="text-[11px] font-semibold text-muted-foreground px-3 mb-1">
                            Popular Tools
                          </p>
                          {popularCalculators.slice(0, 3).map((calc) => (
                            <Link
                              key={calc.id}
                              href={calc.route}
                              className="block px-3 py-1.5 text-xs text-foreground/80 hover:text-primary transition-colors truncate rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              {calc.shortName}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Calculators in selected Category */}
                      <div className="col-span-8 pl-1 max-h-[360px] overflow-y-auto pr-1">
                        <div className="grid grid-cols-2 gap-2">
                          {categoryCalculators.map((calc) => (
                            <Link
                              key={calc.id}
                              href={calc.route}
                              className="p-2.5 rounded-lg border border-transparent hover:border-border hover:bg-muted/40 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                  {calc.name}
                                </span>
                                {calc.badge && (
                                  <span className="text-[9px] uppercase font-bold tracking-wider px-1 py-0.5 bg-primary/10 text-primary rounded shrink-0 ml-1">
                                    {calc.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                                {calc.description}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct First-Layer Links */}
              <Link
                href="/tax"
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  pathname === "/tax"
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-foreground/80 hover:text-foreground hover:bg-muted/60"
                )}
              >
                Tax
              </Link>
              <Link
                href="/sip"
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  pathname === "/sip"
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-foreground/80 hover:text-foreground hover:bg-muted/60"
                )}
              >
                Investing
              </Link>
              <Link
                href="/fno-brokerage"
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  pathname === "/fno-brokerage"
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-foreground/80 hover:text-foreground hover:bg-muted/60"
                )}
              >
                Trading
              </Link>
              <Link
                href="/emi"
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  pathname === "/emi"
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-foreground/80 hover:text-foreground hover:bg-muted/60"
                )}
              >
                Loans
              </Link>
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Search Button (Cmd+K) */}
            <button
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
            {mounted && (
              <button
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
            )}

            {/* Account CTA / User Menu */}
            {status === "authenticated" && session ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="User menu"
                  aria-expanded={isUserMenuOpen}
                >
                  <div className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs">
                    {session.user?.name ? session.user.name[0].toUpperCase() : "U"}
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-card rounded-xl border border-border shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
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
                        <span>Saved Calculations</span>
                      </Link>
                      <button
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
              <button
                onClick={() => signIn("google")}
                className="hidden sm:inline-flex items-center justify-center px-3.5 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Sign In
              </button>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg lg:hidden text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Dedicated Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsMobileMenuOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          <div
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-card border-l border-border shadow-2xl p-5 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
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
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Search Action */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsCommandSearchOpen(true);
                }}
                className="w-full mt-4 flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border bg-muted/50 text-muted-foreground text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Search className="w-4 h-4" />
                <span>Search 31 calculators...</span>
              </button>

              {/* Flagship Primary Links */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  href="/tax"
                  className="p-3 rounded-lg border border-border/60 hover:border-primary/50 bg-card hover:bg-primary/5 text-xs font-semibold text-foreground flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <FileText className="w-4 h-4 text-primary" />
                  <span>Tax (2026–27)</span>
                </Link>
                <Link
                  href="/sip"
                  className="p-3 rounded-lg border border-border/60 hover:border-primary/50 bg-card hover:bg-primary/5 text-xs font-semibold text-foreground flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>SIP Calculator</span>
                </Link>
                <Link
                  href="/fno-brokerage"
                  className="p-3 rounded-lg border border-border/60 hover:border-primary/50 bg-card hover:bg-primary/5 text-xs font-semibold text-foreground flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <LineChart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>F&O Brokerage</span>
                </Link>
                <Link
                  href="/emi"
                  className="p-3 rounded-lg border border-border/60 hover:border-primary/50 bg-card hover:bg-primary/5 text-xs font-semibold text-foreground flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Building2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Loan EMI</span>
                </Link>
              </div>

              {/* Category Directory Accordion */}
              <div className="mt-6 space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Explore by Category
                </p>
                {CATEGORIES.map((cat) => {
                  const Icon = CATEGORY_ICON_MAP[cat.id] || TrendingUp;
                  const tools = CALCULATOR_REGISTRY.filter((c) => c.category === cat.id);

                  return (
                    <details key={cat.id} className="group border-b border-border/60 pb-3">
                      <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-semibold text-foreground">
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-muted-foreground group-open:text-primary" />
                          <span>{cat.label}</span>
                          <span className="text-[10px] text-muted-foreground tabular-nums">
                            ({tools.length})
                          </span>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="mt-2.5 pl-5 space-y-2">
                        {tools.map((calc) => (
                          <Link
                            key={calc.id}
                            href={calc.route}
                            className="block text-xs text-foreground/80 hover:text-primary transition-colors truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                          >
                            {calc.name}
                          </Link>
                        ))}
                      </div>
                    </details>
                  );
                })}
              </div>
            </div>

            {/* Mobile Drawer Footer with Auth & Theme */}
            <div className="pt-6 border-t border-border mt-6 space-y-3">
              {status === "authenticated" && session ? (
                <div className="flex items-center justify-between">
                  <Link
                    href="/history"
                    className="flex items-center gap-2 text-xs font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  >
                    <History className="w-4 h-4" />
                    <span>Saved Calculations</span>
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-xs text-destructive hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => signIn("google")}
                  className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-primary text-primary-foreground text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Sign In with Google
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Command Search Modal */}
      <CommandSearch
        isOpen={isCommandSearchOpen}
        onClose={() => setIsCommandSearchOpen(false)}
      />
    </>
  );
}
