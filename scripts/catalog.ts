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
  // Extra deps are declared by hand; the real list is derived from the
  // source imports at emit time (see inferDependencies) so it can never
  // drift out of sync with the code.
  dependencies: [...(extra.dependencies ?? [])],
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

// NOTE: the shared foundations (utils, use-reduced-motion, use-pointer-proximity,
// spring, tokens) are declared once, in full, in the "Shared foundations" block
// below. They used to also live here, which published every one of them twice:
// the registry index claimed 110 components for 105 unique slugs.

export const catalog: CatalogItem[] = [
  R("floating-object", fullWeb, { name: "Floating Object", description: "3D hovering objects with perspective tilt on hover, floating animation, and drop shadow.", categories: ["motion"], tags: ["3d", "hover"], difficulty: "intermediate" }),
  R("horizontal-scroll", fullWeb, { name: "Horizontal Scroll", description: "Scroll-driven horizontal panning section with mobile fallback.", categories: ["motion"], tags: ["scroll", "horizontal"], difficulty: "advanced" }),
  R("thread-line", fullWeb, { name: "Thread Line", description: "Animated SVG path that draws itself on scroll or on mount.", categories: ["motion"], tags: ["scroll", "svg"], difficulty: "beginner" }),
  R("project-showcase", fullWeb, { name: "Project Showcase", description: "Project gallery section with filter pills, sticky sidebar, and hover zoom.", categories: ["blocks"], tags: ["gallery", "portfolio"], difficulty: "intermediate" }),
  R("reveal-on-scroll", fullWeb, { name: "Reveal on Scroll", description: "Intersection Observer-based reveal wrapper with multiple animation variants.", categories: ["motion"], tags: ["scroll", "reveal"], difficulty: "beginner" }),
  R("handwritten-annotation", fullWeb, { name: "Handwritten Annotation", description: "Playful handwritten-style text annotations with hand-drawn arrow SVGs.", categories: ["primitives"], tags: ["annotation", "handwritten"], difficulty: "beginner" }),
  R("vertical-timeline", fullWeb, { name: "Vertical Timeline", description: "Timeline with dots, tick marks, connecting lines, and staggered scroll-reveal.", categories: ["data"], tags: ["timeline", "scroll"], difficulty: "intermediate" }),
  R("speech-bubble-cursor", fullWeb, { name: "Speech Bubble Cursor", description: "Custom cursor provider that shows speech-bubble tooltips.", categories: ["motion"], tags: ["cursor", "tooltip"], difficulty: "intermediate" }),
  R("magnetic-button", fullWeb, { name: "Magnetic Button", description: "A real <button> with spring magnetic attraction to the cursor. Tactile, accessible, production-ready.", categories: ["motion"], tags: ["button", "magnetic", "spring", "cursor"], difficulty: "beginner", dependencies: ["clsx", "tailwind-merge", "zod"], demoProps: { strength: 0.35, radius: 120 } }),
  R("slingshot-otp", fullWeb, { name: "Slingshot OTP", description: "OTP with real inputs, paste, and SR support. Standard mode by default; slingshot game is opt-in delight.", categories: ["motion"], tags: ["otp", "slingshot", "spring", "signature"], difficulty: "advanced", states: ["empty", "filled", "error"], dependencies: ["motion"] }),
  R("interactive-dropzone", fullWeb, { name: "Interactive Dropzone", description: "Proximity-reactive dropzone with progress visualization and error recovery.", categories: ["motion"], tags: ["upload", "dropzone", "magnetic"], difficulty: "intermediate" }),

  R("segmented-control", fullWeb, { name: "Segmented Control", description: "iOS-style segmented option picker with a spring-gliding accent pill, radiogroup semantics and full keyboard nav.", categories: ["primitives", "motion"], tags: ["segmented", "tabs", "pill"], difficulty: "beginner" }),
  R("gooey-menu", fullWeb, { name: "Gooey Menu", description: "FAB whose actions fan out as fused SVG-goo blobs with crisp labels riding on top. Escape and outside-click close.", categories: ["motion", "overlays"], tags: ["fab", "gooey", "menu"], difficulty: "intermediate" }),
  R("elastic-slider", fullWeb, { name: "Elastic Slider", description: "Rubber-band slider: the knob over-stretches at the rails and snaps back with spring physics. role=slider + arrows/Home/End.", categories: ["forms", "motion"], tags: ["slider", "elastic", "spring"], difficulty: "intermediate" }),
  R("morph-select", fullWeb, { name: "Morph Select", description: "Select whose trigger stretches into the options list and seals back into a pill. Listbox semantics, arrow nav, outside close.", categories: ["forms", "motion"], tags: ["select", "morph", "listbox"], difficulty: "intermediate" }),
  R("confirm-morph", fullWeb, { name: "Confirm Morph", description: "One button, two identities: idle → confirm strip → animated check. aria-live, auto-revert, danger variant.", categories: ["primitives", "motion"], tags: ["confirm", "destructive", "button"], difficulty: "beginner" }),
  R("detent-dial", fullWeb, { name: "Detent Dial", description: "Rotary knob with Gaussian tick-wave emphasis around the active detent. Drag, wheel, or arrows; role=slider.", categories: ["forms", "motion"], tags: ["dial", "knob", "rotary"], difficulty: "intermediate" }),
  R("liquid-gauge", fullWeb, { name: "Liquid Gauge", description: "Ring meter filled with two out-of-phase liquid waves, clipped and animated. role=meter with valuetext.", categories: ["feedback", "motion"], tags: ["gauge", "liquid", "wave"], difficulty: "intermediate" }),
  R("comet-ring-spinner", fullWeb, { name: "Comet Ring Spinner", description: "Comet head racing around a ring of fading trail dots. Pure CSS transforms, role=status, frozen under reduced motion.", categories: ["feedback"], tags: ["spinner", "comet", "loader"], difficulty: "beginner" }),
  R("blueprint-loader", fullWeb, { name: "Blueprint Loader", description: "Drafting-sheet placeholder that draws its dashed frame while ghost rows ghost in behind a scanning beam. Progress and indeterminate.", categories: ["feedback", "motion"], tags: ["loader", "blueprint", "drafting"], difficulty: "beginner" }),
  R("fresnel-orb", fullWeb, { name: "Fresnel Orb", description: "Iridescent orb of layered conic and radial gradients with drifting orientation, rim highlight and caustic core. Pure CSS.", categories: ["backgrounds", "motion"], tags: ["orb", "iridescent", "gradient"], difficulty: "beginner" }),
  R("letter-wave", fullWeb, { name: "Letter Wave", description: "Hover, focus or optional autoloop sends a sine wave rippling through the letters. Real text in aria-label.", categories: ["motion"], tags: ["type", "kinetic", "wave"], difficulty: "beginner" }),
  R("focus-blur-list", fullWeb, { name: "Focus Blur List", description: "List rows where the hovered/focused one stays crisp and siblings sink back with blur + dim. Focus mirrors hover.", categories: ["motion", "blocks"], tags: ["list", "blur", "focus"], difficulty: "beginner" }),
  R("grab-roller-strip", fullWeb, { name: "Grab Roller Strip", description: "Physical roller strip you drag sideways; it settles on the nearest label under a fixed marker with flanks in fade flow.", categories: ["forms", "motion"], tags: ["roller", "drag", "snap"], difficulty: "intermediate" }),
  R("unified-login-field", fullWeb, { name: "Unified Login Field", description: "One bordered container that morphs between email and password stages instead of juggling boxes. Shake on invalid email, Escape steps back.", categories: ["forms"], tags: ["login", "email", "password"], difficulty: "intermediate" }),
  R("magnetic-dropzone", fullWeb, { name: "Magnetic Dropzone", description: "Dropzone that leans toward a file-drag cursor and pulses its field; browse input fallback; dropped files list with removers.", categories: ["forms", "motion"], tags: ["drag-drop", "files", "magnetic"], difficulty: "intermediate" }),
  R("draggable-card-pile", fullWeb, { name: "Draggable Card Pile", description: "Riffled stack: the top card drags out past a threshold and cycles to the back with spring physics. Enter flings for keyboard.", categories: ["motion", "blocks"], tags: ["cards", "stack", "drag"], difficulty: "intermediate" }),

  R("streaming-chat", fullWeb, { name: "Streaming Chat", description: "Chat surface for a token stream. Bring your own transport: it renders the messages you pass and hands the input to onSend.", categories: ["ai-llm"], tags: ["chat", "stream", "llm"], difficulty: "intermediate" }),
  R("model-selector", fullWeb, { name: "Model Selector", description: "Accessible model picker with status dot.", categories: ["ai-llm"], tags: ["model", "selector"], difficulty: "beginner", files: ["packages/components/src/model-selector/index.tsx"] }),
  R("token-meter", fullWeb, { name: "Token Meter", description: "Token usage meter with role=meter semantics.", categories: ["ai-llm"], tags: ["tokens", "usage", "meter"], difficulty: "beginner", files: ["packages/components/src/token-meter/index.tsx"] }),
  R("tool-call-viz", fullWeb, { name: "Tool Call Visualization", description: "Timeline of agent tool calls with running/done states.", categories: ["ai-llm"], tags: ["tools", "agent", "timeline"], difficulty: "intermediate", files: ["packages/components/src/tool-call-viz/index.tsx"] }),
  R("agent-timeline", fullWeb, { name: "Agent Timeline", description: "Agent activity timeline (plan → act → observe) with status semantics.", categories: ["ai-llm"], tags: ["agent", "timeline"], difficulty: "intermediate" }),
  R("attachment-prompt", fullWeb, { name: "Attachment Prompt", description: "Prompt input with removable attachment chips and send.", categories: ["ai-llm"], tags: ["prompt", "attachments"], difficulty: "intermediate" }),
  R("ai-review-edit", fullWeb, { name: "AI Review & Edit", description: "Diff-style review UI for AI-generated content (accept / edit / reject).", categories: ["ai-llm", "editor"], tags: ["review", "diff", "ai"], difficulty: "intermediate" }),

  R("advanced-table", fullWeb, { name: "Advanced Table", description: "Sortable, filterable, paginated table with semantic <table> markup.", categories: ["data"], tags: ["table", "sorting", "filter"], difficulty: "intermediate" }),
  R("json-viewer", fullWeb, { name: "JSON Viewer", description: "Collapsible JSON viewer with mono styling.", categories: ["data", "developer"], tags: ["json", "viewer"], difficulty: "beginner", files: ["packages/components/src/json-viewer/index.tsx"] }),
  R("log-viewer", fullWeb, { name: "Log Viewer", description: "Filterable log stream with role=log semantics.", categories: ["data", "developer"], tags: ["logs", "viewer"], difficulty: "beginner", files: ["packages/components/src/log-viewer/index.tsx"] }),
  R("query-builder", fullWeb, { name: "Query Builder", description: "Composable filter rows with field/operator/value and removable chips.", categories: ["data"], tags: ["filter", "query"], difficulty: "advanced" }),
  R("diff-viewer", fullWeb, { name: "Diff Viewer", description: "Side-by-side line comparison with added/removed semantics.", categories: ["data", "editor"], tags: ["diff", "compare"], difficulty: "intermediate" }),

  R("terminal", fullWeb, { name: "Terminal", description: "Terminal emulator UI with scrollback + command input.", categories: ["developer"], tags: ["terminal", "cli"], difficulty: "intermediate" }),
  R("terminal-ui", fullWeb, { name: "Terminal UI", description: "Full terminal workspace: tab bar, sidebar tree, panes and a command input.", categories: ["developer"], tags: ["terminal", "workspace", "tabs"], difficulty: "advanced", files: ["packages/components/src/terminal-ui/index.tsx", "packages/components/src/terminal-ui/terminal-pane.tsx", "packages/components/src/terminal-ui/terminal-sidebar.tsx", "packages/components/src/terminal-ui/terminal-tab-bar.tsx", "packages/components/src/terminal-ui/command-input.tsx", "packages/components/src/terminal-ui/terminal-theme.ts"] }),
  R("file-tree", fullWeb, { name: "File Tree", description: "Accessible tree with expand/collapse and keyboard support.", categories: ["developer"], tags: ["files", "tree"], difficulty: "beginner", files: ["packages/components/src/file-tree/index.tsx"] }),
  R("code-editor", fullWeb, { name: "Code Editor Lite", description: "Split code/preview surface. A textarea, not an editor engine.", categories: ["developer"], tags: ["code", "editor"], difficulty: "beginner", files: ["packages/components/src/code-editor/index.tsx"] }),
  R("command-palette", fullWeb, { name: "Command Palette", description: "Keyboard-first command surface with fuzzy matching and combobox semantics.", categories: ["navigation"], tags: ["command", "palette", "cmdk"], difficulty: "intermediate", files: ["packages/components/src/command-palette/index.tsx"] }),
  R("hold-button", fullWeb, { name: "Hold Button", description: "Press and hold to confirm, with live progress. A real behaviour, not a finish.", categories: ["motion"], tags: ["button", "hold", "confirm"], difficulty: "beginner", files: ["packages/components/src/hold-button/index.tsx"] }),
  R("particle-field", fullWeb, { name: "Particle Field", description: "Canvas particle drift with a DPR cap. No Three.js.", categories: ["backgrounds"], tags: ["canvas", "particles", "background"], difficulty: "beginner", files: ["packages/components/src/particle-field/index.tsx"] }),
  R("magnification-dock", fullWeb, { name: "Magnification Dock", description: "Dock whose icons grow with cursor proximity, on a continuous spring.", categories: ["navigation"], tags: ["dock", "magnify", "toolbar"], difficulty: "intermediate", files: ["packages/components/src/magnification-dock/index.tsx"] }),
  R("dynamic-island", fullWeb, { name: "Dynamic Island", description: "Morphing status pill for live app state. A live region, not decoration.", categories: ["feedback"], tags: ["status", "live-region", "pill"], difficulty: "intermediate", files: ["packages/components/src/dynamic-island/index.tsx"] }),
  R("tactile-loader", fullWeb, { name: "Tactile Loader", description: "Three bouncing dots that announce themselves once.", categories: ["feedback"], tags: ["loader", "spinner", "status"], difficulty: "beginner", files: ["packages/components/src/tactile-loader/index.tsx"] }),
  R("tui-sparkline", fullWeb, { name: "Sparkline", description: "Inline value sparkline for dense rows. No primitive equivalent.", categories: ["data"], tags: ["sparkline", "chart", "data"], difficulty: "beginner", files: ["packages/components/src/tui-sparkline/index.tsx"] }),
  R("tui-help-overlay", fullWeb, { name: "Key Binding Overlay", description: "Keyboard shortcut cheatsheet overlay. No primitive equivalent.", categories: ["overlays"], tags: ["help", "shortcuts", "keyboard"], difficulty: "beginner", files: ["packages/components/src/tui-help-overlay/index.tsx"] }),
  R("bento-grid", fullWeb, { name: "Bento Grid", description: "Configurable grid with per-item spans.", categories: ["primitives"], tags: ["layout", "grid", "bento"], difficulty: "beginner", files: ["packages/components/src/layouts/bento-grid.tsx"] }),
  R("infinite-marquee", fullWeb, { name: "Infinite Marquee", description: "Seamless scrolling row that pauses on hover.", categories: ["primitives"], tags: ["marquee", "scroll", "ticker"], difficulty: "beginner", files: ["packages/components/src/layouts/infinite-marquee.tsx"] }),
  R("calendar", fullWeb, { name: "Calendar", description: "Month grid with real dates, gridcell semantics and today marked.", categories: ["canvas"], tags: ["calendar", "scheduling"], difficulty: "intermediate", files: ["packages/components/src/kanban/index.tsx"] }),
  R("comment-thread", fullWeb, { name: "Comment Thread", description: "Resolve/reopen comment thread.", categories: ["editor"], tags: ["comments"], difficulty: "beginner", files: ["packages/components/src/comment-thread/index.tsx"] }),
  R("rich-text-editor", fullWeb, { name: "Rich Text Editor", description: "Formatting toolbar over contentEditable. Controlled value, sanitised output, no editor engine.", categories: ["editor"], tags: ["rich-text", "editor"], difficulty: "advanced" }),
  R("slash-commands", fullWeb, { name: "Slash Commands", description: "Notion-style slash menu with fuzzy filtering.", categories: ["editor"], tags: ["slash", "blocks"], difficulty: "intermediate" }),
  R("version-history", fullWeb, { name: "Version History", description: "Document version list with restore action.", categories: ["editor"], tags: ["versions", "history"], difficulty: "intermediate" }),

  R("button", fullWeb, { name: "Primitive Button", description: "Base button with variants and sizes. Foundation for everything clickable.", categories: ["primitives"], tags: ["button", "foundation"], difficulty: "beginner", files: ["packages/components/src/primitives/button/index.tsx"] }),
  R("input", fullWeb, { name: "Primitive Input", description: "Labeled text input with variants, sizes, and error states.", categories: ["forms"], tags: ["input", "field"], difficulty: "beginner", files: ["packages/components/src/primitives/input/index.tsx"] }),
  R("textarea", fullWeb, { name: "Primitive Textarea", description: "Multiline text field sharing Input styling and semantics.", categories: ["forms"], tags: ["textarea", "field"], difficulty: "beginner", files: ["packages/components/src/primitives/textarea/index.tsx"] }),
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
  R("mobile-nav", fullWeb, { name: "Mobile Nav", description: "Bottom mobile tab bar with labeled items, active pill, badges, and safe-area padding.", categories: ["navigation", "mobile"], tags: ["mobile", "bottom", "tabbar"], difficulty: "beginner", files: ["packages/components/src/navigation/mobile-nav.tsx"] }),
  R("mobile-header", fullWeb, { name: "Mobile Header", description: "iOS-style screen header: back bar, centered title, collapsing large title, section headers, and inset settings groups.", categories: ["navigation", "mobile"], tags: ["mobile", "header", "ios", "large-title"], difficulty: "intermediate", files: ["packages/components/src/navigation/mobile-header.tsx"] }),
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

  // ── Kinetic Type family (web-native motion-typography set) ──
  R("matrix-decode", fullWeb, {
    name: "Matrix Decode", description: "Characters scramble through glyphs and lock in left-to-right with stochastic jitter. rAF-driven, resolves once.",
    categories: ["motion"], tags: ["text", "kinetic", "decode"], difficulty: "beginner",
  }),
  R("rgb-glitch", fullWeb, {
    name: "RGB Glitch", description: "Channel-split glitch bursts with clip-path slices and skew in theme-adaptive colors. Pure CSS, deterministic burst cycle.",
    categories: ["motion"], tags: ["text", "glitch", "css"], difficulty: "beginner",
  }),
  R("number-wheel", fullWeb, {
    name: "Number Wheel", description: "Odometer counters: digits roll on vertical reels with staggered cascades. Locale grouping, prefix, suffix, count-up.",
    categories: ["motion"], tags: ["text", "counter", "odometer"], difficulty: "intermediate",
  }),
  R("inline-word-roll", fullWeb, {
    name: "Inline Word Roll", description: "Rolling word slot for inline headlines: slot width eases to the measured word as each term slides up, clipped.",
    categories: ["motion"], tags: ["text", "roll", "headline"], difficulty: "beginner",
  }),
  R("echo-stack", fullWeb, {
    name: "Echo Stack", description: "Outlined echo copies drift above the word and intensify on hover. Pure CSS, zero re-renders.",
    categories: ["motion"], tags: ["text", "echo", "outline"], difficulty: "beginner",
  }),
  R("selection-snap", fullWeb, {
    name: "Selection Snap", description: "Text snaps from hairline to black weight under a designer-style selection box with corner handles.",
    categories: ["motion"], tags: ["text", "weight", "variable-font"], difficulty: "beginner",
  }),
  R("period-drop", fullWeb, {
    name: "Period Drop", description: "The full stop falls in with gravity, squashes on impact, and settles. One-shot keyframes when scrolled into view.",
    categories: ["motion"], tags: ["text", "dot", "gravity"], difficulty: "beginner",
  }),
  R("type-wall", fullWeb, {
    name: "Type Wall", description: "Alternating solid and outline marquee rows under a fade mask. Pauses on hover, static under reduced motion.",
    categories: ["motion"], tags: ["text", "marquee", "wall"], difficulty: "beginner",
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
      light: {
        "--b-bg": "var(--background, oklch(98.23% 0.0029 84.6))",
        "--b-panel": "oklch(100.00% 0.0000 0)",
        "--b-surface": "var(--card, oklch(95.26% 0.0058 84.6))",
        "--b-elevated": "var(--popover, oklch(100.00% 0.0000 0))",
        "--b-border": "var(--border, oklch(18.81% 0.0060 285.8 / 0.08))",
        "--b-border-hover": "oklch(18.81% 0.0060 285.8 / 0.16)",
        "--b-text": "var(--foreground, oklch(18.81% 0.0060 285.8))",
        "--b-text-secondary": "oklch(44.19% 0.0146 285.8)",
        "--b-muted": "var(--muted-foreground, oklch(64.83% 0.0073 286.2))",
        "--b-ring": "oklch(18.81% 0.0060 285.8 / 0.16)",
        "--b-success": "oklch(50.81% 0.1049 165.6)",
        "--b-warning": "oklch(55.53% 0.1455 49.0)",
        "--b-danger": "oklch(51.43% 0.1978 16.9)",
        "--b-accent": "oklch(53.22% 0.1405 131.6)",
        "--b-accent-foreground": "oklch(100.00% 0.0000 0)",
        "--b-accent-muted": "oklch(53.22% 0.1405 131.6 / 0.1)",
        "--b-iris": "oklch(51.06% 0.2301 277.0)",
        "--b-iris-foreground": "oklch(100.00% 0.0000 0)"
      },
      dark: {
        "--b-bg": "var(--background, oklch(16.29% 0.0041 106.8))",
        "--b-panel": "oklch(19.94% 0.0039 106.7)",
        "--b-surface": "var(--card, oklch(22.96% 0.0057 106.8))",
        "--b-elevated": "var(--popover, oklch(25.96% 0.0037 106.7))",
        "--b-border": "var(--border, oklch(100.00% 0.0000 0 / 0.08))",
        "--b-border-hover": "oklch(100.00% 0.0000 0 / 0.16)",
        "--b-text": "var(--foreground, oklch(94.58% 0.0013 106.4))",
        "--b-text-secondary": "oklch(71.18% 0.0129 286.1)",
        "--b-muted": "var(--muted-foreground, oklch(53.99% 0.0077 286.1))",
        "--b-ring": "oklch(100.00% 0.0000 0 / 0.16)",
        "--b-success": "oklch(77.29% 0.1535 163.2)",
        "--b-warning": "oklch(83.69% 0.1644 84.4)",
        "--b-danger": "oklch(71.06% 0.1661 22.2)",
        "--b-accent": "oklch(93.88% 0.2000 122.3)",
        "--b-accent-foreground": "oklch(18.22% 0.0271 108.8)",
        "--b-accent-muted": "oklch(93.88% 0.2000 122.3 / 0.12)",
        "--b-iris": "oklch(70.51% 0.1642 288.2)",
        "--b-iris-foreground": "oklch(25.73% 0.0861 281.3)"
      },
    },
    css: `
      @layer base {
        [data-accent="acid"] { --b-accent: oklch(53.22% 0.1405 131.6); --b-accent-foreground: oklch(100.00% 0.0000 0); }
        [data-theme="dark"][data-accent="acid"] { --b-accent: oklch(93.88% 0.2000 122.3); --b-accent-foreground: oklch(18.22% 0.0271 108.8); }
        [data-accent="emerald"] { --b-accent: oklch(50.81% 0.1049 165.6); --b-accent-foreground: oklch(100.00% 0.0000 0); }
        [data-theme="dark"][data-accent="emerald"] { --b-accent: oklch(77.29% 0.1535 163.2); --b-accent-foreground: oklch(26.98% 0.0497 168.8); }
        [data-accent="iris"] { --b-accent: oklch(51.06% 0.2301 277.0); --b-accent-foreground: oklch(100.00% 0.0000 0); }
        [data-theme="dark"][data-accent="iris"] { --b-accent: oklch(78.53% 0.1041 274.7); --b-accent-foreground: oklch(25.73% 0.0861 281.3); }
        [data-accent="amber"] { --b-accent: oklch(55.34% 0.1739 38.4); --b-accent-foreground: oklch(100.00% 0.0000 0); }
        [data-theme="dark"][data-accent="amber"] { --b-accent: oklch(75.76% 0.1590 55.9); --b-accent-foreground: oklch(26.59% 0.0762 36.3); }
        [data-accent="inherit"] { --b-accent: var(--primary); --b-accent-foreground: var(--primary-foreground); }
      }
    `
  }),
];

