import { useState, useEffect } from "react";

/**
 * Hook to gently delay state updates to prevent thrashing
 * complex math recalculations or excessive network requests.
 * 
 * @param value The value to observe
 * @param delay The millisecond delay (default 250ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 250): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timer to visually update the delayed state
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // If 'value' changes BEFORE 'delay' finishes, clear the active timer.
    // This resets the countdown, ensuring we only update once the user STOPS typing/sliding.
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
