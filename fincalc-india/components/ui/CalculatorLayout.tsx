import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────

interface CalculatorLayoutProps {
  title: string;
  description: string;
  icon: string;
  inputPanel: React.ReactNode;
  resultPanel: React.ReactNode;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────

/**
 * Standard 40/60 split layout for all calculators.
 *
 * - Left: sticky input card with white background
 * - Right: results, charts, insights
 */
export default function CalculatorLayout({
  title,
  description,
  icon,
  inputPanel,
  resultPanel,
  className,
}: CalculatorLayoutProps) {
  return (
    <div className={cn("max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10", className)}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl" aria-hidden="true">{icon}</span>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
            {title}
          </h1>
        </div>
        <p className="text-[var(--text-secondary)]">{description}</p>
      </div>

      {/* Two-column grid: 40% inputs | 60% results */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left column — Inputs */}
        <div className="lg:col-span-2">
          <div
            className={cn(
              "sticky top-6",
              "bg-[var(--bg-card)] dark:bg-slate-800",
              "rounded-2xl border border-[var(--border-default)] dark:border-slate-700",
              "shadow-[var(--shadow-card)]",
              "p-6 space-y-2"
            )}
          >
            {inputPanel}
          </div>
        </div>

        {/* Right column — Results */}
        <div className="lg:col-span-3 space-y-5">
          {resultPanel}
        </div>
      </div>
    </div>
  );
}
