"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  BadgeIndianRupee,
  Building2,
  ChevronDown,
  Coins,
  FileText,
  Globe,
  History,
  LineChart,
  LogOut,
  Menu,
  Moon,
  Scale,
  Sun,
  TrendingUp,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const CALCULATOR_CATEGORIES = [
  {
    name: "Investments & Wealth",
    icon: TrendingUp,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
    items: [
      { href: "/sip", label: "SIP Calculator", desc: "Monthly mutual fund growth" },
      { href: "/step-up-sip", label: "Step-Up & Goal SIP", desc: "Annual increments & target goals" },
      { href: "/lumpsum", label: "Lumpsum Calculator", desc: "One-time investment compounding" },
      { href: "/fd", label: "Fixed Deposit (FD)", desc: "Quarterly compounding & yield" },
      { href: "/ppf", label: "PPF Calculator", desc: "15-year tax-free maturity" },
      { href: "/fire", label: "FIRE Calculator", desc: "Early retirement corpus & SWR" },
      { href: "/xirr-cagr-twrr", label: "XIRR / CAGR / TWRR", desc: "Portfolio returns & irregular cashflows" },
    ],
  },
  {
    name: "Tax & Compliance (2026-27)",
    icon: FileText,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/40",
    items: [
      { href: "/tax", label: "Income Tax (Old vs New)", desc: "Tax Year 2026-27 slabs & Sec 156" },
      { href: "/capital-gains-tax", label: "Capital Gains Tax", desc: "12.5% LTCG, ₹1.25L exemption, real estate" },
      { href: "/hra-exemption", label: "HRA & Rent Optimizer", desc: "Section 10(13A) & parent rent" },
      { href: "/presumptive-tax", label: "Presumptive Tax (44AD/ADA)", desc: "Freelancers, CAs, doctors & business" },
      { href: "/section-54-exemption", label: "Section 54 / 54EC / 54F", desc: "Property sale capital gain exemption" },
      { href: "/marginal-relief", label: "Marginal Relief & Surcharge", desc: "High income surcharge relief" },
      { href: "/lrs-tcs", label: "LRS TCS Remittance", desc: "Section 394 foreign remittance tax" },
    ],
  },
  {
    name: "Trading & Derivatives",
    icon: LineChart,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/40",
    items: [
      { href: "/fno-brokerage", label: "F&O Brokerage & Breakeven", desc: "Updated STT & itemized charges" },
      { href: "/option-payoff", label: "Option Strategy Visualizer", desc: "Multi-leg expiry payoff curves" },
      { href: "/black-scholes", label: "Black-Scholes & Greeks", desc: "Theoretical pricing & Option Greeks" },
      { href: "/position-size", label: "Position Size & Risk", desc: "1% Risk management rule" },
      { href: "/margin-calculator", label: "SPAN Margin & MTF", desc: "SEBI peak margin & MTF interest" },
    ],
  },
  {
    name: "Loans & Real Estate",
    icon: Building2,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/40",
    items: [
      { href: "/emi", label: "Loan EMI Calculator", desc: "Amortization schedule & interest split" },
      { href: "/loan-prepayment", label: "Loan Prepayment vs Invest", desc: "Save tenure & interest" },
      { href: "/no-cost-emi", label: "No-Cost EMI Revealer", desc: "Unmask hidden 18% GST & true APR" },
      { href: "/car-loan-tco", label: "Car Loan Total Cost (TCO)", desc: "Fuel, maintenance & cost per km" },
      { href: "/balance-transfer", label: "Home Loan Balance Transfer", desc: "Refinancing savings & breakeven" },
    ],
  },
  {
    name: "Corporate & Valuation",
    icon: Scale,
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/40",
    items: [
      { href: "/dcf-valuation", label: "DCF Valuation Model", desc: "Intrinsic value & sensitivity matrix" },
      { href: "/wacc", label: "WACC Calculator", desc: "Cost of capital & tax shield" },
      { href: "/dupont-analysis", label: "DuPont ROE Analysis", desc: "3-step & 5-step decomposition" },
    ],
  },
  {
    name: "NRI & Global Wealth",
    icon: Globe,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-950/40",
    items: [
      { href: "/us-stock-tax", label: "US Stock Returns & DTAA", desc: "Section 90 FTC & currency gains" },
      { href: "/nre-nro-fcnr", label: "NRI Deposit Comparator", desc: "NRE vs NRO vs FCNR post-tax yield" },
      { href: "/nps", label: "NPS & Pension Modeler", desc: "PFRDA 2026 exit rules & 80CCD" },
      { href: "/portfolio-risk", label: "Portfolio Risk Ratios", desc: "Sharpe, Sortino, Treynor & Beta" },
    ],
  },
];

