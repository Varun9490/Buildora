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
  R("version-history", fullWeb, { name: "Version History", description: "Document version list with restore action.", categories: ["content"], tags: ["versions", "history"], difficulty: "intermediate" })
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
