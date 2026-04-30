

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-slate-100">
              FinCalc
            </span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              India
            </span>
            <span className="text-xs bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 rounded-full px-2.5 py-0.5 font-medium">
              Free Tools
            </span>
          </div>
          
          {/* Links */}
          <div className="flex items-center gap-5 text-sm text-slate-500 dark:text-slate-400">
            <a href="https://github.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              GitHub
            </a>
            <span>·</span>
            <span className="text-slate-500 dark:text-slate-400 text-xs">
              Not financial advice
            </span>
          </div>
        </div>
        
        <div className="border-t border-slate-100 dark:border-slate-800 mt-5 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {'Made with ❤️ for Indian investors 🇮🇳'}
          </p>
          
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Your data stays on your device 🛡️ 
            · No ads
          </p>
          
        </div>
      </div>
    </footer>
  );
}
