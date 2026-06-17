"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Smoothly animate a numeric value from the previous value to the new target.
 *
 * @param target   the value to animate towards
 * @param duration animation length in ms (default 600)
 * @returns the currently displayed (animated) value
 *
 * Edge cases:
 *   - NaN / Infinity targets are ignored — we keep the last safe value.
 *   - When the target changes faster than the animation can finish, we
 *     re-anchor `startValRef` to the current (mid-animation) value, so the
 *     motion is continuous rather than snapping back to the previous value.
 */
export function useCountUp(target: number, duration: number = 600): number {
  const [current, setCurrent] = useState<number>(() =>
    Number.isFinite(target) ? target : 0
  );
  const startRef = useRef<number>(0);
  const startValRef = useRef<number>(current);
  const rafRef = useRef<number>(0);
  const targetRef = useRef<number>(target);

  useEffect(() => {
    if (!Number.isFinite(target)) return;
    targetRef.current = target;

    // Re-anchor: if an animation is already running, start from the current
    // displayed value (not the previous target) so the motion is smooth.
    startRef.current =
      typeof performance !== "undefined" ? performance.now() : Date.now();
    startValRef.current = current;

    const animate = (now: number) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      const next =
        startValRef.current + (targetRef.current - startValRef.current) * eased;

      setCurrent(next);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
    // We intentionally exclude `current` from deps to avoid restart loops.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return current;
}
