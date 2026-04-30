
import LumpsumCalculator from "@/components/calculators/lumpsum/LumpsumCalculator";
import LumpsumInfo from "@/components/seo/LumpsumInfo";

export const metadata = {
  title: 'Lumpsum Calculator',
  description: 'Calculate returns on one-time lumpsum investment. Compare lumpsum vs SIP returns and see CAGR on your investment.',
  openGraph: {
    title: 'Lumpsum Calculator — FinCalc India',
    description: 'Free lumpsum investment calculator with CAGR and SIP comparison.',
  }
}

export default function LumpsumPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 pb-24 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <nav className="text-sm text-slate-400 mb-3 flex items-center gap-1.5">
            <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
            <span>›</span>
            <span className="text-slate-600 dark:text-slate-300">Lumpsum Calculator</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Lumpsum Calculator</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-2xl">
            See how a one-time investment grows with CAGR, wealth multiplier, and year-by-year projections.
          </p>
        </div>
        <LumpsumCalculator />
        <LumpsumInfo />
      </div>
    </main>
  );
}
