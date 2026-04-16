"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface StickyMobileResultProps {
  label: string;
  value: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function StickyMobileResult({ 
  label, 
  value, 
  buttonText = "See Breakdown", 
  onButtonClick 
}: StickyMobileResultProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after a small delay to avoid fighting entry animations
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={cn(
        "lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 transition-transform duration-300 ease-out",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="bg-slate-900 border border-slate-800 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-0.5">{label}</p>
          <p className="text-xl font-bold text-white transition-all">{value}</p>
        </div>
        
        {onButtonClick && (
          <button 
            onClick={onButtonClick}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl active:scale-95 transition-all shadow-sm"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}
