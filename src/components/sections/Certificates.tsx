"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CERTIFICATES, type Certificate } from "@/lib/data/achievements";
import { viewportOnce } from "@/lib/animations";
import { FaArrowUpRightFromSquare, FaCertificate } from "react-icons/fa6";
import { useThemedAccent } from "@/lib/theme";

function FlipCard({ cert, index }: { cert: Certificate; index: number }) {
  const accent = useThemedAccent();
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ delay: (index % 4) * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group h-[340px] [perspective:1200px]"
    >
      <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* front */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-surface to-abyss p-8 text-center [backface-visibility:hidden]">
          <div className="absolute inset-0 rounded-3xl opacity-30 transition-opacity duration-500 group-hover:opacity-60"
            style={{ background: `radial-gradient(circle at 50% 0%, ${accent(cert.accent)}33, transparent 60%)` }} />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl text-3xl"
            style={{ background: `${accent(cert.accent)}14`, border: `1px solid ${accent(cert.accent)}44`, color: accent(cert.accent), boxShadow: `0 0 28px -8px ${accent(cert.accent)}` }}>
            <FaCertificate />
          </div>
          <h3 className="relative font-display text-lg font-bold leading-snug text-foreground">{cert.title}</h3>
          <p className="relative font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500">{cert.issuer}</p>
          <p className="relative font-mono text-[10px] uppercase tracking-[0.25em] text-slate-600">{cert.date}</p>
          <div className="relative h-0.5 w-10 rounded-full" style={{ background: accent(cert.accent), boxShadow: `0 0 10px ${accent(cert.accent)}` }} />
          <p className="relative font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">hover to flip</p>
        </div>

        {/* back */}
        <div className="absolute inset-0 flex flex-col rounded-3xl border border-white/15 bg-abyss p-7 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="absolute inset-0 rounded-3xl opacity-20"
            style={{ background: `radial-gradient(circle at 80% 20%, ${accent(cert.accent)}44, transparent 55%)` }} />
          <div className="relative">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">Skills gained</span>
              <span style={{ color: accent(cert.accent) }}>#{cert.id.split("-")[0]}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {cert.skills.map((s) => (
                <span key={s} className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-slate-300">
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-6 space-y-1.5 border-t border-white/5 pt-4 font-mono text-[11px] uppercase tracking-widest text-slate-500">
              <p>Issuer · <span className="text-slate-300">{cert.issuer}</span></p>
              <p>Date · <span className="text-slate-300">{cert.date}</span></p>
            </div>
            {cert.url && (
              <a
                href={cert.url}
                target="_blank"
                rel="noreferrer"
                data-cursor
                data-cursor-label="Flip"
                className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-void transition-transform hover:scale-105"
                style={{ background: `linear-gradient(120deg, ${accent(cert.accent)}, ${accent(cert.accent)}aa)`, boxShadow: `0 0 26px -6px ${accent(cert.accent)}` }}
              >
                View Certificate <FaArrowUpRightFromSquare className="text-[10px]" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Certificates() {
  return (
    <section id="certificates" className="relative overflow-hidden py-28 md:py-40">
      <div aria-hidden className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-aurora-magenta/8 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          index="08"
          kicker="credential vault"
          title="A collection of"
          gradientWord="certificates."
          align="center"
          subtitle="Flip the collectibles — the back reveals exactly what each one unlocked."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CERTIFICATES.map((cert, i) => (
            <FlipCard key={cert.id} cert={cert} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}