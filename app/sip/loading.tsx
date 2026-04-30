import { ChartSkeleton, ResultCardSkeleton, TableSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <main className="page-shell">
      <div className="max-w-7xl mx-auto px-4 py-8 pointer-events-none">
        <div className="mb-2 animate-pulse">
          <div className="h-8 bg-muted rounded-lg w-1/3 mb-4" />
          <div className="h-4 bg-muted rounded-lg w-1/2" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 mt-6">
          <div className="surface-card h-[500px] animate-pulse p-6">
            <div className="space-y-6">
              {[1,2,3].map(i => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-muted-foreground/15 rounded w-1/4" />
                  <div className="h-10 bg-muted-foreground/15 rounded-lg w-full" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <ResultCardSkeleton />
            <ChartSkeleton />
            <TableSkeleton />
          </div>
        </div>
      </div>
    </main>
  );
}
