import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("surface-card p-8 text-center", className)}>
      {icon && (
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
          {icon}
        </div>
      )}
      <h2 className="text-xl">{title}</h2>
      {description && <p className="mx-auto mt-2 max-w-md text-body">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
