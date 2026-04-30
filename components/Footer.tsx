

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">
              FinCalc
            </span>
            <span className="font-bold text-blue-600">
              India
            </span>
            <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 rounded-full px-2.5 py-0.5 font-medium">
              Free Tools
            </span>
          </div>
          
          {/* Links */}
          <div className="flex items-center gap-5 text-sm text-slate-400">
            <a href="https://github.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-600 transition-colors">
              GitHub
            </a>
            <span>·</span>
            <span className="text-slate-300 text-xs">
              Not financial advice
            </span>
          </div>
        </div>
        
        <div className="border-t border-slate-100 mt-5 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          
          <p className="text-sm text-slate-400">
            {'Made with ❤️ for Indian investors 🇮🇳'}
          </p>
          
          <p className="text-xs text-slate-300">
            Your data stays on your device 🛡️ 
            · No ads
          </p>
          
        </div>
      </div>
    </footer>
  );
}
