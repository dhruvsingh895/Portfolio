"use client";

import { motion } from "framer-motion";
import { sectionHeadingVariants, viewportOnce } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  index: string;
  kicker: string;
  title: string;
  gradientWord?: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  index,
  kicker,
  title,
  gradientWord,
  subtitle,
  align = "left",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div className={cn("relative mb-14 md:mb-20", centered && "text-center", className)}>
      {/* ghost numeral */}
      <motion.span
        aria-hidden
        variants={sectionHeadingVariants}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className={cn(
          "pointer-events-none absolute -top-10 select-none font-display text-[7rem] font-extrabold leading-none text-transparent opacity-[0.12] md:-top-16 md:text-[12rem]",
          centered ? "left-1/2 -translate-x-1/2" : "right-0",
        )}
        style={{ WebkitTextStroke: "1px rgba(var(--glow-w),0.5)" }}
      >
        {index}
      </motion.span>

      <motion.div
        variants={sectionHeadingVariants}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className={cn(
          "relative mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.35em] text-aurora-cyan/70 md:text-xs",
          centered && "justify-center",
        )}
      >
        <span className="h-px w-8 bg-gradient-to-r from-aurora-cyan/70 to-transparent" />
        <span>
          {index} · {kicker}
        </span>
        {centered && (
          <span className="h-px w-8 bg-gradient-to-l from-aurora-cyan/70 to-transparent" />
        )}
      </motion.div>

      <motion.h2
        variants={sectionHeadingVariants}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        custom={0.1}
        className="font-display text-4xl font-bold leading-[1.02] tracking-[-0.025em] text-foreground md:text-6xl lg:text-7xl"
      >
        {gradientWord ? (
          <>
            {title}{" "}
            <span className="text-gradient-aurora glow-text inline-block">{gradientWord}</span>
          </>
        ) : (
          title
        )}
      </motion.h2>

      <motion.span
        aria-hidden
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={viewportOnce}
        transition={{ type: "spring", bounce: 0, duration: 0.8, delay: 0.25 }}
        className={cn(
          "mt-4 block h-px w-36 bg-gradient-to-r from-aurora-cyan via-aurora-violet to-transparent",
          centered && "mx-auto bg-gradient-to-r from-transparent via-aurora-violet to-transparent",
        )}
      />

      {subtitle && (
        <motion.p
          variants={sectionHeadingVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          custom={0.2}
          className={cn(
            "mt-6 max-w-xl text-sm leading-relaxed text-slate-400 md:text-base",
            centered && "mx-auto",
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