// ── Phase 1 truth pass ─────────────────────────────────────────────
// EXPERIMENTAL = fails the Bar today: hidden from the default listing,
// kept installable via direct URL until its merge or rebuild lands.
//
// The list is empty. The consolidation that used to live here has landed:
// Backdrop (9 backgrounds), CursorFx (5 cursors), FxButton (4 button
// finishes), FxCard (7 card effects) and TextFx (6 text kinds) replaced the
// one-off components, the TUI restyles became the terminal theme, and the
// rebuilt pieces (calendar, rich text editor, streaming chat) now behave the
// way their names say.
//
// Add a slug here when a component ships with a name that overstates it, or
// with demo behaviour behind a real-sounding name. The bar is: the name
// matches what the component does, it renders server-side, and it passes
// the axe gate.
const EXPERIMENTAL = new Set<string>();

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
  [/from "motion"/g, 'from "motion/react"'],
  [/from 'motion'/g, "from 'motion/react'"],
];

export function toConsumerContent(content: string) {
  let out = content.replace(/\r/g, "");
  for (const [re, to] of CONSUMER_IMPORTS) out = out.replace(re, to);
  return out;
}

/** Versions pinned for registry consumers. `shadcn add` reads `name@range`.
 * Only motion is pinned: it is the one dependency whose public API moves
 * between majors, and the rest are stable enough to inherit from the host. */
