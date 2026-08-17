"use client";

import { SKILLS } from "@/lib/data/skills";

const PAIRS = [...SKILLS.map((s) => s.name), ...SKILLS.map((s) => s.name)];

export function TechTicker() {
  return (
    <div
      aria-hidden
      className="relative overflow-hidden border-y border-white/5 bg-abyss/40 py-5 md:py-6"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-void to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-void to-transparent" />
      <div className="flex w-max animate-marquee items-center gap-8 will-change-transform">
        {PAIRS.map((name, i) => (
          <span
            key={i}
            className="flex items-center gap-8 whitespace-nowrap font-display text-2xl font-bold text-slate-700 transition-colors hover:text-slate-500 md:text-4xl"
          >
            {name}
            <span className="text-aurora-cyan/60 text-base md:text-xl">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}