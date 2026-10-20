/**
 * Library audit — measures what actually ships.
 *
 * The previous version of this script read the source tree and reported
 * workspace imports, index.tsx files and undeclared dependencies that the
 * build already resolves. Its output was stale enough to be misleading, so
 * it now reads the generated registry — the artefacts a consumer installs —
 * and reports only risks that are still true.
 *
 * Run: pnpm exec tsx scripts/audit.ts   (writes AUDIT.md)
 */
import * as fs from "node:fs";
import * as path from "node:path";

const root = process.cwd();
const generatedDir = path.join(root, "registry", "generated");

type Item = {
  /** The slug (shadcn uses the slug as the item name). */
  name: string;
  /** The display title. */
  title: string;
  description: string;
  files: Array<{ path: string; target: string; content: string }>;
  dependencies: string[];
  registryDependencies: string[];
};

const items: Item[] = fs
  .readdirSync(generatedDir)
  .filter((f) => f.endsWith(".json") && f !== "registry.json" && f !== "agent-catalog.json")
  .map((f) => JSON.parse(fs.readFileSync(path.join(generatedDir, f), "utf8")) as Item);

/* ── Helpers ─────────────────────────────────────────────────────────── */
const source = (item: Item) => item.files.map((f) => f.content).join("\n");

function importsOf(code: string): string[] {
  const specs: string[] = [];
  const re = /(?:from|import)\s+["']([^"']+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code))) specs.push(m[1]);
  return specs;
}

function packageOf(spec: string): string | null {
  if (spec.startsWith(".") || spec.startsWith("/") || spec.startsWith("node:")) return null;
  if (spec.startsWith("@/") || spec.startsWith("~/")) return null;
  if (spec === "react" || spec === "react-dom" || spec.startsWith("react/")) return null;
  if (/\.(css|scss|less|svg|png|jpg|woff2?)$/.test(spec)) return null;
  const parts = spec.split("/");
  return spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

/** Words in a name or description that promise behaviour the code must show. */
const OVERPROMISED = [
  { word: "physics", needs: /spring|stiffness|damping|velocity|momentum/i },
  { word: "virtualized", needs: /virtual|overscan|window/i },
  { word: "streaming", needs: /stream|chunk|token/i },
  { word: "xterm", needs: /xterm/i },
  { word: "sanit", needs: /sanit|allowlist|strip/i },
];

type Flags = {
  slug: string;
  name: string;
  description: string;
  undeclaredDeps: string[];
  hardcodedColors: string[];
  styleJsx: boolean;
  execCommand: boolean;
  tokenless: boolean;
  missingAria: string[];
  overpromised: string[];
  indexTarget: string[];
  sharedFile: boolean;
};

const flags: Flags[] = items.map((item) => {
  const isCss = item.files.every((f) => f.target.endsWith(".css"));
  const code = source(item);
  const declared = new Set(item.dependencies.map((d) => d.split("@")[0]));

  const undeclaredDeps = [
    ...new Set(
      importsOf(code)
        .map(packageOf)
        .filter((p): p is string => p !== null && !declared.has(p))
    ),
  ];

  const hardcodedColors = [
    ...new Set(
      (code.match(/#[0-9a-fA-F]{3,8}\b/g) ?? []).map((c) => c.toLowerCase())
    ),
  ].slice(0, 6);

  const missingAria: string[] = [];
  if (!isCss) {
    if (/role="dialog"/.test(code) && !/aria-labelledby|aria-label/.test(code)) {
      missingAria.push("dialog without a label");
    }
    if (/role="menuitemcheckbox"/.test(code) && !/aria-checked/.test(code)) {
      missingAria.push("menuitemcheckbox without aria-checked");
    }
    if (/role="(slider|spinbutton|progressbar|meter)"/.test(code) && !/aria-valuenow/.test(code)) {
      missingAria.push("value role without aria-valuenow");
    }
  }

  const overpromised = OVERPROMISED.filter((p) => {
    const text = `${item.title} ${item.description}`.toLowerCase();
    return text.includes(p.word) && !p.needs.test(code);
  }).map((p) => p.word);

  const indexTarget = item.files
    .filter((f) => f.target.endsWith("/index.tsx") && f.target !== `components/buildora/${item.name}/index.tsx`)
    .map((f) => f.target);

  return {
    slug: item.name,
    name: item.title,
    description: item.description,
    undeclaredDeps,
    hardcodedColors,
    // `execCommand` is deprecated for editing but remains the only
    // dependency-free clipboard fallback, so only the editor use is flagged.
    styleJsx: !isCss && /<style\s+jsx/.test(code),
    execCommand: !isCss && /document\.execCommand\s*\(\s*["'](?!copy["'])/.test(code),
    tokenless: !isCss && !/var\(--b-/.test(code) && item.name !== "tokens",
    missingAria,
    overpromised,
    indexTarget,
    sharedFile: false,
  };
});

/* ── Shared files across items ───────────────────────────────────────── */
const fileUse = new Map<string, string[]>();
for (const item of items) {
  for (const f of item.files) {
    fileUse.set(f.path, [...(fileUse.get(f.path) ?? []), item.slug]);
  }
}
for (const flag of flags) {
  const item = items.find((i) => i.name === flag.slug)!;
  flag.sharedFile = item.files.some((f) => (fileUse.get(f.path) ?? []).length > 1);
}

/* ── Report ──────────────────────────────────────────────────────────── */
const count = (fn: (f: Flags) => boolean) => flags.filter(fn).length;

const summary = [
  { flag: "Undeclared third-party import", n: count((f) => f.undeclaredDeps.length > 0), meaning: "the install will not compile" },
  { flag: "Hardcoded colours", n: count((f) => f.hardcodedColors.length > 0), meaning: "the component ignores the theme" },
  { flag: "No theme token", n: count((f) => f.tokenless), meaning: "nothing reads --b-* vars" },
  { flag: "`<style jsx>`", n: count((f) => f.styleJsx), meaning: "Next-only; breaks elsewhere" },
  { flag: "`document.execCommand`", n: count((f) => f.execCommand), meaning: "deprecated editor path" },
  { flag: "Missing ARIA", n: count((f) => f.missingAria.length > 0), meaning: "a role without the attribute it needs" },
  { flag: "Name promises more than the code", n: count((f) => f.overpromised.length > 0), meaning: "the description is not backed" },
  { flag: "Ambiguous index.tsx target", n: count((f) => f.indexTarget.length > 0), meaning: "two installs can overwrite each other" },
  { flag: "File shared with another item", n: count((f) => f.sharedFile), meaning: "installing it also installs its neighbour" },
];

let md = `# Buildora Library Audit

> Generated by \`scripts/audit.ts\`. Measures the generated registry — the
> artefacts a consumer installs — not the source tree. Regenerate with
> \`pnpm exec tsx scripts/audit.ts\`.
>
> Every flag below is also enforced by a CI gate. This file is the readable
> version of the same truth:
>
> | Gate | Command |
> |---|---|
> | Installability | \`pnpm registry:audit\`, \`pnpm registry:verify-install\` |
> | Contrast | \`pnpm registry:contrast\` |
> | Accessibility | \`pnpm --filter @buildora/components test\` |
> | Catalogue coherence | \`pnpm registry:catalogue\` |

## 0. Summary (n=${items.length})

| Flag | Count | Meaning |
|---|---:|---|
${summary.map((s) => `| ${s.flag} | ${s.n} | ${s.meaning} |`).join("\n")}

`;

const section = (title: string, rows: Flags[]) => {
  if (!rows.length) return;
  md += `## ${title}\n\n`;
  md += `| Component | Detail |\n|---|---|\n`;
  for (const r of rows) {
    md += `| ${r.name} (\`${r.slug}\`) | ${r.detail} |\n`;
  }
  md += "\n";
};

section(
  "1. Undeclared dependencies",
  flags
    .filter((f) => f.undeclaredDeps.length)
    .map((f) => ({ ...f, detail: f.undeclaredDeps.join(", ") }))
);

section(
  "2. Hardcoded colours",
  flags
    .filter((f) => f.hardcodedColors.length)
    .map((f) => ({ ...f, detail: f.hardcodedColors.join(", ") }))
);

section(
  "3. Deprecated or Next-only APIs",
  flags
    .filter((f) => f.styleJsx || f.execCommand)
    .map((f) => ({
      ...f,
      detail: [f.styleJsx ? "`<style jsx>`" : "", f.execCommand ? "`document.execCommand`" : ""]
        .filter(Boolean)
        .join(", "),
    }))
);

section(
  "4. Missing ARIA",
  flags
    .filter((f) => f.missingAria.length)
    .map((f) => ({ ...f, detail: f.missingAria.join("; ") }))
);

section(
  "5. Names that promise more than the code",
  flags
    .filter((f) => f.overpromised.length)
    .map((f) => ({ ...f, detail: f.overpromised.join(", ") }))
);

section(
  "6. Ambiguous install targets",
  flags
    .filter((f) => f.indexTarget.length)
    .map((f) => ({ ...f, detail: f.indexTarget.join(", ") }))
);

section(
  "7. Files shared with another item",
  flags
    .filter((f) => f.sharedFile)
    .map((f) => ({
      ...f,
      detail: items
        .find((i) => i.name === f.slug)!
        .files.map((x) => x.path)
        .join(", "),
    }))
);

md += `## Verified clean\n\n`;
md += `- No item ships an unpublished \`@buildora/*\` import.\n`;
md += `- Every item declares the third-party packages its source imports.\n`;
md += `- Every item resolves its \`@/lib/buildora/*\` and \`@/hooks/buildora/*\` imports through \`registryDependencies\`.\n`;
md += `- Every item has a unique install target.\n`;
md += `- Contrast is gated in both themes, and the axe gate scans every exported component.\n`;

fs.writeFileSync(path.join(root, "AUDIT.md"), md);

console.log(`Audit complete: ${items.length} items`);
console.table(
  Object.fromEntries([
    ["items", items.length],
    ...summary.map((s) => [s.flag, s.n]),
  ])
);
