import { readdirSync, readFileSync } from "node:fs";

const dir = "registry/generated";
let failed = 0;
const fail = (m: string) => { console.error("✗", m); failed++; };

for (const f of readdirSync(dir).filter((f) => f.endsWith(".json") && f !== "registry.json" && f !== "agent-catalog.json")) {
  const item = JSON.parse(readFileSync(`${dir}/${f}`, "utf8"));
  const declared = new Set<string>(item.dependencies ?? []);
  const src: string = (item.files ?? []).map((x: { content: string }) => x.content).join("\n");
  
  if (src.includes("\r")) fail(`${item.name}: CRLF line endings`);
  
  for (const [, spec] of src.matchAll(/from\s+["']([^"']+)["']/g)) {
    if (spec.startsWith("@buildora/")) { fail(`${item.name}: workspace import ${spec}`); continue; }
    if (spec.startsWith(".") || spec.startsWith("@/") || spec === "react" || spec === "react-dom") continue;
    const pkg = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0];
    if (!declared.has(pkg)) fail(`${item.name}: undeclared dependency ${pkg}`);
  }
  
  if (/\[--b-/.test(src)) console.warn(`⚠ ${item.name}: legacy arbitrary value [--b-…] (use var() with type hint)`);
  if (/#[0-9a-fA-F]{3,8}\b|\bwhite\/\[|\btext-white\b/.test(src)) console.warn(`⚠ ${item.name}: hard-coded colour`);
  if (!(item.files ?? []).every((x: { target?: string; path: string }) => x.target || !/\/index\.tsx$/.test(x.path))) {
    console.warn(`⚠ ${item.name}: ambiguous index.tsx without target`);
  }
}

if (failed) console.error(`\nRegistry audit failed: ${failed} errors.`);
else console.log(`\nRegistry audit passed.`);
process.exit(failed ? 1 : 0);