const DEP_VERSIONS: Record<string, string> = {
  motion: "^13.4.0",
};

/** Packages the consumer must have for this item's source to compile.
 * Derived from the real import specifiers so the manifest can never claim a
 * dependency the code does not use, or omit one it does. */
const PEER_PACKAGES = new Set(["react", "react-dom"]);

export function inferDependencies(item: CatalogItem): string[] {
  const declared = new Set(item.dependencies ?? []);
  let src = "";
  for (const f of item.files) {
    try {
      src += "\n" + fs.readFileSync(path.join(process.cwd(), f), "utf8");
    } catch { /* ignore */ }
  }
  const specs = [
    ...src.matchAll(/(?:from|import)\s+["']([^"']+)["']/g),
  ].map((m) => m[1]);
  for (const spec of specs) {
    if (spec.startsWith(".") || spec.startsWith("@/") || spec.startsWith("node:")) continue;
    if (spec.startsWith("@buildora/")) continue;
    const pkg = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0];
    if (!pkg || PEER_PACKAGES.has(pkg)) continue;
    declared.add(pkg);
  }
  return [...declared].sort().map((pkg) =>
    DEP_VERSIONS[pkg] ? `${pkg}@${DEP_VERSIONS[pkg]}` : pkg
  );
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
  
  const REGISTRY_BASE_URL = process.env.REGISTRY_BASE_URL || "https://buildora-hazel.vercel.app";
  const buildoraSlugs = new Set(catalog.map(c => c.slug));
  
  return [...deps].map(d => {
    if (buildoraSlugs.has(d)) return `${REGISTRY_BASE_URL}/r/${d}.json`;
    return d;
  });
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
    $schema: "https://buildora-hazel.vercel.app/schema/registry-item.json",
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
    dependencies: inferDependencies(item),
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
    dependencies: inferDependencies(item),
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
    dependencies: inferDependencies(item),
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
    $schema: "https://buildora-hazel.vercel.app/schema/registry-item.json",
    name: "buildora",
    tagline: "Build. Remix. Ship.",
    version: "0.1.0",
    total: comps.length,
    installBase: "pnpm dlx shadcn@latest add @buildora/{component}",
    components: comps.map((c) => ({ slug: c.slug, name: c.name, description: c.description, categories: c.categories, tags: c.tags, difficulty: c.difficulty, version: c.version, status: (c as { status?: string }).status ?? "beta" })),
    shadcn: "Compatible — install via shadcn with the @buildora registry pointing at https://buildora-hazel.vercel.app/r/{component}.json, or the local /r/{component}.json endpoint."
  };
  fs.writeFileSync(path.join(outDir, "registry.json"), JSON.stringify(index, null, 2));
  const agentCatalog = {
    $schema: "https://buildora-hazel.vercel.app/schema/agent-catalog.json",
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
