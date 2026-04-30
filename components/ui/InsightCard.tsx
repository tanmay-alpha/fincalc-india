import { clsx } from "clsx";

export interface InsightCardProps {
  icon: string;
  title: string;
  subtitle?: string;
  type: "info" | "good" | "warning";
}

const styles = {
  info: "bg-blue-50 border-blue-100 text-blue-800",
  good: "bg-green-50 border-green-100 text-green-800",
  warning: "bg-amber-50 border-amber-100 text-amber-800",
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
