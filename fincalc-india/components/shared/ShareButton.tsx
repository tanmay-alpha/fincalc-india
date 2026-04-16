"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  shareId?: string;
  calcType: string;
  resultText: string;
  className?: string;
}

export default function ShareButton({ shareId, calcType, className = "" }: ShareButtonProps) {
  const handleShare = async () => {
    const url = shareId
      ? `${window.location.origin}/result/${shareId}`
      : window.location.href;

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!", {
        description: `Share your ${calcType} calculation with anyone`,
      });
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${className}`}
    >
      <Share2 className="w-4 h-4" />
      Share
    </button>
  );
}
