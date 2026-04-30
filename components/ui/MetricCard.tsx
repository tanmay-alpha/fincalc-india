import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  description?: string;
  tone?: "default" | "success" | "warning" | "destructive";
  className?: string;
}

const tones = {
  default: "text-primary",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
};

export function MetricCard({
  label,
  value,
  description,
  tone = "default",
  className,
}: MetricCardProps) {
  return (
    <div className={cn("surface-card p-4", className)}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className={cn("mt-1 text-2xl font-bold tracking-tight", tones[tone])}>
        {value}
      </p>
      {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
    </div>
  );
}
