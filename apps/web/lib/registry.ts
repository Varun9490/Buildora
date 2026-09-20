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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const req = (typeof require !== "undefined" ? require : null) as unknown as { context?: unknown } | null;

function loadItem(slug: string): RegistryItem | null {
  try {
    // Next.js bundles JSON imports statically; use dynamic require via eval-safe path
    // Fallback: reconstruct from index + conventions if file not importable
    return null;
  } catch {
    return null;
  }
}

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
  // Used in client components where async is awkward — index-level data only
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
    files: [{ path: `packages/components/src/${found.slug}/index.tsx`, content: "// Loading source code..." }],
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
  sort: "popular" | "newest" | "az";
};

// Deterministic pseudo-popularity from slug hash (stable sort demo)
function popularity(slug: string) {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) % 1000;
  // signature components float to top
  if (["slingshot-otp", "magnetic-button", "spatial-command-palette", "kanban", "streaming-chat"].includes(slug)) h += 2000;
  return h;
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
    const sa = q ? fuzzyScore(q, `${a.name} ${a.slug} ${a.description}`) : 0;
    const sb = q ? fuzzyScore(q, `${b.name} ${b.slug} ${b.description}`) : 0;
    if (q && sa !== sb) return sb - sa;
    return popularity(b.slug) - popularity(a.slug);
  });
  return out;
}

export const allCategories = ["creative", "ai-llm", "data", "developer", "saas", "complex", "content", "primitives", "forms", "navigation", "overlays", "feedback", "blocks"];
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
