import { buildAll, catalog } from "./catalog";
import * as path from "node:path";

const out = path.join(process.cwd(), "registry");
const index = buildAll(out);
console.log(`Built registry: ${index.total} components → ${out}/registry.json`);
console.log(`Catalog slugs: ${catalog.length}`);
