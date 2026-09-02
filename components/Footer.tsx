
export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 mt-12 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-slate-900 dark:text-white">FinCalc</span>
            <span className="font-bold text-base text-emerald-700 dark:text-emerald-400"> India</span>
            <span className="text-xs bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full px-2.5 py-0.5 font-medium">Free Tools</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <a href="https://github.com/tanmay-alpha/fincalc-india" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-white transition">GitHub</a>
            <span>·</span>
            <span>Not financial advice</span>
          </div>
        </div>
        <div className="border-t border-slate-100 dark:border-slate-800 mt-5 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-slate-700 dark:text-slate-300">{'Made with \u2764\uFE0F for Indian investors \uD83C\uDDEE\uD83C\uDDF3'}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">Free forever · No ads · No tracking</p>
        </div>
      </div>
    </footer>
  )
}
