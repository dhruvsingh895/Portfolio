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
      <motion.div
        variants={sectionHeadingVariants}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className={cn(
          "mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.35em] text-aurora-cyan/70 md:text-xs",
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
        className="font-display text-4xl font-bold leading-[1.02] tracking-tight text-foreground md:text-6xl lg:text-7xl"
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
