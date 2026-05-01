
import EMICalculator from "@/components/calculators/emi/EMICalculator";
import EMIInfo from "@/components/seo/EMIInfo";

export const metadata = {
  title: 'EMI Calculator',
  description: 'Calculate home loan, car loan, and personal loan EMI instantly. See monthly payment, total interest, and full amortization schedule with our free EMI calculator.',
  openGraph: {
    title: 'EMI Calculator — FinCalc India',
    description: 'Free loan EMI calculator with complete amortization schedule for Indian borrowers.',
  }
}

export default function EMIPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 pb-24 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <nav className="text-sm text-slate-400 mb-3
            flex items-center gap-1.5">
            <a href="/" className="hover:text-blue-600">
              Home
            </a>
            <span>›</span>
            <span className="text-slate-600 dark:text-slate-300">
              EMI Calculator
            </span>
          </nav>
          <h1 className="text-2xl font-bold
            text-slate-900 dark:text-white">
            EMI Calculator
          </h1>
          <p className="text-slate-500 dark:text-slate-400
            text-sm mt-1 max-w-2xl">
            Calculate your monthly loan instalment for home,
            car, or personal loans with full amortization
            schedule.
          </p>
        </div>
        <EMICalculator />
        <EMIInfo />
      </div>
    </main>
  );
}
