/**
 * Component-specific controls — single source of truth.
 * Every entry maps 1:1 to a real prop the component accepts.
 * NEVER show a control that does not affect the rendered component.
 *
 * Components with no tunable numeric props expose zero controls. The UI
 * then shows an honest "no tunable props" state rather than inventing one.
 */

export type ControlDef =
  | {
      kind: "slider";
      key: string;
      label: string;
      min: number;
      max: number;
      step: number;
      /** real prop name on the component (for docs + validation) */
      prop: string;
    }
  | { kind: "toggle"; key: string; label: string; prop: string }
  | { kind: "select"; key: string; label: string; options: string[]; prop: string };

export type ControlsState = Record<string, number | boolean | string>;

export const DEFAULT_CONTROLS: ControlsState = {
  strength: 0.35,
  radius: 120,
  intensity: 0.6,
  speed: 1,
  glow: true,
  scale: 1,
  count: 70,
  length: 6,
  pageSize: 6,
  tilt: 8,
  variant: "accent",
  effect: "shimmer",
};

/**
 * Per-component controls derived from the actual implementation props.
 * Verified against packages/components/src/*.
 */
export const COMPONENT_CONTROLS: Record<string, ControlDef[]> = {
  "magnetic-button": [
    { kind: "slider", key: "strength", label: "Magnetic strength", min: 0, max: 1, step: 0.05, prop: "strength" },
    { kind: "slider", key: "radius", label: "Effect radius (px)", min: 40, max: 260, step: 5, prop: "radius" },
    { kind: "select", key: "variant", label: "Variant", options: ["accent", "ghost", "iris"], prop: "variant" },
    { kind: "toggle", key: "glow", label: "Glow", prop: "glow" },
  ],
  "fx-button": [
    { kind: "select", key: "effect", label: "Finish", options: ["none", "shimmer", "glow", "ripple", "gradient-border", "liquid"], prop: "effect" },
    { kind: "slider", key: "rippleMs", label: "Ripple life (ms)", min: 200, max: 1200, step: 50, prop: "rippleMs" },
  ],
  "fx-card": [
    { kind: "select", key: "effect", label: "Effect", options: ["tilt", "spotlight", "glare", "holographic", "wobble", "glass", "flip"], prop: "effect" },
    { kind: "slider", key: "tiltMax", label: "Tilt (deg)", min: 0, max: 20, step: 1, prop: "tiltMax" },
  ],
  "cursor-fx": [
    { kind: "select", key: "mode", label: "Mode", options: ["glow", "spotlight", "trail", "blob", "ghost"], prop: "mode" },
    { kind: "slider", key: "size", label: "Size (px)", min: 80, max: 480, step: 10, prop: "size" },
  ],
  "text-fx": [
    { kind: "select", key: "kind", label: "Kind", options: ["typewriter", "scramble", "blur", "gradient", "glitch", "morph"], prop: "kind" },
    { kind: "slider", key: "speed", label: "Speed (ms)", min: 10, max: 200, step: 5, prop: "speed" },
  ],
  "split-text": [
    { kind: "select", key: "by", label: "Split by", options: ["word", "char", "line"], prop: "by" },
    { kind: "select", key: "variant", label: "Entrance", options: ["fade-up", "fade", "blur", "slide", "scale"], prop: "variant" },
    { kind: "slider", key: "stagger", label: "Stagger (ms)", min: 0, max: 150, step: 5, prop: "stagger" },
  ],
  "backdrop": [
    { kind: "select", key: "variant", label: "Variant", options: ["aurora", "grid", "dots", "noise", "mesh", "beams", "rise", "meteors", "ripple"], prop: "variant" },
    { kind: "slider", key: "count", label: "Particles", min: 10, max: 120, step: 5, prop: "count" },
  ],
  "particle-field": [
    { kind: "slider", key: "count", label: "Particles", min: 10, max: 200, step: 10, prop: "count" },
  ],
  "slingshot-otp": [
    { kind: "slider", key: "length", label: "Code length", min: 4, max: 8, step: 1, prop: "length" },
  ],
  "hold-button": [
    { kind: "slider", key: "holdDuration", label: "Hold time (ms)", min: 300, max: 3000, step: 100, prop: "holdDuration" },
  ],
  "spring-carousel": [
    { kind: "slider", key: "visible", label: "Visible", min: 1, max: 3, step: 1, prop: "visible" },
    { kind: "slider", key: "stiffness", label: "Stiffness", min: 60, max: 480, step: 10, prop: "stiffness" },
    { kind: "slider", key: "damping", label: "Damping", min: 8, max: 60, step: 1, prop: "damping" },
  ],
  "elastic-slider": [
    { kind: "slider", key: "max", label: "Max", min: 10, max: 200, step: 5, prop: "max" },
    { kind: "slider", key: "step", label: "Step", min: 0.5, max: 20, step: 0.5, prop: "step" },
  ],
  "detent-dial": [
    { kind: "slider", key: "sweep", label: "Sweep (deg)", min: 90, max: 360, step: 15, prop: "sweep" },
    { kind: "slider", key: "size", label: "Size (px)", min: 80, max: 240, step: 10, prop: "size" },
  ],
  "liquid-gauge": [
    { kind: "slider", key: "value", label: "Value", min: 0, max: 100, step: 1, prop: "value" },
    { kind: "select", key: "variant", label: "Variant", options: ["default", "success", "warning", "danger"], prop: "variant" },
  ],
  "segmented-control": [
    { kind: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], prop: "size" },
  ],
  "grab-roller-strip": [
    { kind: "slider", key: "itemWidth", label: "Item width (px)", min: 48, max: 160, step: 4, prop: "itemWidth" },
  ],
  "advanced-table": [
    { kind: "slider", key: "pageSize", label: "Rows per page", min: 3, max: 12, step: 1, prop: "pageSize" },
  ],
  "query-builder": [
    { kind: "slider", key: "pageSize", label: "Rows per page", min: 3, max: 12, step: 1, prop: "pageSize" },
  ],
  "version-history": [
    { kind: "slider", key: "pageSize", label: "Rows per page", min: 3, max: 12, step: 1, prop: "pageSize" },
  ],
};

export function controlsFor(slug: string): ControlDef[] {
  return COMPONENT_CONTROLS[slug] ?? [];
}

/** Keys that are real component props (excludes preview-only helpers). */
export function realPropKeys(slug: string): string[] {
  return controlsFor(slug).map((c) => c.prop);
}
