"use client";

import { useState } from "react";
import { Bookmark, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSession, signIn } from "next-auth/react";
import { getCalculatorContract, isSaveSupportedContract } from "@/lib/calculator-contracts";
import { cn } from "@/lib/utils";

interface SaveCalculationPayload {
  inputs: Record<string, unknown>;
  /**
   * Legacy UI callers may still supply a preview result, but it is never
   * sent to the server or used for persistence.
   */
  results?: Record<string, unknown>;
}

interface SaveCalculationButtonProps {
  calcType: string;
  data: SaveCalculationPayload;
  // eslint-disable-next-line no-unused-vars
  onSaved?: (_calculationId: string) => void;
  className?: string;
}

/**
 * Save the current calculator inputs/results to the user's account.
 *
 * The button is intentionally disabled until the user has been signed-in for
 * at least one tick (i.e. the session has resolved). This avoids a flash of
 * "Login to save" right after sign-in completes.
 */
export default function SaveCalculationButton({
  calcType,
  data,
  onSaved,
  className,
}: SaveCalculationButtonProps) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const { data: session, status } = useSession();
  const contract = getCalculatorContract(calcType.toLowerCase());
  const saveSupported = Boolean(contract && isSaveSupportedContract(contract));

  if (!saveSupported) {
    return null;
  }

  const handleSave = async () => {
    if (status === "loading" || !saveSupported) return;

    if (!session) {
      toast("Sign in to save calculations", {
        description: "Your calculations are private until you choose Share.",
        action: {
          label: "Sign In",
          onClick: () => signIn("google"),
        },
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/calculate/${calcType.toLowerCase()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: data.inputs }),
      });

      if (!res.ok) {
        await res.json().catch(() => ({}));
        // Never echo raw server errors — surface a clean user message.
        const message =
          res.status === 401
            ? "Please sign in to save calculations."
            : res.status === 429
              ? "Too many saves. Please wait a moment."
              : res.status >= 500
                ? "Our servers are having trouble. Please try again."
                : "Could not save. Please check your inputs and try again.";
        throw new Error(message);
      }

      const json = await res.json();
      const calculationId = json?.data?.calculationId;
      if (!json?.success || !calculationId) {
        throw new Error("Save failed");
      }

      setSaved(true);
      onSaved?.(calculationId);

      toast.success("Saved!", {
        description: "You can access this in My History anytime.",
      });

      // Re-enable the button after a moment so the user can save again.
      window.setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      toast.error("Could not save", {
        description:
          err instanceof Error ? err.message : "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={loading || saved || status === "loading" || !saveSupported}
      aria-label="Save calculation"
      className={cn(
        "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 border",
        "disabled:cursor-not-allowed",
        saved
          ? "border-success/25 bg-success/10 text-success"
          : "border-border bg-card text-card-foreground hover:border-primary/35 hover:bg-primary/10 hover:text-primary",
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
      {loading ? "Saving…" : saved ? "Saved" : saveSupported ? "Save" : "Save unavailable"}
    </button>
  );
}
