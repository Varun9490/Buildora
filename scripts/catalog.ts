/**
 * Buildora registry source of truth.
 * Run: pnpm registry:build  → emits registry/components/*.json, registry/registry.json, registry/generated/*.json
 */

import * as fs from "node:fs";
import * as path from "node:path";

export type Compat = "Full" | "Partial" | "Experimental" | "Unsupported";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export type RegistryType =
  | "registry:component"
  | "registry:lib"
  | "registry:hook"
  | "registry:theme"
  | "registry:style"
  | "registry:block";

export type Status = "stable" | "beta" | "experimental";

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
  /** Consumer install paths parallel to files. Defaults derived from slug. */
  targets?: string[];
  registryType?: RegistryType;
  /** beta default; experimental hides from the default listing. */
  status?: Status;
  cssVars?: { light: Record<string, string>; dark: Record<string, string> };
  css?: string;
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
  categories: extra.categories ?? ["primitives"],
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
  dependencies: [
    ...(extra.dependencies ?? []),
    ...(
      [
        "command-palette", "mobile-nav", "navbar", "onboarding-checklist",
        "pricing-table", "progress", "sidebar", "slider", "tabs",
        "team-switcher", "usage-dashboard", "slingshot-otp"
      ].includes(slug) && !(extra.dependencies ?? []).includes("framer-motion")
        ? ["framer-motion"]
        : []
    )
  ],
  registryDependencies: Array.from(new Set([...(extra.registryDependencies ?? []), "utils", "tokens"])),
  files: extra.files ?? [`packages/components/src/${slug}/index.tsx`],
  targets: extra.targets ?? extra.files?.map(f => f.endsWith('index.tsx') ? `components/buildora/${slug}.tsx` : `components/buildora/${slug}/${path.basename(f)}`),
  registryType: extra.registryType,
  status: extra.status ?? "beta",
  cssVars: extra.cssVars,
  css: extra.css,
  demoProps: extra.demoProps
});

const fullWeb = {};
const noMobile3D: Partial<Record<string, Compat>> = { reactNative: "Partial", flutter: "Experimental", swiftUI: "Experimental", compose: "Experimental" };


const baseItems: CatalogItem[] = [
  R("utils", {}, { name: "utils", description: "Utility functions", registryType: "registry:lib", files: ["packages/components/src/utils/index.ts"] }),
  R("use-reduced-motion", {}, { name: "use-reduced-motion", description: "Hook for reduced motion", registryType: "registry:hook", files: ["packages/components/src/hooks/use-reduced-motion.ts"] }),
  R("use-pointer-proximity", {}, { name: "use-pointer-proximity", description: "Hook for pointer proximity", registryType: "registry:hook", files: ["packages/components/src/hooks/use-pointer-proximity.ts"] }),
  R("spring", {}, { name: "spring", description: "Spring animation utility", registryType: "registry:lib", files: ["packages/components/src/animations/spring.ts"] }),
  R("tokens", {}, { name: "tokens", description: "Design tokens", registryType: "registry:theme", files: ["packages/components/src/tokens/index.css"], cssVars: { light: {}, dark: {} } })
];

