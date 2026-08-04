"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/components/ui/TiltCard";
import { EXPERIENCE } from "@/lib/data/experience";
import { viewportOnce } from "@/lib/animations";
import { useThemedAccent } from "@/lib/theme";
import { FaBuilding, FaBriefcase } from "react-icons/fa6";

export function Experience() {
  const accent = useThemedAccent();
  return (
    <section id="experience" className="relative overflow-hidden py-28 md:py-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-bg opacity-25" />
      <div aria-hidden className="pointer-events-none absolute left-1/4 top-1/3 h-96 w-96 rounded-full bg-aurora-cyan/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          index="03"
          kicker="professional narrative"
          title="Where the models"
          gradientWord="meet the real world."
          subtitle="Theory is fragile until it survives production. Here's where my AI training collided with real engineering."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {EXPERIENCE.map((exp, i) => (
            <TiltCard key={exp.company} className={i === 0 ? "lg:col-span-2" : ""}>
              <div className="group relative overflow-hidden rounded-3xl glass-strong p-8 md:p-10">
                <div aria-hidden className="absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-30 blur-[80px] transition-colors duration-700"
                  style={{ background: accent(exp.accent) }} />
                <div className="relative flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl glass">
                      <span className="absolute inset-0 rounded-2xl animate-pulse-glow opacity-70" style={{ background: `${accent(exp.accent)}33` }} />
                      <FaBuilding className="text-xl" style={{ color: accent(exp.accent) }} />
                    </div>
                    <div>
                      <p className="font-display text-xl font-bold text-foreground md:text-2xl">
                        {exp.role}
                      </p>
                      <p className="text-sm text-slate-400">{exp.company}</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-slate-400">
                    {exp.period}
                  </span>
                </div>

                <div className="relative mt-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500">
                  <FaBriefcase />
                  {exp.type}
                </div>
                <p className="relative mt-4 max-w-3xl text-base leading-relaxed text-slate-400">
                  {exp.description}
                </p>

                <div className="relative mt-8 flex flex-wrap gap-2">
                  {exp.highlights.map((h, hi) => (
                    <motion.span
                      key={h}
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={viewportOnce}
                      transition={{ delay: hi * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider text-slate-200 transition-colors duration-300 hover:text-foreground"
                      style={{ border: `1px solid ${accent(exp.accent)}44`, background: `${accent(exp.accent)}14`, boxShadow: `0 0 20px -8px ${accent(exp.accent)}` }}
                    >
                      {h}
                    </motion.span>
                  ))}
                </div>
              </div>
            </TiltCard>
          ))}

          {/* Career trajectory mini-card */}
          <div className="relative overflow-hidden rounded-3xl glass p-8 md:p-10 lg:col-span-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
              Trajectory
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-wider">
              {[
                "DSA · 700+",
                "Full Stack",
                "Deep Learning",
                "Computer Vision",
                "GenAI / NLP",
                "Production AI",
              ].map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="rounded-full glass px-4 py-2 text-slate-300 transition-colors hover:text-aurora-cyan">
                    {step}
                  </span>
                  {i < 5 && <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }} className="text-aurora-cyan/60">
                    ▸
                  </motion.span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}