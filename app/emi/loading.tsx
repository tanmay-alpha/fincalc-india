import { ChartSkeleton, ResultCardSkeleton, TableSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8 pointer-events-none">
        <div className="mb-2 animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3 mb-4" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 mt-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 h-[500px] animate-pulse">
            <div className="space-y-6">
              {[1,2,3].map(i => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                  <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg w-full" />
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
