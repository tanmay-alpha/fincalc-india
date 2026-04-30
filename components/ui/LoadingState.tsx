import { cn } from "@/lib/utils";

interface LoadingStateProps {
  className?: string;
}

export function LoadingState({ className }: LoadingStateProps) {
  return (
    <div className={cn("surface-card p-6", className)}>
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-32 rounded-full bg-muted" />
        <div className="h-9 w-56 rounded-xl bg-muted" />
        <div className="h-3 w-full rounded-full bg-muted" />
        <div className="h-3 w-2/3 rounded-full bg-muted" />
      </div>
    </div>
  );
}
