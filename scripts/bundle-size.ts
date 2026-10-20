/**
 * Bundle size report.
 *
 * Measures what a consumer actually gets: the shipped file content of each
 * registry item, gzipped, plus the dependencies it pulls in. The site
 * publishes these numbers, so a claim about "1.4 KB" is measured rather
 * than asserted.
 *
 * Run: pnpm registry:size
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { gzipSync } from "node:zlib";

const root = process.cwd();
const generatedDir = path.join(root, "registry", "generated");

type Item = {
  name: string;
  title: string;
  description: string;
  files: Array<{ path: string; target: string; content: string }>;
  dependencies: string[];
  registryDependencies: string[];
};

const items: Item[] = fs
  .readdirSync(generatedDir)
  .filter((f) => f.endsWith(".json") && f !== "registry.json" && f !== "agent-catalog.json")
  .map((f) => JSON.parse(fs.readFileSync(path.join(generatedDir, f), "utf8")) as Item);

const kb = (bytes: number) => Math.round((bytes / 1024) * 100) / 100;

const results = items
  .map((item) => {
    const raw = Buffer.from(item.files.map((f) => f.content).join("\n"), "utf8");
    const gz = gzipSync(raw, { level: 9 });
    const needsMotion = item.dependencies.some((d) => d.startsWith("motion"));
    return {
      slug: item.name,
      title: item.title,
      description: item.description,
      rawBytes: raw.length,
      gzipBytes: gz.length,
      gzipKb: kb(gz.length),
      files: item.files.length,
      needsMotion,
      dependencies: item.dependencies,
      registryDependencies: item.registryDependencies.map((d) => {
        const m = d.match(/\/r\/([^/]+)\.json$/);
        return m ? m[1] : d;
      }),
    };
  })
  .sort((a, b) => a.gzipBytes - b.gzipBytes);

/**
 * What a consumer pays for the animation library, if they use a component
 * that needs it. It is one dependency, paid once, however many components
 * they install.
 */
function motionCostKb(): number | null {
  const pnpmDir = path.join(root, "node_modules", ".pnpm");
  if (!fs.existsSync(pnpmDir)) return null;

  const wanted: Array<[string, string]> = [
    ["framer-motion@", "framer-motion/dist/framer-motion.js"],
    ["motion-dom@", "motion-dom/dist/motion-dom.js"],
    ["motion-utils@", "motion-utils/dist/motion-utils.js"],
  ];

  let total = 0;
  let found = 0;
  for (const [prefix, rel] of wanted) {
    const dir = fs.readdirSync(pnpmDir).find((d) => d.startsWith(prefix));
    if (!dir) continue;
    const file = path.join(pnpmDir, dir, "node_modules", rel);
    if (!fs.existsSync(file)) continue;
    total += gzipSync(fs.readFileSync(file), { level: 9 }).length;
    found++;
  }
  return found ? kb(total) : null;
}

const motionKb = motionCostKb();
const withMotion = results.filter((r) => r.needsMotion);

const report = {
  note: "gzip level 9, the file content a consumer installs",
  components: results.length,
  totalGzipKb: kb(results.reduce((n, r) => n + r.gzipBytes, 0)),
  medianGzipKb: results[Math.floor(results.length / 2)]?.gzipKb ?? 0,
  heaviest: { slug: results[results.length - 1].slug, gzipKb: results[results.length - 1].gzipKb },
  motion: {
    /** The animation library is one dependency, paid once. */
    gzipKb: motionKb,
    componentsNeedingIt: withMotion.length,
    /** The rest work without any animation library at all. */
    componentsWithoutIt: results.length - withMotion.length,
    note: motionKb
      ? `motion is ${motionKb} KB gzipped, paid once per project, not per component`
      : "motion is a shared dependency, paid once per project, not per component",
  },
  results,
};

const outDir = path.join(root, "registry", "reports");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "bundle-size.json"), `${JSON.stringify(report, null, 2)}\n`);

const heaviest = results[results.length - 1];

console.log(
  `Bundle size: ${results.length} components · median ${report.medianGzipKb} KB gzip · heaviest ${heaviest.slug} ${heaviest.gzipKb} KB`
);
console.log(
  `  animation library: ${withMotion.length} components need motion (${motionKb ?? "?"} KB gzipped, paid once), ${results.length - withMotion.length} need nothing`
);
