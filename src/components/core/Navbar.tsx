"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMoon, FiSun } from "react-icons/fi";
import { NAV_LINKS, PROFILE } from "@/lib/data/profile";
import { scrollToId } from "@/hooks/useSmoothScroll";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export function Navbar({ active }: { active: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    setTimeout(() => scrollToId(id), open ? 450 : 0);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={active ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className={cn(
          "fixed inset-x-0 top-0 z-[60] transition-all duration-500",
          scrolled ? "py-3" : "py-5",
        )}
      >
        <nav
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8",
            scrolled && "px-4 md:px-6",
          )}
        >
          <button
            onClick={() => go("hero")}
            aria-label="Back to top"
            data-cursor
            className="group relative z-20 flex items-center gap-3"
          >
            <span className="relative flex h-10 w-10 items-center justify-center">
              <span className="absolute inset-0 rounded-full border border-aurora-cyan/40" />
              <span className="absolute inset-0 animate-spin-slow rounded-full border-t border-aurora-cyan group-hover:animate-pulse-glow" />
              <span className="font-display text-sm font-bold text-gradient-aurora">
                {PROFILE.initials}
              </span>
            </span>
            <span className="hidden font-mono text-xs uppercase tracking-[0.3em] text-slate-300 md:block">
              {PROFILE.firstName}.dev
            </span>
          </button>

          <div className="hidden items-center gap-1 rounded-full glass px-2 py-1.5 lg:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => go(link.id)}
                data-cursor
                className="group relative rounded-full px-3.5 py-1.5 text-[13px] font-medium text-slate-300 transition-all duration-300 hover:bg-white/[0.05] hover:text-aurora-cyan hover:shadow-[0_0_18px_-8px_rgba(var(--glow-w),0.5)]"
              >
                {link.label}
                <span className="absolute inset-x-3 -bottom-0.5 h-px scale-x-0 bg-gradient-to-r from-aurora-cyan to-aurora-violet transition-transform duration-300 group-hover:scale-x-100" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              aria-label={theme === "mono" ? "Switch to colorful theme" : "Switch to monochrome theme"}
              title={theme === "mono" ? "Colorful theme" : "Monochrome theme"}
              data-cursor
              className="flex h-10 w-10 items-center justify-center rounded-full glass ring-1 ring-white/5 text-slate-300 transition-all duration-300 hover:border-aurora-cyan/60 hover:text-aurora-cyan hover:shadow-[0_0_20px_-8px_rgba(var(--glow-w),0.6)]"
            >
              {theme === "mono" ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
            </button>

            <MagneticButton
              size="sm"
              variant="primary"
              className="hidden sm:inline-flex"
              onClick={() => go("contact")}
            >
              Hire Me
            </MagneticButton>

            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              data-cursor
              className="relative z-20 flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full glass ring-1 ring-white/5 transition-all duration-300 hover:border-aurora-cyan/50 hover:shadow-[0_0_20px_-8px_rgba(var(--glow-w),0.6)] lg:hidden"
            >
              <span
                className={cn(
                  "h-px w-5 bg-slate-200 transition-all duration-300",
                  open && "translate-y-[3.5px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "h-px w-5 bg-slate-200 transition-all duration-300",
                  open && "-translate-y-[3.5px] -rotate-45",
                )}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[55] flex flex-col justify-center bg-void/80 backdrop-blur-2xl lg:hidden"
          >
            <div className="absolute inset-0 grid-bg opacity-30" />
            <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-aurora-violet/20 blur-[130px]" />
            <div className="relative z-10 flex flex-col gap-2 px-8">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => go(link.id)}
                  className="group flex items-center gap-4 py-3 text-left"
                >
                  <span className="font-mono text-xs text-aurora-cyan/70">
                    0{i + 1}
                  </span>
                  <span className="font-display text-4xl font-bold text-slate-200 transition-colors group-hover:text-gradient-aurora">
                    {link.label}
                  </span>
                </motion.button>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6"
              >
                <MagneticButton variant="primary" size="lg" onClick={() => go("contact")}>
                  Hire Me
                </MagneticButton>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}