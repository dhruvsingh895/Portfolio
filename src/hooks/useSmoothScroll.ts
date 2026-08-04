"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function useSmoothScroll(enabled: boolean) {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || lenisInstance) return;

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.3,
      wheelMultiplier: 1,
    });
    lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisInstance = null;
    };
  }, [enabled]);

  return { scrollTo: (target: string | number, opts?: object) => lenisInstance?.scrollTo(target, opts) };
}

export function scrollToId(id: string) {
  if (lenisInstance) {
    lenisInstance.scrollTo(`#${id}`, { offset: -72, duration: 1.6 });
  } else {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }
}
