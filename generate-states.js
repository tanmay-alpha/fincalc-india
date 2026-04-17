const fs = require('fs');
const path = require('path');

const routes = ['sip', 'emi', 'fd', 'ppf', 'lumpsum', 'tax', 'history', 'result/[shareId]'];
const root = path.join(__dirname, 'app');

const loadingContent = `import { ChartSkeleton, ResultCardSkeleton, TableSkeleton } from "@/components/ui/Skeleton";

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
`;

const errorContent = `"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-[#F8FAFC] dark:bg-slate-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-[var(--shadow-card)] border border-red-100 dark:border-red-900/30 p-8 text-center">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Something went wrong!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          We encountered an unexpected error. Please try again or verify your connection.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-sm"
        >
          <RefreshCcw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </main>
  );
}
`;

routes.forEach(route => {
  const routePath = path.join(root, route);
  if (!fs.existsSync(routePath)) {
    fs.mkdirSync(routePath, { recursive: true });
  }
  fs.writeFileSync(path.join(routePath, 'loading.tsx'), loadingContent);
  fs.writeFileSync(path.join(routePath, 'error.tsx'), errorContent);
});

console.log("Loading and Error states created successfully.");
