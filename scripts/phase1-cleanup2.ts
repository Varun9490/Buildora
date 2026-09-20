import * as fs from "node:fs";
import * as path from "node:path";

const toDelete = [
  "liquid-button",
  "magnetic-card",
  "holographic-card",
  "interactive-3d-card",
  "morphing-typography",
  "aurora-background",
  "cursor-spotlight"
];

const catalogPath = path.join(process.cwd(), "scripts/catalog.ts");
let catalog = fs.readFileSync(catalogPath, "utf8");

for (const slug of toDelete) {
  const dirPath = path.join(process.cwd(), "packages/components/src", slug);
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`Deleted folder: ${slug}`);
  }
  
  const regex = new RegExp(`\\s*R\\(["']${slug}["'].*?\\)(?=\\s*,?\\s*(?:R\\(|//|\\]))`, 'gs');
  catalog = catalog.replace(regex, '');
}

catalog = catalog.replace(/,(?:\s*,)+/g, ",");
catalog = catalog.replace(/\[(?:\s*,)+/g, "[");

fs.writeFileSync(catalogPath, catalog);
console.log("Cleanup 2 script completed.");
