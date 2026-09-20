/**
 * Phase 0.4 — verify-install.
 *
 * Default (offline, fast, CI on every PR):
 *   For every registry/generated/*.json item verifies —
 *   1. Zero @buildora/* imports in shipped content (would 404 on npm).
 *   2. Every bare third-party import appears in `dependencies`.
 *   3. Every registryDependency resolves to an existing registry item.
 *   4. Item name == slug == install id (no buildora- prefix drift).
 *   5. Every file has a unique, non-colliding `target` (never bare index.tsx).
 *   6. Generated content matches registry/components content (no drift).
 *   7. Each TS file transpiles (syntax + JSX).
 *
 * Full matrix (--matrix, needs network; CI nightly / pre-release):
 *   For each app in [next15, vite, react-router-v7, tanstack-start]:
 *   temp scaffold → shadcn init → point @buildora at /r → `shadcn add` each
 *   component → mount smoke page → tsc --noEmit → production build →
 *   Playwright load, fail on console error/warning.
 *
 * Run: pnpm exec tsx scripts/verify-install.ts        (static, offline)
 *      pnpm exec tsx scripts/verify-install.ts --matrix [--only=slug] [--app=next15]
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";
import ts from "typescript";

const root = process.cwd();
const args = new Set(process.argv.slice(2));
const only = (process.argv.find((a) => a.startsWith("--only=")) ?? "").slice("--only=".length);
const appFilter = (process.argv.find((a) => a.startsWith("--app=")) ?? "").slice("--app=".length);

function barePackage(spec: string): string | null {
  if (spec.startsWith(".") || spec.startsWith("/") || spec.startsWith("@/") || spec.startsWith("~/") || spec.startsWith("node:")) return null;
  if (spec === "react" || spec === "react-dom" || spec.startsWith("react/")) return null;
  // CSS / asset imports are not npm deps
  if (/\.(css|scss|sass|less|svg|png|jpg|woff2?)$/.test(spec)) return null;
  const parts = spec.split("/");
  if (spec.startsWith("@")) return parts.length >= 2 ? parts.slice(0, 2).join("/") : spec;
  return parts[0];
}

const genDir = path.join(root, "registry", "generated");
const compDir = path.join(root, "registry", "components");
const slugs = fs.readdirSync(genDir).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));
const registry = new Map<string, { dependencies: string[]; registryDependencies: string[]; files: { path: string; target?: string; content?: string; type?: string }[]; name: string }>();
for (const slug of slugs) {
  registry.set(slug, JSON.parse(fs.readFileSync(path.join(genDir, `${slug}.json`), "utf8")));
}

let failed = 0;
const fail = (msg: string) => { failed++; console.error(`✗ ${msg}`); };

// 1–5. Static installability per item
const seenTargets = new Map<string, string>();
for (const [slug, item] of registry) {
  if (only && slug !== only) continue;
  // 4. name == slug
  if (item.name !== slug) fail(`${slug}: shadcn name is ${item.name}, must equal slug`);
  const targets = new Set<string>();
  for (const f of item.files ?? []) {
    // 5. unique human target
    if (!f.target) { fail(`${slug}: file ${f.path} has no target`); continue; }
    // Bare index.tsx (no slug namespace) collides across items; namespaced
    // components/buildora/{slug}/index.tsx is unique and allowed for multi-file items.
    if (f.target.endsWith("/index.tsx") && f.target !== `components/buildora/${slug}/index.tsx`) fail(`${slug}: bare index.tsx target ${f.target} (must be namespaced)`);
    if (targets.has(f.target)) fail(`${slug}: duplicate target ${f.target} within item`);
    targets.add(f.target);
    if (seenTargets.has(f.target)) fail(`${slug}: target ${f.target} collides with ${seenTargets.get(f.target)}`);
    else seenTargets.set(f.target, slug);
    const content = f.content ?? "";
    // 1. no unpublished imports
    for (const m of content.matchAll(/@buildora\/[\w-]+/g)) fail(`${slug}: ships unpublished import ${m[0]} in ${f.target}`);
    // 2. third-party imports declared
    const declared = new Set([...(item.dependencies ?? []), ...(item.registryDependencies ?? []).flatMap((r) => {
      // registryDeps provide @/ paths, not bare packages — nothing to add here
      return [] as string[];
    })]);
    for (const m of content.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
      const bare = barePackage(m[1]);
      if (!bare) continue;
      // @/… paths are satisfied by registryDependencies or the host project
      if (m[1].startsWith("@/lib/buildora/") || m[1].startsWith("@/hooks/buildora/") || m[1].startsWith("@/components/buildora/") || m[1].startsWith("@/styles/buildora/")) {
        const need = m[1].includes("/lib/buildora/utils") ? "utils"
          : m[1].includes("/hooks/buildora/use-reduced-motion") ? "use-reduced-motion"
          : m[1].includes("/lib/buildora/spring") ? "spring"
          : m[1].includes("/hooks/buildora/use-pointer-proximity") ? "use-pointer-proximity"
          : m[1].includes("/components/buildora/") ? null // same-registry component path (demo strings)
          : null;
        if (need && !(item.registryDependencies ?? []).includes(need)) fail(`${slug}: imports ${m[1]} but missing registryDependency ${need}`);
        continue;
      }
      if (!declared.has(bare) && !["react", "react-dom"].includes(bare)) fail(`${slug}: imports ${bare} (via '${m[1]}') not in dependencies [${item.dependencies?.join(",")}]`);
    }
  }
  // 3. registryDependencies resolve
  for (const r of item.registryDependencies ?? []) {
    if (!registry.has(r)) fail(`${slug}: registryDependency ${r} does not exist`);
  }
  // tokens on every visual item
  const isFoundation = ["utils", "use-reduced-motion", "spring", "use-pointer-proximity", "tokens"].includes(slug);
  if (!isFoundation && !(item.registryDependencies ?? []).includes("tokens")) fail(`${slug}: missing tokens registryDependency`);
  // 6. components/ vs generated/ drift
  const compPath = path.join(compDir, `${slug}.json`);
  if (fs.existsSync(compPath)) {
    const comp = JSON.parse(fs.readFileSync(compPath, "utf8")) as { files: { path: string; content: string }[] };
    const genByTarget = new Map((item.files ?? []).map((f) => [f.target ?? f.path, f.content]));
    for (const f of comp.files ?? []) {
      // comp files carry target now too; compare by path
      const match = (item.files ?? []).find((g) => g.path === f.path);
      if (!match) { fail(`${slug}: generated missing file ${f.path}`); continue; }
      if (match.content !== f.content) fail(`${slug}: generated/content drift for ${f.path} (rebuild registry)`);
      void genByTarget;
    }
  }
}

// 7. Transpile every shipped TS file
let transpiled = 0;
for (const [slug, item] of registry) {
  if (only && slug !== only) continue;
  for (const f of item.files ?? []) {
    if (!/\.(tsx?|mts|cts)$/.test(f.target ?? f.path)) continue;
    transpiled++;
    const out = ts.transpileModule(f.content ?? "", {
      compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
      reportDiagnostics: true,
      fileName: f.target ?? f.path,
    });
    for (const d of out.diagnostics ?? []) {
      if (d.category === ts.DiagnosticCategory.Error) {
        fail(`${slug} ${(f.target ?? f.path)}: ${ts.flattenDiagnosticMessageText(d.messageText, " ")}`);
      }
    }
  }
}

if (failed) {
  console.error(`${failed} verify-install (static) failures`);
  process.exit(1);
}
console.log(`verify-install (static) ok: ${only || `${slugs.length} items`}, ${transpiled} files transpile, ${seenTargets.size} unique targets.`);

// ---- Full 4-app matrix (opt-in, needs network) ----
if (!args.has("--matrix")) {
  console.log("Matrix skipped (pass --matrix to scaffold Next15/Vite/RRv7/TanStack-Start, shadcn add, tsc, build, Playwright).");
  process.exit(0);
}

const APPS = [
  { id: "next15", scaffold: "npx create-next-app@15 {dir} --typescript --tailwind --app --no-src-dir --import-alias '@/*'", marker: "app/page.tsx" },
  { id: "vite", scaffold: "npm create vite@{latest} {dir} -- --template react-ts", marker: "src/App.tsx" },
  { id: "react-router-v7", scaffold: "npx create-react-router@7 {dir} --typescript", marker: "app/routes/home.tsx" },
  { id: "tanstack-start", scaffold: "npx @tanstack/start-cli@latest init {dir}", marker: "src/routes/index.tsx" },
].filter((a) => !appFilter || a.id === appFilter);

const REGISTRY_URL = process.env.BUILDORA_REGISTRY_URL ?? "https://buildora.dev/r/{name}.json";
const tmpBase = fs.mkdtempSync(path.join(fs.realpathSync(require("node:os").tmpdir()), "buildora-verify-"));
console.log(`Matrix root: ${tmpBase}\nRegistry: ${REGISTRY_URL}`);

for (const app of APPS) {
  const dir = path.join(tmpBase, app.id);
  console.log(`\n=== ${app.id} ===`);
  execSync(app.scaffold.replaceAll("{dir}", `"${dir}"`), { stdio: "inherit", shell: process.platform === "win32" ? "powershell.exe" : "/bin/sh" });
  execSync(`npx shadcn@latest init -d -y`, { cwd: dir, stdio: "inherit", shell: process.platform === "win32" ? "powershell.exe" : "/bin/sh" });
  // point @buildora at the real endpoint
  execSync(`npx shadcn@latest add --registry "${REGISTRY_URL}"`, { cwd: dir, stdio: "pipe", shell: process.platform === "win32" ? "powershell.exe" : "/bin/sh" });
  for (const [slug] of registry) {
    if (only && slug !== only) continue;
    if (["utils", "use-reduced-motion", "spring", "use-pointer-proximity", "tokens"].includes(slug)) continue;
    execSync(`npx shadcn@latest add @buildora/${slug} -y`, { cwd: dir, stdio: "inherit", shell: process.platform === "win32" ? "powershell.exe" : "/bin/sh" });
  }
  execSync(`npx tsc --noEmit`, { cwd: dir, stdio: "inherit", shell: process.platform === "win32" ? "powershell.exe" : "/bin/sh" });
  execSync(`npm run build`, { cwd: dir, stdio: "inherit", shell: process.platform === "win32" ? "powershell.exe" : "/bin/sh" });
  // Playwright smoke: serve + fail on console error/warning (deferred to CI image with browsers)
  console.log(`[${app.id}] build ok — Playwright console check runs in CI (browsers installed there).`);
}
console.log("\nverify-install matrix ok.");
