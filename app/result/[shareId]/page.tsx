import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ResultPage({
  params
}: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await params;
  const calc = await prisma.calculation.findUnique({
    where: { shareId },
    select: { 
      type: true, inputs: true, outputs: true,
      createdAt: true
      // DO NOT select userId — privacy
    }
  })
  
  if (!calc) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center max-w-sm w-full">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Calculation not found
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            This shared calculation may have been deleted or the link is incorrect.
          </p>
          <Link href="/"
            className="inline-flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-3 rounded-xl transition">
            Create your own calculation
          </Link>
        </div>
      </main>
    )
  }
  
  // FOUND: render readonly result
  const calcTypeNames: Record<string,string> = {
    sip: 'SIP Calculation',
    emi: 'EMI Calculation', 
    fd: 'FD Calculation',
    ppf: 'PPF Calculation',
    lumpsum: 'Lumpsum Calculation',
    tax: 'Income Tax Calculation',
  }
  
  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 pb-12">
      <div className="max-w-3xl mx-auto px-4 py-8">
        
        {/* Shared badge */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 rounded-full px-3 py-1 font-medium">
            📤 Shared Calculation
          </span>
          <span className="text-xs text-slate-400">
            {new Date(calc.createdAt).toLocaleDateString('en-IN', {
                timeZone: 'Asia/Kolkata',
                day: 'numeric', month: 'short', 
                year: 'numeric'
              })}
          </span>
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {calcTypeNames[calc.type.toLowerCase()] ?? 'Calculation'}
        </h1>
        
        {/* Inputs summary */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 mb-4">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Input Values Used
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(calc.inputs as Record<string,unknown>).map(([key, val]) => (
              <div key={key} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                <p className="text-xs text-slate-400 capitalize mb-1">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                </p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {typeof val === 'number' ? val.toLocaleString('en-IN') : String(val)}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Key results */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 mb-6">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Results
          </h2>
          {/* Show top-level output values */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(calc.outputs as Record<string,unknown>)
            .filter(([k,v]) => 
              typeof v === 'number' && 
              !Array.isArray(v) &&
              !k.toLowerCase().includes('schedule') &&
              !k.toLowerCase().includes('breakdown') &&
              !k.toLowerCase().includes('data')
            )
            .map(([key, val]) => (
              <div key={key} className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3">
                <p className="text-xs text-blue-600 dark:text-blue-400 capitalize mb-1">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                </p>
                <p className="text-sm font-bold text-blue-900 dark:text-blue-300">
                  {Number(val).toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl border border-blue-100 dark:border-blue-800/50 p-6 text-center">
          <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
            Want to calculate your own?
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Free, instant, no login required to calculate
          </p>
          <Link href={`/${calc.type.toLowerCase()}`}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
            Try {calcTypeNames[calc.type.toLowerCase()]} →
          </Link>
        </div>
        
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-6">
          ⚠️ This is a shared calculation for reference only. Results are estimates and not financial advice.
        </p>
        
      </div>
    </main>
  )
}

/* generateMetadata for social sharing */
export async function generateMetadata({
  params
}: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await params;
  const calc = await prisma.calculation.findUnique({
    where: { shareId },
    select: { type: true, outputs: true, inputs: true }
  })
  if (!calc) {
    return { title: 'Calculation Not Found' }
  }
  const typeNames: Record<string,string> = {
    sip: 'SIP', emi: 'EMI', fd: 'FD',
    ppf: 'PPF', lumpsum: 'Lumpsum', tax: 'Tax'
  }
  return {
    title: `Shared ${typeNames[calc.type.toLowerCase()] ?? ''} Calculation | FinCalc India`,
    description: 'See this financial calculation shared via FinCalc India.',
    openGraph: {
      title: `Shared ${typeNames[calc.type.toLowerCase()] ?? ''} Calculation`,
      description: 'View this shared calculation on FinCalc India — free financial calculators for Indian investors.',
    }
  }
}
