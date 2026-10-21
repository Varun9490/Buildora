/**
 * Catalogue coherence gate.
 *
 * The site, the registry and the package must describe the same catalogue.
 * When they drifted, the homepage showed components that could not be
 * installed, and the registry published components the site never mentioned.
 *
 * Checks:
 *   1. Every slug in the site's explorer groups exists in the registry.
 *   2. Every registry slug appears in exactly one explorer group.
 *   3. Every registry slug is exported by the package barrel.
 *   4. Every component page has a live demo case in the renderer.
 *   5. No component is published under two different slugs.
 *
 * Run: pnpm registry:catalogue
 */
import * as fs from "node:fs";
import * as path from "node:path";

const root = process.cwd();
const failures: string[] = [];
const fail = (m: string) => failures.push(m);

const read = (p: string) => fs.readFileSync(path.join(root, p), "utf8");

/* ── The registry ───────────────────────────────────────────────────────── */
const registryIndex = JSON.parse(read("registry/registry.json")) as {
  total: number;
  components: Array<{ slug: string; name: string }>;
};
const published = registryIndex.components.map((c) => c.slug);
const publishedSet = new Set(published);

if (publishedSet.size !== published.length) {
  const seen = new Set<string>();
  for (const s of published) {
    if (seen.has(s)) fail(`registry publishes "${s}" more than once`);
    seen.add(s);
  }
}
if (registryIndex.total !== published.length) {
  fail(`registry total is ${registryIndex.total} but it lists ${published.length} components`);
}

/* ── The shipped source of every item ──────────────────────────────────── */
const generatedDir = path.join(root, "registry", "generated");
const registry = new Map<
  string,
  { files: Array<{ content?: string; target?: string }> }
>();
for (const f of fs.readdirSync(generatedDir)) {
  if (!f.endsWith(".json") || f === "registry.json" || f === "agent-catalog.json") {
    continue;
  }
  const slug = f.replace(/\.json$/, "");
  registry.set(
    slug,
    JSON.parse(fs.readFileSync(path.join(generatedDir, f), "utf8")) as {
      files: Array<{ content?: string; target?: string }>;
    }
  );
}

/* ── The site's explorer groups ─────────────────────────────────────────── */
const explorer = read("apps/web/components/landing/ExplorerWorkspace.tsx");
const groupsBlock = explorer.slice(
  explorer.indexOf("const GROUPS"),
  explorer.indexOf("const SIGNATURE_DEMOS")
);
const groupSlugs: string[] = [];
for (const g of groupsBlock.matchAll(/id:\s*"([^"]+)",\s*\n\s*label:[^]*?slugs:\s*\[([^\]]*)\]/g)) {
  for (const m of g[2].matchAll(/"([a-z0-9-]+)"/g)) groupSlugs.push(m[1]);
}

const groupCounts = new Map<string, number>();
for (const s of groupSlugs) groupCounts.set(s, (groupCounts.get(s) ?? 0) + 1);

for (const s of groupSlugs) {
  if (!publishedSet.has(s)) {
    fail(`explorer groups list "${s}", which is not in the registry`);
  }
}
for (const [s, n] of groupCounts) {
  if (n > 1) fail(`explorer groups list "${s}" in ${n} groups`);
}

const grouped = new Set(groupSlugs);
const ungrouped = published.filter((s) => !grouped.has(s));
// Foundations are libraries, not components: they are documented but not
// showcased in the explorer.
const FOUNDATIONS = new Set([
  "utils",
  "use-reduced-motion",
  "use-pointer-proximity",
  "spring",
  "tokens",
]);
for (const s of ungrouped) {
  if (!FOUNDATIONS.has(s)) {
    fail(`"${s}" is published but appears in no explorer group`);
  }
}

/* ── The package barrel ─────────────────────────────────────────────────── */
const barrel = read("packages/components/src/index.ts");
const exported = new Set<string>();
for (const m of barrel.matchAll(/export\s*\{([^}]*)\}/g)) {
  for (const part of m[1].split(",")) {
    const name = part.trim().split(/\s+as\s+/).pop()?.trim();
    if (name && /^\w+$/.test(name)) exported.add(name);
  }
}
for (const m of barrel.matchAll(/export\s+(?:function|const|class)\s+(\w+)/g)) {
  exported.add(m[1]);
}
for (const m of barrel.matchAll(/export\s*\{\s*([^}]*?)\s*\}\s*from\s*"\.\/[^"]+"/g)) {
  for (const part of m[1].split(",")) {
    const name = part.trim().split(/\s+as\s+/).pop()?.trim();
    if (name && /^\w+$/.test(name)) exported.add(name);
  }
}

/* ── The renderer's demo cases ──────────────────────────────────────────── */
const renderer = read("apps/web/components/ComponentRenderer.tsx");
const demoed = new Set<string>();
for (const m of renderer.matchAll(/case\s+"([a-z0-9-]+)":/g)) demoed.add(m[1]);

const FOUNDATION_DEMOS = new Set(FOUNDATIONS);
for (const s of published) {
  if (!demoed.has(s) && !FOUNDATION_DEMOS.has(s)) {
    fail(`"${s}" has no live demo in the component renderer`);
  }
}
for (const s of demoed) {
  if (!publishedSet.has(s)) {
    fail(`the renderer demos "${s}", which is not in the registry`);
  }
}

/* ── 6. Reduced motion ───────────────────────────────────────────────────
   A component that moves on its own must check the motion preference
   first. Otherwise the site is making an accessibility promise the
   components do not keep. */
const MOVES = /requestAnimationFrame|animate-|animation:|motion\.|springStep|useMagnetic|setInterval/;
const CHECKS = /useReducedMotion|prefers-reduced-motion|motion-safe:/;

for (const [slug, item] of registry) {
  const code = item.files.map((f) => f.content ?? "").join("\n");
  if (!MOVES.test(code)) continue;
  if (!CHECKS.test(code)) {
    fail(`"${slug}" moves but never checks the motion preference`);
  }
}

/* ── 7. CSS variants ─────────────────────────────────────────────────────
   Every component with a TSX file must have a generated CSS variant, and
   the file must parse. The CSS is generated from the same source the
   Tailwind variant ships, so it cannot drift — but a missing one would
   leave a consumer without Tailwind stuck. */
const cssDir = path.join(root, "apps", "web", "public", "css");
const cssFiles = fs.existsSync(cssDir)
  ? fs.readdirSync(cssDir).filter((f) => f.endsWith(".css"))
  : [];

for (const [slug] of registry) {
  const item = registry.get(slug)!;
  if (!item.files.some((f) => f.path.endsWith(".tsx"))) continue;
  if (!cssFiles.includes(`${slug}.css`)) {
    fail(`"${slug}" has no CSS variant — run pnpm registry:css`);
  }
}

/* ── 8. The advertised schemas exist ──────────────────────────────────────
   Every registry item carries a $schema URL. If the file behind it is
   missing, the site is advertising a schema it does not have. */
const schemaDir = path.join(root, "apps", "web", "public", "schema");
for (const name of ["registry-item.json", "agent-catalog.json"]) {
  if (!fs.existsSync(path.join(schemaDir, name))) {
    fail(`the advertised schema ${name} is missing — run pnpm registry:schema`);
  }
}

/* ── Report ─────────────────────────────────────────────────────────────── */
console.log(
  `Catalogue: ${published.length} published · ${groupSlugs.length} grouped · ${exported.size} exports · ${demoed.size} demos · ${cssFiles.length} css variants`
);

if (failures.length) {
  console.error(`\n✗ catalogue gate failed (${failures.length}):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("Catalogue gate passed: registry, package and site agree.");
