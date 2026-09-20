import registryIndex from "../../../registry/registry.json";
import { fuzzyScore } from "@buildora/utils";

export type RegistryItem = {
  $schema: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  categories: string[];
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  version: string;
  license: string;
  states: string[];
  implementations: Record<string, { status: "Full" | "Partial" | "Experimental" | "Unsupported"; notes?: string; files?: string[] }>;
  accessibility: { keyboard: boolean; screenReader: boolean; reducedMotion: boolean };
  dependencies: string[];
  registryDependencies: string[];
  files: { path: string; content: string }[];
  github: string;
  docs: string;
  install: string;
};

export type ComponentSummary = {
  slug: string;
  name: string;
  description: string;
  categories: string[];
  tags: string[];
  difficulty: string;
  version: string;
};

export const allComponents: ComponentSummary[] = (registryIndex as { components: ComponentSummary[] }).components;

export const totalComponents = (registryIndex as { total: number }).total;

export async function getComponent(slug: string): Promise<RegistryItem | null> {
  const { registryComponents } = await import("./registry-data.generated");
  return ((registryComponents as Record<string, RegistryItem>)[slug] ?? null);
}

export function getComponentSync(slug: string): RegistryItem | null {
  // Client-safe sync accessor: index-level data only. Real source files are
  // served via the registry API; we never fabricate file contents here.
  const found = allComponents.find((c) => c.slug === slug);
  if (!found) return null;
  return {
    $schema: "",
    id: found.slug,
    name: found.name,
    slug: found.slug,
    description: found.description,
    categories: found.categories,
    tags: found.tags,
    difficulty: found.difficulty as RegistryItem["difficulty"],
    version: found.version,
    license: "MIT",
    states: [],
    implementations: {},
    accessibility: { keyboard: true, screenReader: true, reducedMotion: true },
    dependencies: [],
    registryDependencies: [],
    files: [],
    github: `https://github.com/Varun9490/Buildora/tree/main/packages/components/src/${found.slug}`,
    docs: `/components/${found.slug}`,
    install: `pnpm dlx shadcn@latest add @buildora/${found.slug}`
  };
}

export type SearchFilters = {
  query: string;
  category: string;
  framework: string;
  tag: string;
  difficulty: string;
  sort: "featured" | "newest" | "az";
};

// Featured: signature components rank first; everything else sorts alphabetically.
// No fake popularity scores — the label matches the behavior.
function featuredRank(slug: string) {
  return ["slingshot-otp", "magnetic-button", "spatial-command-palette", "kanban", "streaming-chat"].includes(slug)
    ? 1
    : 0;
}

export function searchComponents(items: ComponentSummary[], f: SearchFilters): ComponentSummary[] {
  const q = f.query.trim().toLowerCase();
  let out = items.filter((c) => {
    if (f.category !== "all" && !c.categories.includes(f.category)) return false;
    if (f.difficulty !== "all" && c.difficulty !== f.difficulty) return false;
    if (f.tag !== "all" && !c.tags.includes(f.tag)) return false;
    if (!q) return true;
    const hay = `${c.name} ${c.slug} ${c.description} ${c.tags.join(" ")} ${c.categories.join(" ")}`;
    return fuzzyScore(q, hay) > 0;
  });
  out = [...out].sort((a, b) => {
    if (f.sort === "az") return a.name.localeCompare(b.name);
    if (f.sort === "newest") return b.slug.localeCompare(a.slug);
    if (f.sort === "featured") {
      const fa = featuredRank(a.slug);
      const fb = featuredRank(b.slug);
      if (fa !== fb) return fb - fa;
      return a.name.localeCompare(b.name);
    }
    const sa = q ? fuzzyScore(q, `${a.name} ${a.slug} ${a.description}`) : 0;
    const sb = q ? fuzzyScore(q, `${b.name} ${b.slug} ${b.description}`) : 0;
    if (q && sa !== sb) return sb - sa;
    return a.name.localeCompare(b.name);
  });
  return out;
}

export const allCategories = ["primitives", "forms", "feedback", "navigation", "overlays", "motion", "backgrounds", "data", "developer", "ai-llm", "canvas", "editor", "blocks", "saas"];

export const categoryMeta: Record<string, { label: string; blurb: string }> = {
  primitives: { label: "Primitives", blurb: "Unstyled-able foundations: buttons, badges, tabs, layout." },
  forms: { label: "Forms", blurb: "Inputs, selects, and controls with real semantics." },
  feedback: { label: "Feedback", blurb: "Loaders, toasts, and progress that announce state." },
  navigation: { label: "Navigation", blurb: "Headers, sidebars, trails, and command surfaces." },
  overlays: { label: "Overlays", blurb: "Dialogs, popovers, and menus with focus management." },
  motion: { label: "Motion", blurb: "Tactile springs, pointer physics, and kinetic type." },
  backgrounds: { label: "Backgrounds", blurb: "Ambient surfaces: aurora, grids, particles, beams." },
  data: { label: "Data", blurb: "Tables, grids, and inspectors with honest semantics." },
  developer: { label: "Developer", blurb: "Terminals, file trees, and TUI building blocks." },
  "ai-llm": { label: "AI / LLM", blurb: "Chat, agents, and review flows. Bring your own model." },
  canvas: { label: "Canvas", blurb: "Boards, diagrams, and timelines you manipulate." },
  editor: { label: "Editor", blurb: "Markdown, mentions, and versioned writing surfaces." },
  blocks: { label: "Blocks", blurb: "Copy-paste page sections composed from primitives." },
  saas: { label: "SaaS", blurb: "Pricing, teams, and product workflows." },
};
export const allTags = [...new Set(allComponents.flatMap((c) => c.tags))].sort();
export const frameworks = ["react", "javascript", "vue", "svelte", "angular", "html", "tailwind", "reactNative", "flutter", "swiftUI", "compose"];
export const frameworkLabels: Record<string, string> = {
  react: "React",
  javascript: "JavaScript",
  vue: "Vue",
  svelte: "Svelte",
  angular: "Angular",
  html: "HTML/CSS/JS",
  tailwind: "Tailwind",
  reactNative: "React Native",
  flutter: "Flutter",
  swiftUI: "SwiftUI",
  compose: "Jetpack Compose"
};