const quickLinks = [
  { href: "/tax", label: "Tax 2026-27", icon: FileText, highlight: true },
  { href: "/sip", label: "SIP", icon: TrendingUp },
  { href: "/capital-gains-tax", label: "Cap Gains", icon: BadgeIndianRupee },
  { href: "/fno-brokerage", label: "F&O", icon: LineChart },
  { href: "/emi", label: "EMI", icon: Building2 },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const megaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-1.5 focus:outline-none">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">FinCalc</span>
              <span className="text-xl font-black tracking-tight text-blue-600">India</span>
              <span className="hidden sm:inline-block ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                FY 2026-27
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1.5" ref={megaRef}>
              {/* All Calculators Mega Menu Trigger */}
              <div className="relative">
                <button
                  onClick={() => setMegaOpen(!megaOpen)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all",
                    megaOpen
                      ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <Coins className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>All 31 Calculators</span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", megaOpen && "rotate-180")} />
                </button>

                {/* Mega Dropdown Panel */}
                {megaOpen && (
                  <div className="absolute left-0 top-full mt-2 w-[850px] max-h-[80vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Financial Calculation Directory</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">31 statutory calculators conforming to Finance Act, 2026 & Income-tax Act, 2025</p>
                      </div>
                      <Link
                        href="/"
                        onClick={() => setMegaOpen(false)}
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View Directory Grid →
                      </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      {CALCULATOR_CATEGORIES.map((category) => (
                        <div key={category.name} className="space-y-2">
                          <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
                            <category.icon className={cn("h-4 w-4", category.color)} />
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                              {category.name}
                            </h4>
                          </div>
                          <ul className="space-y-1">
                            {category.items.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  onClick={() => setMegaOpen(false)}
                                  className={cn(
                                    "group block rounded-lg px-2.5 py-1.5 transition-colors",
                                    pathname === item.href
                                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold"
                                      : "hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"
                                  )}
                                >
                                  <div className="text-xs font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                    {item.label}
                                  </div>
                                  <div className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-1">
                                    {item.desc}
                                  </div>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick direct links */}
              {quickLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold"
                        : link.highlight
                          ? "text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/30"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle dark mode"
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}

            {!session ? (
              <button
                onClick={() => signIn("google")}
                className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition-all duration-150 whitespace-nowrap"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" className="shrink-0" aria-hidden="true">
                  <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in
              </button>
            ) : (
              <div className="relative group">
                <button className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  {session.user?.image && (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={24}
                      height={24}
                      className="rounded-full"
                      unoptimized
                    />
                  )}
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block max-w-[80px] truncate">
                    {session.user?.name?.split(" ")[0]}
                  </span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg z-50 py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                  <Link
                    href="/history"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <History className="h-4 w-4" />
                    My History
                  </Link>
                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            <button
              className="lg:hidden -mr-2 rounded-xl p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer with full 31-calculator categorized directory */}
      {menuOpen && (
        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-x-0 top-16 bottom-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-y-auto p-4 lg:hidden"
        >
          <div className="space-y-6 pb-20">
            {CALCULATOR_CATEGORIES.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center gap-2 px-2 py-1 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <category.icon className={cn("h-4 w-4", category.color)} />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    {category.name}
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pl-2">
                  {category.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                          "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                        )}
                      >
                        <span>{item.label}</span>
                        <span className="text-[10px] text-slate-600 dark:text-slate-400">{item.desc}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {!session?.user && (
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  signIn("google");
                }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-3 text-sm font-semibold text-white"
              >
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