export const catalog: CatalogItem[] = [
  ...baseItems,
  R("fx-button", fullWeb, { name: "Fx Button", description: "Unified button with multiple effects (liquid, shimmer, glow, ripple).", categories: ["motion"], tags: ["button", "effects"], difficulty: "beginner" }),
  R("fx-card", fullWeb, { name: "Fx Card", description: "Unified card with multiple interactive effects (glare, spotlight, wobble, glass).", categories: ["motion"], tags: ["card", "effects"], difficulty: "intermediate" }),
  R("text-fx", fullWeb, { name: "Text Fx", description: "Unified text effects (morphing, typewriter, glitch).", categories: ["motion"], tags: ["text", "effects"], difficulty: "beginner" }),
  R("cursor-fx", fullWeb, { name: "Cursor Fx", description: "Unified cursor effects (glow, spotlight, trail, blob).", categories: ["motion"], tags: ["cursor", "effects"], difficulty: "beginner" }),
  R("backdrop", fullWeb, { name: "Backdrop", description: "Unified animated backgrounds (aurora, grid, noise, mesh).", categories: ["backgrounds"], tags: ["background", "effects"], difficulty: "beginner" }),
  R("magnetic-button", fullWeb, { name: "Magnetic Button", description: "A real <button> with spring magnetic attraction to the cursor. Tactile, accessible, production-ready.", categories: ["motion"], tags: ["button", "magnetic", "spring", "cursor"], difficulty: "beginner", dependencies: ["clsx", "tailwind-merge"], demoProps: { strength: 0.35, radius: 120 } }),
  R("slingshot-otp", fullWeb, { name: "Slingshot OTP", description: "OTP with real inputs, paste, and SR support. Standard mode by default; slingshot game is opt-in delight.", categories: ["motion"], tags: ["otp", "slingshot", "spring", "signature"], difficulty: "advanced", states: ["empty", "filled", "error"], dependencies: ["framer-motion"] }),
  R("interactive-dropzone", fullWeb, { name: "Interactive Dropzone", description: "Proximity-reactive dropzone with progress visualization and error recovery.", categories: ["motion"], tags: ["upload", "dropzone", "magnetic"], difficulty: "intermediate" }),

  R("streaming-chat", fullWeb, { name: "Streaming Chat", description: "Demo chat UI with simulated token streaming and citations. No transport yet — do not point at production. Transport-agnostic rebuild planned.", categories: ["ai-llm"], tags: ["chat", "demo", "llm"], difficulty: "intermediate" }),
  R("model-selector", fullWeb, { name: "Model Selector", description: "Accessible model picker with status dot.", categories: ["ai-llm"], tags: ["model", "selector"], difficulty: "beginner", files: ["packages/components/src/streaming-chat/index.tsx"] }),
  R("token-meter", fullWeb, { name: "Token Meter", description: "Token usage meter with role=meter semantics.", categories: ["ai-llm"], tags: ["tokens", "usage", "meter"], difficulty: "beginner", files: ["packages/components/src/streaming-chat/index.tsx"] }),
  R("tool-call-viz", fullWeb, { name: "Tool Call Visualization", description: "Timeline of agent tool calls with running/done states.", categories: ["ai-llm"], tags: ["tools", "agent", "timeline"], difficulty: "intermediate", files: ["packages/components/src/streaming-chat/index.tsx"] }),
  R("agent-timeline", fullWeb, { name: "Agent Timeline", description: "Agent activity timeline (plan → act → observe) with status semantics.", categories: ["ai-llm"], tags: ["agent", "timeline"], difficulty: "intermediate" }),
  R("attachment-prompt", fullWeb, { name: "Attachment Prompt", description: "Prompt input with removable attachment chips and send.", categories: ["ai-llm"], tags: ["prompt", "attachments"], difficulty: "intermediate" }),
  R("ai-review-edit", fullWeb, { name: "AI Review & Edit", description: "Diff-style review UI for AI-generated content (accept / edit / reject).", categories: ["ai-llm", "editor"], tags: ["review", "diff", "ai"], difficulty: "intermediate" }),

  R("advanced-table", fullWeb, { name: "Advanced Table", description: "Sortable, filterable, paginated table with semantic <table> markup.", categories: ["data"], tags: ["table", "sorting", "filter"], difficulty: "intermediate" }),
  R("json-viewer", fullWeb, { name: "JSON Viewer", description: "Collapsible JSON viewer with mono styling.", categories: ["data", "developer"], tags: ["json", "viewer"], difficulty: "beginner", files: ["packages/components/src/advanced-table/index.tsx"] }),
  R("log-viewer", fullWeb, { name: "Log Viewer", description: "Filterable log stream with role=log semantics.", categories: ["data", "developer"], tags: ["logs", "viewer"], difficulty: "beginner", files: ["packages/components/src/advanced-table/index.tsx"] }),
  R("query-builder", fullWeb, { name: "Query Builder", description: "Composable filter rows with field/operator/value and removable chips.", categories: ["data"], tags: ["filter", "query"], difficulty: "advanced" }),
  R("diff-viewer", fullWeb, { name: "Diff Viewer", description: "Side-by-side line comparison with added/removed semantics.", categories: ["data", "editor"], tags: ["diff", "compare"], difficulty: "intermediate" }),

  R("terminal", fullWeb, { name: "Terminal", description: "Terminal emulator UI with scrollback + command input.", categories: ["developer"], tags: ["terminal", "cli"], difficulty: "intermediate" }),
  R("file-tree", fullWeb, { name: "File Tree", description: "Accessible tree with expand/collapse and keyboard support.", categories: ["developer"], tags: ["files", "tree"], difficulty: "beginner", files: ["packages/components/src/terminal/index.tsx"] }),
  R("calendar", fullWeb, { name: "Calendar", description: "Scheduling grid with gridcell semantics.", categories: ["canvas"], tags: ["calendar", "scheduling"], difficulty: "intermediate", files: ["packages/components/src/kanban/index.tsx"] }),
  R("comment-thread", fullWeb, { name: "Comment Thread", description: "Resolve/reopen comment thread.", categories: ["editor"], tags: ["comments"], difficulty: "beginner", files: ["packages/components/src/markdown-editor/index.tsx"] }),
  R("rich-text-editor", fullWeb, { name: "Rich Text Editor", description: "Toolbar + contentEditable editor with word count.", categories: ["editor"], tags: ["rich-text"], difficulty: "advanced" }),
  R("slash-commands", fullWeb, { name: "Slash Commands", description: "Notion-style slash menu with fuzzy filtering.", categories: ["editor"], tags: ["slash", "blocks"], difficulty: "intermediate" }),
  R("version-history", fullWeb, { name: "Version History", description: "Document version list with restore action.", categories: ["editor"], tags: ["versions", "history"], difficulty: "intermediate" }),

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
  R("masonry-layout", fullWeb, { name: "Masonry Layout", description: "Pinterest-style masonry columns.", categories: ["primitives"], tags: ["layout", "masonry"], difficulty: "intermediate", files: ["packages/components/src/layouts/masonry-layout.tsx"] }),

  R("cta-block", fullWeb, { name: "CTA Block", description: "Centered call-to-action with actions and optional stats.", categories: ["blocks"], tags: ["cta", "marketing"], difficulty: "beginner", dependencies: ["clsx", "tailwind-merge"] }),
  R("feature-grid", fullWeb, { name: "Feature Grid", description: "Three-up feature grid with tags and copy.", categories: ["blocks"], tags: ["features", "marketing"], difficulty: "beginner", dependencies: ["clsx", "tailwind-merge"] }),
  R("logo-cloud", fullWeb, { name: "Logo Cloud", description: "Customer logo row with label. Logos only, no taglines.", categories: ["blocks"], tags: ["logos", "social-proof"], difficulty: "beginner", dependencies: ["clsx", "tailwind-merge"] }),
  R("site-footer", fullWeb, { name: "Site Footer", description: "Footer with brand, link columns, and status line.", categories: ["blocks"], tags: ["footer", "navigation"], difficulty: "beginner", dependencies: ["clsx", "tailwind-merge"] }),

  // ── Phase 1 merged replacements (one honest component per effect family) ──
  R("backdrop", fullWeb, {
    name: "Backdrop", description: "One ambient background, nine variants (aurora, grid, dots, noise, mesh, beams, rise, meteors, ripple). CSS-first, decorative, deterministic layout.",
    categories: ["backgrounds"], tags: ["background", "ambient"], difficulty: "beginner", files: ["packages/components/src/backdrop/index.tsx"],
  }),
  R("cursor-fx", { ...noMobile3D, reactNative: "Unsupported", flutter: "Unsupported", swiftUI: "Unsupported", compose: "Unsupported" }, {
    name: "CursorFx", description: "Pointer-following glow in four modes (glow, spotlight, trail, blob). One rAF loop, pointer-fine only, silent under reduced motion.",
    categories: ["motion"], tags: ["cursor", "pointer"], difficulty: "intermediate", files: ["packages/components/src/cursor-fx/index.tsx"],
    notes: { reactNative: "No cursor on touch devices." },
  }),
  R("text-fx", fullWeb, {
    name: "TextFx", description: "Kinetic text in six kinds (typewriter, scramble, blur, gradient, glitch, morph). Screen readers hear the final text once.",
    categories: ["motion"], tags: ["text", "animated"], difficulty: "beginner", files: ["packages/components/src/text-fx/index.tsx"],
  }),
  R("fx-card", fullWeb, {
    name: "FxCard", description: "Card shell with six pointer effects (tilt, spotlight, glare, holographic, wobble, glass). Ref-driven, no re-render per move.",
    categories: ["motion"], tags: ["card", "hover"], difficulty: "beginner", files: ["packages/components/src/fx-card/index.tsx"],
  }),
  R("fx-button", fullWeb, {
    name: "FxButton", description: "Real button with six finishes (none, shimmer, glow, ripple, gradient-border, liquid). Native semantics throughout.",
    categories: ["motion"], tags: ["button", "effects"], difficulty: "beginner", files: ["packages/components/src/fx-button/index.tsx"],
  }),

  // ── Shared foundations (Phase 0.2). Zero @buildora/* in generated output:
  // components import these via @/… paths and declare registryDependencies. ──
  R("utils", { react: "Full", javascript: "Full", vue: "Full", svelte: "Full", angular: "Full", html: "Full", tailwind: "Full", reactNative: "Unsupported", flutter: "Unsupported", swiftUI: "Unsupported", compose: "Unsupported" }, {
    name: "Utils", description: "cn + clamp + fuzzyScore + formatBytes. Shared class-name helper for every component.",
    categories: ["primitives"], tags: ["utils", "cn", "foundation"], difficulty: "beginner",
    dependencies: ["clsx", "tailwind-merge"], files: ["registry/shared/utils.ts"],
    targets: ["lib/buildora/utils.ts"], registryType: "registry:lib",
  }),
  R("use-reduced-motion", { react: "Full", javascript: "Partial", vue: "Partial", svelte: "Partial", angular: "Partial", html: "Partial", tailwind: "Unsupported", reactNative: "Unsupported", flutter: "Unsupported", swiftUI: "Unsupported", compose: "Unsupported" }, {
    name: "useReducedMotion", description: "SSR-safe prefers-reduced-motion via useSyncExternalStore. No hydration flash.",
    categories: ["primitives"], tags: ["a11y", "motion", "hook"], difficulty: "beginner",
    files: ["registry/shared/use-reduced-motion.ts"], targets: ["hooks/buildora/use-reduced-motion.ts"], registryType: "registry:hook",
  }),
  R("spring", { react: "Full", javascript: "Full", vue: "Full", svelte: "Full", angular: "Full", html: "Partial", tailwind: "Unsupported", reactNative: "Partial", flutter: "Partial", swiftUI: "Partial", compose: "Partial" }, {
    name: "Spring", description: "dt-based springStep + magnet + rafLoop. The physics behind magnetic effects.",
    categories: ["motion"], tags: ["spring", "physics", "animation"], difficulty: "beginner",
    files: ["registry/shared/spring.ts"], targets: ["lib/buildora/spring.ts"], registryType: "registry:lib",
  }),
  R("use-pointer-proximity", { react: "Full", javascript: "Partial", vue: "Partial", svelte: "Partial", angular: "Partial", html: "Partial", tailwind: "Unsupported", reactNative: "Unsupported", flutter: "Unsupported", swiftUI: "Unsupported", compose: "Unsupported" }, {
    name: "usePointerProximity", description: "Window-level pointer proximity with rAF throttle. Attracts from radius away; fine-pointer only; zero cost under reduced motion.",
    categories: ["motion"], tags: ["pointer", "proximity", "magnetic", "hook"], difficulty: "intermediate",
    files: ["registry/shared/use-pointer-proximity.ts"], targets: ["hooks/buildora/use-pointer-proximity.ts"], registryType: "registry:hook",
  }),
  R("tokens", { react: "Full", javascript: "Full", vue: "Full", svelte: "Full", angular: "Full", html: "Full", tailwind: "Full", reactNative: "Partial", flutter: "Partial", swiftUI: "Partial", compose: "Partial" }, {
    name: "Tokens", description: "Light + dark CSS vars + shared keyframes. Import once so components are styled on first paint.",
    categories: ["primitives"], tags: ["tokens", "theme", "css"], difficulty: "beginner",
    files: ["registry/shared/tokens.css"], targets: ["styles/buildora/tokens.css"], registryType: "registry:theme", status: "stable",
    cssVars: {
      light: { "--b-bg": "#faf9f7", "--b-panel": "#ffffff", "--b-text": "#131316", "--b-border": "rgba(19,19,22,0.08)", "--b-accent": "#4d7c0f", "--b-accent-foreground": "#ffffff" },
      dark: { "--b-bg": "#0e0e0c", "--b-panel": "#161614", "--b-text": "#ededec", "--b-border": "rgba(255,255,255,0.08)", "--b-accent": "#d4ff4f", "--b-accent-foreground": "#131305" },
    },
  }),
];

