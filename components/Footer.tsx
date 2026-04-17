import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">₹</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-lg leading-tight">FinCalc India</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Premium Tools</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-800/50">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-semibold">Your data stays on your device 🛡️</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              No ads &middot; No login required
            </p>
          </div>

          <div className="flex flex-col items-end gap-1 text-right">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for Indian investors 🇮🇳
            </p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">
              Not financial advice
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
