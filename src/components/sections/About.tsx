"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { viewportOnce } from "@/lib/animations";
import { useThemedAccent } from "@/lib/theme";
import { EDUCATION } from "@/lib/data/experience";
import { TiltCard } from "@/components/ui/TiltCard";
import { cn } from "@/lib/utils";

const CHAPTERS = [
  {
    n: "I",
    title: "Curiosity.",
    text: "Every product starts as a question. Mine began in first year of engineering, staring at a black-and-white MNIST grid that learned to recognize a handwritten '7'. Machines can learn — and I needed to know how.",
    accent: "#22d3ee",
  },
  {
    n: "II",
    title: "Building.",
    text: "So I built. Full-stack products where the frontend felt alive and the backend survived real traffic. Hundreds of DSA problems sharpened the fundamentals; shipping apps taught me taste.",
    accent: "#60a5fa",
  },
  {
    n: "III",
    title: "Machine Learning.",
    text: "Then I went deeper — the math, the models, the failure. Neural networks, computer vision, natural language. I learned that 80% of ML is data, 15% is evaluation, and 5% is the magic everyone talks about.",
    accent: "#a78bfa",
  },
  {
    n: "IV",
    title: "Production Engineering.",
    text: "Models in notebooks don't change anything. At Infosys Springboard I learned generative AI, prompt engineering and NLP inside an enterprise program — and I built systems that actually serve users, at 342ms latency, scaled to 5,000.",
    accent: "#f472b6",
  },
  {
    n: "V",
    title: "Future.",
    text: "Agentic AI, edge inference, products that feel like intelligence. The next chapter is being written now — one production system at a time.",
    accent: "#34f5c5",
  },
];

const chapterAnim = [
  { x: -60, rotate: -3, scale: 0.95 },
  { x: 60, rotate: 2 },
  { blur: true },
  { x: -40, y: 30 },
  { scale: 0.9, rotate: 3 },
];

export function About() {
  const accent = useThemedAccent();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const glowX = useTransform(scrollYProgress, [0, 1], ["-20%", "120%"]);
  const bgHue = useTransform(scrollYProgress, [0, 1], [`${accent("#22d3ee")}22`, `${accent("#f472b6")}22`]);

  return (
    <section ref={sectionRef} id="about" className="relative overflow-hidden py-28 md:py-40">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 transition-colors duration-700"
        style={{ background: `radial-gradient(circle at 50% 0%, ${"#0a0a0c"}, transparent 70%)` }}
      />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading index="02" kicker="origin story" title="The becoming of" gradientWord="an engineer." />

        {/* Chapter stream — one chapter per viewport */}
        <div className="relative mt-8 space-y-32 md:space-y-44">
          {CHAPTERS.map((chapter, i) => {
            const v = chapterAnim[i % chapterAnim.length];
            return (
              <motion.article
                key={chapter.n}
                className={cn("group relative lg:pl-32", i % 2 === 1 && "lg:pl-0 lg:pr-32")}
              >
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  variants={{
                    hidden: { opacity: 0, x: v.x ?? 0, y: v.y ?? 0, scale: v.scale ?? 1, rotate: v.rotate ?? 0, filter: v.blur ? "blur(14px)" : "blur(0px)" },
                    visible: {
                      opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, filter: "blur(0px)",
                      transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                >
                  <div className="flex items-start gap-6 md:gap-10">
                    {/* Chapter marker */}
                    <div className="relative shrink-0 pt-3">
                      <span
                        className="font-display text-5xl font-extrabold text-transparent md:text-7xl"
                        style={{ WebkitTextStroke: `1.5px ${accent(chapter.accent)}55` }}
                      >
                        {chapter.n}
                      </span>
                      <span
                        className="absolute -bottom-2 left-0 h-1 w-10 rounded-full"
                        style={{ background: accent(chapter.accent), boxShadow: `0 0 18px ${accent(chapter.accent)}` }}
                      />
                    </div>

                    <div>
                      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
                        Chapter {chapter.n}
                      </p>
                      <h3
                        className="font-display text-4xl font-bold tracking-tight text-foreground transition-colors duration-700 md:text-6xl"
                        style={{ ['--ch-accent' as string]: accent(chapter.accent) }}
                      >
                        <span className="group-hover:text-gradient-aurora">{chapter.title}</span>
                      </h3>
                      <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 md:text-lg">
                        {chapter.text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.article>
            );
          })}
        </div>

        <motion.div style={{ top: "40%" }} aria-hidden className="pointer-events-none absolute bottom-0 left-0 right-0 hidden h-px lg:block">
          <motion.div style={{ x: glowX }} className="h-full w-40 shimmer-line opacity-60" />
        </motion.div>

        {/* Education spotlight */}
        <div className="mt-32">
          <TiltCard maxTilt={6} className="group">
            <div className="relative overflow-hidden rounded-3xl glass-strong conic-border p-8 md:p-12">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 grid-bg opacity-30"
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full blur-[120px] transition-colors duration-700"
                style={{ background: bgHue }}
              />
              <div className="relative grid gap-10 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-aurora-cyan/70">
                    Academic Core
                  </p>
                  <h3 className="mt-4 font-display text-2xl font-bold text-foreground md:text-4xl">
                    {EDUCATION.degree}
                  </h3>
                  <p className="mt-2 text-slate-400">{EDUCATION.university}</p>
                  <ul className="mt-6 space-y-2">
                    {EDUCATION.details.map((d) => (
                      <li key={d} className="flex items-center gap-3 text-sm text-slate-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-aurora-cyan shadow-[0_0_8px_rgba(var(--glow-w),0.9)]" />
                        {d}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {EDUCATION.courses.map((c) => (
                      <span key={c} className="rounded-full border border-white/10 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-400 transition-all duration-300 hover:border-aurora-cyan/60 hover:bg-aurora-cyan/5 hover:text-aurora-cyan">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-start justify-center gap-4 lg:col-span-5 lg:items-end">
                  <div className="relative rounded-3xl glass p-8 text-center">
                    <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-aurora-cyan/10 to-aurora-violet/10" />
                    <div className="font-display text-6xl font-extrabold text-gradient-aurora">
                      {EDUCATION.cgpa}
                    </div>
                    <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
                      CGPA
                    </div>
                    <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
                      {EDUCATION.period}
                    </div>
                  </div>
                  {EDUCATION.secondary && (
                    <div className="w-full rounded-3xl glass p-6 text-left">
                      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-aurora-violet/80">
                        {EDUCATION.secondary.period}
                      </div>
                      <h4 className="mt-2 text-sm font-semibold text-slate-200">
                        {EDUCATION.secondary.school}
                      </h4>
                      <ul className="mt-3 space-y-2">
                        {EDUCATION.secondary.details.map((d) => (
                          <li key={d.label} className="flex items-center justify-between gap-3 text-sm">
                            <span className="text-slate-400">{d.label}</span>
                            <span className="font-mono font-semibold text-aurora-cyan">{d.value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}