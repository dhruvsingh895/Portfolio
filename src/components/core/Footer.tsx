"use client";

import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";
import { FiMail, FiArrowUp } from "react-icons/fi";
import { PROFILE } from "@/lib/data/profile";
import { scrollToId } from "@/hooks/useSmoothScroll";

const SOCIALS = [
  { icon: FaGithub, label: "GitHub", href: PROFILE.socials.github },
  { icon: FaLinkedin, label: "LinkedIn", href: PROFILE.socials.linkedin },
  { icon: SiLeetcode, label: "LeetCode", href: PROFILE.socials.leetcode },
  { icon: FiMail, label: "Email", href: `mailto:${PROFILE.email}` },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-abyss/60">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-20" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[60vw] -translate-x-1/2 rounded-full bg-aurora-violet/15 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <span className="conic-border relative flex h-12 w-12 items-center justify-center rounded-full">
                <span className="absolute inset-0 rounded-full border border-aurora-cyan/40" />
                <span className="absolute inset-0 animate-spin-slow rounded-full border-t-2 border-aurora-cyan" />
                <span className="relative z-10 font-display text-base font-bold text-gradient-aurora">
                  {PROFILE.initials}
                </span>
              </span>
              <div>
                <p className="font-display text-lg font-bold">{PROFILE.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-aurora-cyan/70">
                  AI Engineer
                </p>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-slate-400">
              Building production-ready AI systems from Kanpur, India. Currently exploring agentic
              AI, edge inference, and interfaces that feel like intelligence.
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
              Navigate
            </p>
            <div className="mt-4 grid gap-2">
              {[
                ["about", "Story"],
                ["experience", "Experience"],
                ["projects", "Projects"],
                ["skills", "Skills"],
                ["contact", "Contact"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => scrollToId(id)}
                  data-cursor
                  className="group flex w-max items-center gap-2 text-sm text-slate-400 transition-colors hover:text-aurora-cyan"
                >
                  <span className="h-px w-4 bg-slate-600 transition-all duration-300 group-hover:w-6 group-hover:bg-aurora-cyan" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 md:col-start-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
              Connect
            </p>
            <div className="mt-4 flex gap-3">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  data-cursor
                  className="group relative flex h-11 w-11 items-center justify-center rounded-full glass ring-1 ring-white/5 text-slate-300 transition-all duration-300 hover:border-aurora-cyan/60 hover:text-aurora-cyan hover:shadow-[0_0_24px_-6px_rgba(var(--glow-w),0.7)]"
                >
                  <Icon className="text-lg" />
                </a>
              ))}
            </div>
            <div className="mt-8 space-y-1.5">
              <p className="text-xs text-slate-500">Based in</p>
              <p className="flex items-center gap-2 text-sm text-slate-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-neon" />
                </span>
                {PROFILE.location}
              </p>
            </div>
          </div>
        </div>

        <div className="user-select-none relative mt-14 overflow-hidden" aria-hidden>
          {/* aurora glow behind the name */}
          <div className="pointer-events-none absolute inset-x-0 -top-6 mx-auto h-40 w-[80%] rounded-full bg-gradient-to-r from-aurora-cyan/12 via-aurora-violet/20 to-aurora-magenta/12 blur-[90px]" />
          <p className="text-hue whitespace-nowrap text-center font-display text-[18vw] font-extrabold leading-none tracking-tight drop-shadow-[0_0_35px_rgba(var(--glow-g),0.45)] md:text-[13vw]">
            DHRUV SINGH
          </p>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="h-1.5 w-1.5 rounded-full bg-aurora-cyan animate-orbit shadow-[0_0_10px_rgba(var(--glow-w),0.9)]" />
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500">
            © {new Date().getFullYear()} {PROFILE.name} · Crafted with intent
          </p>
          <button
            onClick={() => scrollToId("hero")}
            data-cursor
            aria-label="Back to top"
            className="group flex h-11 w-11 items-center justify-center rounded-full glass ring-1 ring-white/5 text-slate-300 transition-all duration-300 hover:border-aurora-cyan/60 hover:text-aurora-cyan hover:shadow-[0_0_24px_-6px_rgba(var(--glow-w),0.7)]"
          >
            <FiArrowUp className="transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

export function MobileFooterCta() {
  return null;
}