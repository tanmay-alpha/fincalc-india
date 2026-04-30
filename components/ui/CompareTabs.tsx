"use client";

import { cn } from "@/lib/utils";

interface CompareTabsProps {
  activeTab: "A" | "B";
  // eslint-disable-next-line no-unused-vars
  onTabChange: (tab: "A" | "B") => void;
  labelA?: string;
  labelB?: string;
}

export default function CompareTabs({ 
  activeTab, 
  onTabChange, 
  labelA = "Scenario A", 
  labelB = "Scenario B" 
}: CompareTabsProps) {
  return (
    <div className="mb-6 flex items-center rounded-xl border border-border bg-muted p-1 shadow-inner">
      <button
        onClick={() => onTabChange("A")}
        className={cn(
          "flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ease-out",
          activeTab === "A"
            ? "bg-card text-primary shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {labelA}
      </button>
      <button
        onClick={() => onTabChange("B")}
        className={cn(
          "flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ease-out",
          activeTab === "B"
            ? "bg-card text-primary shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {labelB}
      </button>
    </div>
  );
}
