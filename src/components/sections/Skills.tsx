"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SKILLS, type Skill } from "@/lib/data/skills";
import { viewportOnce } from "@/lib/animations";
import { FaPython, FaReact, FaDocker, FaAws, FaDatabase, FaGitAlt, FaBolt, FaVideo, FaEye, FaNetworkWired, FaLeaf, FaWandMagicSparkles, FaBrain, FaXmark, FaJava, FaNodeJs, FaCode, FaHtml5 } from "react-icons/fa6";
import { TbBrandNextjs } from "react-icons/tb";
import { SiTailwindcss, SiExpress } from "react-icons/si";
import { useThemedAccent } from "@/lib/theme";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  python: FaPython,
  java: FaJava,
  sql: FaCode,
  brain: FaBrain,
  neural: FaNetworkWired,
  eye: FaEye,
  camera: FaVideo,
  bolt: FaBolt,
  next: TbBrandNextjs,
  react: FaReact,
  node: FaNodeJs,
  express: SiExpress,
  tailwind: SiTailwindcss,
  html: FaHtml5,
  docker: FaDocker,
  aws: FaAws,
  database: FaDatabase,
  leaf: FaLeaf,
  git: FaGitAlt,
  spark: FaWandMagicSparkles,
};

function Cube({ skill, index, onOpen }: { skill: Skill; index: number; onOpen: () => void }) {
  const accent = useThemedAccent();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, y: 40, rotateX: 20 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={viewportOnce}
      transition={{ delay: (index % 7) * 0.07, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onOpen}
      aria-label={`Learn more about ${skill.name}`}
      data-cursor
      className="group relative mx-auto flex h-[130px] w-[130px] items-center justify-center [perspective:700px] md:h-[150px] md:w-[150px]"
      style={undefined}
    >
      {/* emitted particles on hover */}
      {hovered &&
        Array.from({ length: 6 }).map((_, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="pointer-events-none absolute h-1.5 w-1.5 rounded-full"
            style={{ background: accent(skill.accent), boxShadow: `0 0 10px ${accent(skill.accent)}` }}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{
              x: Math.cos((i / 6) * Math.PI * 2) * 80,
              y: Math.sin((i / 6) * Math.PI * 2) * 80,
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        ))}

      {/* glow floor */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 h-6 w-16 rounded-full blur-xl transition-opacity duration-500"
        style={{ background: accent(skill.accent), opacity: hovered ? 0.55 : 0.25 }}
      />

      <motion.div
        className="relative h-[86px] w-[86px] [transform-style:preserve-3d] md:h-[100px] md:w-[100px]"
        animate={{ rotateX: hovered ? 32 : -18, rotateY: hovered ? -38 : 24 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={undefined}
      >
        {/* six glass faces */}
        {["front", "back", "right", "left", "top", "bottom"].map((f) => (
          <div
            key={f}
            className="absolute inset-0 flex items-center justify-center rounded-xl border border-white/10 transition-shadow duration-500"
            style={{
              background: `linear-gradient(150deg, ${accent(skill.accent)}1e, rgba(255,255,255,0.02))`,
              transform: `${
                f === "front" ? "translateZ(43px)" :
                f === "back" ? "rotateY(180deg) translateZ(43px)" :
                f === "right" ? "rotateY(90deg) translateZ(43px)" :
                f === "left" ? "rotateY(-90deg) translateZ(43px)" :
                f === "top" ? "rotateX(90deg) translateZ(43px)" :
                "rotateX(-90deg) translateZ(43px)"
              }`,
              boxShadow: hovered ? `0 0 34px -6px ${accent(skill.accent)}aa` : `0 0 22px -10px ${accent(skill.accent)}66`,
            }}
          />
        ))}
        <div
          className="absolute inset-0 flex items-center justify-center text-3xl transition-transform duration-500 md:text-4xl"
          style={{ color: accent(skill.accent), transform: "translateZ(44px)", filter: hovered ? `drop-shadow(0 0 10px ${accent(skill.accent)})` : "none" }}
        >
          {(() => { const I = ICONS[skill.icon] ?? FaBolt; return <I />; })()}
        </div>
      </motion.div>

      <span className="pointer-events-none mt-14 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400 transition-colors group-hover:text-foreground">
        {skill.name}
      </span>
    </motion.button>
  );
}

function SkillModal({ skill, onClose }: { skill: Skill; onClose: () => void }) {
  const accent = useThemedAccent();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[75] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-void/70 backdrop-blur-xl" onClick={onClose} />
      <motion.div
        initial={{ y: 60, scale: 0.94 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 40, scale: 0.95 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl glass-strong p-8"
      >
        <button onClick={onClose} aria-label="Close" data-cursor
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full glass ring-1 ring-white/5 text-slate-300 transition-all duration-300 hover:rotate-90 hover:border-aurora-cyan/60 hover:text-aurora-cyan hover:shadow-[0_0_18px_-8px_rgba(var(--glow-w),0.6)]">
          <FaXmark />
        </button>

        <div className="relative flex items-center gap-5">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
            style={{ background: `${accent(skill.accent)}1a`, border: `1px solid ${accent(skill.accent)}44`, boxShadow: `0 0 30px -8px ${accent(skill.accent)}`, color: accent(skill.accent) }}
          >
            {(() => { const I = ICONS[skill.icon] ?? FaBolt; return <I />; })()}
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold text-foreground">{skill.name}</h3>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">{skill.category}</span>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-end justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">Mastery</span>
            <span className="font-display text-3xl font-bold" style={{ color: accent(skill.accent) }}>{skill.level}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${skill.level}%` }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${accent(skill.accent)}, ${accent(skill.accent)}88)`, boxShadow: `0 0 12px ${accent(skill.accent)}` }}
            />
          </div>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-slate-300">{skill.blurb}</p>

        <div className="mt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">In practice</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {skill.uses.map((u) => (
              <span key={u} className="rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-slate-300" style={{ boxShadow: `inset 0 -2px 0 ${accent(skill.accent)}33` }}>
                {u}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Skills() {
  const accent = useThemedAccent();
  const [selected, setSelected] = useState<Skill | null>(null);

  return (
    <section id="skills" className="relative overflow-hidden py-28 md:py-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-bg opacity-20" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          index="05"
          kicker="capability matrix"
          title="A toolkit built"
          gradientWord="for shipping."
          align="center"
          subtitle="Hover to rotate the glass cubes. Click one to pop the hood."
        />

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {SKILLS.map((skill, i) => (
            <Cube key={skill.id} skill={skill} index={i} onOpen={() => setSelected(skill)} />
          ))}
        </div>
      </div>

      <AnimatePresence>{selected && <SkillModal skill={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
    </section>
  );
}