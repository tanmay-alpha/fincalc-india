"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  /** The private saved-calculation id; a public token is created on click. */
  shareId: string | null;
  className?: string;
}

export default function ShareButton({ shareId, className }: ShareButtonProps) {
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    if (!shareId) return;

    setSharing(true);
    try {
      const response = await fetch(`/api/history/${shareId}/share`, { method: "POST" });
      const payload = await response.json().catch(() => null);
      const publicToken = payload?.data?.shareId;
      if (!response.ok || !publicToken) throw new Error("Unable to publish calculation");

      const url = `${window.location.origin}/result/${publicToken}`;
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        const input = document.createElement("input");
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      toast.success("Link copied!", {
        description: "This calculation is now shared. Revoke it from My History at any time.",
      });
    } catch {
      toast.error("Could not create a share link", {
        description: "Your saved calculation remains private.",
      });
    } finally {
      setSharing(false);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={!shareId || sharing}
      className={cn(
        "flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-200",
        shareId
          ? "border-border bg-card text-card-foreground hover:border-primary/35 hover:bg-primary/10 hover:text-primary"
          : "cursor-not-allowed border-border/60 text-muted-foreground/50",
        className
      )}
    >
      <Share2 size={15} />
      {sharing ? "Sharing…" : "Share"}
    </button>
  );
}
