import type { Variants } from "motion/react";

export const EASE = [0.22, 1, 0.36, 1] as const;
export type RevealDirection = "up" | "down" | "start" | "end" | "none";

/** Only transform + opacity are animated, so there is no layout shift. */
export function revealVariants(direction: RevealDirection, rtl: boolean, distance = 24): Variants {
  const sign = rtl ? -1 : 1;
  const from = {
    up: { y: distance },
    down: { y: -distance },
    start: { x: -distance * sign },
    end: { x: distance * sign },
    none: {},
  }[direction];
  return {
    hidden: { opacity: 0, ...from },
    show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.6, ease: EASE } },
  };
}

export const staggerContainer = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});
