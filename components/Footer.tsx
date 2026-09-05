import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-7">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              ₹
            </div>
            <span className="font-bold text-sm text-foreground">
              FinCalc <span className="text-primary">India</span>
            </span>
          </div>

          {/* Links & Trust Notes */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs text-muted-foreground text-center sm:text-right">
            <div className="flex items-center gap-3">
              <Link
                href="https://github.com/tanmay-alpha/fincalc-india"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                GitHub
              </Link>
              <span aria-hidden>·</span>
              <Link href="/history" className="hover:text-foreground transition-colors">
                Calculation History
              </Link>
              <span aria-hidden>·</span>
              <span>Free · Privacy-first · No tracking</span>
            </div>
            <span className="hidden sm:inline" aria-hidden>·</span>
            <span className="text-xs text-foreground/80 font-medium">
              Tax Year 2026–27 · For educational & estimation purposes only
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
