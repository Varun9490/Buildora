/**
 * Generate apps/web/public/llms.txt from the catalogue.
 *
 * The file used to be hand-written, which is how it ended up claiming 72
 * components while the catalogue shipped 127, and listing components that
 * had been retired. The prose still matters — it is what an agent reads
 * before it decides what to install — so it stays here, but every number
 * and every component line is derived from the same source as the
 * registry, so it cannot drift.
 *
 * Run: pnpm registry:llms
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { pathToFileURL } from "node:url";
import { catalog, type CatalogItem } from "./catalog";

const root = process.cwd();

/** The frameworks, in the order the file lists them. */
const FRAMEWORKS: Array<[string, string]> = [
  ["react", "React"],
  ["javascript", "JavaScript"],
  ["vue", "Vue (Composition API)"],
  ["svelte", "Svelte (runes)"],
  ["angular", "Angular (@Input)"],
  ["html", "HTML"],
  ["tailwind", "Tailwind"],
  ["reactNative", "React Native"],
  ["flutter", "Flutter"],
  ["swiftUI", "SwiftUI"],
  ["compose", "Jetpack Compose"],
];

const STATUS_WORDS: Record<string, string> = {
  Full: "Full",
  Partial: "Partial",
  Experimental: "Experimental",
  Unsupported: "Unsupported",
};

/** Which components are Full outside React, and which are Unsupported anywhere. */
function frameworkSummary(): string {
  const lines: string[] = [];
  for (const [key, label] of FRAMEWORKS) {
    const items = catalog.filter((i) => i.compat[key]);
    const byLevel = (level: string) =>
      items.filter((i) => i.compat[key] === level).length;

    if (key === "react") {
      lines.push(
        `- React: Full on all ${byLevel("Full")} components. React is the source of truth and the only tested full implementation. Install via shadcn above.`
      );
      continue;
    }

    const counts: string[] = [];
    for (const level of ["Full", "Partial", "Experimental", "Unsupported"]) {
      const n = byLevel(level);
      if (n) counts.push(`${n} ${STATUS_WORDS[level]}`);
    }
    lines.push(
      `- ${label}: ${counts.join(", ") || "no components"} — snippet-level ports, not a dedicated runtime. Interactive behaviour requires the React implementation. On mobile there is no hover/cursor — use press + haptics.`
    );
  }

  const exceptions: string[] = [];

  // Full outside React, grouped by component so it reads as "these are the
  // ones that are genuinely portable", not "these frameworks differ".
  const fullBy: Record<string, string[]> = {};
  for (const item of catalog) {
    for (const [key, level] of Object.entries(item.compat)) {
      if (level === "Full" && key !== "react") {
        fullBy[item.slug] = [...(fullBy[item.slug] ?? []), key];
      }
    }
  }
  const fullSlugs = Object.keys(fullBy).sort();
  if (fullSlugs.length) {
    const parts = fullSlugs.map(
      (slug) =>
        `${slug} (${fullBy[slug]
          .map((k) => FRAMEWORKS.find(([kk]) => kk === k)?.[1] ?? k)
          .join(", ")})`
    );
    exceptions.push(`Full outside React: ${parts.join("; ")}`);
  }

  // Unsupported anywhere.
  const badBy: Record<string, string[]> = {};
  for (const item of catalog) {
    for (const [key, level] of Object.entries(item.compat)) {
      if (level === "Unsupported") {
        badBy[item.slug] = [...(badBy[item.slug] ?? []), key];
      }
    }
  }
  const badSlugs = Object.keys(badBy).sort();
  if (badSlugs.length) {
    const parts = badSlugs.map(
      (slug) =>
        `${slug} (${badBy[slug]
          .map((k) => FRAMEWORKS.find(([kk]) => kk === k)?.[1] ?? k)
          .join(", ")})`
    );
    exceptions.push(`Unsupported: ${parts.join("; ")}`);
  }

  if (exceptions.length) {
    lines.push(
      `- Exceptions (generated): ${exceptions.join(". ")}. Check \`registry/agent-catalog.json\` \`frameworks\` per component before promising support.`
    );
  }

  return lines.join("\n");
}

/** One line per component: slug, then the description. */
function componentLines(items: CatalogItem[]): string {
  return items
    .map((i) => `- ${i.slug}: ${i.description}`)
    .join("\n");
}

/**
 * The cost numbers, read from the report the size script writes.
 *
 * If the report is missing the section says so rather than quoting a
 * number nobody measured.
 */
