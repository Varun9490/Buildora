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
    react: "Full",
    javascript: "Full",
    vue: "Partial",
    svelte: "Partial",
    angular: "Partial",
    html: "Full",
    tailwind: "Full",
    reactNative: "Partial",
    flutter: "Experimental",
    swiftUI: "Experimental",
    compose: "Experimental",
    ...compat
  },
  notes: extra.notes,
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
  R("cursor-spotlight", fullWeb, { name: "Cursor Spotlight", description: "Cursor-tracked spotlight container for any content.", categories: ["creative"], tags: ["cursor", "spotlight"], difficulty: "beginner" }),
  R("aurora-background", fullWeb, { name: "Aurora Background", description: "Slow-drifting aurora blobs. Reduced-motion safe, pure CSS.", categories: ["creative"], tags: ["background", "aurora", "gradient"], difficulty: "beginner", compat: { react: "Full", javascript: "Full", html: "Full", tailwind: "Full", vue: "Full", svelte: "Full", angular: "Full", reactNative: "Partial", flutter: "Partial", swiftUI: "Partial", compose: "Partial" }, notes: { reactNative: "Use LinearGradient + Animated instead of blur.", flutter: "Use BackdropFilter + CustomPaint.", swiftUI: "Use LinearGradient + blur modifiers." } }),
  R("particle-field", { ...noMobile3D, reactNative: "Experimental" }, { name: "Particle Field", description: "Lightweight canvas particle field with DPR scaling. No Three.js needed.", categories: ["creative"], tags: ["particles", "canvas"], difficulty: "intermediate", notes: { reactNative: "Use react-native-skia or SVG; canvas not available.", flutter: "Use CustomPainter.", swiftUI: "Use Canvas + TimelineView." } }),
  R("morphing-typography", fullWeb, { name: "Morphing Typography", description: "Cycling display words with gradient + motion. aria-live polite.", categories: ["creative"], tags: ["typography", "animated"], difficulty: "beginner" }),
  R("holographic-card", fullWeb, { name: "Holographic Card", description: "Holographic sheen that tracks the pointer.", categories: ["creative"], tags: ["card", "holographic", "hover"], difficulty: "intermediate" }),
  R("interactive-3d-card", { ...noMobile3D }, { name: "Interactive 3D Card", description: "Lightweight CSS 3D flip card. Lazy-safe; no Three.js on this page.", categories: ["creative"], tags: ["3d", "flip", "card"], difficulty: "intermediate", notes: { reactNative: "Use Animated + rotateY interpolation.", flutter: "Use Transform with Matrix4.", swiftUI: "Use rotation3DEffect." } }),
  R("tactile-loader", fullWeb, { name: "Tactile Loader", description: "Bouncy dot loader with role=status and SR label.", categories: ["creative"], tags: ["loader", "feedback"], difficulty: "beginner" }),
  R("creative-notifications", fullWeb, { name: "Creative Notifications", description: "Stacked toast system with tones and live-region announcements.", categories: ["creative"], tags: ["toast", "notifications"], difficulty: "intermediate" }),

  R("streaming-chat", fullWeb, { name: "Streaming Chat", description: "Token-streaming chat UI with citations. Frontend only — bring your own LLM backend.", categories: ["ai-llm"], tags: ["chat", "streaming", "llm"], difficulty: "intermediate" }),
  R("model-selector", fullWeb, { name: "Model Selector", description: "Accessible model picker with status dot.", categories: ["ai-llm"], tags: ["model", "selector"], difficulty: "beginner" }),
  R("token-meter", fullWeb, { name: "Token Meter", description: "Token usage meter with role=meter semantics.", categories: ["ai-llm"], tags: ["tokens", "usage", "meter"], difficulty: "beginner" }),
  R("tool-call-viz", fullWeb, { name: "Tool Call Visualization", description: "Timeline of agent tool calls with running/done states.", categories: ["ai-llm"], tags: ["tools", "agent", "timeline"], difficulty: "intermediate" }),
  R("agent-timeline", fullWeb, { name: "Agent Timeline", description: "Agent activity timeline (plan → act → observe). Shares Tool Call Viz patterns.", categories: ["ai-llm"], tags: ["agent", "timeline"], difficulty: "intermediate", files: ["packages/components/src/streaming-chat/index.tsx"] }),
  R("attachment-prompt", fullWeb, { name: "Attachment Prompt", description: "Prompt input with attachment chips. Pairs with Streaming Chat + Dropzone.", categories: ["ai-llm"], tags: ["prompt", "attachments"], difficulty: "intermediate", files: ["packages/components/src/interactive-dropzone/index.tsx"] }),
  R("ai-review-edit", fullWeb, { name: "AI Review & Edit", description: "Diff-style review UI for AI-generated content (accept / edit / reject).", categories: ["ai-llm", "content"], tags: ["review", "diff", "ai"], difficulty: "intermediate", files: ["packages/components/src/markdown-editor/index.tsx"] }),

  R("advanced-table", fullWeb, { name: "Advanced Table", description: "Sortable, filterable, paginated table with semantic <table> markup.", categories: ["data"], tags: ["table", "sorting", "filter"], difficulty: "intermediate" }),
  R("spreadsheet-grid", fullWeb, { name: "Spreadsheet Grid", description: "Spreadsheet-like grid patterns (built on Advanced Table + Inline Editor).", categories: ["data"], tags: ["grid", "spreadsheet"], difficulty: "advanced", files: ["packages/components/src/advanced-table/index.tsx"] }),
  R("json-viewer", fullWeb, { name: "JSON Viewer", description: "Collapsible JSON viewer with mono styling.", categories: ["data", "developer"], tags: ["json", "viewer"], difficulty: "beginner", files: ["packages/components/src/advanced-table/index.tsx"] }),
  R("log-viewer", fullWeb, { name: "Log Viewer", description: "Filterable log stream with role=log semantics.", categories: ["data", "developer"], tags: ["logs", "viewer"], difficulty: "beginner", files: ["packages/components/src/advanced-table/index.tsx"] }),
  R("query-builder", fullWeb, { name: "Query Builder", description: "Filter/query builder chips (uses Advanced Table filter patterns).", categories: ["data"], tags: ["filter", "query"], difficulty: "advanced", files: ["packages/components/src/advanced-table/index.tsx"] }),
  R("diff-viewer", fullWeb, { name: "Diff Viewer", description: "Side-by-side data comparison view.", categories: ["data", "content"], tags: ["diff", "compare"], difficulty: "intermediate", files: ["packages/components/src/markdown-editor/index.tsx"] }),

  R("terminal", fullWeb, { name: "Terminal", description: "Terminal emulator UI with scrollback + command input.", categories: ["developer"], tags: ["terminal", "cli"], difficulty: "intermediate" }),
  R("code-editor", fullWeb, { name: "Code Editor (Lite)", description: "Editable code pane with live preview. No heavy editor dep.", categories: ["developer"], tags: ["editor", "code"], difficulty: "intermediate", files: ["packages/components/src/terminal/index.tsx"] }),
  R("file-tree", fullWeb, { name: "File Tree", description: "Accessible tree with expand/collapse and keyboard support.", categories: ["developer"], tags: ["files", "tree"], difficulty: "beginner", files: ["packages/components/src/terminal/index.tsx"] }),
  R("api-request-builder", fullWeb, { name: "API Request Builder", description: "Method + URL + headers + body inspector patterns.", categories: ["developer"], tags: ["api", "http"], difficulty: "intermediate", files: ["packages/components/src/terminal/index.tsx"] }),
  R("webhook-viewer", fullWeb, { name: "Webhook Viewer", description: "Webhook event list with payload inspector (Log Viewer patterns).", categories: ["developer"], tags: ["webhooks", "events"], difficulty: "intermediate", files: ["packages/components/src/advanced-table/index.tsx"] }),
  R("env-manager", fullWeb, { name: "Environment Manager", description: "Masked env-var table with reveal + copy.", categories: ["developer"], tags: ["env", "secrets"], difficulty: "intermediate", files: ["packages/components/src/advanced-table/index.tsx"] }),
  R("cron-builder", fullWeb, { name: "Cron Builder", description: "Human-friendly cron expression builder.", categories: ["developer"], tags: ["cron", "scheduler"], difficulty: "intermediate", files: ["packages/components/src/kanban/index.tsx"] }),

  R("pricing-table", fullWeb, { name: "Pricing Table", description: "Billing toggle + featured tier. Demo only — Buildora has no payments.", categories: ["saas"], tags: ["pricing", "billing"], difficulty: "beginner" }),
  R("usage-dashboard", fullWeb, { name: "Usage Dashboard", description: "Usage bars with accessible img fallback text.", categories: ["saas", "data"], tags: ["usage", "dashboard"], difficulty: "beginner", files: ["packages/components/src/pricing-table/index.tsx"] }),
  R("team-switcher", fullWeb, { name: "Team Switcher", description: "Org/team switcher with listbox semantics.", categories: ["saas"], tags: ["team", "org"], difficulty: "beginner", files: ["packages/components/src/pricing-table/index.tsx"] }),
  R("invite-flow", fullWeb, { name: "Invite Flow", description: "Invite-member dialog patterns (Team Switcher + Mention Input).", categories: ["saas"], tags: ["invite", "team"], difficulty: "intermediate", files: ["packages/components/src/pricing-table/index.tsx"] }),
  R("onboarding-checklist", fullWeb, { name: "Onboarding Checklist", description: "Progress-tracked checklist with real checkboxes.", categories: ["saas"], tags: ["onboarding", "checklist"], difficulty: "beginner", files: ["packages/components/src/pricing-table/index.tsx"] }),
  R("approval-workflow", fullWeb, { name: "Approval Workflow", description: "Multi-step approval chain (Kanban + Checklist patterns).", categories: ["saas", "complex"], tags: ["approval", "workflow"], difficulty: "advanced", files: ["packages/components/src/kanban/index.tsx"] }),
  R("audit-log", fullWeb, { name: "Audit Log", description: "Immutable event log (Log Viewer patterns).", categories: ["saas", "data"], tags: ["audit", "log"], difficulty: "intermediate", files: ["packages/components/src/advanced-table/index.tsx"] }),
  R("feature-flags", fullWeb, { name: "Feature Flags", description: "Flag toggles with switch semantics.", categories: ["saas", "developer"], tags: ["flags", "toggles"], difficulty: "intermediate", files: ["packages/components/src/pricing-table/index.tsx"] }),

  R("command-palette", fullWeb, { name: "Command Palette", description: "Base command palette (see Spatial variant for depth presentation).", categories: ["complex"], tags: ["command", "keyboard"], difficulty: "intermediate", files: ["packages/components/src/spatial-command-palette/index.tsx"] }),
  R("kanban", fullWeb, { name: "Physics Kanban", description: "Spring drag board with snap zones + Alt+Arrow keyboard movement.", categories: ["complex"], tags: ["kanban", "drag", "physics"], difficulty: "advanced" }),
  R("node-editor", fullWeb, { name: "Node Editor", description: "Node/edge diagram primitives (Kanban drag + zoom patterns).", categories: ["complex"], tags: ["nodes", "diagram"], difficulty: "advanced", files: ["packages/components/src/kanban/index.tsx"] }),
  R("timeline-editor", fullWeb, { name: "Timeline Editor", description: "Track-based timeline editor patterns.", categories: ["complex", "content"], tags: ["timeline"], difficulty: "advanced", files: ["packages/components/src/kanban/index.tsx"] }),
  R("calendar", fullWeb, { name: "Calendar", description: "Scheduling grid with gridcell semantics.", categories: ["complex"], tags: ["calendar", "scheduling"], difficulty: "intermediate", files: ["packages/components/src/kanban/index.tsx"] }),
  R("workflow-builder", fullWeb, { name: "Workflow Builder", description: "Multi-step workflow composer.", categories: ["complex"], tags: ["workflow", "steps"], difficulty: "advanced", files: ["packages/components/src/kanban/index.tsx"] }),

  R("markdown-editor", fullWeb, { name: "Markdown Editor", description: "Split markdown editor with live preview.", categories: ["content"], tags: ["markdown", "editor"], difficulty: "intermediate" }),
  R("mention-input", fullWeb, { name: "Mention Input", description: "@mention autocomplete with listbox suggestions.", categories: ["content"], tags: ["mentions"], difficulty: "intermediate", files: ["packages/components/src/markdown-editor/index.tsx"] }),
  R("comment-thread", fullWeb, { name: "Comment Thread", description: "Resolve/reopen comment thread.", categories: ["content"], tags: ["comments"], difficulty: "beginner", files: ["packages/components/src/markdown-editor/index.tsx"] }),
  R("rich-text-editor", fullWeb, { name: "Rich Text Editor", description: "Toolbar + contentEditable patterns (Markdown Editor + Slash Commands).", categories: ["content"], tags: ["rich-text"], difficulty: "advanced", files: ["packages/components/src/markdown-editor/index.tsx"] }),
  R("slash-commands", fullWeb, { name: "Slash Commands", description: "Notion-style / command menu (Mention Input patterns).", categories: ["content"], tags: ["slash", "blocks"], difficulty: "intermediate", files: ["packages/components/src/markdown-editor/index.tsx"] }),
  R("version-history", fullWeb, { name: "Version History", description: "Document version list with restore.", categories: ["content"], tags: ["versions", "history"], difficulty: "intermediate", files: ["packages/components/src/advanced-table/index.tsx"] })
];

export function toRegistryJson(item: CatalogItem) {
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
    files: item.files,
    github: `https://github.com/buildora/buildora/tree/main/packages/components/src/${item.slug}`,
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
    files: item.files.map((f) => ({ path: f, type: "registry:component" as const })),
    docs: `https://github.com/buildora/buildora/tree/main/${f2(item)}`
  };
}

function f2(item: CatalogItem) {
  return item.files[0] ?? "";
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
  return index;
}
