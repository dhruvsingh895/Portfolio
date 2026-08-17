"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });
  const pct = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const [displayPct, setDisplayPct] = useState(0);
  const [show, setShow] = useState(false);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const unsub = pct.on("change", (v) => setDisplayPct(Math.round(v)));
    const onScroll = () => {
      setShow(window.scrollY > 400);
      setAtBottom(window.scrollY + window.innerHeight > document.body.scrollHeight - 200);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      unsub();
      window.removeEventListener("scroll", onScroll);
    };
  }, [pct]);

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-aurora-cyan via-aurora-violet to-aurora-magenta shadow-[0_0_12px_rgba(var(--glow-g),0.7)]"
        style={{ scaleX }}
      />
      <motion.div
        aria-hidden
        initial={false}
        animate={{ opacity: show && !atBottom ? 1 : 0, x: show && !atBottom ? 0 : 24 }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="fixed bottom-6 right-6 z-[70] hidden items-center gap-2 rounded-full glass px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-300 md:flex"
      >
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon shadow-[0_0_8px_rgba(var(--glow-w),0.9)]" />
        {displayPct}%
        <span className="text-slate-600">scrolled</span>
      </motion.div>
    </>
  );
}