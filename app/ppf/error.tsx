"use client";

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
    <main className="min-h-[80vh] flex items-center justify-center bg-[#F8FAFC] dark:bg-slate-950 p-4">
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
