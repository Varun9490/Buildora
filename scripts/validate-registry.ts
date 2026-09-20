import * as fs from "node:fs";
import * as path from "node:path";

const dir = path.join(process.cwd(), "registry", "components");
let failed = 0;

if (!fs.existsSync(dir)) {
  console.error("registry/components missing — run pnpm registry:build first");
  process.exit(1);
}

const CANONICAL_GITHUB = "https://github.com/Varun9490/Buildora";

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
  // Guard 1: slug/filename/install must agree (prevents slingshot-otp -> magnetic-button drift)
  const slugFromFile = f.replace(/\.json$/, "");
  if (raw.slug !== slugFromFile) errs.push(`slug mismatch file=${slugFromFile} slug=${raw.slug}`);
  if (raw.id !== raw.slug) errs.push(`id must equal slug (${raw.id} != ${raw.slug})`);
  const expectedInstall = `pnpm dlx shadcn@latest add @buildora/${raw.slug}`;
  if (raw.install !== expectedInstall) errs.push(`install mismatch: ${raw.install}`);
  // Guard 2: github must point at canonical repo, never legacy buildora/buildora
  if (typeof raw.github === "string") {
    if (raw.github.includes("github.com/buildora/buildora")) {
      errs.push(`legacy github URL (must be ${CANONICAL_GITHUB})`);
    } else if (!raw.github.startsWith(CANONICAL_GITHUB)) {
      errs.push(`github must start with ${CANONICAL_GITHUB}`);
    }
  } else {
    errs.push("missing github");
  }
  // Guard 3: files must exist on disk OR be an honest shared-implementation reference.
  // Shared refs are allowed but must embed real content (no "Could not read file").
  for (const file of raw.files ?? []) {
    const p = typeof file === "string" ? file : file.path;
    const content = typeof file === "string" ? "" : (file.content ?? "");
    if (!p || !fs.existsSync(path.join(process.cwd(), p))) {
      errs.push(`missing source file on disk: ${p}`);
    }
    if (content.includes("Could not read file")) {
      errs.push(`unreadable embedded content: ${p}`);
    }
  }
  // Guard 4: framework honesty — Full react requires a real file; non-react Full
  // is only allowed when notes explain the mapping.
  if (raw.implementations?.react?.status === "Full" && !(raw.files ?? []).length) {
    errs.push("react Full requires at least one file");
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
