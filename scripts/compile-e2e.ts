/**
 * Offline install e2e — verifies every registry entry's GENERATED source
 * compiles as a consumer would receive it, without network access.
 *
 * For each catalog entry it checks the embedded files[].content from
 * registry/components/*.json (the exact bytes a shadcn install delivers):
 *  1. Transpile per file with the repo TypeScript (syntax + JSX transform).
 *  2. Consistency: registry/generated/*.json carries identical content.
 *
 * This guards the embedding pipeline (truncation, escaping, stale artifacts),
 * not the library sources themselves (covered by tsc + vitest).
 */
import * as fs from "node:fs";
import * as path from "node:path";
import ts from "typescript";
import { catalog } from "./catalog";

const root = process.cwd();
let failed = 0;
let checked = 0;

for (const item of catalog) {
  const compPath = path.join(root, "registry", "components", `${item.slug}.json`);
  const genPath = path.join(root, "registry", "generated", `${item.slug}.json`);
  if (!fs.existsSync(compPath) || !fs.existsSync(genPath)) {
    failed++;
    console.error(`✗ ${item.slug}: missing built artifact`);
    continue;
  }
  const comp = JSON.parse(fs.readFileSync(compPath, "utf8")) as {
    files: { path: string; content: string }[];
  };
  const gen = JSON.parse(fs.readFileSync(genPath, "utf8")) as {
    files: { path: string; content: string }[];
  };
  const genByPath = new Map(gen.files.map((f) => [f.path, f.content]));
  for (const f of comp.files) {
    checked++;
    const isTs = /\.(tsx?|mts|cts)$/.test(f.path);
    if (!isTs) continue;
    const out = ts.transpileModule(f.content, {
      compilerOptions: {
        jsx: ts.JsxEmit.ReactJSX,
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
      },
      reportDiagnostics: true,
      fileName: f.path,
    });
    const errors = (out.diagnostics ?? []).filter(
      (d) => d.category === ts.DiagnosticCategory.Error
    );
    if (errors.length) {
      failed++;
      for (const e of errors) {
        const msg = ts.flattenDiagnosticMessageText(e.messageText, " ");
        console.error(`✗ ${item.slug} ${f.path}: ${msg}`);
      }
    }
    const genContent = genByPath.get(f.path);
    if (genContent === undefined) {
      failed++;
      console.error(`✗ ${item.slug}: generated/*.json missing file ${f.path}`);
    } else if (genContent !== f.content) {
      failed++;
      console.error(`✗ ${item.slug}: generated/*.json content drift for ${f.path} (rebuild registry)`);
    }
  }
}

if (failed) {
  console.error(`${failed} compile-e2e failures over ${checked} files`);
  process.exit(1);
}
console.log(`Compile-e2e ok: ${checked} generated files transpile, artifacts consistent.`);
