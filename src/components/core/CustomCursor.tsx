"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const ringX = useSpring(x, { stiffness: 480, damping: 38, mass: 0.85 });
  const ringY = useSpring(y, { stiffness: 480, damping: 38, mass: 0.85 });
  const tailX = useSpring(x, { stiffness: 190, damping: 20, mass: 0.9 });
  const tailY = useSpring(y, { stiffness: 190, damping: 20, mass: 0.9 });

  const speed = useMotionValue(0);
  const dirSin = useMotionValue(0);
  const dirCos = useMotionValue(1);

  const sDirSin = useSpring(dirSin, { stiffness: 260, damping: 26 });
  const sDirCos = useSpring(dirCos, { stiffness: 260, damping: 26 });
  const sSpeed = useSpring(speed, { stiffness: 240, damping: 28 });

  const tailOpacity = useTransform(sSpeed, [0.05, 0.7], [0, 0.85]);
  const tailStretch = useTransform(sSpeed, [0.05, 1.4], [0.3, 1]);
  const ringStretch = useTransform(sSpeed, [0.05, 1.4], [1, 1.35]);
  const rotate = useTransform(
    [sDirSin, sDirCos],
    ([s, c]: number[]) => (Math.atan2(s, c) * 180) / Math.PI,
  );

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.body.classList.add("cursor-active");

    let lastX = 0;
    let lastY = 0;
    let lastT = 0;

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      const vx = (e.clientX - lastX) / dt;
      const vy = (e.clientY - lastY) / dt;
      const len = Math.hypot(vx, vy);
      speed.set(len);
      if (len > 0.01) {
        dirSin.set(vy / len);
        dirCos.set(vx / len);
      }
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const interactive = t.closest("a, button, [data-cursor], input, textarea, select");
      setHovering(!!interactive);
      setLabel(t.closest("[data-cursor-label]")?.getAttribute("data-cursor-label") ?? null);
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => {
      setVisible(false);
      speed.set(0);
    };
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      document.body.classList.remove("cursor-active");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [x, y, speed, dirSin, dirCos]);

  if (!enabled) return null;

  const showLabel = hovering && label;

  return (
    <>
      {/* comet tail — lags behind, stretches on the motion axis */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[99] mix-blend-screen"
        style={{
          x: tailX,
          y: tailY,
          translateX: "-50%",
          translateY: "-50%",
          rotate,
          scaleX: tailStretch,
          opacity: tailOpacity,
        }}
      >
        <div className="h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.5)_0%,rgba(34,211,238,0.28)_40%,transparent_70%)] blur-lg" />
      </motion.div>

      {/* directional ring — stretches with speed, expands on hover */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-11 w-11 mix-blend-screen"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          rotate,
        }}
        animate={{
          scale: pressed ? 0.8 : hovering ? 1.3 : 1,
          opacity: visible ? (showLabel ? 0.55 : 1) : 0,
        }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
      >
        <motion.div
          className="h-full w-full rounded-full border-[1.5px] border-aurora-purple/70 shadow-[0_0_18px_rgba(139,92,246,0.35),inset_0_0_14px_rgba(34,211,238,0.15)]"
          style={{ scaleX: ringStretch }}
        />
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-full"
          animate={{ backgroundColor: hovering ? "rgba(34,211,238,0.08)" : "rgba(34,211,238,0)" }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* sharp core dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[101]"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{
          scale: pressed ? 0.6 : hovering ? 0.5 : 1,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      >
        <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-white to-aurora-cyan shadow-[0_0_10px_rgba(255,255,255,0.8),0_0_24px_rgba(var(--glow-w),0.6)]" />
      </motion.div>

      {/* label pill on labeled targets */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[102]"
        style={{ x, y }}
        animate={{
          opacity: showLabel ? 1 : 0,
          scale: showLabel ? 1 : 0.6,
          translateX: "-50%",
          translateY: "-50%",
        }}
        transition={{ type: "spring", stiffness: 360, damping: 24 }}
      >
        <div className="flex items-center gap-2 whitespace-nowrap rounded-full border border-aurora-cyan/50 bg-void/70 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-aurora-cyan shadow-[0_0_24px_rgba(34,211,238,0.35)] backdrop-blur-md">
          <span className="h-1 w-1 rounded-full bg-aurora-cyan shadow-[0_0_8px_#fafafa]" />
          {label}
        </div>
      </motion.div>
    </>
  );
}