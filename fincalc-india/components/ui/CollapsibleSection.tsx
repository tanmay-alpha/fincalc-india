"use client";

import { useState, ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function CollapsibleSection({ 
  title, 
  icon, 
  children, 
  defaultOpen = false 
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-slate-400 dark:text-slate-500">{icon}</span>}
          <h3 className="text-sm md:text-base font-semibold text-slate-700 dark:text-slate-200">
            {title}
          </h3>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 transition-transform">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      <div 
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-700">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
