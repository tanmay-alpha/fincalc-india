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
    <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl mb-6 shadow-inner">
      <button
        onClick={() => onTabChange("A")}
        className={cn(
          "flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ease-out",
          activeTab === "A"
            ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400"
            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        )}
      >
        {labelA}
      </button>
      <button
        onClick={() => onTabChange("B")}
        className={cn(
          "flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ease-out",
          activeTab === "B"
            ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400"
            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        )}
      >
        {labelB}
      </button>
    </div>
  );
}
