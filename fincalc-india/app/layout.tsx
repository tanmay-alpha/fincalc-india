import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/styles/tokens.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FinCalc India — Free Financial Calculators",
    template: "%s | FinCalc India",
  },
  description:
    "Free financial calculators for every Indian — SIP, EMI, FD, PPF, Lumpsum, and Income Tax estimator. No login. No ads.",
  keywords:
    "SIP calculator, EMI calculator, FD calculator, PPF calculator, income tax calculator India, lumpsum calculator, financial calculator India",
  openGraph: {
    title: "FinCalc India — Free Financial Calculators",
    description: "Free financial calculators for every Indian investor and salaried individual.",
    type: "website",
    siteName: "FinCalc India",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-slate-900`}>
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster position="bottom-right" richColors closeButton />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
