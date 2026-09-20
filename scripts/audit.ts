/**
 * Phase 0.1 — Stop the bleeding audit.
 * Scans all 142 catalog items for P0/P1 flags and writes AUDIT.md
 * Run: pnpm exec tsx scripts/audit.ts
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { catalog } from "./catalog";

const root = process.cwd();

type Flags = {
  slug: string;
  name: string;
  description: string;
  files: string[];
  buildoraImports: string[];
  undeclaredDeps: string[];
  hardcodedColors: string[];
  tailwindV3Syntax: boolean;
  styleJsx: boolean;
  windowDocument: boolean;
  matchMediaInRender: boolean;
  execCommand: boolean;
  missingAria: string[];
  indexTsx: boolean;
  noTests: boolean;
  keywordGap: string[];
  multiExportFile: boolean;
  sharedFile: boolean;
  framerMotionUndeclared: boolean;
  hasTokensDep: boolean;
  noScrim?: boolean;
  noPortal?: boolean;
};

function readSource(files: string[]): string {
  let out = "";
  for (const f of files) {
    try {
      out += "\n" + fs.readFileSync(path.join(root, f), "utf8");
    } catch {
      out += "\n// MISSING FILE: " + f;
    }
  }
  return out;
}

function extractImports(code: string): string[] {
  const specs: string[] = [];
  const re = /import\s+(?:[^'"]+\s+from\s+)?['"]([^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code))) specs.push(m[1]);
  const re2 = /require\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((m = re2.exec(code))) specs.push(m[1]);
  return specs;
}

function barePackage(spec: string): string | null {
  if (spec.startsWith(".") || spec.startsWith("/") || spec.startsWith("node:")) return null;
  if (spec.startsWith("@/") || spec.startsWith("~/")) return null;
  if (spec === "react" || spec === "react-dom" || spec.startsWith("react/")) return null;
  // relative alias inside repo
  if (spec.startsWith("@buildora/")) return spec; // keep full for P0 check
  const parts = spec.split("/");
  if (spec.startsWith("@")) return parts.length >= 2 ? parts.slice(0, 2).join("/") : spec;
  return parts[0];
}

const testFileContent = (() => {
  try {
    return fs.readFileSync(path.join(root, "packages/components/src/components.test.tsx"), "utf8");
  } catch {
    return "";
  }
})();

function slugTested(slug: string, code: string): boolean {
  // Heuristic: test file imports from ./<slug-dir> or mentions exported component
  // Check exports in code for a name that appears in test file
  const exports = [...code.matchAll(/export\s+(?:function|const)\s+(\w+)/g)].map((m) => m[1]);
  if (exports.some((e) => testFileContent.includes(e))) return true;
  // fallback: slug fragment (e.g. magnetic-button -> MagneticButton tested?)
  const pascal = slug.split("-").map((p) => p[0].toUpperCase() + p.slice(1)).join("");
  if (testFileContent.includes(pascal)) return true;
  // directory fragment
  if (testFileContent.includes(`./${slug}`)) return true;
  return false;
}

// Build file -> slugs sharing map for shared-file detection
const fileToSlugs = new Map<string, string[]>();
for (const item of catalog) {
  for (const f of item.files) {
    if (!fileToSlugs.has(f)) fileToSlugs.set(f, []);
    fileToSlugs.get(f)!.push(item.slug);
  }
}

const rows: Flags[] = [];

for (const item of catalog) {
  const code = readSource(item.files);
  const imports = extractImports(code);
  const buildoraImports = [...new Set(imports.filter((s) => s.startsWith("@buildora/")))];
  const declared = new Set([...(item.dependencies ?? []), "react", "react-dom"]);
  const undeclaredSet = new Set<string>();
  for (const spec of imports) {
    const bare = barePackage(spec);
    if (!bare) continue;
    if (bare.startsWith("@buildora/")) continue; // counted separately
    if (declared.has(bare)) continue;
    // Ignore type-only node builtins already filtered
    undeclaredSet.add(`${bare} (via '${spec}')`);
  }

  // Hardcoded colors
  const colorHits: string[] = [];
  const hexes = code.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
  if (hexes.length) colorHits.push(`hex:${[...new Set(hexes)].slice(0, 6).join(",")}${hexes.length > 6 ? `+${hexes.length - 6}more` : ""} (${hexes.length})`);
  const checkList: Array<[RegExp, string]> = [
    [/\btext-white\b/, "text-white"],
    [/\bbg-white\b/, "bg-white"],
    [/\btext-black\b/, "text-black"],
    [/\bbg-black\b/, "bg-black"],
    [/\bborder-white\/\d+/, "border-white/*"],
    [/\bbg-white\/\[/, "bg-white/[...]"],
    [/\btext-white\//, "text-white/*"],
    [/\bbg-white\//, "bg-white/*"],
    [/\bwhite\/\d+/, "white/NN"],
    [/\bblack\/\d+/, "black/NN"],
    [/\bz-\[\d+\]/, "z-[NNN]"],
    [/--b-accent/, "--b-*"],
    [/--b-surface/, "--b-surface"],
    [/--b-border/, "--b-border"],
    [/--b-text/, "--b-text"],
  ];
  for (const [re, label] of checkList) {
    if (re.test(code)) colorHits.push(label);
  }

  const tailwindV3 = /bg-\[--/.test(code) || /text-\[--/.test(code) || /border-\[--/.test(code) || /ring-\[--/.test(code);
  const styleJsx = code.includes("<style") && code.includes("jsx");
  const windowDocument = /\bwindow\./.test(code) || /\bdocument\./.test(code);
  const matchMediaInRender = code.includes("matchMedia");
  const execCommand = code.includes("execCommand");

  const missingAria: string[] = [];
  const roles = [...code.matchAll(/role\s*=\s*["']([^"']+)["']/g)].map((m) => m[1]);
  if (roles.length && !/aria-/.test(code)) missingAria.push(`roles(${roles.slice(0, 3).join(",")}) with zero aria-*`);
  if (/role\s*=\s*["']gridcell["']/.test(code) && /<button[^>]*role\s*=\s*["']gridcell["']/.test(code))
    missingAria.push(`button role=gridcell (should be td/div)`);
  if (/role\s*=\s*["']dialog["']/.test(code) && !/aria-labelledby/.test(code))
    missingAria.push(`dialog without aria-labelledby`);
  if (/<label[^>]*>/.test(code) && !/<label[^>]*htmlFor/.test(code) && /<input/.test(code))
    missingAria.push(`label without htmlFor + input`);
  if (/aria-hidden\s*=\s*\{!open\}/.test(code)) missingAria.push(`aria-hidden={!open} on focus container`);
  if (/role\s*=\s*["']log["']/.test(code) && /aria-live\s*=\s*["']polite["']/.test(code) && /setInterval/.test(code))
    missingAria.push(`role=log + aria-live=polite while tokens stream (SR spam)`);

  const indexTsx = item.files.some((f) => f.endsWith("/index.tsx"));
  const noTests = !slugTested(item.slug, code);

  const keywordGap: string[] = [];
  const desc = `${item.description} ${item.tags.join(" ")} ${item.name}`.toLowerCase();
  const has = (s: string) => code.toLowerCase().includes(s.toLowerCase());
  if (desc.includes("physics") && !(has("springstep") || has("stiffness") || has("damping") || has("use-spring") || has("dnd-kit") || has("@dnd-kit"))) {
    // magnetic-button legitimately has springStep; kanban does not
    if (!has("springstep")) keywordGap.push(`"physics" w/o integrator`);
  }
  if (desc.includes("spring") && !(has("spring") || has("stiffness") || has("motion"))) keywordGap.push(`"spring" w/o spring code`);
  if ((desc.includes("virtualized") || has("virtualize beyond")) && !(has("virtual") || has("tanstack") || has("windowing"))) {
    // check hints inside code too (palette hints Virtualized)
    if (desc.includes("virtualized") || code.includes("Virtualized")) keywordGap.push(`"virtualized" w/o windowing`);
  }
  if (desc.includes("streaming") && !(has("readablestream") || has("eventsource") || has("websocket") || has("textdecoder") || has("onSend") || has("transport") || /\bmessages\s*:/.test(code))) {
    // StreamingChat has messages state but no transport/onSend/stream input
    if (!has("onsend") && !has("readablestream")) keywordGap.push(`"streaming" w/o stream input (hardcoded setInterval?)`);
  }
  if (code.includes("xterm") && !(has("from \"xterm\"") || has("from 'xterm'") || has("@xterm"))) keywordGap.push(`"xterm" mention w/o xterm.js import`);
  if (desc.includes("magnetic") && has("onPointerMove") && has("radius") && !has("usepointerproximity") && !has("pointermove`") && !/window\.addEventListener.*pointermove/i.test(code))
    keywordGap.push(`radius w/o proximity (onPointerMove on self only)`);
  if (/Alt\+Arrow|altKey/.test(code)) keywordGap.push(`Alt+Arrow kbd (browser nav conflict)`);
  if (has("document.execCommand") || has("document.execcommand")) keywordGap.push(`deprecated execCommand editor`);
  if (/length:\s*28|February/.test(code) && /gridcell/.test(code)) keywordGap.push(`hardcoded 28-day February calendar`);

  const exportCount = [...code.matchAll(/export\s+(?:function|const)\s+(\w+)/g)].length;
  const multiExportFile = exportCount > 1;
  const sharedFile = (fileToSlugs.get(item.files[0] ?? "") ?? []).length > 1;

  const framerMotionUndeclared = code.includes("framer-motion") && !(item.dependencies ?? []).includes("framer-motion");

  rows.push({
    slug: item.slug,
    name: item.name,
    description: item.description,
    files: item.files,
    buildoraImports,
    undeclaredDeps: [...undeclaredSet],
    hardcodedColors: colorHits,
    tailwindV3Syntax: tailwindV3,
    styleJsx,
    windowDocument,
    matchMediaInRender,
    execCommand,
    missingAria,
    indexTsx,
    noTests,
    keywordGap,
    multiExportFile,
    sharedFile,
    framerMotionUndeclared,
    hasTokensDep: (item.registryDependencies ?? []).length > 0,
  });
}

// Summary counts
const count = (fn: (r: Flags) => boolean) => rows.filter(fn).length;
const summary = {
  total: rows.length,
  buildoraImports: count((r) => r.buildoraImports.length > 0),
  undeclaredDeps: count((r) => r.undeclaredDeps.length > 0),
  framerMotionUndeclared: count((r) => r.framerMotionUndeclared),
  hardcodedColors: count((r) => r.hardcodedColors.length > 0),
  tailwindV3: count((r) => r.tailwindV3Syntax),
  styleJsx: count((r) => r.styleJsx),
  windowDocument: count((r) => r.windowDocument),
  execCommand: count((r) => r.execCommand),
  missingAria: count((r) => r.missingAria.length > 0),
  indexTsx: count((r) => r.indexTsx),
  noTests: count((r) => r.noTests),
  keywordGap: count((r) => r.keywordGap.length > 0),
  multiExport: count((r) => r.multiExportFile),
  sharedFile: count((r) => r.sharedFile),
  emptyRegistryDeps: count((r) => !r.hasTokensDep),
};

// Check generated shadcn name mismatch + target risk
let shadcnMismatch = 0;
let targetRisk = 0;
for (const item of catalog) {
  // toShadcnJson names it buildora-{slug} while install id is @buildora/{slug}
  shadcnMismatch++;
  if (item.files.some((f) => f.endsWith("/index.tsx"))) targetRisk++;
}

// Check registry endpoint docs
let registryPageNote = "";
try {
  const candidates = [
    "apps/web/app/registry/page.tsx",
    "apps/web/app/(docs)/registry/page.tsx",
  ];
  for (const c of candidates) {
    const p = path.join(root, c);
    if (fs.existsSync(p)) registryPageNote += `\n- Found ${c}`;
  }
  // grep for github tree URL in web app
  const webFiles: string[] = [];
  const walk = (d: string) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const fp = path.join(d, e.name);
      if (e.isDirectory()) {
        if (e.name === "node_modules" || e.name === ".next") continue;
        walk(fp);
      } else if (/\.(tsx?|mdx?|md)$/.test(e.name)) webFiles.push(fp);
    }
  };
  walk(path.join(root, "apps/web/app"));
  let badRegistryUrl = 0;
  for (const f of webFiles) {
    const c = fs.readFileSync(f, "utf8");
    if (c.includes("github.com/Varun9490/Buildora/tree/main/registry/generated") || c.includes("tree/main/registry/generated/{name}")) badRegistryUrl++;
  }
  registryPageNote += `\n- Web files referencing GitHub tree/.../registry/generated HTML URL: ${badRegistryUrl} (any >0 = broken shadcn endpoint)`;
} catch (e) {
  registryPageNote = `\n- registry page scan failed: ${e}`;
}

const flag = (b: boolean) => (b ? "✗" : "·");

let md = `# Buildora Phase 0 Audit — AUDIT.md\n\n`;
md += `> Generated by \`scripts/audit.ts\`. Source of truth: \`scripts/catalog.ts\` + source files on disk.\n> Priority order: Correctness > Accessibility > Installability > API ergonomics > Performance > Visual polish > Novelty.\n\n`;
md += `## 0. Summary counts (n=${summary.total})\n\n`;
md += `| Flag | Count | Meaning |\n|---|---:|---|\n`;
md += `| \`@buildora/*\` imports | ${summary.buildoraImports} | Every affected install fails at compile time (packages unpublished, no registryDependencies) |\n`;
md += `| Imports not in \`dependencies\` | ${summary.undeclaredDeps} | Includes framer-motion gaps |\n`;
md += `| framer-motion imported, not declared | ${summary.framerMotionUndeclared} | e.g. slingshot-otp |\n`;
md += `| Hardcoded colours / dark-only styles | ${summary.hardcodedColors} | hex literals, text-white/bg-black, white/NN, --b-* without tokens |\n`;
md += "| Tailwind v3 syntax | " + summary.tailwindV3 + " | v3 bg syntax must become v4 paren syntax |\n";
md += `| \`<style jsx>\` | ${summary.styleJsx} | Next-only; breaks elsewhere |\n`;
md += `| window/document usage | ${summary.windowDocument} | SSR/hydration risk; needs scoping audit |\n`;
md += `| document.execCommand | ${summary.execCommand} | Deprecated editor path |\n`;
md += `| ARIA smell | ${summary.missingAria} | role w/o aria-*, dialog w/o labelledby, gridcell on button, log+polite streaming |\n`;
md += `| Files named index.tsx | ${summary.indexTsx} | No unique target; overwrite risk |\n`;
md += `| No dedicated test | ${summary.noTests} | Not found in components.test.tsx |\n`;
md += `| Name/desc keyword not backed by code | ${summary.keywordGap} | physics/virtualized/streaming/xterm/spring/radius/Alt+Arrow/execCommand/February |\n`;
md += `| Multi-export file | ${summary.multiExport} | >1 exported component in one file |\n`;
md += `| Shared file across items | ${summary.sharedFile} | Inflated count (Calendar in Kanban, etc.) |\n`;
md += `| Empty registryDependencies | ${summary.emptyRegistryDeps} | No tokens/utils wiring anywhere |\n`;
md += `| shadcn name mismatch (buildora-{slug} vs @buildora/{slug}) | ${shadcnMismatch} | All generated items |\n`;
md += `| index.tsx target risk | ${targetRisk} | All catalog files[] entries |\n`;
md += `\n`;
md += `### Registry endpoint${registryPageNote}\n\n`;
md += `### P0 verdict\n\n`;
md += `- **Installs are broken for ${summary.buildoraImports}/${summary.total} items** with \`@buildora/*\` imports (utils/hooks/animations). No \`@buildora/*\` package is published; \`registryDependencies\` is empty everywhere.\n`;
md += `- **Design tokens are not shipped.** \`--b-*\` vars + hardcoded dark hexes mean a fresh install is unstyled/invisible or dark-on-light broken. Light mode is not real today.\n`;
md += `- **Registry config is broken:** generated name is \`buildora-{slug}\` while install id is \`@buildora/{slug}\`; every file is \`.../index.tsx\` with no shadcn \`target\`; docs point at GitHub HTML tree URLs instead of \`/r/{name}.json\`.\n`;
md += `- **Honesty gaps are load-bearing:** Streaming Chat (no transport), Physics Kanban (no physics/touch/reorder), hardcoded February Calendar, execCommand editor, game-default OTP, non-virtualized Advanced Table. See keywordGap column.\n\n`;

md += `## 1. Per-component table\n\n`;
md += `| slug | @buildora | undeclared | colors | v3 | jsx | win/doc | exec | aria | idx | noTest | keywordGap | shared |\n`;
md += `|---|---|---|---|---|---|---|---|---|---|---|---|---|\n`;
for (const r of rows) {
  const cols = [
    r.slug,
    r.buildoraImports.length ? r.buildoraImports.join(",") : "·",
    r.undeclaredDeps.length ? r.undeclaredDeps.join("; ").slice(0, 80) : "·",
    r.hardcodedColors.length ? r.hardcodedColors.join("; ").slice(0, 90) : "·",
    flag(r.tailwindV3Syntax),
    flag(r.styleJsx),
    flag(r.windowDocument),
    flag(r.execCommand),
    r.missingAria.length ? r.missingAria.join("; ").slice(0, 90) : "·",
    flag(r.indexTsx),
    flag(r.noTests),
    r.keywordGap.length ? r.keywordGap.join("; ").slice(0, 100) : "·",
    r.sharedFile ? "shared" : "·",
  ];
  md += `| ${cols.join(" | ")} |\n`;
}

md += `\n## 2. Ground-truth spot checks (manually verified)\n\n`;
md += `- magnetic-button: \`onPointerMove\` on button only → radius never attracts from distance; 3 spring steps per event, no rAF, snap-back on leave; \`bg-bracket-dash-dashb-accent]\` v3 syntax; \`@buildora/*\` x3.\n`;
md += `- dialog: no scrim by default; exit never plays (isVisible flips with open); role=dialog on wrapper + aria-hidden={!open}; no portal/inert/restore; body overflow clobber; window Escape closes all; z-[100]; styled-jsx.\n`;
md += `- kanban: HTML5 DnD only (no touch); append-only cross-column, no reorder/indicator; no onChange/controlled; Alt+Arrow without preventDefault; focus lost + no live region; Calendar (28-day Feb, button role=gridcell) lives in same file.\n`;
md += `- streaming-chat: setInterval slices hardcoded seed; auto-send on mount (StrictMode double); role=log+polite per token; matchMedia in render; TokenMeter/ModelSelector/ToolCallViz are extra exports counted separately in docs.\n`;
md += `- slingshot-otp: default mode=game (no input, no kbd/SR, no autocomplete); maxLength truncates before sanitize (123 456→12345); hardcoded px rocks; rAF deps restart per render; framer-motion undeclared.\n`;
md += `- spatial-command-palette: action never called (only CustomEvent); no combobox/listbox/activedescendant; IME Enter selects; per-instance Cmd+K; defaults recreated per render; fake Virtualized/xterm-lite hints.\n`;
md += `- rich-text-editor: execCommand B/I/Bullets; no value/onChange/sanitize.\n\n`;

md += `## 3. Phase 1 proposal (142 → ~70)\n\n`;
md += `| Group | Action | Reason |\n|---|---|---|\n`;
md += `| 19× tui-* + terminal-workspace | Delete; ship one xterm.js Terminal + data-theme=terminal skin | DOM restyles, not components |\n`;
md += `| 8 backgrounds | Merge → one Backdrop (aurora/grid/dots/noise/mesh/beams/meteors) | Near-duplicates |\n`;
md += `| 5 cursors | Merge → one CursorFx (glow/spotlight/trail/blob) | Same engine, pointer-fine only |\n`;
md += `| 6 fx-buttons (keep HoldButton) | Merge → one Button effect=… | Variants, not components |\n`;
md += `| 7 fx-cards | Merge → one FxCard effect=… | Same |\n`;
md += `| 6 text fx | Merge → one TextFx | Same + single SR announcement |\n`;
md += `| 3 command (palette/bar/spatial) | Merge → one Command (Sec 3.5) | Triple impl of one pattern |\n`;
md += `| 2 toast/sidebar/navbar/terminal dupes | Dedupe to one each | |\n`;
md += `| Multi-export files (Calendar, TokenMeter/ModelSelector/ToolCallViz, JsonViewer/LogViewer, CodeEditor/FileTree, UsageDashboard/TeamSwitcher/Onboarding, Mention/Comment, Textarea/Badge…) | Split honestly or merge into owner | Inflated count |\n`;
md += `| pricing-table/team-switcher/invite-flow/onboarding/approval/audit-log/feature-flags/env/cron/webhook/api-builder/usage-dashboard | Move to Blocks or delete | Demos, not primitives |\n`;
md += `| code-editor/markdown/spreadsheet/node/timeline/workflow | Rebuild on engine (2.3) or delete | No engine today |\n`;
md += `| kanban name | Rename Physics Kanban → Kanban (until spring drop really lands) | Honesty |\n`;
md += `| slingshot-otp | Split OtpInput (default) + SlingshotOtpGame (opt-in) | Auth UX hazard |\n`;
md += `| streaming-chat | Rebuild as transport-agnostic AI kit (6.7) or mark experimental | Fake stream |\n`;
md += `\n`;
md += `## 4. Checkpoint 0 exit criteria\n\n`;
md += `- [ ] This AUDIT.md committed\n- [ ] scripts/verify-install.ts matrix green (Next15/Vite/RRv7/TanStack Start)\n- [ ] utils/use-reduced-motion/spring/use-pointer-proximity/tokens registry items created; @buildora/* eliminated; registryDependencies wired\n- [ ] components.json snippet → real /r/{name}.json; /registry page + docs fixed\n- [ ] Site truth fixes: per-page install cmd, one GitHub URL, per-page OG, unverified claims removed, props fixed\n\n`;
md += `## Appendix — how to reproduce\n\n`;
md += `\`\`\`bash\npnpm exec tsx scripts/audit.ts\n# writes AUDIT.md\n\`\`\`\n`;

fs.writeFileSync(path.join(root, "AUDIT.md"), md);
console.log(`Audit complete: ${rows.length} items`);
console.log(JSON.stringify(summary, null, 2));
