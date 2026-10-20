import type { ComponentSummary } from "@/lib/registry";

/**
 * The brief an AI agent needs to use a component correctly.
 *
 * Competitors ship agent files; the useful part is not the file, it is the
 * facts: what to install, what the props do, and what the component promises
 * about accessibility. Those come from the registry, so the brief cannot
 * drift from the component.
 */
export function agentBrief(
  slug: string,
  summary?: ComponentSummary
): string {
  if (!summary) return "";

  const lines = [
    `# ${summary.name}`,
    "",
    summary.description,
    "",
    "## Install",
    "",
    "```bash",
    `pnpm dlx shadcn@latest add @buildora/${slug}`,
    "```",
    "",
    "## Import",
    "",
    "```tsx",
    `import { ${summary.name.replace(/[^A-Za-z0-9]/g, "")} } from "@/components/buildora/${slug}";`,
    "```",
    "",
    "## Facts",
    "",
    `- Collection: ${summary.collection ?? "kit"}`,
    `- Category: ${summary.categories.join(", ")}`,
    `- Difficulty: ${summary.difficulty}`,
    `- Status: ${summary.status ?? "beta"}`,
    "- React is the only full implementation. Other framework targets are snippet ports.",
    "- Uses Buildora tokens (--b-* vars). Do not hardcode colours.",
    "- Honours prefers-reduced-motion; the app can also pause all motion with",
    '  `data-motion="reduced"` on the document root.',
    "",
    "## Before you use it",
    "",
    "- Read the component source on the page before customizing it.",
    "- Only pass props the component actually accepts.",
    "- The shipped file is the whole component: one file, one install.",
  ];

  return lines.join("\n");
}
