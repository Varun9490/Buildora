/**
 * Buildora registry source of truth.
 * Run: pnpm registry:build  → emits registry/components/*.json, registry/registry.json, registry/generated/*.json
 */

import * as fs from "node:fs";
import * as path from "node:path";

export type Compat = "Full" | "Partial" | "Experimental" | "Unsupported";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export type CatalogItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  categories: string[];
  tags: string[];
  difficulty: Difficulty;
  version: string;
  license: string;
  states?: string[];
  compat: Record<string, Compat>;
  notes?: Record<string, string>;
  dependencies?: string[];
  registryDependencies?: string[];
  files: string[];
  demoProps?: Record<string, unknown>;
};

const HONEST_SNIPPET_NOTES = {
  javascript: "Snippet-level port. React is the source of truth; no dedicated JS runtime.",
  vue: "Composition API snippet port. React is the source of truth.",
  svelte: "Svelte runes snippet port. React is the source of truth.",
  angular: "Angular @Input snippet port. React is the source of truth.",
  html: "Static markup snippet. Interactive behavior requires the React implementation.",
  tailwind: "Tailwind variant snippet, not a standalone component.",
  reactNative: "No hover/cursor on mobile; use press + haptics. Snippet port.",
  flutter: "Experimental snippet port; pointer interactions remapped to gestures.",
  swiftUI: "Experimental snippet port; pointer interactions remapped.",
  compose: "Experimental snippet port; pointer interactions remapped.",
} as const;

const R = (slug: string, compat: Partial<Record<string, Compat>>, extra: Partial<CatalogItem> = {}): CatalogItem => ({
  id: slug,
  name: extra.name ?? slug,
  slug,
  description: extra.description ?? "",
  categories: extra.categories ?? ["creative"],
  tags: extra.tags ?? [],
  difficulty: extra.difficulty ?? "intermediate",
  version: "0.1.0",
  license: "MIT",
  states: extra.states,
  compat: {
    // Honest defaults: only React is a tested Full implementation.
    // Every other framework is a hand-written snippet port.
    react: "Full",
    javascript: "Partial",
    vue: "Partial",
    svelte: "Partial",
    angular: "Partial",
    html: "Partial",
    tailwind: "Partial",
    reactNative: "Partial",
    flutter: "Experimental",
    swiftUI: "Experimental",
    compose: "Experimental",
    ...compat
  },
  notes: { ...HONEST_SNIPPET_NOTES, ...extra.notes },
  dependencies: extra.dependencies ?? [],
  registryDependencies: extra.registryDependencies,
  files: extra.files ?? [`packages/components/src/${slug}/index.tsx`],
  demoProps: extra.demoProps
});

const fullWeb = {};
const noMobile3D: Partial<Record<string, Compat>> = { reactNative: "Partial", flutter: "Experimental", swiftUI: "Experimental", compose: "Experimental" };

