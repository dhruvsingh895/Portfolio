"use client";

import { motion } from "framer-motion";
import { letterVariant, staggerContainer, viewportOnce } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  once?: boolean;
  active?: boolean;
}

export function AnimatedText({
  text,
  className,
  delay = 0,
  stagger = 0.04,
  as: Tag = "div",
  once = true,
  active,
}: AnimatedTextProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate={active !== undefined ? (active ? "visible" : "hidden") : undefined}
      whileInView={active === undefined ? "visible" : undefined}
      viewport={once ? viewportOnce : { once: false, margin: "-40px" }}
      custom={stagger}
      aria-label={text}
      className={cn("inline-block", className)}
    >
      <Tag className="sr-only">{text}</Tag>
      <span aria-hidden className="inline-block">
        {text.split(" ").map((word, wi) => (
          <span key={wi} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            {word.split("").map((char, ci) => (
              <motion.span
                key={ci}
                variants={letterVariant}
                custom={delay + wi * 4 + ci}
                className="inline-block will-change-transform"
              >
                {char}
              </motion.span>
            ))}
            {wi < text.split(" ").length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))}
      </span>
    </motion.div>
  );
}
