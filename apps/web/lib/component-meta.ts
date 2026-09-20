/**
 * Component docs metadata — powers Accessibility / Performance / Related sections.
 * Curated, not generated. Fallbacks keep every page honest when unmapped.
 */

export type PerfLevel = "lightweight" | "moderate" | "heavy";

export const PERFORMANCE: Record<string, { level: PerfLevel; note: string }> = {
  "magnetic-button": { level: "lightweight", note: "Pointer handler only; transform + opacity. No canvas." },
  "liquid-button": { level: "lightweight", note: "CSS blob; pointer-tracked custom property." },
  "magnetic-card": { level: "lightweight", note: "Tilt via transform; spotlight radial gradient." },
  "slingshot-otp": { level: "moderate", note: "rAF game loop only in game mode; standard mode is static." },
  "particle-field": { level: "moderate", note: "Canvas with DPR cap and bounded count. Reduce count on weak hardware." },
  "aurora-background": { level: "lightweight", note: "Pure CSS drift; disabled under reduced motion." },
  "streaming-chat": { level: "lightweight", note: "Interval streamer; no network. Bring your own LLM backend." },
  "advanced-table": { level: "lightweight", note: "Client filter/sort/paginate; virtualize beyond ~500 rows." },
  "spreadsheet-grid": { level: "moderate", note: "One input per cell; cap grid size for large sheets." },
  kanban: { level: "moderate", note: "HTML5 drag + keyboard move; no physics engine." },
  "node-editor": { level: "moderate", note: "Static SVG; zoom via transform scale." },
  terminal: { level: "lightweight", note: "Scrollback list; autoscroll on append." },
};

export function perfFor(slug: string): { level: PerfLevel; note: string } {
  return PERFORMANCE[slug] ?? { level: "lightweight", note: "Static UI with local state; no animation loops." };
}

export const RELATED: Record<string, string[]> = {
  "magnetic-button": ["liquid-button", "magnetic-card", "command-palette"],
  "liquid-button": ["magnetic-button", "magnetic-card"],
  "magnetic-card": ["magnetic-button", "holographic-card", "interactive-3d-card"],
  "slingshot-otp": ["interactive-dropzone", "command-palette"],
  "spatial-command-palette": ["command-palette", "slash-commands", "mention-input"],
  "command-palette": ["spatial-command-palette", "slash-commands"],
  "streaming-chat": ["attachment-prompt", "model-selector", "token-meter", "tool-call-viz", "agent-timeline", "ai-review-edit"],
  "agent-timeline": ["tool-call-viz", "streaming-chat", "audit-log"],
  "tool-call-viz": ["agent-timeline", "streaming-chat"],
  "attachment-prompt": ["streaming-chat", "interactive-dropzone"],
  "ai-review-edit": ["diff-viewer", "version-history", "comment-thread"],
  "diff-viewer": ["ai-review-edit", "version-history"],
  "advanced-table": ["spreadsheet-grid", "query-builder", "audit-log", "env-manager"],
  "spreadsheet-grid": ["advanced-table", "query-builder"],
  "query-builder": ["advanced-table", "spreadsheet-grid"],
  "audit-log": ["log-viewer", "webhook-viewer", "agent-timeline"],
  "version-history": ["diff-viewer", "ai-review-edit", "comment-thread"],
  terminal: ["file-tree", "code-editor", "api-request-builder", "command-palette"],
  "file-tree": ["terminal", "code-editor"],
  "code-editor": ["terminal", "file-tree", "rich-text-editor", "slash-commands"],
  "api-request-builder": ["terminal", "webhook-viewer", "env-manager"],
  "webhook-viewer": ["api-request-builder", "log-viewer", "audit-log"],
  "env-manager": ["api-request-builder", "feature-flags"],
  "cron-builder": ["workflow-builder", "timeline-editor"],
  "kanban": ["node-editor", "workflow-builder", "timeline-editor", "calendar", "approval-workflow"],
  "node-editor": ["kanban", "workflow-builder"],
  "workflow-builder": ["kanban", "node-editor", "approval-workflow", "cron-builder"],
  "timeline-editor": ["kanban", "workflow-builder"],
  "calendar": ["kanban", "cron-builder"],
  "markdown-editor": ["mention-input", "comment-thread", "rich-text-editor", "slash-commands"],
  "mention-input": ["slash-commands", "comment-thread", "markdown-editor"],
  "comment-thread": ["mention-input", "version-history", "ai-review-edit"],
  "rich-text-editor": ["markdown-editor", "slash-commands"],
  "slash-commands": ["mention-input", "command-palette", "rich-text-editor"],
  "pricing-table": ["usage-dashboard", "team-switcher", "onboarding-checklist"],
  "team-switcher": ["invite-flow", "pricing-table"],
  "invite-flow": ["team-switcher", "approval-workflow"],
  "approval-workflow": ["kanban", "workflow-builder", "invite-flow", "audit-log"],
  "feature-flags": ["env-manager", "audit-log"],
};

export function relatedFor(slug: string): string[] {
  return RELATED[slug] ?? [];
}

export const A11Y_NOTES: Record<string, string> = {
  "magnetic-button": "Native button; keyboard, focus ring, disabled intact. Motion off under reduced motion.",
  "slingshot-otp": "Game mode is pointer-driven; Standard Mode toggle exposes a labeled input with SR progress.",
  kanban: "Cards focusable; Alt+Arrow moves columns. Drag has a keyboard equivalent.",
  "command-palette": "Combobox/listbox with arrow-key navigation and active-descendant.",
  "spatial-command-palette": "Same combobox contract as base palette plus depth presentation.",
  "streaming-chat": "Log region with polite live updates; input labeled.",
  "token-meter": "Role meter with value now/min/max.",
  terminal: "Log region for output; command input labeled.",
  "file-tree": "Tree role with expand/collapse buttons.",
  "advanced-table": "Semantic table; sortable headers as buttons with sort labels.",
  "spreadsheet-grid": "Every cell input labeled by column letter + row number.",
  "env-manager": "Reveal toggles use aria-pressed; copy announces via button label swap.",
  "feature-flags": "Switches expose aria-checked with accessible names.",
  "invite-flow": "Label-above-input; inline error with role alert; custom validation via noValidate.",
  "timeline-editor": "Clips are buttons with pressed state; selection announced via status.",
};

export function a11yFor(slug: string): string {
  return (
    A11Y_NOTES[slug] ??
    "Semantic HTML with labeled controls, visible focus, and reduced-motion-safe behavior."
  );
}