export const catalog: CatalogItem[] = [
  R("magnetic-button", fullWeb, { name: "Magnetic Button", description: "A real <button> with spring magnetic attraction to the cursor. Tactile, accessible, production-ready.", categories: ["creative"], tags: ["button", "magnetic", "spring", "cursor"], difficulty: "beginner", dependencies: ["clsx", "tailwind-merge"], demoProps: { strength: 0.35, radius: 120 } }),
  R("liquid-button", fullWeb, { name: "Liquid Button", description: "Gooey blob fill that follows the pointer inside a real button.", categories: ["creative"], tags: ["button", "gooey", "hover"], difficulty: "beginner" }),
  R("magnetic-card", fullWeb, { name: "Magnetic Card", description: "Pointer tilt + spotlight card with keyboard focus support.", categories: ["creative"], tags: ["card", "tilt", "spotlight"], difficulty: "beginner" }),
  R("slingshot-otp", fullWeb, { name: "Slingshot OTP", description: "Signature gamified OTP — pull digits like a slingshot. Real inputs, paste, SR fallback underneath.", categories: ["creative"], tags: ["otp", "slingshot", "spring", "signature"], difficulty: "advanced", states: ["empty", "filled", "error"] }),
  R("interactive-dropzone", fullWeb, { name: "Interactive Dropzone", description: "Proximity-reactive dropzone with progress visualization and error recovery.", categories: ["creative"], tags: ["upload", "dropzone", "magnetic"], difficulty: "intermediate" }),
  R("spatial-command-palette", fullWeb, { name: "Spatial Command Palette", description: "Keyboard-first palette with animated selection, grouped results, recents, and depth presentation.", categories: ["creative", "complex"], tags: ["command", "palette", "keyboard", "spatial"], difficulty: "advanced" }),
  R("cursor-spotlight", fullWeb, { name: "Cursor Spotlight", description: "Cursor-tracked spotlight container for any content.", categories: ["creative"], tags: ["cursor", "spotlight"], difficulty: "beginner", files: ["packages/components/src/creative-atmosphere/index.tsx"] }),
  R("aurora-background", fullWeb, { name: "Aurora Background", description: "Slow-drifting aurora blobs. Reduced-motion safe, pure CSS.", categories: ["creative"], tags: ["background", "aurora", "gradient"], difficulty: "beginner", files: ["packages/components/src/creative-atmosphere/index.tsx"], compat: { react: "Full", javascript: "Full", html: "Full", tailwind: "Full", vue: "Full", svelte: "Full", angular: "Full", reactNative: "Partial", flutter: "Partial", swiftUI: "Partial", compose: "Partial" }, notes: { reactNative: "Use LinearGradient + Animated instead of blur.", flutter: "Use BackdropFilter + CustomPaint.", swiftUI: "Use LinearGradient + blur modifiers." } }),
  R("particle-field", { ...noMobile3D, reactNative: "Experimental" }, { name: "Particle Field", description: "Lightweight canvas particle field with DPR scaling. No Three.js needed.", categories: ["creative"], tags: ["particles", "canvas"], difficulty: "intermediate", files: ["packages/components/src/creative-atmosphere/index.tsx"], notes: { reactNative: "Use react-native-skia or SVG; canvas not available.", flutter: "Use CustomPainter.", swiftUI: "Use Canvas + TimelineView." } }),
  R("morphing-typography", fullWeb, { name: "Morphing Typography", description: "Cycling display words with gradient + motion. aria-live polite.", categories: ["creative"], tags: ["typography", "animated"], difficulty: "beginner", files: ["packages/components/src/creative-atmosphere/index.tsx"] }),
  R("holographic-card", fullWeb, { name: "Holographic Card", description: "Holographic sheen that tracks the pointer.", categories: ["creative"], tags: ["card", "holographic", "hover"], difficulty: "intermediate", files: ["packages/components/src/creative-atmosphere/index.tsx"] }),
  R("interactive-3d-card", { ...noMobile3D }, { name: "Interactive 3D Card", description: "Lightweight CSS 3D flip card. Lazy-safe; no Three.js on this page.", categories: ["creative"], tags: ["3d", "flip", "card"], difficulty: "intermediate", files: ["packages/components/src/creative-atmosphere/index.tsx"], notes: { reactNative: "Use Animated + rotateY interpolation.", flutter: "Use Transform with Matrix4.", swiftUI: "Use rotation3DEffect." } }),
  R("tactile-loader", fullWeb, { name: "Tactile Loader", description: "Bouncy dot loader with role=status and SR label.", categories: ["creative"], tags: ["loader", "feedback"], difficulty: "beginner", files: ["packages/components/src/creative-atmosphere/index.tsx"] }),
  R("creative-notifications", fullWeb, { name: "Creative Notifications", description: "Stacked toast system with tones and live-region announcements.", categories: ["creative"], tags: ["toast", "notifications"], difficulty: "intermediate" }),

  R("streaming-chat", fullWeb, { name: "Streaming Chat", description: "Token-streaming chat UI with citations. Frontend only — bring your own LLM backend.", categories: ["ai-llm"], tags: ["chat", "streaming", "llm"], difficulty: "intermediate" }),
  R("model-selector", fullWeb, { name: "Model Selector", description: "Accessible model picker with status dot.", categories: ["ai-llm"], tags: ["model", "selector"], difficulty: "beginner", files: ["packages/components/src/streaming-chat/index.tsx"] }),
  R("token-meter", fullWeb, { name: "Token Meter", description: "Token usage meter with role=meter semantics.", categories: ["ai-llm"], tags: ["tokens", "usage", "meter"], difficulty: "beginner", files: ["packages/components/src/streaming-chat/index.tsx"] }),
  R("tool-call-viz", fullWeb, { name: "Tool Call Visualization", description: "Timeline of agent tool calls with running/done states.", categories: ["ai-llm"], tags: ["tools", "agent", "timeline"], difficulty: "intermediate", files: ["packages/components/src/streaming-chat/index.tsx"] }),
  R("agent-timeline", fullWeb, { name: "Agent Timeline", description: "Agent activity timeline (plan → act → observe) with status semantics.", categories: ["ai-llm"], tags: ["agent", "timeline"], difficulty: "intermediate" }),
  R("attachment-prompt", fullWeb, { name: "Attachment Prompt", description: "Prompt input with removable attachment chips and send.", categories: ["ai-llm"], tags: ["prompt", "attachments"], difficulty: "intermediate" }),
  R("ai-review-edit", fullWeb, { name: "AI Review & Edit", description: "Diff-style review UI for AI-generated content (accept / edit / reject).", categories: ["ai-llm", "content"], tags: ["review", "diff", "ai"], difficulty: "intermediate" }),

  R("advanced-table", fullWeb, { name: "Advanced Table", description: "Sortable, filterable, paginated table with semantic <table> markup.", categories: ["data"], tags: ["table", "sorting", "filter"], difficulty: "intermediate" }),
  R("spreadsheet-grid", fullWeb, { name: "Spreadsheet Grid", description: "Editable spreadsheet grid with labeled cells and keyboard-native inputs.", categories: ["data"], tags: ["grid", "spreadsheet"], difficulty: "advanced" }),
  R("json-viewer", fullWeb, { name: "JSON Viewer", description: "Collapsible JSON viewer with mono styling.", categories: ["data", "developer"], tags: ["json", "viewer"], difficulty: "beginner", files: ["packages/components/src/advanced-table/index.tsx"] }),
  R("log-viewer", fullWeb, { name: "Log Viewer", description: "Filterable log stream with role=log semantics.", categories: ["data", "developer"], tags: ["logs", "viewer"], difficulty: "beginner", files: ["packages/components/src/advanced-table/index.tsx"] }),
  R("query-builder", fullWeb, { name: "Query Builder", description: "Composable filter rows with field/operator/value and removable chips.", categories: ["data"], tags: ["filter", "query"], difficulty: "advanced" }),
  R("diff-viewer", fullWeb, { name: "Diff Viewer", description: "Side-by-side line comparison with added/removed semantics.", categories: ["data", "content"], tags: ["diff", "compare"], difficulty: "intermediate" }),

  R("terminal", fullWeb, { name: "Terminal", description: "Terminal emulator UI with scrollback + command input.", categories: ["developer"], tags: ["terminal", "cli"], difficulty: "intermediate" }),
  R("code-editor", fullWeb, { name: "Code Editor (Lite)", description: "Editable code pane with live preview. No heavy editor dep.", categories: ["developer"], tags: ["editor", "code"], difficulty: "intermediate", files: ["packages/components/src/terminal/index.tsx"] }),
  R("file-tree", fullWeb, { name: "File Tree", description: "Accessible tree with expand/collapse and keyboard support.", categories: ["developer"], tags: ["files", "tree"], difficulty: "beginner", files: ["packages/components/src/terminal/index.tsx"] }),
  R("api-request-builder", fullWeb, { name: "API Request Builder", description: "Method + URL + body editor with live response preview.", categories: ["developer"], tags: ["api", "http"], difficulty: "intermediate" }),
  R("webhook-viewer", fullWeb, { name: "Webhook Viewer", description: "Webhook event list with payload inspector.", categories: ["developer"], tags: ["webhooks", "events"], difficulty: "intermediate" }),
  R("env-manager", fullWeb, { name: "Environment Manager", description: "Masked env-var table with reveal + copy.", categories: ["developer"], tags: ["env", "secrets"], difficulty: "intermediate" }),
  R("cron-builder", fullWeb, { name: "Cron Builder", description: "Human-friendly cron expression builder with presets.", categories: ["developer"], tags: ["cron", "scheduler"], difficulty: "intermediate" }),

  R("pricing-table", fullWeb, { name: "Pricing Table", description: "Billing toggle + featured tier. Demo only — Buildora has no payments.", categories: ["saas"], tags: ["pricing", "billing"], difficulty: "beginner" }),
  R("usage-dashboard", fullWeb, { name: "Usage Dashboard", description: "Usage bars with accessible img fallback text.", categories: ["saas", "data"], tags: ["usage", "dashboard"], difficulty: "beginner", files: ["packages/components/src/pricing-table/index.tsx"] }),
  R("team-switcher", fullWeb, { name: "Team Switcher", description: "Org/team switcher with listbox semantics.", categories: ["saas"], tags: ["team", "org"], difficulty: "beginner", files: ["packages/components/src/pricing-table/index.tsx"] }),
  R("invite-flow", fullWeb, { name: "Invite Flow", description: "Validated invite form with email + role and success status.", categories: ["saas"], tags: ["invite", "team"], difficulty: "intermediate" }),
  R("onboarding-checklist", fullWeb, { name: "Onboarding Checklist", description: "Progress-tracked checklist with real checkboxes.", categories: ["saas"], tags: ["onboarding", "checklist"], difficulty: "beginner", files: ["packages/components/src/pricing-table/index.tsx"] }),
  R("approval-workflow", fullWeb, { name: "Approval Workflow", description: "Multi-step approval chain with approve/reject and progress status.", categories: ["saas", "complex"], tags: ["approval", "workflow"], difficulty: "advanced" }),
  R("audit-log", fullWeb, { name: "Audit Log", description: "Filterable immutable event log with severity semantics.", categories: ["saas", "data"], tags: ["audit", "log"], difficulty: "intermediate" }),
  R("feature-flags", fullWeb, { name: "Feature Flags", description: "Flag toggles with switch semantics and rollout labels.", categories: ["saas", "developer"], tags: ["flags", "toggles"], difficulty: "intermediate" }),

  R("command-palette", fullWeb, { name: "Command Palette", description: "Base fuzzy command palette with keyboard navigation (see Spatial variant for depth).", categories: ["complex"], tags: ["command", "keyboard"], difficulty: "intermediate" }),
  R("kanban", fullWeb, { name: "Physics Kanban", description: "Spring drag board with snap zones + Alt+Arrow keyboard movement.", categories: ["complex"], tags: ["kanban", "drag", "physics"], difficulty: "advanced" }),
  R("node-editor", fullWeb, { name: "Node Editor", description: "SVG node/edge diagram with zoom and accessible node list.", categories: ["complex"], tags: ["nodes", "diagram"], difficulty: "advanced" }),
  R("timeline-editor", fullWeb, { name: "Timeline Editor", description: "Track-based timeline with selectable clips.", categories: ["complex", "content"], tags: ["timeline"], difficulty: "advanced" }),
  R("calendar", fullWeb, { name: "Calendar", description: "Scheduling grid with gridcell semantics.", categories: ["complex"], tags: ["calendar", "scheduling"], difficulty: "intermediate", files: ["packages/components/src/kanban/index.tsx"] }),
  R("workflow-builder", fullWeb, { name: "Workflow Builder", description: "Step composer with active-step state and add/next actions.", categories: ["complex"], tags: ["workflow", "steps"], difficulty: "advanced" }),

  R("markdown-editor", fullWeb, { name: "Markdown Editor", description: "Split markdown editor with live preview.", categories: ["content"], tags: ["markdown", "editor"], difficulty: "intermediate" }),
  R("mention-input", fullWeb, { name: "Mention Input", description: "@mention autocomplete with listbox suggestions.", categories: ["content"], tags: ["mentions"], difficulty: "intermediate", files: ["packages/components/src/markdown-editor/index.tsx"] }),
  R("comment-thread", fullWeb, { name: "Comment Thread", description: "Resolve/reopen comment thread.", categories: ["content"], tags: ["comments"], difficulty: "beginner", files: ["packages/components/src/markdown-editor/index.tsx"] }),
  R("rich-text-editor", fullWeb, { name: "Rich Text Editor", description: "Toolbar + contentEditable editor with word count.", categories: ["content"], tags: ["rich-text"], difficulty: "advanced" }),
  R("slash-commands", fullWeb, { name: "Slash Commands", description: "Notion-style slash menu with fuzzy filtering.", categories: ["content"], tags: ["slash", "blocks"], difficulty: "intermediate" }),
  R("version-history", fullWeb, { name: "Version History", description: "Document version list with restore action.", categories: ["content"], tags: ["versions", "history"], difficulty: "intermediate" }),

  R("button", fullWeb, { name: "Primitive Button", description: "Base button with variants and sizes. Foundation for everything clickable.", categories: ["primitives"], tags: ["button", "foundation"], difficulty: "beginner", files: ["packages/components/src/primitives/button/index.tsx"] }),
  R("input", fullWeb, { name: "Primitive Input", description: "Labeled text input with variants, sizes, and error states.", categories: ["forms"], tags: ["input", "field"], difficulty: "beginner", files: ["packages/components/src/primitives/input/index.tsx"] }),
  R("textarea", fullWeb, { name: "Primitive Textarea", description: "Multiline text field sharing Input styling and semantics.", categories: ["forms"], tags: ["textarea", "field"], difficulty: "beginner", files: ["packages/components/src/primitives/input/index.tsx"] }),
  R("badge", fullWeb, { name: "Badge & Chip", description: "Status badges and removable chips with variant tones.", categories: ["primitives"], tags: ["badge", "chip"], difficulty: "beginner", files: ["packages/components/src/primitives/badge/index.tsx"] }),
  R("switch", fullWeb, { name: "Switch", description: "Labeled toggle switch built on a native checkbox.", categories: ["forms"], tags: ["switch", "toggle"], difficulty: "beginner", files: ["packages/components/src/primitives/switch/index.tsx"] }),
  R("checkbox", fullWeb, { name: "Checkbox", description: "Accessible checkbox with label and indeterminate support.", categories: ["forms"], tags: ["checkbox"], difficulty: "beginner", files: ["packages/components/src/primitives/checkbox/index.tsx"] }),
  R("radio-group", fullWeb, { name: "Radio Group", description: "Single-select radio set with keyboard arrow navigation.", categories: ["forms"], tags: ["radio"], difficulty: "beginner", files: ["packages/components/src/primitives/radio/index.tsx"] }),
  R("slider", fullWeb, { name: "Slider", description: "Range slider with value display and keyboard support.", categories: ["forms"], tags: ["slider", "range"], difficulty: "beginner", files: ["packages/components/src/primitives/slider/index.tsx"] }),
  R("progress", fullWeb, { name: "Progress", description: "Determinate progress bar with variant tones.", categories: ["feedback"], tags: ["progress"], difficulty: "beginner", files: ["packages/components/src/primitives/progress/index.tsx"] }),
  R("spinner", fullWeb, { name: "Spinner", description: "Activity spinner with sizes and live-region label.", categories: ["feedback"], tags: ["spinner", "loading"], difficulty: "beginner", files: ["packages/components/src/primitives/spinner/index.tsx"] }),
  R("skeleton", fullWeb, { name: "Skeleton", description: "Content placeholder matching final layout shape.", categories: ["feedback"], tags: ["skeleton", "loading"], difficulty: "beginner", files: ["packages/components/src/primitives/skeleton/index.tsx"] }),
  R("avatar", fullWeb, { name: "Avatar", description: "Identity avatar with fallback initials and group stacking.", categories: ["primitives"], tags: ["avatar"], difficulty: "beginner", files: ["packages/components/src/primitives/avatar/index.tsx"] }),
  R("kbd", fullWeb, { name: "Kbd", description: "Keyboard shortcut glyphs with chord composition.", categories: ["primitives"], tags: ["keyboard", "kbd"], difficulty: "beginner", files: ["packages/components/src/primitives/kbd/index.tsx"] }),
  R("separator", fullWeb, { name: "Separator", description: "Thematic break and divider rules for grouping content.", categories: ["primitives"], tags: ["separator", "divider"], difficulty: "beginner", files: ["packages/components/src/primitives/separator/index.tsx"] }),
  R("tabs", fullWeb, { name: "Tabs", description: "Keyboard-navigable tab set with panels.", categories: ["primitives"], tags: ["tabs"], difficulty: "beginner", files: ["packages/components/src/primitives/tabs/index.tsx"] }),
  R("accordion", fullWeb, { name: "Accordion", description: "Disclosure stack with expanded-state semantics.", categories: ["primitives"], tags: ["accordion"], difficulty: "beginner", files: ["packages/components/src/primitives/accordion/index.tsx"] }),
  R("toast", fullWeb, { name: "Toast", description: "Transient notifications via provider and toast API.", categories: ["feedback"], tags: ["toast"], difficulty: "intermediate", files: ["packages/components/src/primitives/toast/index.tsx"] }),
  R("tooltip", fullWeb, { name: "Tooltip", description: "Hover/focus description bubble for controls.", categories: ["primitives"], tags: ["tooltip"], difficulty: "beginner", files: ["packages/components/src/primitives/tooltip/index.tsx"] }),

  R("dialog", fullWeb, { name: "Dialog", description: "Focus-trapped modal dialog with overlay and escape handling.", categories: ["overlays"], tags: ["dialog", "modal"], difficulty: "intermediate", files: ["packages/components/src/overlays/dialog.tsx"] }),
  R("alert-dialog", fullWeb, { name: "Alert Dialog", description: "Confirm/cancel dialog with destructive variant.", categories: ["overlays"], tags: ["confirm", "dialog"], difficulty: "beginner", files: ["packages/components/src/overlays/alert-dialog.tsx"] }),
  R("sheet", fullWeb, { name: "Sheet", description: "Side panel sliding from any edge with focus management.", categories: ["overlays"], tags: ["panel", "side"], difficulty: "intermediate", files: ["packages/components/src/overlays/sheet.tsx"] }),
  R("drawer", fullWeb, { name: "Drawer", description: "Bottom-anchored drawer panel for mobile-first flows.", categories: ["overlays"], tags: ["panel", "drawer"], difficulty: "intermediate", files: ["packages/components/src/overlays/drawer.tsx"] }),
  R("popover", fullWeb, { name: "Popover", description: "Anchored floating panel with placement control.", categories: ["overlays"], tags: ["popover"], difficulty: "intermediate", files: ["packages/components/src/overlays/popover.tsx"] }),
  R("dropdown-menu", fullWeb, { name: "Dropdown Menu", description: "Trigger-anchored menu with items, labels, and checks.", categories: ["overlays"], tags: ["menu", "dropdown"], difficulty: "intermediate", files: ["packages/components/src/overlays/dropdown-menu.tsx"] }),
  R("context-menu", fullWeb, { name: "Context Menu", description: "Right-click menu with keyboard fallback trigger.", categories: ["overlays"], tags: ["menu", "context"], difficulty: "intermediate", files: ["packages/components/src/overlays/context-menu.tsx"] }),
  R("hover-card", fullWeb, { name: "Hover Card", description: "Delayed hover preview card with configurable side.", categories: ["overlays"], tags: ["preview", "hover"], difficulty: "beginner", files: ["packages/components/src/overlays/hover-card.tsx"] }),
  R("modal-stack", fullWeb, { name: "Modal Stack", description: "Stacked modal manager with push/pop/replace semantics.", categories: ["overlays"], tags: ["stacked", "modal"], difficulty: "advanced", files: ["packages/components/src/overlays/modal-stack.tsx"] }),

  R("navbar", fullWeb, { name: "Navbar", description: "Sticky header bar with logo, center, and actions slots.", categories: ["navigation"], tags: ["header", "navbar"], difficulty: "beginner", files: ["packages/components/src/navigation/navbar.tsx"] }),
  R("floating-navbar", fullWeb, { name: "Floating Navbar", description: "Scroll-aware floating navigation pill.", categories: ["navigation"], tags: ["floating", "navbar"], difficulty: "intermediate", files: ["packages/components/src/navigation/floating-navbar.tsx"] }),
  R("sidebar", fullWeb, { name: "Sidebar", description: "Collapsible app sidebar with sections and active state.", categories: ["navigation"], tags: ["sidebar"], difficulty: "intermediate", files: ["packages/components/src/navigation/sidebar.tsx"] }),
  R("expandable-sidebar", fullWeb, { name: "Expandable Sidebar", description: "Hover-expanding rail sidebar with delayed reveal.", categories: ["navigation"], tags: ["sidebar", "hover"], difficulty: "intermediate", files: ["packages/components/src/navigation/expandable-sidebar.tsx"] }),
  R("mobile-nav", fullWeb, { name: "Mobile Nav", description: "Bottom mobile navigation with labeled items.", categories: ["navigation"], tags: ["mobile", "bottom"], difficulty: "beginner", files: ["packages/components/src/navigation/mobile-nav.tsx"] }),
  R("breadcrumb", fullWeb, { name: "Breadcrumb", description: "Ancestor trail with current-page semantics.", categories: ["navigation"], tags: ["trail", "breadcrumb"], difficulty: "beginner", files: ["packages/components/src/navigation/breadcrumb-nav.tsx"] }),
  R("step-nav", fullWeb, { name: "Step Nav", description: "Stepper navigation with current-step state.", categories: ["navigation"], tags: ["stepper", "steps"], difficulty: "beginner", files: ["packages/components/src/navigation/step-nav.tsx"] }),
  R("pagination", fullWeb, { name: "Pagination", description: "Page controls with prev/next and numbered buttons.", categories: ["navigation"], tags: ["pages", "pagination"], difficulty: "beginner", files: ["packages/components/src/navigation/pagination.tsx"] }),
  R("command-bar", fullWeb, { name: "Command Bar", description: "Keyboard-triggered command bar with trigger and items.", categories: ["navigation"], tags: ["command", "palette"], difficulty: "intermediate", files: ["packages/components/src/navigation/command-bar.tsx"] }),

  R("tui-panel", fullWeb, { name: "TUI Panel", description: "Bordered terminal panel with title and focus state.", categories: ["developer"], tags: ["tui", "panel"], difficulty: "beginner", files: ["packages/components/src/tui/tui-panel.tsx"] }),
  R("tui-status-bar", fullWeb, { name: "TUI Status Bar", description: "Status strip with labeled values and tone colors.", categories: ["developer"], tags: ["tui", "status"], difficulty: "beginner", files: ["packages/components/src/tui/tui-status-bar.tsx"] }),
  R("tui-header", fullWeb, { name: "TUI Header", description: "Terminal header with title, subtitle, and slots.", categories: ["developer"], tags: ["tui", "header"], difficulty: "beginner", files: ["packages/components/src/tui/tui-header.tsx"] }),
  R("tui-footer", fullWeb, { name: "TUI Footer", description: "Shortcut hints and message line for terminal UIs.", categories: ["developer"], tags: ["tui", "footer"], difficulty: "beginner", files: ["packages/components/src/tui/tui-footer.tsx"] }),
  R("tui-table", fullWeb, { name: "TUI Table", description: "Monospace data table with selection support.", categories: ["developer"], tags: ["tui", "table"], difficulty: "intermediate", files: ["packages/components/src/tui/tui-table.tsx"] }),
  R("tui-tree", fullWeb, { name: "TUI Tree", description: "Expandable terminal tree with selection callbacks.", categories: ["developer"], tags: ["tui", "tree"], difficulty: "intermediate", files: ["packages/components/src/tui/tui-tree.tsx"] }),
  R("tui-list", fullWeb, { name: "TUI List", description: "Selectable terminal list with shortcuts and icons.", categories: ["developer"], tags: ["tui", "list"], difficulty: "beginner", files: ["packages/components/src/tui/tui-list.tsx"] }),
  R("tui-form", fullWeb, { name: "TUI Form", description: "Terminal form renderer with submit handling.", categories: ["developer"], tags: ["tui", "form"], difficulty: "intermediate", files: ["packages/components/src/tui/tui-form.tsx"] }),
  R("tui-select", fullWeb, { name: "TUI Select", description: "Terminal single-select with search support.", categories: ["developer"], tags: ["tui", "select"], difficulty: "beginner", files: ["packages/components/src/tui/tui-select.tsx"] }),
  R("tui-multi-select", fullWeb, { name: "TUI Multi Select", description: "Terminal multi-select with visible-count control.", categories: ["developer"], tags: ["tui", "select"], difficulty: "intermediate", files: ["packages/components/src/tui/tui-multi-select.tsx"] }),
  R("tui-progress", fullWeb, { name: "TUI Progress", description: "Block-character progress bar with tone colors.", categories: ["developer"], tags: ["tui", "progress"], difficulty: "beginner", files: ["packages/components/src/tui/tui-progress.tsx"] }),
  R("tui-spinner", fullWeb, { name: "TUI Spinner", description: "Terminal activity indicator with label.", categories: ["developer"], tags: ["tui", "spinner"], difficulty: "beginner", files: ["packages/components/src/tui/tui-spinner.tsx"] }),
  R("tui-gauge", fullWeb, { name: "TUI Gauge", description: "Capacity gauge with value, unit, and size options.", categories: ["developer"], tags: ["tui", "gauge"], difficulty: "beginner", files: ["packages/components/src/tui/tui-gauge.tsx"] }),
  R("tui-sparkline", fullWeb, { name: "TUI Sparkline", description: "Inline data sparkline with min/max readout.", categories: ["developer"], tags: ["tui", "chart"], difficulty: "beginner", files: ["packages/components/src/tui/tui-sparkline.tsx"] }),
  R("tui-log-viewer", fullWeb, { name: "TUI Log Viewer", description: "Leveled terminal log stream with filtering.", categories: ["developer"], tags: ["tui", "logs"], difficulty: "beginner", files: ["packages/components/src/tui/tui-log-viewer.tsx"] }),
  R("tui-help-overlay", fullWeb, { name: "TUI Help Overlay", description: "Keybinding reference overlay with columns.", categories: ["developer"], tags: ["tui", "help"], difficulty: "beginner", files: ["packages/components/src/tui/tui-help-overlay.tsx"] }),
  R("tui-diff-viewer", fullWeb, { name: "TUI Diff Viewer", description: "Hunk-based terminal diff with line numbers.", categories: ["developer"], tags: ["tui", "diff"], difficulty: "intermediate", files: ["packages/components/src/tui/tui-diff-viewer.tsx"] }),

  R("terminal-workspace", fullWeb, { name: "Terminal Workspace", description: "Full terminal workspace: tabs, panes, sidebar, themes, command input.", categories: ["developer"], tags: ["terminal", "workspace"], difficulty: "advanced", files: ["packages/components/src/terminal-ui/index.tsx", "packages/components/src/terminal-ui/terminal-pane.tsx", "packages/components/src/terminal-ui/terminal-sidebar.tsx", "packages/components/src/terminal-ui/terminal-tab-bar.tsx", "packages/components/src/terminal-ui/command-input.tsx", "packages/components/src/terminal-ui/terminal-theme.ts", "packages/components/src/terminal-ui/terminal-ui.ts"] }),

  R("noise-background", fullWeb, { name: "Noise Background", description: "Film-grain texture overlay for tactile surfaces.", categories: ["creative"], tags: ["background", "noise"], difficulty: "beginner", files: ["packages/components/src/backgrounds/noise-background.tsx"] }),
  R("grid-background", fullWeb, { name: "Grid Background", description: "Perspective grid with fade control.", categories: ["creative"], tags: ["background", "grid"], difficulty: "beginner", files: ["packages/components/src/backgrounds/grid-background.tsx"] }),
  R("dot-grid-background", fullWeb, { name: "Dot Grid Background", description: "Dotted lattice backdrop for technical layouts.", categories: ["creative"], tags: ["background", "dots"], difficulty: "beginner", files: ["packages/components/src/backgrounds/dot-grid-background.tsx"] }),
  R("gradient-mesh-background", fullWeb, { name: "Gradient Mesh Background", description: "Layered mesh gradient field.", categories: ["creative"], tags: ["background", "mesh"], difficulty: "beginner", files: ["packages/components/src/backgrounds/gradient-mesh-background.tsx"] }),
  R("aurora-beam-background", fullWeb, { name: "Aurora Beam Background", description: "Sweeping aurora beams over content.", categories: ["creative"], tags: ["background", "aurora"], difficulty: "beginner", files: ["packages/components/src/backgrounds/aurora-beam-background.tsx"] }),
  R("ripple-background", fullWeb, { name: "Ripple Background", description: "Pointer-reactive ripple field.", categories: ["creative"], tags: ["background", "ripple"], difficulty: "intermediate", files: ["packages/components/src/backgrounds/ripple-background.tsx"] }),
  R("meteor-background", fullWeb, { name: "Meteor Background", description: "Streaking meteor shower backdrop.", categories: ["creative"], tags: ["background", "meteor"], difficulty: "intermediate", files: ["packages/components/src/backgrounds/meteor-background.tsx"] }),
  R("beam-background", fullWeb, { name: "Beam Background", description: "Light-beam sweep backdrop.", categories: ["creative"], tags: ["background", "beam"], difficulty: "beginner", files: ["packages/components/src/backgrounds/beam-background.tsx"] }),

  R("glow-cursor", { ...noMobile3D, reactNative: "Unsupported", flutter: "Unsupported", swiftUI: "Unsupported", compose: "Unsupported" }, { name: "Glow Cursor", description: "Soft glow following the pointer. Null under reduced motion; pointer-only.", categories: ["creative"], tags: ["cursor", "glow"], difficulty: "beginner", files: ["packages/components/src/cursor-effects/glow-cursor.tsx"], notes: { reactNative: "No cursor on touch devices.", html: "Pointer-only; provide non-cursor interaction." } }),
  R("blob-cursor", { ...noMobile3D, reactNative: "Unsupported", flutter: "Unsupported", swiftUI: "Unsupported", compose: "Unsupported" }, { name: "Blob Cursor", description: "Organic blob trailing the pointer. Pointer-only.", categories: ["creative"], tags: ["cursor", "blob"], difficulty: "beginner", files: ["packages/components/src/cursor-effects/blob-cursor.tsx"] }),
  R("trail-cursor", { ...noMobile3D, reactNative: "Unsupported", flutter: "Unsupported", swiftUI: "Unsupported", compose: "Unsupported" }, { name: "Trail Cursor", description: "Fading particle trail behind the pointer.", categories: ["creative"], tags: ["cursor", "trail"], difficulty: "intermediate", files: ["packages/components/src/cursor-effects/trail-cursor.tsx"] }),
  R("ghost-cursor", { ...noMobile3D, reactNative: "Unsupported", flutter: "Unsupported", swiftUI: "Unsupported", compose: "Unsupported" }, { name: "Ghost Cursor", description: "Delayed ghost echo of pointer movement.", categories: ["creative"], tags: ["cursor", "ghost"], difficulty: "intermediate", files: ["packages/components/src/cursor-effects/ghost-cursor.tsx"] }),
  R("spotlight-cursor", { ...noMobile3D, reactNative: "Unsupported", flutter: "Unsupported", swiftUI: "Unsupported", compose: "Unsupported" }, { name: "Spotlight Cursor", description: "Hard-edged spotlight tracking the pointer.", categories: ["creative"], tags: ["cursor", "spotlight"], difficulty: "beginner", files: ["packages/components/src/cursor-effects/spotlight-cursor.tsx"] }),

  R("typewriter", fullWeb, { name: "Typewriter", description: "Typing loop with configurable speed and cursor.", categories: ["creative"], tags: ["text", "typewriter"], difficulty: "beginner", files: ["packages/components/src/text-effects/index.tsx"] }),
  R("scrambled-text", fullWeb, { name: "Scrambled Text", description: "Decode-style scramble reveal for headings.", categories: ["creative"], tags: ["text", "scramble"], difficulty: "intermediate", files: ["packages/components/src/text-effects/index.tsx"] }),
  R("blur-text", fullWeb, { name: "Blur Text", description: "Blur-to-sharp text entrance.", categories: ["creative"], tags: ["text", "blur"], difficulty: "beginner", files: ["packages/components/src/text-effects/index.tsx"] }),
  R("gradient-text", fullWeb, { name: "Gradient Text", description: "Gradient-ink display text.", categories: ["creative"], tags: ["text", "gradient"], difficulty: "beginner", files: ["packages/components/src/text-effects/index.tsx"] }),
  R("glitch-text", fullWeb, { name: "Glitch Text", description: "RGB-split glitch effect for display type.", categories: ["creative"], tags: ["text", "glitch"], difficulty: "intermediate", files: ["packages/components/src/text-effects/index.tsx"] }),

  R("ripple-button", fullWeb, { name: "Ripple Button", description: "Material-style expanding ripple on press.", categories: ["creative"], tags: ["button", "ripple"], difficulty: "beginner", files: ["packages/components/src/buttons/ripple-button.tsx"] }),
  R("shimmer-button", fullWeb, { name: "Shimmer Button", description: "Light sweep shimmer across the label.", categories: ["creative"], tags: ["button", "shimmer"], difficulty: "beginner", files: ["packages/components/src/buttons/shimmer-button.tsx"] }),
  R("glow-button", fullWeb, { name: "Glow Button", description: "Luminous halo button for primary actions.", categories: ["creative"], tags: ["button", "glow"], difficulty: "beginner", files: ["packages/components/src/buttons/glow-button.tsx"] }),
  R("gradient-border-button", fullWeb, { name: "Gradient Border Button", description: "Animated gradient frame around a solid label.", categories: ["creative"], tags: ["button", "gradient"], difficulty: "beginner", files: ["packages/components/src/buttons/gradient-border-button.tsx"] }),
  R("hold-button", fullWeb, { name: "Hold Button", description: "Press-and-hold confirm with progress feedback.", categories: ["creative"], tags: ["button", "hold", "confirm"], difficulty: "intermediate", files: ["packages/components/src/buttons/hold-button.tsx"] }),

  R("glare-card", fullWeb, { name: "Glare Card", description: "Specular glare sweeping with pointer angle.", categories: ["creative"], tags: ["card", "glare"], difficulty: "intermediate", files: ["packages/components/src/cards/glare-card.tsx"] }),
  R("spotlight-card", fullWeb, { name: "Spotlight Card", description: "Cursor spotlight card, calmer sibling of Magnetic Card.", categories: ["creative"], tags: ["card", "spotlight"], difficulty: "beginner", files: ["packages/components/src/cards/spotlight-card.tsx"] }),
  R("wobble-card", fullWeb, { name: "Wobble Card", description: "Spring wobble response to pointer enter.", categories: ["creative"], tags: ["card", "spring"], difficulty: "intermediate", files: ["packages/components/src/cards/wobble-card.tsx"] }),
  R("glass-card", fullWeb, { name: "Glass Card", description: "Frosted-glass panel card with solid fallback.", categories: ["creative"], tags: ["card", "glass"], difficulty: "beginner", files: ["packages/components/src/cards/glass-card.tsx"] }),

  R("bento-grid", fullWeb, { name: "Bento Grid", description: "Tile grid with configurable columns and spans.", categories: ["creative"], tags: ["layout", "bento", "grid"], difficulty: "beginner", files: ["packages/components/src/layouts/bento-grid.tsx"] }),
  R("infinite-marquee", fullWeb, { name: "Infinite Marquee", description: "Seamless looping marquee row.", categories: ["creative"], tags: ["layout", "marquee"], difficulty: "beginner", files: ["packages/components/src/layouts/infinite-marquee.tsx"] }),
  R("masonry-layout", fullWeb, { name: "Masonry Layout", description: "Pinterest-style masonry columns.", categories: ["creative"], tags: ["layout", "masonry"], difficulty: "intermediate", files: ["packages/components/src/layouts/masonry-layout.tsx"] })
];

