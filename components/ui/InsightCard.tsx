import { clsx } from "clsx";

export interface InsightCardProps {
  icon: string;
  title: string;
  subtitle?: string;
  type: "info" | "good" | "warning";
}

const indicatorStyles = {
  info: "bg-primary/10 text-primary border-primary/20",
  good: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
  warning: "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/25",
};

const borderAccentStyles = {
  info: "border-l-primary/60",
  good: "border-l-emerald-500/70",
  warning: "border-l-amber-500/70",
};

export default function InsightCard({
  icon,
  title,
  subtitle,
  type,
}: InsightCardProps) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-border/70 bg-card p-3.5 sm:p-4 text-foreground shadow-2xs",
        "border-l-[3px] transition-all duration-150 hover:border-border-strong hover:bg-muted/20",
        borderAccentStyles[type]
      )}
    >
      <div className="flex gap-3 items-start">
        <div
          className={clsx(
            "w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 text-sm font-medium",
            indicatorStyles[type]
          )}
          aria-hidden="true"
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-semibold text-foreground leading-snug tracking-tight">
            {title}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
