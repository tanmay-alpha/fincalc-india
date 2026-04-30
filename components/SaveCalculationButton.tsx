"use client";

import { useState } from "react";
import { Bookmark, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSession, signIn } from "next-auth/react";
import { cn } from "@/lib/utils";

interface SaveCalculationButtonProps {
  calcType: string;
  data: Record<string, unknown>;
  // eslint-disable-next-line no-unused-vars
  onSaved?: (_id: string) => void;
  className?: string;
}

export default function SaveCalculationButton({ calcType, data, onSaved, className }: SaveCalculationButtonProps) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const { data: session } = useSession();

  const handleSave = async () => {
    if (!session) {
      toast("Login to save calculations", {
        description: "Your calculations will be saved and shareable",
        action: {
          label: "Sign In",
          onClick: () => signIn("google"),
        },
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        inputs: data.inputs || data, // Handle both structures just in case
        results: data.results || {},
      };

      const res = await fetch(`/api/calculate/${calcType.toLowerCase()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Save failed");
      }

      const { data: responseData, shareId: directShareId } = await res.json();
      const finalShareId = responseData?.shareId || directShareId;
      
      setSaved(true);
      onSaved?.(finalShareId);

      toast.success("Saved!", {
        description: "You can access this in My History anytime",
      });
      
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      toast.error("Could not save", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={loading || saved}
      className={cn(
        "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 border",
        saved
          ? "bg-green-50 text-green-700 border-green-200 cursor-default dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
          : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700",
        className
      )}
    >
      {loading ? (
        <Loader2 size={15} className="animate-spin" />
      ) : saved ? (
        <Check size={15} />
      ) : (
        <Bookmark size={15} />
      )}
      {loading ? "Saving..." : saved ? "Saved" : "Save"}
    </button>
  );
}
