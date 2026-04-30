"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  shareId: string | null;
  className?: string;
}

export default function ShareButton({ shareId, className }: ShareButtonProps) {
  const handleShare = async () => {
    if (!shareId) return;
    const url = `${window.location.origin}/result/${shareId}`;
    
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!", {
        description: "Share this calculation with anyone",
      });
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      toast.success("Link copied!", {
        description: "Share this calculation with anyone",
      });
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={!shareId}
      className={cn(
        "flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-200",
        shareId
          ? "border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-blue-800"
          : "border-slate-100 text-slate-300 cursor-not-allowed dark:border-slate-800 dark:text-slate-600",
        className
      )}
    >
      <Share2 size={15} />
      Share
    </button>
  );
}
