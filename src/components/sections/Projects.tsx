"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PROJECTS } from "@/lib/data/projects";
import { ProjectModal } from "./ProjectModal";
import { viewportOnce } from "@/lib/animations";
import { FaArrowRight, FaPlay } from "react-icons/fa6";
import { TiltCard } from "@/components/ui/TiltCard";
import { useThemedAccent } from "@/lib/theme";

export function Projects() {
  const [selected, setSelected] = useState<string | null>(null);
  const accent = useThemedAccent();
  const active = PROJECTS.find((p) => p.id === selected);

  return (
    <section id="projects" className="relative overflow-hidden py-28 md:py-40">
      <div aria-hidden className="pointer-events-none absolute right-0 top-40 h-[500px] w-[500px] rounded-full bg-aurora-violet/10 blur-[160px]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          index="04"
          kicker="flagship builds"
          title="Products with"
          gradientWord="pulse."
          subtitle="Not demos — deployed systems. Each one opens like a film: background, mockups, live stats and an animated architecture."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.id}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={{
                hidden: { opacity: 0, y: 60, rotateX: 6 },
                visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 } },
              }}
              className={project.isFeatured ? "md:col-span-2" : ""}
            >
              <TiltCard maxTilt={4} className="h-full">
                <button
                  onClick={() => setSelected(project.id)}
                  data-cursor
                  data-cursor-label="Open"
                  className="group relative block h-full w-full overflow-hidden rounded-3xl text-left"
                >
                  <div className="relative h-full min-h-[320px] overflow-hidden rounded-3xl border border-white/10 bg-surface p-7 transition-colors duration-500 group-hover:border-white/20 md:min-h-[380px] md:p-10">
                    {/* Animated scene background */}
                    <div aria-hidden className="absolute inset-0 opacity-80">
                      <div className="absolute inset-0 grid-bg opacity-40" />
                      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full blur-[100px] transition-all duration-1000 group-hover:scale-150"
                        style={{ background: `${accent(project.accent)}33` }} />
                      <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full blur-[100px] opacity-70 transition-all duration-1000 group-hover:scale-125"
                        style={{ background: `${accent(project.accent2)}33` }} />
                      {/* fake orbit object */}
                      <div className="absolute right-12 top-14 hidden h-24 w-24 rounded-3xl border border-white/10 rotate-12 transition-transform duration-1000 group-hover:rotate-[24deg] group-hover:scale-110 md:block"
                        style={{ background: `linear-gradient(150deg, ${accent(project.accent)}22, transparent)` }}>
                        <div className="absolute inset-2 rounded-2xl border border-white/5"
                          style={{ background: `linear-gradient(150deg, ${accent(project.accent)}33, ${accent(project.accent2)}22)` }} />
                      </div>
                      <div className="absolute bottom-16 left-10 hidden animate-float-slow md:block">
                        <div className="h-16 w-40 rounded-2xl border border-white/10 bg-void/60 backdrop-blur-sm p-2">
                          <div className="flex gap-1.5">
                            <span className="h-1 w-1 rounded-full bg-red-400/80" />
                            <span className="h-1 w-1 rounded-full bg-yellow-400/80" />
                            <span className="h-1 w-1 rounded-full bg-green-400/80" />
                          </div>
                          <div className="mt-2 h-1.5 w-3/4 rounded-full" style={{ background: `${accent(project.accent)}66` }} />
                          <div className="mt-1.5 h-1.5 w-1/2 rounded-full bg-white/10" />
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 flex h-full flex-col justify-between" style={{ transform: "translateZ(30px)" }}>
                      <div className="flex items-start justify-between">
                        <div className="flex flex-wrap gap-2">
                          {project.category && (
                            <span className="rounded-full border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-slate-300"
                              style={{ color: accent(project.accent) }}>
                              {project.category}
                            </span>
                          )}
                        </div>
                        <span className="font-display text-5xl font-extrabold text-transparent transition-all duration-500 group-hover:opacity-90 md:text-7xl"
                          style={{ WebkitTextStroke: `1px ${accent(project.accent)}66` }}>
                          {project.index}
                        </span>
                      </div>

                      <div className="mt-auto">
                        <h3 className="max-w-2xl font-display text-2xl font-bold leading-snug tracking-[-0.02em] text-foreground transition-colors group-hover:text-gradient-aurora md:text-4xl">
                          {project.title}
                        </h3>
                        <p className="mt-3 max-w-2xl text-sm text-slate-400 md:text-base">
                          {project.tagline}
                        </p>
                        <div className="mt-5 flex flex-wrap gap-2">
                          {project.tech.slice(0, 6).map((t) => (
                            <span key={t} className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-400 transition-colors group-hover:border-white/25">
                              {t}
                            </span>
                          ))}
                        </div>
                        <div className="mt-7 flex items-center gap-3">
                          <span className="flex h-11 w-11 items-center justify-center rounded-full text-void transition-transform duration-500 group-hover:scale-110"
                            style={{ background: `linear-gradient(120deg, ${accent(project.accent)}, ${accent(project.accent2)})`, boxShadow: `0 0 30px -8px ${accent(project.accent)}` }}>
                            <FaPlay className="text-sm" />
                          </span>
                          <span className="font-mono text-xs uppercase tracking-[0.25em] text-slate-400 group-hover:text-foreground">
                            Open experience
                          </span>
                          <FaArrowRight className="ml-auto text-slate-500 transition-all duration-500 group-hover:translate-x-1 group-hover:text-aurora-cyan" />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && <ProjectModal project={active} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}