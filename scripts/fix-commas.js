const fs = require("node:fs");
const path = require("node:path");

const catalogPath = path.join(process.cwd(), "scripts/catalog.ts");
let catalog = fs.readFileSync(catalogPath, "utf8");

catalog = catalog.replace(/,(?:\s*,)+/g, ",");
catalog = catalog.replace(/\[(?:\s*,)+/g, "[");

fs.writeFileSync(catalogPath, catalog);
console.log("Fixed commas again.");
