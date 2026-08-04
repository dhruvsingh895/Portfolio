"use client";

import { useMemo } from "react";

interface Star {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  tint: "default" | "cyan" | "violet";
}

const SHOOTERS = [
  { top: 12, right: -6, width: 140, height: 2, delay: 1.2, duration: 7 },
  { top: 30, right: -8, width: 110, height: 2, delay: 4.1, duration: 9 },
  { top: 6, right: -5, width: 170, height: 2, delay: 7.6, duration: 8 },
];

// Deterministic PRNG so server-rendered HTML matches the hydrated client.
function seededRandom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function Starfield({ active = true }: { active?: boolean }) {
  const stars = useMemo<Star[]>(() => {
    const rand = seededRandom(1337);
    return Array.from({ length: 110 }, () => {
      const r = rand();
      return {
        left: rand() * 100,
        top: rand() * 100,
        size: 1 + rand() * 2.2,
        delay: rand() * 4,
        duration: 2.2 + rand() * 3.6,
        tint: r < 0.82 ? "default" : r < 0.9 ? "cyan" : "violet",
      };
    });
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden transition-opacity duration-1000"
      style={{ opacity: active ? 1 : 0 }}
    >
      {stars.map((s, i) => (
        <span
          key={i}
          className={`star-dot ${s.tint === "cyan" ? "star-dot-tint-cyan" : s.tint === "violet" ? "star-dot-tint-violet" : ""}`}
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
      {SHOOTERS.map((sh, i) => (
        <span
          key={`shoot-${i}`}
          className="star-shooter"
          style={{
            top: `${sh.top}%`,
            right: `${sh.right}%`,
            width: sh.width,
            height: sh.height,
            animationDelay: `${sh.delay}s`,
            animationDuration: `${sh.duration}s`,
          }}
        />
      ))}
    </div>
  );
}