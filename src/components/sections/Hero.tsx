"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { PROFILE, HERO_STATS } from "@/lib/data/profile";
import { useTyping } from "@/hooks/useTyping";
import { useCountUp } from "@/hooks/useCountUp";
import { sceneBus } from "@/lib/sceneBus";
import { scrollToId } from "@/hooks/useSmoothScroll";
import { FiChevronDown, FiMail, FiGithub, FiLinkedin } from "react-icons/fi";
import { FaDownload } from "react-icons/fa";
import { Starfield } from "@/components/ui/Starfield";

function StatPill({ value, suffix, label, decimals = 0, delay }: { value: number; suffix: string; label: string; decimals?: number; delay: number }) {
  const [start, setStart] = useState(false);
  const count = useCountUp(value, { duration: 2400, decimals, start, startDelay: 200 });

  useEffect(() => {
    const t = setTimeout(() => setStart(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div className="group relative">
      <div className="pointer-events-none absolute -inset-1 rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60 bg-gradient-to-r from-aurora-cyan/30 to-aurora-violet/30" />
      <div className="relative rounded-2xl glass px-5 py-4 text-center">
        <div className="font-display text-2xl font-bold tabular-nums text-gradient md:text-3xl">
          {count}
          {suffix}
        </div>
        <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-slate-500 md:text-[10px]">
          {label}
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const [ready, setReady] = useState(false);
  const role = useTyping(PROFILE.roles, { typeMs: 62, deleteMs: 28, holdMs: 1700 });

  useEffect(() => {
    const unsub = sceneBus.subscribe((s) => {
      if (s.introDone) setReady(true);
    });
    const fallback = setTimeout(() => setReady(true), 6800);
    return () => {
      unsub();
      clearTimeout(fallback);
    };
  }, []);

  const downloadResume = () => {
    const a = document.createElement("a");
    a.href = PROFILE.resumeUrl;
    a.download = "Dhruv_Singh_Resume.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <section id="hero" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden">
      <Starfield active={ready} />
      <div className="mx-auto w-full max-w-7xl px-4 pt-28 md:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500"
        >
          <span className="text-aurora-cyan/80">01</span>
          <span className="text-slate-600">/</span>
          <span>story</span>
          <span className="text-slate-600">/</span>
          <span className="text-neon/90">system online</span>
          <span className="hidden text-slate-600 sm:inline">/</span>
          <span className="hidden text-slate-600 sm:inline">26.4499° n · 80.3319° e</span>
        </motion.div>

        <div className="mt-10">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-slate-400 md:text-2xl"
          >
            Hello<span className="text-aurora-cyan">.</span>
            <br className="md:hidden" />
            <span className="mt-1 block md:mt-0 md:inline"> I&apos;m</span>
          </motion.p>

          <h1 className="mt-4 font-display text-[17vw] font-extrabold leading-[0.92] tracking-tight md:text-[11vw] lg:text-[9.5rem]">
            <AnimatedText text="DHRUV" className="block" delay={0.15} stagger={0.05} active={ready} />
            <AnimatedText
              text="SINGH"
              className="block text-gradient-aurora glow-text"
              delay={0.4}
              stagger={0.05}
              active={ready}
            />
          </h1>

          <div className="mt-8 flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={ready ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
              className="flex items-center gap-3 font-mono text-sm text-slate-300 md:text-lg"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-neon" />
              </span>
              <span aria-hidden className="border-r border-aurora-cyan/40 pr-3">
                {role}
              </span>
              <span className="-ml-2 animate-typing-caret text-aurora-cyan">▍</span>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 1.1 }}
            className="mt-6 max-w-xl text-sm leading-relaxed text-slate-400 md:text-base"
          >
            {PROFILE.summary}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 1.25 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <MagneticButton variant="primary" size="lg" onClick={() => scrollToId("about")}>
            Explore Journey
          </MagneticButton>
          <MagneticButton variant="glass" size="lg" onClick={downloadResume}>
            <FaDownload className="opacity-80" /> Download Resume
          </MagneticButton>
          <MagneticButton variant="outline" size="lg" onClick={() => scrollToId("projects")}>
            View Projects
          </MagneticButton>
          <MagneticButton variant="ghost" size="lg" onClick={() => scrollToId("contact")}>
            Hire Me
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 1.45 }}
          className="mt-14 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3"
        >
          {HERO_STATS.map((stat, i) => (
            <StatPill key={stat.label} {...stat} delay={1600 + i * 150} />
          ))}
        </motion.div>
      </div>

      {/* floating side info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 1.2, delay: 1.9 }}
        className="pointer-events-none absolute bottom-24 right-6 hidden flex-col items-end gap-3 xl:flex"
      >
        <a href={PROFILE.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" data-cursor className="flex h-11 w-11 items-center justify-center rounded-full glass ring-1 ring-white/5 text-slate-300 transition-all duration-300 hover:border-aurora-cyan/60 hover:text-aurora-cyan hover:shadow-[0_0_24px_-6px_rgba(var(--glow-w),0.7)]">
          <FiGithub />
        </a>
        <a href={PROFILE.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" data-cursor className="flex h-11 w-11 items-center justify-center rounded-full glass ring-1 ring-white/5 text-slate-300 transition-all duration-300 hover:border-aurora-cyan/60 hover:text-aurora-cyan hover:shadow-[0_0_24px_-6px_rgba(var(--glow-w),0.7)]">
          <FiLinkedin />
        </a>
        <a href={`mailto:${PROFILE.email}`} aria-label="Email" data-cursor className="flex h-11 w-11 items-center justify-center rounded-full glass ring-1 ring-white/5 text-slate-300 transition-all duration-300 hover:border-aurora-cyan/60 hover:text-aurora-cyan hover:shadow-[0_0_24px_-6px_rgba(var(--glow-w),0.7)]">
          <FiMail />
        </a>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 2 }}
        onClick={() => scrollToId("about")}
        aria-label="Scroll down"
        data-cursor
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="text-aurora-cyan"
        >
          <FiChevronDown />
        </motion.div>
      </motion.button>
    </section>
  );
}