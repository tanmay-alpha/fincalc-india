import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppLayoutShell from "@/components/layout/AppLayoutShell";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fincalc-india.vercel.app"),
  title: {
    template: "%s | FinCalc India",
    default: "FinCalc India — Financial Workspace for Indian Investors",
  },
  description:
    "Private financial workspace with 31 verified calculators for Indian statutory tax, compounding wealth, debt amortization, derivatives, and business valuation. Updated for Tax Year 2026–27.",
  keywords: [
    "financial workspace India",
    "SIP calculator India",
    "EMI calculator",
    "FD calculator India",
    "PPF calculator",
    "income tax calculator India 2026-27",
    "income tax Tax Year 2026-27",
    "Tax Year 2026-27 calculator",
    "financial modeling suite India",
    "mutual fund calculator",
    "loan calculator India",
  ],
  openGraph: {
    title: "FinCalc India — Financial Workspace",
    description:
      "Your private financial workspace built for India. 31 calculators covering tax law, investments, loan schedules, and valuation.",
    url: "https://fincalc-india.vercel.app",
    siteName: "FinCalc India",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FinCalc India — Financial Workspace",
    description:
      "Private financial workspace with 31 verified calculators for Indian tax, investments, loans, and corporate valuation.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:text-sm focus:font-medium"
        >
          Skip to main content
        </a>
        <AuthProvider>
          <ThemeProvider>
            <AppLayoutShell>{children}</AppLayoutShell>
            <Toaster position="bottom-right" richColors closeButton />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
