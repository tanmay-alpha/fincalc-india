import { clsx } from "clsx";

export interface InsightCardProps {
  icon: string;
  title: string;
  subtitle?: string;
  type: "info" | "good" | "warning";
}

const styles = {
  info: "border-primary/20 bg-primary/10 text-primary",
  good: "border-success/20 bg-success/10 text-success",
  warning: "border-warning/25 bg-warning/10 text-warning",
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
            <p className="mt-0.5 text-xs opacity-80">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
