"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { type Project, type ProjectMetric } from "@/lib/data/projects";
import { getLenis } from "@/hooks/useSmoothScroll";
import { useCountUp } from "@/hooks/useCountUp";
import { viewportOnce } from "@/lib/animations";
import { useThemedAccent } from "@/lib/theme";
import { FaXmark, FaGithub, FaArrowUpRightFromSquare, FaBookOpen, FaLock, FaShieldHalved } from "react-icons/fa6";

interface Props {
  project: Project;
  onClose: () => void;
}

function Metric({ metric, delay, accent }: { metric: ProjectMetric; delay: number; accent: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const count = useCountUp(metric.value ?? 0, {
    duration: 1800,
    decimals: metric.decimals ?? 0,
    start: inView,
    startDelay: delay * 1000 + 300,
  });

  return (
    <div
      ref={ref}
      className="rounded-2xl glass px-5 py-4 text-center transition-colors hover:border-white/20"
    >
      <div
        className="font-display text-2xl font-bold tabular-nums md:text-3xl"
        style={{ color: accent, textShadow: `0 0 18px ${accent}66` }}
      >
        {metric.text ?? (
          <>
            {count.toLocaleString(undefined, {
              minimumFractionDigits: metric.decimals ?? 0,
              maximumFractionDigits: metric.decimals ?? 0,
            })}
            {metric.suffix}
          </>
        )}
      </div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">{metric.label}</div>
    </div>
  );
}

function MacbookMockup({ project }: { project: Project }) {
  const accent = useThemedAccent();
  return (
    <div className="relative mx-auto w-full max-w-3xl" style={{ transform: "perspective(1400px) rotateX(4deg)" }}>
      {/* Screen */}
      <div className="relative rounded-[18px] border border-white/15 bg-void p-2 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
        <div className="relative overflow-hidden rounded-[12px] bg-abyss">
          {/* faux dashboard */}
          <div className="relative h-[300px] w-full md:h-[360px]">
            <div className="absolute inset-0 grid-bg opacity-30" />
            <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 20% 0%, ${accent(project.accent)}22, transparent 50%), linear-gradient(180deg, ${accent(project.accent)}0a, transparent)` }} />
            {/* top bar */}
            <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-white/5 px-5 py-3">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-slate-400">
                <span className="h-2 w-2 rounded-full animate-pulse-glow" style={{ background: accent(project.accent) }} />
                op·dash
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-white/10" /><span className="h-2 w-2 rounded-full bg-white/10" /><span className="h-2 w-2 rounded-full bg-white/10" />
              </div>
            </div>
            {/* sidebar + content */}
            <div className="absolute inset-y-0 left-0 top-9 hidden w-32 flex-col gap-2 border-r border-white/5 p-4 md:flex">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-2.5 rounded-full" style={{ background: i === 0 ? `${accent(project.accent)}99` : "rgba(255,255,255,0.08)" }} />
              ))}
            </div>
            <div className="absolute inset-y-0 left-0 right-0 top-9 p-5 md:left-32 md:p-6">
              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-lg border border-white/5 p-3" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="h-1.5 w-1/2 rounded-full bg-white/15" />
                    <div className="mt-2 h-3 w-3/4 rounded-sm" style={{ background: `${accent(project.accent)}${i === 1 ? "99" : "66"}` }} />
                  </div>
                ))}
              </div>
              {/* chart */}
              <div className="mt-4 h-24 rounded-lg border border-white/5 p-2" style={{ background: "rgba(255,255,255,0.03)" }}>
                <svg viewBox="0 0 200 80" className="h-full w-full overflow-visible">
                  <defs>
                    <linearGradient id={`chart${project.id}`} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={accent(project.accent)} stopOpacity="0.5" />
                      <stop offset="100%" stopColor={accent(project.accent)} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M0,70 C30,66 45,40 70,46 C95,52 110,22 140,26 C165,29 180,14 200,10"
                    fill="none" stroke={accent(project.accent)} strokeWidth="2.5"
                    initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
                    transition={{ duration: 1.8, ease: "easeInOut", delay: 0.4 }}
                  />
                  <motion.path
                    d="M0,70 C30,66 45,40 70,46 C95,52 110,22 140,26 C165,29 180,14 200,10 L200,80 L0,80 Z"
                    fill={`url(#chart${project.id})`}
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 1.6 }}
                  />
                </svg>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="font-mono text-[9px] uppercase tracking-widest text-slate-500">allocation engine</div>
                <div className="font-mono text-[10px] font-bold" style={{ color: accent(project.accent) }}>
                  ~342ms
                </div>
              </div>
            </div>
            <div className="absolute bottom-4 right-4 rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest text-void" style={{ background: `linear-gradient(120deg, ${accent(project.accent)}, ${accent(project.accent2)})`, boxShadow: `0 0 24px -6px ${accent(project.accent)}` }}>
              live
            </div>
          </div>
        </div>
      </div>
      {/* base */}
      <div className="mx-auto h-3 w-[112%] rounded-b-xl border-x border-b border-white/15 bg-gradient-to-b from-[#0d0d10] to-[#050505]" />
      <div className="mx-auto h-2 w-[70%] rounded-b-md bg-[#050505]" />
    </div>
  );
}

