import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

const chartHeights = [42, 68, 54, 82, 61, 76, 48, 70];

export function ChartSkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "h-[300px] w-full animate-pulse rounded-2xl bg-muted",
        className
      )}
    >
      <div className="flex h-full items-end gap-2 px-8 pb-8 pt-12">
        {chartHeights.map((height, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-muted-foreground/15"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function ResultCardSkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse space-y-4 rounded-2xl bg-muted p-6",
        className
      )}
    >
      <div className="h-3 w-1/3 rounded-full bg-muted-foreground/15" />
      <div className="h-8 w-2/3 rounded-lg bg-muted-foreground/15" />
      <div className="h-3 w-1/2 rounded-full bg-muted-foreground/15" />
    </div>
  );
}

export function TableSkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse space-y-3 rounded-2xl bg-muted p-6",
        className
      )}
    >
      <div className="mb-4 flex gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-3 flex-1 rounded-full bg-muted-foreground/20"
          />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, row) => (
        <div key={row} className="flex gap-4">
          {[1, 2, 3, 4].map((col) => (
            <div
              key={col}
              className="h-3 flex-1 rounded-full bg-muted-foreground/15"
              style={{ opacity: 1 - row * 0.1 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function LineSkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("h-4 animate-pulse rounded-full bg-muted", className)}
    />
  );
}
