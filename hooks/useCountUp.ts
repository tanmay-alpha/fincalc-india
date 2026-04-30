"use client";

import { useEffect, useRef, useState } from "react";

export function useCountUp(target: number, duration: number = 600): number {
  const [current, setCurrent] = useState(target);
  const startRef = useRef<number>(0);
  const startValRef = useRef<number>(target);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    startRef.current = performance.now();
    startValRef.current = current;

    const animate = (now: number) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = startValRef.current + (target - startValRef.current) * eased;

      setCurrent(value);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return current;
}
