"use client";

import { useEffect } from "react";

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
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-6">⚠️</div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Something went wrong</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
