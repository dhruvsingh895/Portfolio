"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { sceneBus } from "@/lib/sceneBus";
import { BinaryRain } from "./BinaryRain";
import { PROFILE } from "@/lib/data/profile";

const BOOT_STEPS = [
  "Loading Intelligence…",
  "Initializing Neural Core…",
  "Connecting Knowledge Graph…",
  "Rendering Experience…",
];

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [rainActive, setRainActive] = useState(true);
  const doneRef = useRef(false);

  const reduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useEffect(() => {
    if (doneRef.current) return;
    doneRef.current = true;

    const steps = stepsRef.current?.querySelectorAll("[data-step]") ?? [];
    const tl = gsap.timeline({
      onUpdate: () => {
        sceneBus.setProgress(tl.progress());
        setProgress(Math.round(tl.progress() * 100));
        if (barRef.current) barRef.current.style.width = `${tl.progress() * 100}%`;
      },
      onComplete: () => {
        sceneBus.setProgress(1);
        exit();
      },
    });

    steps.forEach((stepEl) => {
      const text = stepEl.querySelector("[data-text]");
      const check = stepEl.querySelector("[data-check]");
      const hold = reduced ? 0.1 : 0.95;
      tl.fromTo(stepEl, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" })
        .to(text, { opacity: 0.35, duration: 0.3, ease: "power2.inOut" }, `+=${hold}`)
        .to(check, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(2)" }, "<");
    });

    function exit() {
      setRainActive(false);
      const root = rootRef.current;
      const bar = barRef.current;
      if (!root) return onComplete();
      gsap.to(root, {
        yPercent: -100,
        duration: 1,
        ease: "power4.inOut",
        delay: 0.25,
        onComplete: () => {
          root.style.display = "none";
          onComplete();
        },
      });
      if (bar) gsap.to(bar, { opacity: 0, duration: 0.4 });
    }

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-void"
    >
      <BinaryRain active={!reduced && rainActive} />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div
        className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-aurora-violet/20 blur-[160px] animate-blob"
      />
      <div
        className="pointer-events-none absolute -bottom-40 right-1/4 h-[420px] w-[420px] rounded-full bg-aurora-cyan/15 blur-[140px] animate-blob"
        style={{ animationDelay: "-9s" }}
      />

      <div className="relative z-10 w-[min(92vw,540px)]">
        <div className="mb-8 flex items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border border-aurora-cyan/30" />
            <div className="absolute inset-0 animate-spin-slow rounded-full border-t-2 border-aurora-cyan" />
            <div className="absolute inset-0 animate-spin-slower rounded-full border-b-2 border-aurora-magenta" />
            <div className="absolute inset-[13px] rounded-full bg-gradient-to-br from-aurora-cyan to-aurora-violet opacity-80 blur-[2px]" />
          </div>
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-slate-300">
              {PROFILE.firstName}.dev
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
              Neural core v2.6.26
            </p>
          </div>
        </div>

        <div ref={stepsRef} className="mb-10 min-h-[150px] space-y-3">
          {BOOT_STEPS.map((step) => (
            <div key={step} data-step className="flex items-center gap-3 opacity-0">
              <span
                data-check
                className="flex h-5 w-5 scale-0 items-center justify-center rounded-full border border-neon/60 text-[10px] text-neon"
              >
                ✓
              </span>
              <span
                data-text
                className="font-mono text-xs uppercase tracking-[0.2em] text-slate-200 md:text-sm"
              >
                {step}
              </span>
            </div>
          ))}
        </div>

        <div className="relative h-px w-full overflow-hidden bg-white/10">
          <div
            ref={barRef}
            className="absolute inset-y-0 left-0 h-px bg-gradient-to-r from-aurora-cyan via-aurora-violet to-aurora-magenta shadow-[0_0_12px_rgba(var(--glow-w),0.8)]"
          />
          <div className="absolute inset-y-0 left-0 w-full shimmer-line opacity-40" />
        </div>

        <div className="mt-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500">
          <span>Initializing experience</span>
          <span className="tabular-nums text-aurora-cyan">{progress}%</span>
        </div>
      </div>
    </div>
  );
}