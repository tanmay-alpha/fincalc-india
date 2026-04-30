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
    <main className="flex min-h-[80vh] items-center justify-center bg-background p-4">
      <div className="surface-card w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-foreground">Something went wrong!</h2>
        <p className="mb-8 leading-relaxed text-muted-foreground">
          We encountered an unexpected error. Please try again or verify your connection.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-destructive px-6 py-3 font-semibold text-destructive-foreground shadow-sm transition-all hover:bg-destructive/90 active:scale-95"
        >
          <RefreshCcw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </main>
  );
}
