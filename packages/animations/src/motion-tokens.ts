/**
 * Buildora Fluid Motion Tokens — The shared motion language.
 * Springs drive pointer-reactive effects; easings drive layout choreography.
 * Every animated component reads from here — one source, one feel.
 */

export const springs = {
  /** Hover/selection — gentle settle */
  gentle: { stiffness: 170, damping: 26, mass: 1 },
  /** Press/switch — crisp snap */
  snappy: { stiffness: 320, damping: 28, mass: 0.9 },
  /** Wobble/glare overshoot — playful bounce */
  bouncy: { stiffness: 220, damping: 14, mass: 1 },
  /** Modal/overlay — decisive, no bounce */
  stiff: { stiffness: 480, damping: 34, mass: 1 },
  /** Hero/drag fluid drift — the React-Bits signature */
  fluid: { stiffness: 120, damping: 18, mass: 1.1 },
  /** Magnetic attraction — tight, floaty */
  magnetic: { stiffness: 260, damping: 22, mass: 0.7 },
} as const;

export type SpringPreset = keyof typeof springs;

export const easings = {
  /** Layout enter — Apple spring curve */
  enter: "cubic-bezier(0.16, 1, 0.3, 1)",
  /** Exit — quiet fade */
  exit: "cubic-bezier(0.4, 0, 1, 1)",
  /** Emphasized — for hero scrub */
  emphasized: "cubic-bezier(0.2, 0, 0, 1)",
} as const;

export const durations = {
  instant: 90,
  fast: 160,
  base: 260,
  slow: 460,
  epic: 800,
} as const;

/** Framer Motion variant — fade + rise (default stagger child) */
export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } },
};

/** Framer Motion variant — scale from 0.96 */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

/** Framer Motion container — staggers children */
export const stagger = (staggerMs = 0.06, delayMs = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: staggerMs, delayChildren: delayMs },
  },
});

/** Map a spring preset to a motion transition */
export function springTransition(preset: SpringPreset = "gentle") {
  const { stiffness, damping, mass } = springs[preset];
  return { type: "spring" as const, stiffness, damping, mass };
}
