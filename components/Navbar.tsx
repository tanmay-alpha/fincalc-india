"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  Building2,
  Coins,
  FileText,
  History,
  Home,
  Landmark,
  Lock,
  LogOut,
  Menu,
  Moon,
  Sun,
  TrendingUp,
  X,
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

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" className="shrink-0" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { data: session } = useSession();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-full items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">
              FinCalc<span className="text-primary"> India</span>
            </span>
          </Link>

          <nav className="hidden h-full items-center gap-6 md:flex">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative flex h-full items-center gap-1.5 text-sm transition-colors",
                    isActive
                      ? "font-medium text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Toggle theme"
            >
              {mounted && resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {!session ? (
              <button
                onClick={() => signIn("google")}
                className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-all duration-150 hover:border-primary/30 hover:bg-muted hover:shadow-soft"
              >
                <GoogleIcon />
                Sign in
              </button>
            ) : (
              <div className="relative group">
                <button className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 transition-colors hover:bg-muted">
                  {session.user?.image && (
                    <Image
                      src={session.user.image}
                      alt="avatar"
                      width={24}
                      height={24}
                      className="rounded-full"
                      unoptimized
                    />
                  )}
                  <span className="hidden max-w-[80px] truncate text-sm font-medium text-card-foreground sm:block">
                    {session.user?.name?.split(" ")[0]}
                  </span>
                </button>
                <div className="invisible absolute right-0 top-full z-50 mt-2 w-44 rounded-xl border border-border bg-popover py-1.5 text-popover-foreground opacity-0 shadow-card transition-all duration-150 group-hover:visible group-hover:opacity-100">
                  <Link
                    href="/history"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <History className="h-4 w-4" />
                    My History
                  </Link>
                  <div className="my-1 border-t border-border" />
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}

            <button
              className="md:hidden -mr-2 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="absolute left-0 right-0 top-16 z-40 border-b border-border bg-popover text-popover-foreground shadow-card md:hidden">
          <nav className="space-y-1 p-4">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <link.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                  {link.label}
                </Link>
              );
            })}

            {!session?.user && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  signIn("google");
                }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
              >
                <GoogleIcon />
                Sign in with Google
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
