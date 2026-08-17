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

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function useSmoothScroll(enabled: boolean) {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || lenisInstance || prefersReducedMotion()) return;

    // Velocity-driven lerp (not a fixed-duration tween): wheel feel tracks
    // the pointer, and momentum projects naturally on release.
    const lenis = new Lenis({
      lerp: 0.08,
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
  const reduced = prefersReducedMotion();
  if (lenisInstance && !reduced) {
    // Distance-scaled duration: short hops are quick, long journeys take longer.
    const el = document.getElementById(id);
    const distance = el ? Math.abs(el.getBoundingClientRect().top) : 0;
    const duration = Math.min(1.1, Math.max(0.4, distance / 2500));
    lenisInstance.scrollTo(`#${id}`, { offset: -72, duration });
  } else {
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }
}