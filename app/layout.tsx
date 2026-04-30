import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/styles/tokens.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://fincalc-india.vercel.app'),
  title: {
    template: '%s | FinCalc India',
    default: 'FinCalc India — Free Financial Calculators',
  },
  description: 'Free financial calculators for every Indian investor. SIP, EMI, FD, PPF, Lumpsum, and Income Tax calculators — accurate, instant, and completely free.',
  keywords: ['SIP calculator', 'EMI calculator', 'FD calculator', 'PPF calculator', 'income tax calculator India', 'financial calculator India', 'free finance calculator'],
  openGraph: {
    title: 'FinCalc India — Free Financial Calculators',
    description: 'Free SIP, EMI, FD, PPF, Lumpsum & Tax calculators. Built for Indian investors.',
    url: 'https://fincalc-india.vercel.app',
    siteName: 'FinCalc India',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinCalc India — Free Financial Calculators',
    description: 'Free SIP, EMI, FD, PPF, Tax calculators for Indian investors',
  },
  robots: {
    index: true,
    follow: true,
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
        className={cn(
          inter.className,
          "h-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased transition-colors duration-200"
        )}
      >
        <a 
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
        >
          Skip to main content
        </a>
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            <div id="main-content" className="flex-1">
              {children}
            </div>
            <Footer />
            <Toaster position="bottom-right" richColors closeButton />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
