import * as fs from "node:fs";
import * as path from "node:path";
import { catalog } from "./catalog";

const validSlugs = new Set(catalog.map(c => c.slug));
const validComponents = new Set();
// We need to map slugs to Component names. Usually it's PascalCase.
// We can just rely on TS to tell us what's exported.
const indexTs = fs.readFileSync(path.join(process.cwd(), "packages/components/src/index.ts"), "utf8");
const exports = Array.from(indexTs.matchAll(/export\s+\{([^}]+)\}/g))
  .flatMap(m => m[1].split(",").map(s => s.trim().split(/\s+/)[0]))
  .filter(Boolean);

const validExports = new Set(exports);

// 1. Cleanup ComponentRenderer.tsx
const rendererPath = path.join(process.cwd(), "apps/web/components/ComponentRenderer.tsx");
let rendererContent = fs.readFileSync(rendererPath, "utf8");

// Remove invalid imports
rendererContent = rendererContent.replace(/import\s+\{([^}]+)\}\s+from\s+["']@buildora\/components["'];/, (match, group1) => {
  const imports = group1.split(",").map(s => s.trim()).filter(Boolean);
  const valid = imports.filter(i => validExports.has(i));
  return `import {\n  ${valid.join(",\n  ")}\n} from "@buildora/components";`;
});

// Remove invalid cases
// A case looks like: case "slug": return <Component {...controls} />;
// We'll use a regex that matches `case "slug": ... return ...`
const caseRegex = /case\s+["']([^"']+)["']:\s*(?:return|[\s\S]*?return)[^;]+;/g;
rendererContent = rendererContent.replace(caseRegex, (match, slug) => {
  if (!validSlugs.has(slug)) {
    return `// removed ${slug}`;
  }
  return match;
});

fs.writeFileSync(rendererPath, rendererContent);

// 2. Cleanup controls.ts
const controlsPath = path.join(process.cwd(), "apps/web/lib/controls.ts");
let controlsContent = fs.readFileSync(controlsPath, "utf8");

// COMPONENT_CONTROLS object keys
const objRegex = /"([^"]+)":\s*\[[^\]]*\],/g;
controlsContent = controlsContent.replace(objRegex, (match, slug) => {
  if (!validSlugs.has(slug)) {
    return `// removed ${slug}`;
  }
  return match;
});

// also for single line `  "slug": [],`
const emptyRegex = /["']?([a-z0-9\-]+)["']?:\s*\[\],/g;
controlsContent = controlsContent.replace(emptyRegex, (match, slug) => {
  if (!validSlugs.has(slug)) {
    return `// removed ${slug}`;
  }
  return match;
});

fs.writeFileSync(controlsPath, controlsContent);
console.log("Cleaned up web app files.");
