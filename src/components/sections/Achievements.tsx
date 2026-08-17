"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import confetti from "canvas-confetti";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ACHIEVEMENTS, STATS_MARQUEE } from "@/lib/data/achievements";
import { useCountUp } from "@/hooks/useCountUp";
import { viewportOnce } from "@/lib/animations";
import { useThemedAccent } from "@/lib/theme";

function AchievementCard({
  value,
  suffix,
  label,
  platform,
  accent: rawAccent,
  note,
  decimals,
  delay,
}: (typeof ACHIEVEMENTS)[number] & { delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const themed = useThemedAccent();
  const accent = themed(rawAccent);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const count = useCountUp(value, { duration: reduce ? 0 : 2300, decimals, start: inView, startDelay: delay * 200 + 400 });

  const celebrate = () => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    confetti({
      particleCount: 70,
      spread: 70,
      startVelocity: 34,
      origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight },
      colors: [accent, themed("#22d3ee"), themed("#8b5cf6"), themed("#f472b6"), themed("#ffffff")],
      zIndex: 200,
      disableForReducedMotion: true,
    });
  };

  return (
    <div ref={ref} className="relative">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ delay: delay * 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        onClick={celebrate}
        data-cursor
        className="group relative overflow-hidden rounded-3xl glass-strong p-8 text-center transition-colors duration-500 hover:border-white/20 md:p-10"
      >
        {/* glowing ring */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-8 h-40 w-40 -translate-x-1/2 rounded-full opacity-25 blur-2xl transition-opacity duration-500 group-hover:opacity-50"
          style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 rounded-full border"
          style={{ borderColor: `${accent}55`, boxShadow: `0 0 24px -6px ${accent}88`, width: "8.5rem", height: "8.5rem" }}
        >
          <div
            aria-hidden
            className="absolute inset-2 rounded-full border border-dashed"
            style={{ borderColor: `${accent}33` }}
          />
        </div>

        <div className="relative mt-40 font-display text-6xl font-extrabold tabular-nums tracking-[-0.04em] md:text-7xl" style={{ color: accent, textShadow: `0 0 40px ${accent}88` }}>
          {count.toLocaleString()}
          <span className="text-4xl md:text-5xl">{suffix}</span>
        </div>
        <div className="relative mt-3 font-mono text-[11px] uppercase tracking-[0.3em] text-slate-400">
          {label}
        </div>
        <div className="relative mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-600">
          {platform}
        </div>
        <p className="relative mx-auto mt-5 max-w-[240px] text-xs leading-relaxed text-slate-500">{note}</p>

        {/* energy wave */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 overflow-hidden opacity-40">
          <svg viewBox="0 0 400 60" preserveAspectRatio="none" className="h-full w-full">
            <motion.path
              d="M0,30 Q50,10 100,30 T200,30 T300,30 T400,30"
              fill="none" stroke={accent} strokeWidth="1.5"
              animate={reduce ? { d: "M0,30 Q50,50 100,30 T200,30 T300,30 T400,30" } : { d: ["M0,30 Q50,10 100,30 T200,30 T300,30 T400,30", "M0,30 Q50,50 100,30 T200,30 T300,30 T400,30", "M0,30 Q50,10 100,30 T200,30 T300,30 T400,30"] }}
              transition={reduce ? { duration: 0 } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ filter: `drop-shadow(0 0 6px ${accent})` }}
            />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}

export function Achievements() {
  return (
    <section id="achievements" className="relative overflow-hidden py-28 md:py-40">
      <div aria-hidden className="pointer-events-none absolute left-0 top-1/4 h-96 w-96 rounded-full bg-aurora-cyan/8 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          index="06"
          kicker="proof of obsession"
          title="Numbers that"
          gradientWord="compound."
          align="center"
          subtitle="Years of deliberate practice, measured. Click a card for confetti — you've earned it too."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {ACHIEVEMENTS.map((a, i) => (
            <AchievementCard key={a.platform} {...a} delay={i} />
          ))}
        </div>

        <div className="relative mt-20 overflow-hidden mask-fade-y">
          <div className="flex w-max animate-marquee gap-10 py-4">
            {[...STATS_MARQUEE, ...STATS_MARQUEE].map((stat, i) => (
              <span key={i} className="flex items-center gap-10 whitespace-nowrap font-display text-2xl font-bold text-slate-700 transition-colors hover:text-slate-400 md:text-4xl">
                {stat}
                <span className="text-aurora-cyan/60 text-base">◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}