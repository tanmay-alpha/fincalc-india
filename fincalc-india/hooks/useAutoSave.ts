import { useState, useEffect, useRef } from "react";

interface AutoSaveProps<T> {
  calcType: string;
  debouncedInputs: T;
  results: Record<string, unknown>;
  enabled?: boolean;
}

/**
 * Automatically triggers the /api/calculate/[type] endpoint
 * to store the calculation in history and generate a dynamic shareId.
 */
export function useAutoSave<T>({ calcType, debouncedInputs, results, enabled = true }: AutoSaveProps<T>) {
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
          const data = await response.json();
          if (data.success && data.shareId) {
            setShareId(data.shareId);
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
