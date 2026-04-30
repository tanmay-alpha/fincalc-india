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
          ? "border-border bg-card text-card-foreground hover:border-primary/35 hover:bg-primary/10 hover:text-primary"
          : "cursor-not-allowed border-border/60 text-muted-foreground/50",
        className
      )}
    >
      <Share2 size={15} />
      Share
    </button>
  );
}
