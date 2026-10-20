import { registryShadcn } from "./registry-data.generated";
import { COMPONENT_CONTROLS, type ControlDef } from "./controls";

/**
 * What each component actually does, derived from the shipped source.
 *
 * The props come from the controls map, which is only ever written from a
 * real prop. The motion behaviour is read out of the shipped file, so a page
 * cannot claim a component honours reduced motion when it does not.
 */

type RegistryEntry = {
  files?: Array<{ content?: string; target?: string }>;
};

const sourceCache = new Map<string, string>();

function sourceOf(slug: string): string {
  const cached = sourceCache.get(slug);
  if (cached !== undefined) return cached;
  const entry = (registryShadcn as Record<string, RegistryEntry>)[slug];
  const src = entry?.files?.map((f) => f.content ?? "").join("\n") ?? "";
  sourceCache.set(slug, src);
  return src;
}

/** Does the component move on its own? */
export function animates(slug: string): boolean {
  const src = sourceOf(slug);
  return /requestAnimationFrame|animate-|animation:|motion\.|springStep|useMagnetic|setInterval|setTimeout/.test(src);
}

/** Does it check the motion preference before it moves? */
export function honoursReducedMotion(slug: string): boolean {
  const src = sourceOf(slug);
  return /useReducedMotion|prefers-reduced-motion|motion-safe:/.test(src);
}

export type MotionBehaviour = {
  /** The component moves on its own. */
  animates: boolean;
  /** It checks the motion preference before it moves. */
  honours: boolean;
  /** One line, for the page. */
  summary: string;
};

export function motionBehaviour(slug: string): MotionBehaviour {
  const moves = animates(slug);
  const honours = honoursReducedMotion(slug);
  const summary = !moves
    ? "No motion of its own — nothing to reduce."
    : honours
      ? "Stops when the system asks for reduced motion, and when the app pauses all motion."
      : "Moves independently of the motion preference.";
  return { animates: moves, honours, summary };
}

/** The real props of a component, from the controls map. */
export function propsOf(slug: string): ControlDef[] {
  return COMPONENT_CONTROLS[slug] ?? [];
}

/** The named props a component accepts, for the brief an agent gets. */
export function propNames(slug: string): string[] {
  return propsOf(slug).map((c) => c.prop);
}
