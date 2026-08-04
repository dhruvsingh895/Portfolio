"use client";

import { useEffect, useRef, useState } from "react";

export function useCountUp(
  target: number,
  { duration = 2000, decimals = 0, start = false, startDelay = 0 } = {},
): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!start) return;
    const t0 = performance.now() + startDelay;

    const tick = (now: number) => {
      const elapsed = Math.max(0, now - t0);
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      const next = target * eased;
      setValue(decimals > 0 ? Number(next.toFixed(decimals)) : Math.floor(next));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, decimals, start, startDelay]);

  return value;
}
