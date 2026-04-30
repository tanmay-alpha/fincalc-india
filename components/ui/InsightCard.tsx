import { clsx } from "clsx";

export interface InsightCardProps {
  icon: string;
  title: string;
  subtitle?: string;
  type: "info" | "good" | "warning";
}

const styles = {
  info: "bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/60 text-blue-800 dark:text-blue-200",
  good: "bg-green-50 dark:bg-green-950/30 border-green-100 dark:border-green-900/60 text-green-800 dark:text-green-200",
  warning: "bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/60 text-amber-800 dark:text-amber-200",
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
          <p className="text-sm font-medium leading-snug">
            {title}
          </p>
          {subtitle && (
            <p className="text-xs mt-0.5 opacity-75">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
