import * as fs from "node:fs";
import * as path from "node:path";

const dir = path.join(process.cwd(), "registry", "components");
let failed = 0;

if (!fs.existsSync(dir)) {
  console.error("registry/components missing — run pnpm registry:build first");
  process.exit(1);
}

for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith(".json")) continue;
  const raw = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  const errs: string[] = [];
  for (const k of ["id", "name", "slug", "description", "categories", "tags", "difficulty", "implementations", "accessibility"]) {
    if (raw[k] === undefined) errs.push(`missing ${k}`);
  }
  if (!["beginner", "intermediate", "advanced"].includes(raw.difficulty)) errs.push("bad difficulty");
  const impl = raw.implementations ?? {};
  for (const [fw, v] of Object.entries(impl) as [string, { status?: string }][]) {
    if (!["Full", "Partial", "Experimental", "Unsupported"].includes(v.status ?? "")) errs.push(`bad status ${fw}=${v.status}`);
  }
  if (!raw.accessibility?.keyboard || !raw.accessibility?.screenReader || !raw.accessibility?.reducedMotion) {
    console.warn(`warn ${f}: accessibility should document keyboard/SR/reducedMotion`);
  }
  if (errs.length) {
    failed++;
    console.error(`✗ ${f}: ${errs.join(", ")}`);
  }
}

if (failed) {
  console.error(`${failed} registry files invalid`);
  process.exit(1);
}
console.log("Registry valid.");