function PhoneMockup({ project }: { project: Project }) {
  const accent = useThemedAccent();
  return (
    <div className="relative w-[190px] shrink-0">
      <div className="relative rounded-[30px] border border-white/15 bg-void p-2.5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]">
        <div className="relative overflow-hidden rounded-[22px] bg-abyss">
          <div className="absolute left-1/2 top-2 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-black/80" />
          <div className="relative h-[290px] overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-30" />
            <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 0%, ${accent(project.accent2)}22, transparent 60%)` }} />
            <div className="relative flex h-full flex-col gap-2.5 p-4 pt-8">
              <div className="flex items-center justify-between">
                <div className="h-2.5 w-1/2 rounded-full" style={{ background: `${accent(project.accent)}88` }} />
                <span className="h-4 w-4 rounded-full border" style={{ borderColor: accent(project.accent) }} />
              </div>
              <div className="mt-1 h-20 rounded-xl border border-white/5 p-2" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="h-1.5 w-full rounded-full bg-white/10" />
                <div className="mt-2 h-1.5 w-2/3 rounded-full bg-white/10" />
                <div className="mt-3 flex items-center gap-1.5">
                  {[0, 1, 2, 3].map((i) => <span key={i} className="h-5 flex-1 rounded" style={{ background: `${accent(project.accent)}${50 + i * 15}` }} />)}
                </div>
              </div>
              <div className="mt-auto rounded-xl border border-white/5 p-2" style={{ background: `linear-gradient(140deg, ${accent(project.accent)}22, ${accent(project.accent2)}18)` }}>
                <div className="h-2 w-1/2 rounded-full bg-white/20" />
                <div className="mt-1.5 flex gap-1.5">
                  {[0, 1, 2].map((i) => <span key={i} className="h-4 flex-1 rounded-sm bg-white/10" />)}
                </div>
              </div>
              <div className="mb-1 flex gap-2">
                <div className="rounded-full px-3 py-1.5 text-center font-mono text-[8px] uppercase tracking-widest text-void" style={{ background: `linear-gradient(120deg, ${accent(project.accent)}, ${accent(project.accent2)})` }}>
                  ask ai
                </div>
                <div className="flex-1 rounded-full border border-white/10 py-1.5 text-center font-mono text-[8px] uppercase tracking-widest text-slate-500">
                  sync
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArchitectureFlow({ project }: { project: Project }) {
  const accent = useThemedAccent();
  return (
    <div className="relative select-none">
      <div aria-hidden className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-white/10" />
      <div className="relative flex items-stretch justify-between gap-2">
        {project.architecture.map((n, i) => (
          <div key={i} className="relative flex flex-1 flex-col items-center gap-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full rounded-2xl glass px-3 py-4 text-center transition-colors hover:border-aurora-cyan/40"
            >
              <div className="font-display text-sm font-bold text-foreground">{n.from}</div>
              <div className="mt-1 font-mono text-[9px] uppercase tracking-widest text-slate-500">{n.to}</div>
            </motion.div>
            {i < project.architecture.length - 1 && (
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.15 }}
                className="absolute -right-3 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-void text-[9px] text-aurora-cyan shadow-[0_0_12px_rgba(var(--glow-w),0.4)]"
              >
                ▸
              </motion.span>
            )}
            <motion.span
              initial={{ opacity: 0, y: -6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 + i * 0.15 }}
              className="font-mono text-[10px] uppercase tracking-widest text-aurora-cyan/80"
            >
              {n.label}
            </motion.span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectModal({ project, onClose }: Props) {
  const accent = useThemedAccent();
  useEffect(() => {
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[75] flex items-center justify-center p-0 md:p-6"
    >
      {/* cinematic backdrop */}
      <div className="absolute inset-0 bg-void/70 backdrop-blur-xl" onClick={onClose} />
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 animate-blob opacity-60" style={{ background: `radial-gradient(circle at 30% 20%, ${accent(project.accent)}30, transparent 50%), radial-gradient(circle at 80% 70%, ${accent(project.accent2)}25, transparent 50%)` }} />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-px shimmer-line opacity-50" />
      </div>

      <motion.div
        initial={{ y: 80, scale: 0.96, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 60, scale: 0.97, opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-h-[92vh] w-full max-w-6xl overflow-y-auto overflow-x-hidden rounded-3xl border border-white/10 bg-surface/90 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9)]"
      >
        {/* top chrome */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-abyss/70 px-6 py-4 backdrop-blur-xl md:px-10">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: accent(project.accent) }} />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: accent(project.accent) }} />
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-slate-400">
              Now playing · {project.category}
            </span>
          </div>
          <button onClick={onClose} aria-label="Close" data-cursor
            className="flex h-10 w-10 items-center justify-center rounded-full glass ring-1 ring-white/5 text-slate-300 transition-all duration-300 hover:rotate-90 hover:border-aurora-cyan/60 hover:text-aurora-cyan hover:shadow-[0_0_20px_-8px_rgba(var(--glow-w),0.6)]">
            <FaXmark />
          </button>
        </div>

        <div className="space-y-14 px-6 py-10 md:px-10 md:py-14">
          {/* header */}
          <div className="text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-mono text-[11px] uppercase tracking-[0.35em] text-aurora-cyan/70"
            >
              Project {project.index} · {project.year}
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-4 max-w-3xl font-display text-3xl font-bold leading-tight text-gradient md:text-5xl"
            >
              {project.title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.25 }}
              className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base"
            >
              {project.description}
            </motion.p>
          </div>

          {/* mockups */}
          <div className="flex flex-col items-center gap-10">
            <MacbookMockup project={project} />
            <div className="flex items-end gap-10 md:gap-16">
              <PhoneMockup project={project} />
              <div className="hidden h-44 w-full max-w-[220px] rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm p-4 md:block">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500">monitor</span>
                  <span style={{ color: accent(project.accent) }}>●</span>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-1.5 w-3/4 rounded-full bg-white/15" />
                  <div className="h-1.5 w-1/2 rounded-full bg-white/10" />
                  <div className="mt-4 h-10 rounded-lg border border-white/5" style={{ background: `${accent(project.accent)}18` }} />
                  <div className="flex gap-2">
                    <div className="h-6 flex-1 rounded border border-white/5 bg-white/5" />
                    <div className="h-6 flex-1 rounded border border-white/5 bg-white/5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* metrics */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {project.metrics.map((m, i) => (
              <Metric key={m.label} metric={m} delay={i * 0.15} accent={accent(project.accent)} />
            ))}
          </div>

          {/* features */}
          <div>
            <p className="mb-6 text-center font-mono text-[11px] uppercase tracking-[0.35em] text-slate-500">
              Signature features
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {project.features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="group rounded-2xl glass p-6 transition-colors hover:border-white/20"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold" style={{ color: accent(project.accent) }}>0{i + 1}</span>
                    <h4 className="font-display text-lg font-bold text-foreground">{f.title}</h4>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{f.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* architecture */}
          <div>
            <p className="mb-8 text-center font-mono text-[11px] uppercase tracking-[0.35em] text-slate-500">
              System architecture
            </p>
            <ArchitectureFlow project={project} />
          </div>

          {/* tech */}
          <div className="text-center">
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.35em] text-slate-500">Engineered with</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {project.tech.map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={viewportOnce}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-full px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-slate-100 transition-all duration-300 hover:scale-105"
                  style={{ border: `1px solid ${accent(project.accent)}55`, background: `${accent(project.accent)}12`, boxShadow: `0 0 24px -10px ${accent(project.accent)}` }}
                >
                  {t}
                </motion.span>
              ))}
            </div>
          </div>

          {/* security strip */}
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl glass px-6 py-5">
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-slate-400"><FaLock className="text-aurora-cyan" /> JWT auth</span>
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-slate-400"><FaShieldHalved className="text-aurora-cyan" /> RBAC</span>
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-slate-400"><span className="h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_8px_var(--glow-teal)]" /> rate limited</span>
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-slate-400"><span className="h-1.5 w-1.5 rounded-full bg-aurora-cyan shadow-[0_0_8px_var(--glow-teal)]" /> input validation</span>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pb-4">
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" data-cursor
                className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-neon via-aurora-cyan to-aurora-purple px-7 py-3.5 font-medium text-void ring-1 ring-white/15 shadow-[0_0_28px_-8px_rgba(var(--glow-w),0.6)] transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_38px_-8px_rgba(var(--glow-g),0.8)]">
                <FaGithub /> GitHub
              </a>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noreferrer" data-cursor
                className="flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 font-medium text-aurora-cyan transition-all duration-500 hover:border-aurora-cyan/60 hover:bg-aurora-cyan/5 hover:shadow-[0_0_30px_-8px_rgba(var(--glow-w),0.7)]">
                <FaArrowUpRightFromSquare /> Live Demo
              </a>
            )}
            {project.caseStudy && (
              <a href={project.caseStudy} target="_blank" rel="noreferrer" data-cursor
                className="flex items-center gap-2 rounded-full glass ring-1 ring-white/5 px-7 py-3.5 font-medium text-slate-200 transition-all duration-500 hover:border-aurora-violet/60 hover:text-aurora-violet hover:shadow-[0_0_30px_-8px_rgba(var(--glow-g),0.7)]">
                <FaBookOpen /> Case Study
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}