"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TIMELINE } from "@/lib/data/achievements";
import { viewportOnce } from "@/lib/animations";
import { useThemedAccent } from "@/lib/theme";
import { cn } from "@/lib/utils";

export function Timeline() {
  const accent = useThemedAccent();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 60%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="timeline" className="relative overflow-hidden py-28 md:py-40">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-aurora-violet/40 to-transparent opacity-30" />

      <div className="relative mx-auto max-w-5xl px-4 md:px-8">
        <SectionHeading
          index="09"
          kicker="the journey"
          title="A timeline that"
          gradientWord="grew."
          align="center"
        />

        <div ref={ref} className="relative">
          {/* growing spine */}
          <div aria-hidden className="absolute left-5 top-0 h-full w-[3px] rounded-full bg-white/5 md:left-1/2 md:-translate-x-1/2">
            <motion.div
              className="h-full w-full origin-top rounded-full bg-gradient-to-b from-aurora-cyan via-aurora-violet to-aurora-magenta"
              style={{ scaleY: lineScale, boxShadow: "0 0 14px rgba(var(--glow-g),0.6)" }}
            />
            <motion.div
              aria-hidden
              className="absolute -top-4 left-1/2 h-8 w-8 -translate-x-1/2 rounded-full blur-xl bg-aurora-cyan"
              style={{ top: glowY }}
            />
          </div>

          <div className="space-y-16 md:space-y-24">
            {TIMELINE.map((event, i) => {
              const left = i % 2 === 0;
              return (
                <div key={event.id} className="relative flex items-start gap-8 pl-14 md:pl-0">
                  <div className="md:w-1/2 md:pr-16">
                    {left ? (
                      <motion.div
                        initial={{ opacity: 0, x: -60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={viewportOnce}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className={cn("md:text-right")}
                      >
                        <EventCard event={event} alignRight />
                      </motion.div>
                    ) : (
                      <div />
                    )}
                  </div>

                  {/* node */}
                  <div className="absolute left-5 top-2 z-10 -translate-x-1/2 md:left-1/2">
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={viewportOnce}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="relative flex h-10 w-10 items-center justify-center rounded-full"
                      style={{ background: `${accent(event.accent)}1a`, border: `1px solid ${accent(event.accent)}66`, boxShadow: `0 0 20px -2px ${accent(event.accent)}` }}
                    >
                      <motion.span
                        className="absolute inset-0 rounded-full"
                        animate={reduce ? { opacity: 0.4 } : { opacity: [0.6, 0, 0.6], scale: [1, 1.7, 1] }}
                        transition={reduce ? { duration: 0 } : { duration: 2.4, repeat: Infinity, delay: i * 0.3 }}
                        style={{ border: `1.5px solid ${accent(event.accent)}66` }}
                      />
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: accent(event.accent), boxShadow: `0 0 10px ${accent(event.accent)}` }} />
                    </motion.div>
                  </div>

                  <div className="md:w-1/2 md:pl-16">
                    {!left ? (
                      <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={viewportOnce}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <EventCard event={event} />
                      </motion.div>
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function EventCard({ event, alignRight }: { event: (typeof TIMELINE)[number]; alignRight?: boolean }) {
  const accent = useThemedAccent();
  return (
    <div
      data-cursor
      className="group relative overflow-hidden rounded-2xl glass p-6 transition-all duration-500 hover:border-white/25 hover:shadow-[0_0_40px_-12px_var(--glow)]"
      style={({ "--glow": `${accent(event.accent)}aa` }) as React.CSSProperties}
    >
      <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-20 blur-2xl"
        style={{ background: accent(event.accent) }} />
      <div className={cn("flex items-center gap-3", alignRight && "md:justify-end")}>
        <span className="font-display text-3xl font-extrabold tabular-nums" style={{ color: accent(event.accent), textShadow: `0 0 24px ${accent(event.accent)}66` }}>
          {event.year}
        </span>
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-white/20" />
      </div>
      <h3 className={cn("mt-3 font-display text-xl font-bold text-foreground", alignRight && "md:text-right")}>
        {event.title}
      </h3>
      <p className={cn("mt-0.5 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500", alignRight && "md:text-right")}>
        {event.org}
      </p>
      <p className={cn("mt-3 text-sm leading-relaxed text-slate-400", alignRight && "md:text-right")}>
        {event.description}
      </p>
      <span aria-hidden className="mt-4 block h-0.5 w-8 rounded-full" style={{ background: accent(event.accent), boxShadow: `0 0 8px ${accent(event.accent)}`, marginLeft: alignRight ? "auto" : undefined }} />
    </div>
  );
}