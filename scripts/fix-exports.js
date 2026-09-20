const fs = require("node:fs");
const path = require("node:path");

const indexPath = path.join(process.cwd(), "packages/components/src/index.ts");
let lines = fs.readFileSync(indexPath, "utf8").split("\n");

let output = [];
let i = 0;

while (i < lines.length) {
  let line = lines[i];
  if (line.trim() === "") {
    output.push(line);
    i++;
    continue;
  }
  
  // If it's a single line export like `export { ... } from "./something";`
  let match = line.match(/from\s+['"]\.\/([^'"]+)['"]/);
  
  // If it's a multiline export starting with `export {`
  if (!match && line.startsWith("export {")) {
    let j = i;
    while (j < lines.length && !lines[j].includes("from")) {
      j++;
    }
    if (j < lines.length) {
      match = lines[j].match(/from\s+['"]\.\/([^'"]+)['"]/);
      if (match) {
        // Check if directory exists
        const dir = match[1];
        if (!fs.existsSync(path.join(process.cwd(), "packages/components/src", dir))) {
          // Skip these lines
          i = j + 1;
          continue;
        }
      }
    }
  }
  
  if (match) {
    const dir = match[1];
    if (!fs.existsSync(path.join(process.cwd(), "packages/components/src", dir))) {
      i++;
      continue;
    }
  }
  
  output.push(line);
  i++;
}

fs.writeFileSync(indexPath, output.join("\n"));
console.log("Fixed exports.");
