import { cn } from "@/lib/utils";

export interface InsightCardProps {
  icon: string;
  title: string;
  subtitle?: string;
  type: "info" | "good" | "warning";
}

const styles = {
  info: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100",
  good: "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100",
  warning: "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-100",
};

const subtitleStyles = {
  info: "text-blue-700 dark:text-blue-300",
  good: "text-emerald-800 dark:text-emerald-300",
  warning: "text-amber-800 dark:text-amber-300",
};

export default function InsightCard({
  icon,
  title,
  subtitle,
  type,
}: InsightCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        "transition-all duration-200",
        styles[type]
      )}
    >
      <div className="flex gap-3 items-start">
        <span className="text-lg leading-none mt-0.5">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-snug">
            {title}
          </p>
          {subtitle && (
            <p className={cn("mt-0.5 text-xs font-medium", subtitleStyles[type])}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
