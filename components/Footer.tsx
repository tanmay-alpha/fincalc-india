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

          {/* Links */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link
              href="https://github.com/tanmay-alpha/fincalc-india"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </Link>
            <span aria-hidden>·</span>
            <span>Not financial advice</span>
            <span aria-hidden>·</span>
            <span>Free · No ads · No tracking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