// ── Phase 1 truth pass ─────────────────────────────────────────────
// EXPERIMENTAL = fails the Bar today; hidden from the default listing,
// kept installed via direct URL until its merge/rebuild lands (or deletion).
const EXPERIMENTAL = new Set([
  // 19 tui + workspace → one xterm.js Terminal + terminal skin (3.10)
  "tui-panel", "tui-status-bar", "tui-header", "tui-footer", "tui-table", "tui-tree",
  "tui-list", "tui-form", "tui-select", "tui-multi-select", "tui-progress", "tui-spinner",
  "tui-gauge", "tui-sparkline", "tui-log-viewer", "tui-help-overlay", "tui-diff-viewer",
  "terminal-workspace",
  // 8 backgrounds (+aurora) → Backdrop
  "aurora-background", "noise-background", "grid-background", "dot-grid-background",
  "gradient-mesh-background", "aurora-beam-background", "ripple-background", "meteor-background",
  "beam-background",
  // 5 cursors → CursorFx
  "glow-cursor", "blob-cursor", "trail-cursor", "ghost-cursor", "spotlight-cursor",
  // 5 fx-buttons → FxButton (HoldButton stays: real behavior)
  "liquid-button", "ripple-button", "shimmer-button", "glow-button", "gradient-border-button",
  // 7 fx-cards → FxCard
  "magnetic-card", "holographic-card", "interactive-3d-card", "glare-card",
  "spotlight-card", "wobble-card", "glass-card",
  // 6 text fx → TextFx
  "typewriter", "scrambled-text", "blur-text", "gradient-text", "glitch-text", "morphing-typography",
  // 2 command dupes → command-palette until the Command rebuild (3.5)
  "command-bar", "spatial-command-palette",
  // 1 toast dupe → toast until NotificationCenter
  "creative-notifications",
  // 1 sidebar + 1 navbar variant → base keeps, variants merge in AppShell work
  "expandable-sidebar", "floating-navbar",
  // engines → rebuild on real engines (3.10) or delete
  "code-editor", "markdown-editor", "spreadsheet-grid", "node-editor", "timeline-editor", "workflow-builder",
  // honesty gaps → rebuilds
  "query-builder", "calendar", "rich-text-editor", "modal-stack",
  "streaming-chat", "model-selector", "token-meter", "tool-call-viz",
  "agent-timeline", "attachment-prompt", "ai-review-edit",
  "advanced-table",
]);

