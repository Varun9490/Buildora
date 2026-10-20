/**
 * Remove imports that the file no longer uses.
 *
 * The component renderer imported every component the package exported at the
 * time, including the ones the Phase 1 consolidation retired. Unused
 * imports are not an error in JS but they are noise, and they break the
 * build once the export disappears.
 *
 * Usage: node scripts/prune-imports.mjs <file.tsx> [--export <module>]
 */
import * as fs from "node:fs";

const file = process.argv[2];
const exportModule = process.argv.includes("--export")
  ? process.argv[process.argv.indexOf("--export") + 1]
  : "@buildora/components";

if (!file) {
  console.error("usage: prune-imports.mjs <file> [--export <module>]");
  process.exit(1);
}

const src = fs.readFileSync(file, "utf8");
const importRe = new RegExp(
  `import\\s*\\{([^}]*)\\}\\s*from\\s*"${exportModule.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}";`,
  "s"
);
const m = importRe.exec(src);
if (!m) {
  console.log(`${file}: no import block from ${exportModule}`);
  process.exit(0);
}

const body = src.slice(0, m.index) + src.slice(m.index + m[0].length);

const names = m[1]
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const kept = [];
const dropped = [];
for (const entry of names) {
  const bare = entry.replace(/^type\s+/, "").split(/\s+as\s+/).pop().trim();
  const used = new RegExp(`\\b${bare.replace(/[$]/g, "\\$")}\\b`).test(body);
  if (used) kept.push(entry);
  else dropped.push(entry);
}

if (dropped.length === 0) {
  console.log(`${file}: nothing to prune`);
  process.exit(0);
}

const next =
  body.slice(0, m.index) +
  `import {\n${kept.map((n) => `  ${n},`).join("\n")}\n} from "${exportModule}";` +
  body.slice(m.index);

fs.writeFileSync(file, next, "utf8");
console.log(`${file}: kept ${kept.length}, pruned ${dropped.length}`);
console.log(`  pruned: ${dropped.join(", ")}`);
