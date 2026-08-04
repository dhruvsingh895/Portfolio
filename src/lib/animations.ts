import type { Variants, Transition } from "framer-motion";

export const EASE = [0.16, 1, 0.3, 1] as const;
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.83, 0, 0.17, 1] as const;

export const TRANSITION: Transition = {
  duration: 1,
  ease: EASE,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE, delay: i * 0.08 },
  }),
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 1.2, ease: EASE, delay: i * 0.1 },
  }),
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: EASE, delay: i * 0.08 },
  }),
};

export const blurIn: Variants = {
  hidden: { opacity: 0, filter: "blur(16px)", y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 1.1, ease: EASE, delay: i * 0.1 },
  }),
};

export const letterVariant: Variants = {
  hidden: { opacity: 0, y: "110%", rotateX: -45 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.8, ease: EASE, delay: i * 0.035 },
  }),
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: (stagger: number = 0.08) => ({
    transition: { staggerChildren: stagger, delayChildren: 0.1 },
  }),
};

export const lineReveal: Variants = {
  hidden: { scaleX: 0 },
  visible: (i: number = 0) => ({
    scaleX: 1,
    transition: { duration: 1.4, ease: EASE, delay: i * 0.15 },
  }),
};

export const slideIn: Variants = {
  hidden: (dir: "left" | "right" = "left") => ({
    opacity: 0,
    x: dir === "left" ? -80 : 80,
  }),
  visible: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 1.1, ease: EASE, delay: i * 0.08 },
  }),
};

export const viewportOnce = { once: true, margin: "-80px" } as const;

export const sectionHeadingVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: EASE, delay: i * 0.1 },
  }),
};