function costLines(): string {
  const file = path.join(root, "registry", "reports", "bundle-size.json");
  let report: {
    medianGzipKb?: number;
    motion?: { componentsNeedingIt?: number; componentsWithoutIt?: number; gzipKb?: number };
  };
  try {
    report = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return "- Bundle sizes: run `pnpm registry:size` to generate the report.";
  }

  const m = report.motion ?? {};
  const lines = [
    `- Median component: ${report.medianGzipKb ?? "?"} KB gzipped. Per-component numbers in \`registry/reports/bundle-size.json\`.`,
  ];
  if (m.componentsWithoutIt !== undefined) {
    lines.push(
      `- ${m.componentsWithoutIt} of ${catalog.length} components need no animation library at all.`
    );
  }
  if (m.componentsNeedingIt !== undefined) {
    lines.push(
      `- The ${m.componentsNeedingIt} that do share one dependency (${m.gzipKb ?? "?"} KB gzipped), paid once per project rather than per component.`
    );
  }
  return lines.join("\n");
}

export function buildLlms(root: string): number {
  const creative = catalog.filter((i) => i.collection === "creative");
  const kit = catalog.filter((i) => i.collection !== "creative");
  const sorted = [...catalog].sort((a, b) => a.slug.localeCompare(b.slug));

  const body = `# Buildora — Build. Remix. Ship.

> Creative components for serious developers.

Buildora is a premium open-source, registry-driven component platform for
creative, interactive, production-ready developer components.
One component definition powers website, docs, playground, search, and install.
Accessibility-first: creative interactions never remove semantic behavior.
Flow: Discover → Interact → Inspect → Copy → Install → Remix → Ship.
Version: 0.1.0. License: MIT.

## Install (shadcn-compatible registry)

Pattern (from \`registry/registry.json\` \`installBase\`):

\`\`\`bash
pnpm dlx shadcn@latest add @buildora/{component}
\`\`\`

Example:

\`\`\`bash
pnpm dlx shadcn@latest add @buildora/magnetic-button
\`\`\`

\`\`\`tsx
import { MagneticButton } from "@/components/buildora/magnetic-button";

export function Demo() {
  return <MagneticButton strength={0.35}>Ship it</MagneticButton>;
}
\`\`\`

Registry endpoints:
- \`https://buildora-hazel.vercel.app/r/{component}.json\`
- Local: \`/r/{component}.json\` (served from \`registry/generated/\`)

Rebuild / validate (source of truth is \`scripts/catalog.ts\`):

\`\`\`bash
pnpm registry:build     # emits registry/components/*.json, registry/generated/*.json, registry/registry.json, apps/web/lib/registry-data.generated.ts
pnpm registry:validate  # schema + status check
pnpm registry:llms      # regenerates this file
\`\`\`

## Not using Tailwind

Every component with a TSX source also ships a CSS variant, generated from
that same source by \`pnpm registry:css\` — so the two cannot drift. Link the
token file and the component's CSS and it looks the same with no Tailwind setup:

\`\`\`css
@import "@/styles/buildora/tokens.css";
@import "@/styles/buildora/magnetic-button.css";
\`\`\`

## Components (${catalog.length} unique slugs, ${catalog.length} registry entries; one line each)

${componentLines(sorted)}

Collections: ${creative.length} creative, ${kit.length} kit.

Full machine-readable metadata: \`registry/registry.json\` (index), \`registry/agent-catalog.json\` (install + frameworks + docs + github per component), \`registry/components/*.json\`, \`registry/generated/*.json\`.
Per-component docs: \`/components/{slug}\`. Per-component source: \`https://github.com/Varun9490/Buildora/tree/main/packages/components/src/{slug}\`.

## Framework support (honest, generated from the catalogue)

${frameworkSummary()}

## Cost (measured, not estimated)

${costLines()}

## Links

- Site: https://buildora-hazel.vercel.app
- Components: https://buildora-hazel.vercel.app/components/{slug}
- Registry item: https://buildora-hazel.vercel.app/r/{component}.json
- Registry index: https://buildora-hazel.vercel.app/schema/registry-item.json
- Agent catalog: https://buildora-hazel.vercel.app/schema/agent-catalog.json
- GitHub: https://github.com/Varun9490/Buildora
- Docs: docs/registry.md, README.md, CONTRIBUTING.md
`;

  const out = path.join(root, "apps", "web", "public", "llms.txt");
  fs.writeFileSync(out, body, "utf8");
  return catalog.length;
}

// Run only when this file is the entry point, not when the registry build
// imports it.
const isEntry =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isEntry) {
  const n = buildLlms(root);
  console.log(`llms.txt: ${n} components → apps/web/public/llms.txt`);
}
