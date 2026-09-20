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
  // removed liquid-button
  // removed magnetic-card
  "slingshot-otp": [
    { kind: "slider", key: "length", label: "Code length", min: 4, max: 8, step: 1, prop: "length" },
  ],
  // removed particle-field
  "advanced-table": [
    { kind: "slider", key: "pageSize", label: "Rows per page", min: 3, max: 12, step: 1, prop: "pageSize" },
  ],
  // removed spreadsheet-grid
  "query-builder": [
    { kind: "slider", key: "pageSize", label: "Rows per page", min: 3, max: 12, step: 1, prop: "pageSize" },
  ],
  // removed audit-log
  "version-history": [
    { kind: "slider", key: "pageSize", label: "Rows per page", min: 3, max: 12, step: 1, prop: "pageSize" },
  ],
  // Components with no tunable numeric props expose zero controls.
  // The UI then shows an honest "no tunable props" state.
  // removed cursor-spotlight
  // removed aurora-background
  // removed morphing-typography
  // removed holographic-card
  // removed interactive-3d-card
  // removed tactile-loader
  // removed creative-notifications
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
  // removed webhook-viewer
  terminal: [],
  // removed api-request-builder
  "file-tree": [],
  // removed code-editor
  "rich-text-editor": [],
  "slash-commands": [],
  // removed env-manager
  // removed feature-flags
  // removed cron-builder
  // removed timeline-editor
  // removed workflow-builder
  // removed node-editor
  // removed pricing-table
  // removed usage-dashboard
  // removed team-switcher
  // removed invite-flow
  // removed onboarding-checklist
  // removed approval-workflow
  // removed command-palette
  // removed spatial-command-palette
  // removed kanban
  calendar: [],
  // removed markdown-editor
  // removed mention-input
  "comment-thread": [],
  button: [],
  input: [],
  textarea: [],
  badge: [],
  switch: [],
  checkbox: [],
  "radio-group": [],
  slider: [],
  progress: [],
  spinner: [],
  skeleton: [],
  avatar: [],
  kbd: [],
  separator: [],
  tabs: [],
  accordion: [],
  toast: [],
  tooltip: [],
  dialog: [],
  "alert-dialog": [],
  sheet: [],
  drawer: [],
  popover: [],
  "dropdown-menu": [],
  "context-menu": [],
  "hover-card": [],
  "modal-stack": [],
  navbar: [],
  "floating-navbar": [],
  sidebar: [],
  "expandable-sidebar": [],
  "mobile-nav": [],
  breadcrumb: [],
  "step-nav": [],
  pagination: [],
  // removed command-bar
  // removed tui-panel
  // removed tui-status-bar
  // removed tui-header
  // removed tui-footer
  // removed tui-table
  // removed tui-tree
  // removed tui-list
  // removed tui-form
  // removed tui-select
  // removed tui-multi-select
  // removed tui-progress
  // removed tui-spinner
  // removed tui-gauge
  // removed tui-sparkline
  // removed tui-log-viewer
  // removed tui-help-overlay
  // removed tui-diff-viewer
  // removed terminal-workspace
  // removed noise-background
  // removed grid-background
  // removed dot-grid-background
  // removed gradient-mesh-background
  // removed aurora-beam-background
  // removed ripple-background
  // removed meteor-background
  // removed beam-background
  // removed glow-cursor
  // removed blob-cursor
  // removed trail-cursor
  // removed ghost-cursor
  // removed spotlight-cursor
  // removed typewriter
  // removed scrambled-text
  // removed blur-text
  // removed gradient-text
  // removed glitch-text
  // removed ripple-button
  // removed shimmer-button
  // removed glow-button
  // removed gradient-border-button
  // removed hold-button
  // removed glare-card
  // removed spotlight-card
  // removed wobble-card
  // removed glass-card
  // removed bento-grid
  // removed infinite-marquee
  "masonry-layout": [],
  "cta-block": [],
  "feature-grid": [],
  "logo-cloud": [],
  "site-footer": [],
};

export function controlsFor(slug: string): ControlDef[] {
  return COMPONENT_CONTROLS[slug] ?? [];
}

/** Keys that are real component props (excludes preview-only helpers). */
export function realPropKeys(slug: string): string[] {
  return controlsFor(slug).map((c) => c.prop);
}
