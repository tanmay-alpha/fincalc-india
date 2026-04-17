import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────

export type InsightType = "info" | "good" | "warn";

export interface InsightCardData {
  icon: string;
  text: string;
  highlight?: string;
  type: InsightType;
}

export interface InsightCardProps extends InsightCardData {
  className?: string;
}

// ─── Style map ────────────────────────────────────────────────

const typeStyles: Record<InsightType, string> = {
  info: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800",
  good: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-100 dark:border-green-800",
  warn: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-100 dark:border-yellow-800",
};

const highlightStyles: Record<InsightType, string> = {
  info: "text-blue-800 dark:text-blue-200",
  good: "text-green-800 dark:text-green-200",
  warn: "text-yellow-800 dark:text-yellow-200",
};

// ─── Component ────────────────────────────────────────────────

export default function InsightCard({
  icon,
  text,
  highlight,
  type,
  className,
}: InsightCardProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl px-4 py-3 border text-sm leading-relaxed transition-all duration-200",
        typeStyles[type],
        className
      )}
    >
      <span className="text-base flex-shrink-0 mt-0.5" aria-hidden="true">
        {icon}
      </span>
      <p>
        {text}
        {highlight && (
          <span className={cn("font-bold ml-1", highlightStyles[type])}>
            {highlight}
          </span>
        )}
      </p>
    </div>
  );
}
