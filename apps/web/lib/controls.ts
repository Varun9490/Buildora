/**
 * Component-specific controls — single source of truth.
 * Every entry maps 1:1 to a real prop the component accepts.
 * NEVER show a control that does not affect the rendered component.
 *
 * Generic preview-only `scale` is allowed as a visual aid but is
 * clearly marked and never presented as a component prop.
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
};

/**
 * Per-component controls derived from actual implementation props.
 * Verified against packages/components/src/*.
 */
export const COMPONENT_CONTROLS: Record<string, ControlDef[]> = {
  "magnetic-button": [
    { kind: "slider", key: "strength", label: "Magnetic strength", min: 0, max: 1, step: 0.05, prop: "strength" },
    { kind: "slider", key: "radius", label: "Effect radius (px)", min: 40, max: 260, step: 5, prop: "radius" },
    { kind: "select", key: "variant", label: "Variant", options: ["accent", "ghost", "iris"], prop: "variant" },
    { kind: "toggle", key: "glow", label: "Glow", prop: "glow" },
  ],
  "liquid-button": [
    { kind: "slider", key: "intensity", label: "Goo intensity", min: 0, max: 1, step: 0.05, prop: "intensity" },
  ],
  "magnetic-card": [
    { kind: "slider", key: "tilt", label: "Tilt (deg)", min: 0, max: 20, step: 1, prop: "tilt" },
  ],
  "slingshot-otp": [
    { kind: "slider", key: "length", label: "Code length", min: 4, max: 8, step: 1, prop: "length" },
  ],
  "particle-field": [
    { kind: "slider", key: "count", label: "Particle count", min: 10, max: 200, step: 5, prop: "count" },
  ],
  "advanced-table": [
    { kind: "slider", key: "pageSize", label: "Rows per page", min: 3, max: 12, step: 1, prop: "pageSize" },
  ],
  "spreadsheet-grid": [
    { kind: "slider", key: "pageSize", label: "Rows per page", min: 3, max: 12, step: 1, prop: "pageSize" },
  ],
  "query-builder": [
    { kind: "slider", key: "pageSize", label: "Rows per page", min: 3, max: 12, step: 1, prop: "pageSize" },
  ],
  "audit-log": [
    { kind: "slider", key: "pageSize", label: "Rows per page", min: 3, max: 12, step: 1, prop: "pageSize" },
  ],
  "version-history": [
    { kind: "slider", key: "pageSize", label: "Rows per page", min: 3, max: 12, step: 1, prop: "pageSize" },
  ],
  // Components with no tunable numeric props expose zero controls.
  // The UI then shows an honest "no tunable props" state.
  "cursor-spotlight": [],
  "aurora-background": [],
  "morphing-typography": [],
  "holographic-card": [],
  "interactive-3d-card": [],
  "tactile-loader": [],
  "creative-notifications": [],
  "streaming-chat": [],
  "token-meter": [],
  "model-selector": [],
  "tool-call-viz": [],
  "agent-timeline": [],
  "interactive-dropzone": [],
  "attachment-prompt": [],
  "ai-review-edit": [],
  "diff-viewer": [],
  "json-viewer": [],
  "log-viewer": [],
  "webhook-viewer": [],
  terminal: [],
  "api-request-builder": [],
  "file-tree": [],
  "code-editor": [],
  "rich-text-editor": [],
  "slash-commands": [],
  "env-manager": [],
  "feature-flags": [],
  "cron-builder": [],
  "timeline-editor": [],
  "workflow-builder": [],
  "node-editor": [],
  "pricing-table": [],
  "usage-dashboard": [],
  "team-switcher": [],
  "invite-flow": [],
  "onboarding-checklist": [],
  "approval-workflow": [],
  "command-palette": [],
  "spatial-command-palette": [],
  kanban: [],
  calendar: [],
  "markdown-editor": [],
  "mention-input": [],
  "comment-thread": [],
};

export function controlsFor(slug: string): ControlDef[] {
  return COMPONENT_CONTROLS[slug] ?? [];
}

/** Keys that are real component props (excludes preview-only helpers). */
export function realPropKeys(slug: string): string[] {
  return controlsFor(slug).map((c) => c.prop);
}
