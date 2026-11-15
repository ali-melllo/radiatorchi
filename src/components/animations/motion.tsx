"use client";

import { useRef, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { LazyMotion, MotionConfig, domAnimation, m, useScroll, useTransform } from "motion/react";
import { EASE, revealVariants, staggerContainer, type RevealDirection } from "./variants";

/** Loads only the DOM animation features and honors prefers-reduced-motion app-wide. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

type TriggerProps = {
  children: ReactNode;
  className?: string;
  /** Animate on mount (above the fold) instead of when scrolled into view. */
  immediate?: boolean;
};

function triggerProps(immediate?: boolean) {
  return immediate
    ? ({ initial: "hidden", animate: "show" } as const)
    : ({ initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-80px" } } as const);
}

export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  immediate,
}: TriggerProps & { direction?: RevealDirection; delay?: number }) {
  const rtl = useLocale() === "fa";
  const variants = revealVariants(direction, rtl);
  return (
    <m.div
      className={className}
      variants={{ ...variants, show: { ...(variants.show as object), transition: { duration: 0.6, ease: EASE, delay } } }}
      {...triggerProps(immediate)}
    >
      {children}
    </m.div>
  );
}

export function Stagger({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  immediate,
  as = "div",
}: TriggerProps & { stagger?: number; delay?: number; as?: "div" | "ul" | "ol" }) {
  const Comp = m[as] as typeof m.div;
  return (
    <Comp className={className} variants={staggerContainer(stagger, delay)} {...triggerProps(immediate)}>
      {children}
    </Comp>
  );
}

export function StaggerItem({
  children,
  className,
  direction = "up",
  as = "div",
}: { children: ReactNode; className?: string; direction?: RevealDirection; as?: "div" | "li" }) {
  const rtl = useLocale() === "fa";
  const Comp = m[as] as typeof m.div;
  return (
    <Comp className={className} variants={revealVariants(direction, rtl)}>
      {children}
    </Comp>
  );
}

/** Wipes an image/frame into view. */
export function ImageReveal({ children, className, immediate }: TriggerProps) {
  return (
    <m.div
      className={className}
      variants={{
        hidden: { clipPath: "inset(0 0 100% 0)", opacity: 0.6 },
        show: { clipPath: "inset(0 0 0% 0)", opacity: 1, transition: { duration: 0.9, ease: EASE } },
      }}
      {...triggerProps(immediate)}
    >
      {children}
    </m.div>
  );
}

/** Subtle vertical parallax (transform only). */
export function Parallax({ children, className, offset = 24 }: { children: ReactNode; className?: string; offset?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
  return (
    <div ref={ref} className={className}>
      <m.div style={{ y }}>{children}</m.div>
    </div>
  );
}

/** Coolant-line that draws itself once. */
export function DrawLine({ d, className }: { d: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 600 600" fill="none" aria-hidden="true" preserveAspectRatio="none">
      <m.path
        d={d}
        stroke="var(--brand)"
        strokeWidth={3}
        strokeLinecap="square"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: EASE, delay: 0.5 }}
      />
    </svg>
  );
}

/** Scroll-linked vertical rule used by the ordering timeline. */
export function GrowLine({ className }: { className?: string }) {
  return (
    <m.span
      aria-hidden="true"
      className={className}
      style={{ originY: 0 }}
      initial={{ scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true, margin: "-20%" }}
      transition={{ duration: 1.2, ease: EASE }}
    />
  );
}
