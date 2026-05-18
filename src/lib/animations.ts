/**
 * Reusable GSAP / ScrollTrigger animation configurations.
 * Import these into section components for consistent motion.
 */

import type { gsap as GsapType } from "gsap";

// ─── Type helpers ─────────────────────────────────────────────────────────────

export type GsapVars = Parameters<typeof GsapType.to>[1];
export type ScrollTriggerVars = {
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  once?: boolean;
  toggleActions?: string;
};

// ─── Motion preference ────────────────────────────────────────────────────────

/**
 * Returns true if the user has requested reduced motion.
 * Use this to skip GSAP animations when appropriate.
 *
 * @example
 * useEffect(() => {
 *   if (shouldReduceMotion()) return;
 *   gsap.to(ref.current, fadeUpConfig.tween);
 * }, []);
 */
export function shouldReduceMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ─── Tween presets ────────────────────────────────────────────────────────────

/** Fade up from y:40 — standard entrance */
export const fadeUpConfig = {
  from: { opacity: 0, y: 40 } satisfies GsapVars,
  to:   { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" } satisfies GsapVars,
  scrollTrigger: {
    start: "top 85%",
    end: "top 60%",
    toggleActions: "play none none none",
    once: true,
  } satisfies ScrollTriggerVars,
};

/** Fade in from x:-60 (left column reveal) */
export const fadeLeftConfig = {
  from: { opacity: 0, x: -60 } satisfies GsapVars,
  to:   { opacity: 1, x: 0, duration: 0.9, ease: "power3.out" } satisfies GsapVars,
  scrollTrigger: {
    start: "top 80%",
    toggleActions: "play none none none",
    once: true,
  } satisfies ScrollTriggerVars,
};

/** Fade in from x:60 (right column reveal) */
export const fadeRightConfig = {
  from: { opacity: 0, x: 60 } satisfies GsapVars,
  to:   { opacity: 1, x: 0, duration: 0.9, ease: "power3.out" } satisfies GsapVars,
  scrollTrigger: {
    start: "top 80%",
    toggleActions: "play none none none",
    once: true,
  } satisfies ScrollTriggerVars,
};

/** Scale in — for cards and chips */
export const scaleInConfig = {
  from: { opacity: 0, scale: 0.9 } satisfies GsapVars,
  to:   { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.4)" } satisfies GsapVars,
  scrollTrigger: {
    start: "top 88%",
    toggleActions: "play none none none",
    once: true,
  } satisfies ScrollTriggerVars,
};

// ─── Stagger presets ──────────────────────────────────────────────────────────

export const staggerConfig = {
  /** Default stagger between sibling elements */
  default: 0.1,
  /** Tight stagger for many small elements (chips, icons) */
  tight: 0.05,
  /** Loose stagger for large sections / rows */
  loose: 0.15,
  /** Section-level stagger */
  section: 0.2,
};

// ─── ScrollTrigger defaults ───────────────────────────────────────────────────

export const scrollDefaults: ScrollTriggerVars = {
  start: "top 85%",
  end: "top 60%",
  toggleActions: "play none none none",
  once: true,
};

/** Scrubbed ScrollTrigger — for timeline / line-draw effects */
export const scrubDefaults: ScrollTriggerVars = {
  start: "top 60%",
  end: "bottom 60%",
  scrub: 1,
};
