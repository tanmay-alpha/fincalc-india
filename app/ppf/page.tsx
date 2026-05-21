
import Link from "next/link";
import PPFCalculator from "@/components/calculators/ppf/PPFCalculator";
import PPFInfo from "@/components/seo/PPFInfo";

export const metadata = {
  title: 'PPF Calculator',
  description: 'Calculate PPF (Public Provident Fund) corpus over 15 to 50 years. See year-by-year tax-free growth at 7.1% interest rate.',
  openGraph: {
    title: 'PPF Calculator — FinCalc India',
    description: 'Free PPF calculator with withdrawal eligibility and tax-free corpus projection.',
  }
}

export default function PPFPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 pb-24 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <nav className="text-sm text-slate-400 mb-3 flex items-center gap-1.5">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>›</span>
            <span className="text-slate-600 dark:text-slate-300">PPF Calculator</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">PPF Calculator</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-2xl">
            Plan tax-free PPF maturity across the lock-in period and optional extensions. See yearly breakdown of contributions and interest.
          </p>
        </div>
        <PPFCalculator />
        <PPFInfo />
      </div>
    </main>
  );
}
