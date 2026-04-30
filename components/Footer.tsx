export default function Footer() {
  return (
    <footer className="border-t border-border bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">FinCalc</span>
            <span className="font-bold text-primary">India</span>
            <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              Free Tools
            </span>
          </div>

          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <a
              href="https://github.com/tanmay-alpha/fincalc-india"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              GitHub
            </a>
            <span aria-hidden="true">-</span>
            <span className="text-xs">Not financial advice</span>
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center justify-between gap-2 border-t border-border pt-5 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Made for Indian investors
          </p>
          <p className="text-xs text-muted-foreground">
            Calculate freely. Sign in only when you want saved history.
          </p>
        </div>
      </div>
    </footer>
  );
}
