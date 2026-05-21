
import Link from "next/link";
import FDCalculator from "@/components/calculators/fd/FDCalculator";
import FDInfo from "@/components/seo/FDInfo";

export const metadata = {
  title: 'FD Calculator',
  description: 'Calculate Fixed Deposit maturity amount with monthly, quarterly, and annual compounding. See how ₹1 lakh grows in any FD.',
  openGraph: {
    title: 'FD Calculator — FinCalc India',
    description: 'Free FD maturity calculator with compounding frequency options.',
  }
}

export default function FDPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 pb-24 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <nav className="text-sm text-slate-400 mb-3 flex items-center gap-1.5">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>›</span>
            <span className="text-slate-600 dark:text-slate-300">FD Calculator</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">FD Calculator</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-2xl">
            Project fixed deposit maturity with different compounding frequencies. See effective yield and interest breakdown.
          </p>
        </div>
        <FDCalculator />
        <FDInfo />
      </div>
    </main>
  );
}
