"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "next-themes";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  TrendingUp, Building2, Lock, Landmark, Coins, FileText,
  Sun, Moon, Menu, X, Home, LogIn, LogOut, User, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/sip", label: "SIP", icon: TrendingUp },
  { href: "/emi", label: "EMI", icon: Building2 },
  { href: "/fd", label: "FD", icon: Lock },
  { href: "/ppf", label: "PPF", icon: Landmark },
  { href: "/lumpsum", label: "Lumpsum", icon: Coins },
  { href: "/tax", label: "Tax", icon: FileText },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-bold text-lg text-slate-900 dark:text-white">
              FinCalc<span className="text-blue-600"> India</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center h-full gap-6">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative flex items-center gap-1.5 h-full text-sm transition-colors",
                    isActive
                      ? "text-blue-600 font-medium"
                      : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                  )}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              <Sun className="w-4 h-4 hidden dark:block" />
              <Moon className="w-4 h-4 block dark:hidden" />
            </button>

            {/* Auth section */}
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            ) : session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-full ring-2 ring-transparent hover:ring-blue-100 dark:hover:ring-blue-900 transition-all focus:outline-none"
                  aria-label="User menu"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-sm">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>

                {/* Profile dropdown */}
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-[var(--shadow-hover)] border border-slate-200 dark:border-slate-700 z-50 overflow-hidden text-sm">
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {session.user.email}
                        </p>
                      </div>
                      <Link
                        href="/history"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        Dashboard
                      </Link>
                      <Link
                        href="/history?tab=saved"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700"
                      >
                        <Clock className="w-4 h-4 text-blue-600" />
                        Saved Calculations
                      </Link>
                      <button
                        onClick={() => { setProfileOpen(false); signOut(); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="hidden sm:flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <LogIn className="w-4 h-4 text-slate-400" />
                Sign In
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 -mr-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer (slide from top) */}
      <div
        className={cn(
          "md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl transition-all duration-300 overflow-hidden",
          menuOpen ? "max-h-[500px] border-b" : "max-h-0 border-transparent border-b-0"
        )}
      >
        <nav className="p-4 space-y-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <link.icon className={cn("w-5 h-5", isActive ? "text-blue-600" : "text-slate-400")} />
                {link.label}
              </Link>
            );
          })}

          {!session?.user && (
            <button
              onClick={() => { setMenuOpen(false); signIn("google"); }}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium rounded-xl"
            >
              <LogIn className="w-4 h-4" />
              Sign In with Google
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
