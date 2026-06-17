"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hook to delay state updates to prevent thrashing expensive recalculations.
 *
 * @param value The value to observe
 * @param delay The millisecond delay (default 250ms)
 * @returns The debounced value
 *
 * Behaviour:
 *   - The first value seen is returned immediately (no flash-of-default on mount).
 *   - Subsequent values are only emitted after `delay` ms of inactivity.
 *   - The delay can be safely changed between renders.
 */
export function useDebounce<T>(value: T, delay: number = 250): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // If a timer is already pending, cancel it so we don't emit twice.
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
      timerRef.current = null;
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [value, delay]);

  return debouncedValue;
}