const CANONICAL_REPO = "https://github.com/Varun9490/Buildora";

export function toRegistryJson(item: CatalogItem) {
  // Resolve the real source dir: catalog `files[0]` may point at a shared
  // implementation (e.g. agent-timeline lives inside streaming-chat).
  // GitHub links must point at the actual file, not a non-existent slug dir.
  const primaryFile = item.files[0] ?? `packages/components/src/${item.slug}/index.tsx`;
  const githubDir = primaryFile
    .replace(/^packages\/components\/src\//, "")
    .replace(/\/index\.tsx$/, "");
  return {
    $schema: "https://buildora.dev/schema/registry-item.json",
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    categories: item.categories,
    tags: item.tags,
    difficulty: item.difficulty,
    version: item.version,
    license: item.license,
    states: item.states ?? [],
    implementations: Object.fromEntries(
      Object.entries(item.compat).map(([fw, status]) => [
        fw,
        {
          status,
          ...(item.notes?.[fw] ? { notes: item.notes[fw] } : {}),
          files: status === "Unsupported" ? [] : item.files
        }
      ])
    ),
    accessibility: { keyboard: true, screenReader: true, reducedMotion: true },
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
    provenance: { origin: "original", license: "MIT", adapted: false },
    files: item.files.map((f) => {
      try {
        const content = fs.readFileSync(path.join(process.cwd(), f), "utf8");
        return { path: f, content };
      } catch (e) {
        return { path: f, content: `// Could not read file: ${f}` };
      }
    }),
    github: `${CANONICAL_REPO}/tree/main/${primaryFile.replace(/\/index\.tsx$/, "")}`,
    githubFile: `${CANONICAL_REPO}/blob/main/${primaryFile}`,
    sourceDir: githubDir,
    docs: `/components/${item.slug}`,
    install: `pnpm dlx shadcn@latest add @buildora/${item.slug}`
  };
}

export function toShadcnJson(item: CatalogItem) {
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: `buildora-${item.slug}`,
    type: "registry:component" as const,
    title: item.name,
    description: item.description,
    categories: item.categories,
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
    files: item.files.map((f) => {
      try {
        const content = fs.readFileSync(path.join(process.cwd(), f), "utf8");
        return { path: f, content, type: "registry:component" as const };
      } catch (e) {
        return { path: f, content: `// Could not read file: ${f}`, type: "registry:component" as const };
      }
    }),
    docs: `https://github.com/Varun9490/Buildora/tree/main/${f2(item)}`
  };
}

