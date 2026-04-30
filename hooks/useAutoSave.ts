import { useState, useEffect, useRef } from "react";

interface AutoSaveProps<T> {
  calcType: string;
  debouncedInputs: T;
  results: Record<string, unknown>;
  enabled?: boolean;
}

/**
 * Disabled by default so calculator defaults are not written to history.
 * Prefer explicit saves via SaveCalculationButton.
 */
export function useAutoSave<T>({ calcType, debouncedInputs, results, enabled = false }: AutoSaveProps<T>) {
  const [shareId, setShareId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Track the previous payload string to prevent re-firing exact same POST requests unnecessarily
  const lastPayloadStr = useRef<string>("");

  useEffect(() => {
    if (!enabled) return;

    // Small local debounce mapping 
    const currentPayload = JSON.stringify({ inputs: debouncedInputs, results });
    
    if (currentPayload === lastPayloadStr.current) {
        return; // Already saved this exact snapshot
    }

    const saveCalculation = async () => {
      setIsSaving(true);
      try {
        const response = await fetch(`/api/calculate/${calcType.toLowerCase()}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: currentPayload,
        });

        if (response.ok) {
          const json = await response.json();
          const responseShareId = json.data?.shareId || json.shareId;
          if (json.success && responseShareId) {
            setShareId(responseShareId);
            lastPayloadStr.current = currentPayload;
          }
        }
      } catch (err) {
        console.error("Auto-save failed", err);
      } finally {
        setIsSaving(false);
      }
    };

    saveCalculation();
  }, [calcType, debouncedInputs, results, enabled]);

  return { shareId, isSaving };
}
