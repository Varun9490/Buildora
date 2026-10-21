import { buildAll, buildWebBarrel, catalog } from "./catalog";
import { buildLlms } from "./build-llms";
import * as path from "node:path";

const root = process.cwd();
const out = path.join(root, "registry");
const index = buildAll(out);
buildWebBarrel(root);
buildLlms(root);
console.log(`Built registry: ${index.total} components → ${out}/registry.json`);
console.log(`Web barrel: apps/web/lib/registry-data.generated.ts`);
console.log(`llms.txt: apps/web/public/llms.txt`);
console.log(`Catalog slugs: ${catalog.length}`);