function f2(item: CatalogItem) {
  return item.files[0] ?? "";
}

export function toAgentCatalog(item: CatalogItem) {
  const reg = toRegistryJson(item);
  return {
    slug: item.slug,
    name: item.name,
    description: item.description,
    categories: item.categories,
    tags: item.tags,
    difficulty: item.difficulty,
    version: item.version,
    install: reg.install,
    docs: reg.docs,
    github: reg.github,
    files: item.files,
    frameworks: Object.fromEntries(
      Object.entries(item.compat).map(([fw, status]) => [fw, { status, note: item.notes?.[fw] }])
    ),
    dependencies: item.dependencies ?? [],
    provenance: (reg as { provenance?: unknown }).provenance ?? { origin: "original" },
    workflow: ["find", "inspect", "install", "customize", "validate"],
  };
}

export function buildAll(outDir: string) {
  const comps = catalog.map(toRegistryJson);
  fs.mkdirSync(path.join(outDir, "components"), { recursive: true });
  fs.mkdirSync(path.join(outDir, "generated"), { recursive: true });
  for (const item of catalog) {
    fs.writeFileSync(path.join(outDir, "components", `${item.slug}.json`), JSON.stringify(toRegistryJson(item), null, 2));
    fs.writeFileSync(path.join(outDir, "generated", `${item.slug}.json`), JSON.stringify(toShadcnJson(item), null, 2));
  }
  const index = {
    $schema: "https://buildora.dev/schema/registry.json",
    name: "buildora",
    tagline: "Build. Remix. Ship.",
    version: "0.1.0",
    total: comps.length,
    installBase: "pnpm dlx shadcn@latest add @buildora/{component}",
    components: comps.map((c) => ({ slug: c.slug, name: c.name, description: c.description, categories: c.categories, tags: c.tags, difficulty: c.difficulty, version: c.version })),
    shadcn: "Compatible — see generated/*.json or /r/{component}.json. GitHub-hosted, no custom domain required."
  };
  fs.writeFileSync(path.join(outDir, "registry.json"), JSON.stringify(index, null, 2));
  const agentCatalog = {
    $schema: "https://buildora.dev/schema/agent-catalog.json",
    name: "buildora",
    version: "0.1.0",
    total: catalog.length,
    workflow: ["find component", "inspect metadata", "install via shadcn", "customize props", "validate registry"],
    components: catalog.map(toAgentCatalog),
  };
  fs.writeFileSync(path.join(outDir, "agent-catalog.json"), JSON.stringify(agentCatalog, null, 2));
  return index;
}

/**
 * Emit a bundled TS barrel for apps/web so API routes can serve registry
 * data without runtime filesystem access (required on Vercel serverless).
 * Writes to apps/web/lib/registry-data.generated.ts (committed).
 */
export function buildWebBarrel(repoRoot: string) {
  const comps: Record<string, unknown> = {};
  const shadcn: Record<string, unknown> = {};
  for (const item of catalog) {
    comps[item.slug] = toRegistryJson(item);
    shadcn[item.slug] = toShadcnJson(item);
  }
  const src =
    `// GENERATED — do not edit. Built by \`pnpm registry:build\`.\n` +
    `export const registryComponents: Record<string, unknown> = ${JSON.stringify(comps)};\n` +
    `export const registryShadcn: Record<string, unknown> = ${JSON.stringify(shadcn)};\n`;
  const dir = path.join(repoRoot, "apps", "web", "lib");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "registry-data.generated.ts"), src);
}
