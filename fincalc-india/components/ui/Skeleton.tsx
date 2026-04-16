import { cn } from "@/lib/utils";

// ─── Chart Skeleton ───────────────────────────────────────────

interface SkeletonProps {
  className?: string;
}

export function ChartSkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse",
        "h-[300px] w-full",
        className
      )}
    >
      <div className="h-full flex items-end gap-2 px-8 pb-8 pt-12">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-t"
            style={{ height: `${30 + Math.random() * 60}%` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Result Card Skeleton ─────────────────────────────────────

export function ResultCardSkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse p-6 space-y-4",
        className
      )}
    >
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-1/3" />
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-2/3" />
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-1/2" />
    </div>
  );
}

// ─── Table Skeleton ───────────────────────────────────────────

export function TableSkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse p-6 space-y-3",
        className
      )}
    >
      {/* Header */}
      <div className="flex gap-4 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-3 bg-slate-300 dark:bg-slate-600 rounded-full flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: 5 }).map((_, row) => (
        <div key={row} className="flex gap-4">
          {[1, 2, 3, 4].map((col) => (
            <div
              key={col}
              className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full flex-1"
              style={{ opacity: 1 - row * 0.1 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Generic line skeleton ────────────────────────────────────

export function LineSkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "h-4 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse",
        className
      )}
    />
  );
}
