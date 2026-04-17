export default function LoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="mb-8">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded-lg mb-3" />
        <div className="h-4 w-96 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-6 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg" />
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full" />
              </div>
            ))}
          </div>
          <div className="h-28 bg-blue-100 dark:bg-blue-900/30 rounded-2xl" />
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 h-96" />
        </div>
      </div>
    </div>
  );
}
