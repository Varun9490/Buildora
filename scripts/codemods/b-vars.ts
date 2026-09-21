import fs from "node:fs";
import path from "node:path";
import { globSync } from "glob"; // Wait, glob might not be installed. I'll use simple fs traversal or just install glob.

// To avoid dependencies, let's write a simple recursive function:
function findFiles(dir: string, ext: string[]): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory() && !fullPath.includes('node_modules') && !fullPath.includes('.next')) {
      results = results.concat(findFiles(fullPath, ext));
    } else {
      if (ext.some(e => fullPath.endsWith(e))) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

const colorPrefixes = [
  "text", "bg", "border", "ring", "ring-offset", "outline",
  "decoration", "caret", "accent", "fill", "stroke", "divide",
  "from", "via", "to"
];

function transformLine(line: string): string {
  // 1. Handle opacity modifiers: prefix-[--b-var]/opacity
  // Example: bg-[--b-accent]/5 -> bg-[color-mix(in_oklab,var(--b-accent)_5%,transparent)]
  const opacityRegex = /([a-z-]+)-\[(--b-[a-zA-Z0-9-]+)\]\/(\d+)/g;
  let result = line.replace(opacityRegex, (match, prefix, cssVar, opacity) => {
    return `${prefix}-[color-mix(in_oklab,var(${cssVar})_${opacity}%,transparent)]`;
  });

  // 2. Handle normal var rewrites: prefix-[--b-var]
  // Example: bg-[--b-bg] -> bg-[var(--b-bg)] (or bg-[color:var(--b-bg)] if needed)
  const varRegex = /([a-z-]+)-\[(--b-[a-zA-Z0-9-]+)\]/g;
  result = result.replace(varRegex, (match, prefix, cssVar) => {
    // If it's a radius/length
    if (cssVar === "--b-radius") {
      return `${prefix}-[length:var(${cssVar})]`;
    }
    // If it's a color prefix, we add color: (Wait, tailwind says ambiguous utilities need type hints. bg is not ambiguous usually, but the instructions say "since all --b-* colour tokens are colours: text-[color:...], ring-[color:...]").
    // Let's add color: to all color prefixes just in case, or at least the ones listed.
    if (colorPrefixes.includes(prefix)) {
      return `${prefix}-[color:var(${cssVar})]`;
    }
    // Default
    return `${prefix}-[var(${cssVar})]`;
  });

  return result;
}

const targetDirs = ["packages/components", "apps/web"];
let changedFiles = 0;

for (const dir of targetDirs) {
  const files = findFiles(path.resolve(process.cwd(), dir), [".tsx", ".ts", ".css"]);
  for (const file of files) {
    const original = fs.readFileSync(file, "utf8");
    const updated = original.split("\n").map(transformLine).join("\n");
    if (original !== updated) {
      fs.writeFileSync(file, updated, "utf8");
      console.log(`Updated ${file}`);
      changedFiles++;
    }
  }
}

console.log(`Codemod complete. Modified ${changedFiles} files.`);