// Demos, not components → Blocks category (compositions of real primitives).
const BLOCKS = new Set([
  "pricing-table", "usage-dashboard", "team-switcher", "invite-flow", "onboarding-checklist",
  "approval-workflow", "audit-log", "feature-flags", "env-manager", "cron-builder",
  "webhook-viewer", "api-request-builder",
]);

const STABLE = new Set(["utils", "use-reduced-motion", "spring", "use-pointer-proximity", "tokens"]);

for (const item of catalog) {
  if (EXPERIMENTAL.has(item.slug)) item.status = "experimental";
  else if (STABLE.has(item.slug)) item.status = "stable";
  else item.status = "beta";
  if (BLOCKS.has(item.slug)) {
    item.categories = ["blocks"];
    item.registryType = "registry:block";
  }
}

const CANONICAL_REPO = "https://github.com/Varun9490/Buildora";

/** Phase 0.2: generated (consumer) code must contain zero @buildora/* imports.
 * Repo source uses workspace aliases; the build rewrites them to the
 * installed locations below so `shadcn add` works in a fresh project. */
const CONSUMER_IMPORTS: Array<[RegExp, string]> = [
  [/@buildora\/utils/g, "@/lib/buildora/utils"],
  [/@buildora\/hooks/g, "@/hooks/buildora/use-reduced-motion"],
  [/@buildora\/animations/g, "@/lib/buildora/spring"],
  [/@buildora\/tokens/g, "@/styles/buildora/tokens"],
  [/@buildora\/magnetic-button/g, "@/components/buildora/magnetic-button"],
];

