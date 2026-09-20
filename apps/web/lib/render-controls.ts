/**
 * Shared preview-control defaults for the ComponentRenderer.
 * Kept in its own tiny module so pages can code-split the renderer itself
 * (the barrel pulls in the entire component library) while still importing
 * the control types and defaults cheaply.
 */
export type Controls = {
  strength: number;
  radius: number;
  intensity: number;
  speed: number;
  glow: boolean;
  scale: number;
  /** Real component props (component-specific controls). */
  count: number;
  length: number;
  pageSize: number;
  tilt: number;
  variant: string;
};

export const DEFAULT_RENDER_CONTROLS: Controls = {
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
};
