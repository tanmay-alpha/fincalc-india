import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] 
      dark:bg-slate-950 flex items-center 
      justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="text-7xl font-bold 
          text-slate-200 dark:text-slate-800 mb-2">
          404
        </div>
        <div className="text-3xl mb-4">🧮</div>
        <h1 className="text-lg font-bold 
          text-slate-900 dark:text-white mb-2">
          Page not found
        </h1>
        <p className="text-sm text-slate-500 
          dark:text-slate-400 mb-6">
          The page you&apos;re looking for doesn&apos;t exist. 
          Try one of our calculators instead.
        </p>
        <Link href="/"
          className="inline-flex items-center gap-2 
            bg-blue-600 hover:bg-blue-700 text-white 
            text-sm font-semibold px-5 py-2.5 
            rounded-xl transition-colors">
          Go to FinCalc India →
        </Link>
      </div>
    </main>
  )
}
