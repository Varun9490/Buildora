const fs = require("node:fs");
const path = require("node:path");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith(".tsx") || file.endsWith(".ts")) {
        results.push(file);
      }
    }
  });
  return results;
}

const srcDir = path.join(process.cwd(), "packages/components/src");
const files = walk(srcDir);

files.forEach(file => {
  let content = fs.readFileSync(file, "utf8");
  const relativeToSrc = path.relative(path.dirname(file), srcDir).replace(/\\/g, '/');
  
  // Fix the previously broken hooks/animations/tokens
  content = content.replace(/\$2/g, "");
  
  // Replace ../utils, ../hooks/, etc with correct relative path
  // Since we already messed it up slightly, let's fix it universally by matching:
  // "something/utils" or "something/hooks/" or "something/animations/"
  
  const replacers = [
    { regex: /(['"])(?:(?:\.\.\/)+|[A-Za-z0-9_\-\.\/]*\/)?(utils)(['"])/g, dir: "utils" },
    { regex: /(['"])(?:(?:\.\.\/)+|[A-Za-z0-9_\-\.\/]*\/)?(hooks\/[A-Za-z0-9_\-]+)(['"])/g, dir: "" },
    { regex: /(['"])(?:(?:\.\.\/)+|[A-Za-z0-9_\-\.\/]*\/)?(animations\/[A-Za-z0-9_\-]+)(['"])/g, dir: "" },
    { regex: /(['"])(?:(?:\.\.\/)+|[A-Za-z0-9_\-\.\/]*\/)?(tokens\/[A-Za-z0-9_\-\.]+)(['"])/g, dir: "" }
  ];

  for (const r of replacers) {
    content = content.replace(r.regex, (match, p1, p2, p3) => {
      // p1 is opening quote, p2 is e.g. "utils" or "hooks/use-reduced-motion", p3 is closing quote
      const relative = relativeToSrc === "" ? "." : relativeToSrc;
      return `${p1}${relative}/${p2}${p3}`;
    });
  }

  fs.writeFileSync(file, content);
});
console.log("Fixed relative imports properly.");
