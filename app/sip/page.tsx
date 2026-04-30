import { Metadata } from "next";
import SIPCalculator from "@/components/calculators/sip/SIPCalculator";
import SIPInfo from "@/components/seo/SIPInfo";

export const metadata: Metadata = {
  title: 'SIP Calculator',
  description: 'Free SIP calculator for Indian investors. Calculate returns on monthly Systematic Investment Plan with compound interest and year-by-year breakdown.',
  openGraph: {
    title: 'SIP Calculator | FinCalc India',
    description: 'Calculate SIP returns with compound interest, year-by-year corpus growth, and investment breakdown.',
    type: 'website',
  },
};

export default function SIPPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 pb-24 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <nav className="text-sm text-slate-400 mb-3 flex items-center gap-1.5">
            <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
            <span>›</span>
            <span className="text-slate-600 dark:text-slate-300">SIP Calculator</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">SIP Calculator</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-2xl">
            Calculate returns on your monthly Systematic Investment Plan. See year-by-year corpus growth with compound interest.
          </p>
        </div>
        <SIPCalculator />
        <SIPInfo />
      </div>
    </main>
  );
}
