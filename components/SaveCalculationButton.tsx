"use client";

import { useState } from "react";
import { Bookmark, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SaveCalculationButtonProps {
  calcType: string;
  data: Record<string, unknown>;
  className?: string;
}

export default function SaveCalculationButton({ calcType, data, className }: SaveCalculationButtonProps) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    try {
      const key = "fincalc_saved_calculations";
      const existing = JSON.parse(localStorage.getItem(key) ?? "[]") as unknown[];
      const entry = {
        id: `${calcType}-${Date.now()}`,
        calcType,
        data,
        savedAt: new Date().toISOString(),
      };
      existing.unshift(entry);
      // Keep most recent 50 saves
      localStorage.setItem(key, JSON.stringify(existing.slice(0, 50)));
      setSaved(true);
      toast.success("Calculation saved!", {
        description: `${calcType} calculation saved to your browser.`,
      });
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error("Could not save", {
        description: "Your browser storage may be full or restricted.",
      });
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={saved}
      className={cn(
        "flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 border",
        saved
          ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 cursor-default"
          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-primary hover:text-primary hover:shadow-sm active:scale-95",
        className
      )}
    >
      {saved ? (
        <>
          <CheckCircle2 className="w-4 h-4" />
          Saved!
        </>
      ) : (
        <>
          <Bookmark className="w-4 h-4" />
          Save Calculation
        </>
      )}
    </button>
  );
}
