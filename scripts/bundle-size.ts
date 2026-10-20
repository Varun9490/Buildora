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
    return {
      slug: item.name,
      title: item.title,
      description: item.description,
      rawBytes: raw.length,
      gzipBytes: gz.length,
      gzipKb: kb(gz.length),
      files: item.files.length,
      dependencies: item.dependencies,
      registryDependencies: item.registryDependencies.map((d) => {
        const m = d.match(/\/r\/([^/]+)\.json$/);
        return m ? m[1] : d;
      }),
    };
  })
  .sort((a, b) => a.gzipBytes - b.gzipBytes);

const totalGzip = results.reduce((n, r) => n + r.gzipBytes, 0);
const median = results[Math.floor(results.length / 2)]?.gzipKb ?? 0;
const heaviest = results[results.length - 1];

const report = {
  note: "gzip level 9, the file content a consumer installs",
  components: results.length,
  totalGzipKb: kb(totalGzip),
  medianGzipKb: median,
  heaviest: { slug: heaviest.slug, gzipKb: heaviest.gzipKb },
  results,
};

const outDir = path.join(root, "registry", "reports");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "bundle-size.json"), `${JSON.stringify(report, null, 2)}\n`);

console.log(
  `Bundle size: ${results.length} components · median ${median} KB gzip · heaviest ${heaviest.slug} ${heaviest.gzipKb} KB → registry/reports/bundle-size.json`
);
