"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "ghost" | "outline" | "glass";
  size?: "sm" | "md" | "lg";
  href?: string;
  target?: string;
  rel?: string;
  download?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
  magnetic?: boolean;
}

const sizeClasses = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const variantClasses = {
  primary:
    "text-void bg-gradient-to-r from-neon via-aurora-cyan to-aurora-purple ring-1 ring-white/15 shadow-[0_0_24px_-4px_rgba(var(--glow-w),0.5),0_0_42px_-10px_rgba(var(--glow-w),0.5),inset_0_1px_0_rgba(255,255,255,0.35)] hover:shadow-[0_0_38px_-4px_rgba(var(--glow-w),0.8),0_0_60px_-8px_rgba(var(--glow-g),0.75),inset_0_1px_0_rgba(255,255,255,0.35)] hover:ring-white/25",
  ghost:
    "text-void bg-gradient-to-r from-aurora-magenta to-aurora-violet ring-1 ring-white/15 shadow-[0_0_24px_-4px_rgba(var(--glow-m),0.55),0_0_42px_-10px_rgba(var(--glow-g),0.55),inset_0_1px_0_rgba(255,255,255,0.35)] hover:shadow-[0_0_38px_-4px_rgba(var(--glow-m),0.85),0_0_60px_-8px_rgba(var(--glow-g),0.8),inset_0_1px_0_rgba(255,255,255,0.35)] hover:ring-white/25",
  outline:
    "border border-aurora-cyan/40 text-aurora-cyan hover:border-aurora-cyan/70 hover:bg-aurora-cyan/5 hover:text-aurora-blue hover:shadow-[0_0_30px_-10px_rgba(var(--glow-w),0.7)]",
  glass:
    "glass-strong text-foreground ring-1 ring-aurora-violet/25 hover:ring-aurora-violet/50 hover:border-aurora-violet/50 hover:shadow-[0_0_30px_-12px_rgba(var(--glow-g),0.7)]",
};

export function MagneticButton({
  children,
  className,
  variant = "ghost",
  size = "md",
  href,
  target,
  rel,
  download,
  onClick,
  type = "button",
  disabled,
  ariaLabel,
  magnetic = true,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.6 });

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    if (!magnetic || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.28);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.28);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const cls = cn(
    "group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full font-medium tracking-wide backdrop-blur-md transition-all duration-500 will-change-transform",
    sizeClasses[size],
    variantClasses[variant],
    disabled && "pointer-events-none opacity-50",
    className,
  );

  const inner = (
    <>
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  );

  const motionProps = {
    style: { x: sx, y: sy },
    onMouseMove: handleMove,
    onMouseLeave: reset,
    whileHover: { scale: 1.04 },
    whileTap: { scale: 0.96 },
  };

  if (href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        download={download}
        aria-label={ariaLabel}
        className={cls}
        data-cursor
        {...motionProps}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      onClick={onClick as (e: React.MouseEvent<HTMLButtonElement>) => void}
      aria-label={ariaLabel}
      className={cls}
      data-cursor
      {...motionProps}
    >
      {inner}
    </motion.button>
  );
}