export function toConsumerContent(content: string) {
  let out = content;
  for (const [re, to] of CONSUMER_IMPORTS) out = out.replace(re, to);
  return out;
}

/** Infer registryDependencies from workspace imports in source. */
export function inferRegistryDeps(item: CatalogItem): string[] {
  if (["utils", "use-reduced-motion", "spring", "use-pointer-proximity", "tokens"].includes(item.slug)) {
    return item.slug === "tokens" ? [] : [];
  }
  let src = "";
  for (const f of item.files) {
    try {
      src += "\n" + fs.readFileSync(path.join(process.cwd(), f), "utf8");
    } catch { /* ignore */ }
  }
  const deps = new Set<string>(item.registryDependencies ?? []);
  if (src.includes("@buildora/utils")) deps.add("utils");
  if (src.includes("@buildora/hooks")) deps.add("use-reduced-motion");
  if (src.includes("@buildora/animations")) deps.add("spring");
  // Every visual component needs tokens or it renders unstyled.
  if (!["utils", "use-reduced-motion", "spring", "use-pointer-proximity", "tokens"].includes(item.slug)) {
    deps.add("tokens");
  }
  return [...deps];
}

/** Consumer install path per file. Never index.tsx. */
export function consumerTargets(item: CatalogItem): string[] {
  if (item.targets) return item.targets;
  const multi = item.files.length > 1;
  return item.files.map((f) => {
    const base = f.split("/").pop() ?? `${item.slug}.tsx`;
    if (!multi) {
      if (base === "index.tsx") return `components/buildora/${item.slug}.tsx`;
      return `components/buildora/${base}`;
    }
    if (base === "index.tsx") return `components/buildora/${item.slug}/index.tsx`;
    return `components/buildora/${item.slug}/${base}`;
  });
}

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
    status: item.status ?? "beta",
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
    registryDependencies: inferRegistryDeps(item),
    provenance: { origin: "original", license: "MIT", adapted: false },
    files: item.files.map((f, i) => {
      try {
        const raw = fs.readFileSync(path.join(process.cwd(), f), "utf8");
        return { path: f, target: consumerTargets(item)[i], content: toConsumerContent(raw) };
      } catch (e) {
        return { path: f, target: consumerTargets(item)[i], content: `// Could not read file: ${f}` };
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
  const type = item.registryType ?? "registry:component";
  const targets = consumerTargets(item);
  const base = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.slug,
    type,
    title: item.name,
    description: item.description,
    status: item.status ?? "beta",
    categories: item.categories,
    dependencies: item.dependencies ?? [],
    registryDependencies: inferRegistryDeps(item),
    files: item.files.map((f, i) => {
      try {
        const raw = fs.readFileSync(path.join(process.cwd(), f), "utf8");
        return { path: f, target: targets[i], content: toConsumerContent(raw), type };
      } catch (e) {
        return { path: f, target: targets[i], content: `// Could not read file: ${f}`, type };
      }
    }),
    docs: `https://github.com/Varun9490/Buildora/tree/main/${f2(item)}`
  } as Record<string, unknown>;
  if (item.cssVars) base.cssVars = item.cssVars;
  if (item.css) base.css = item.css;
  return base;
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
    registryDependencies: inferRegistryDeps(item),
    status: item.status ?? "beta",
    provenance: (reg as { provenance?: unknown }).provenance ?? { origin: "original" },
    targets: consumerTargets(item),
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
    components: comps.map((c) => ({ slug: c.slug, name: c.name, description: c.description, categories: c.categories, tags: c.tags, difficulty: c.difficulty, version: c.version, status: (c as { status?: string }).status ?? "beta" })),
    shadcn: "Compatible — install via shadcn with the @buildora registry pointing at https://buildora.dev/r/{component}.json, or the local /r/{component}.json endpoint."
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
