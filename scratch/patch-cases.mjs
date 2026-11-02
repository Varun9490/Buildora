import fs from "node:fs";
const p = "C:/Users/varun/Desktop/Buildora/apps/web/components/ComponentRenderer.tsx";
let s = fs.readFileSync(p, "utf8");
const start = s.indexOf('    case "portfolio-hero-entrance":');
const end = s.indexOf('    default:');
if (start !== -1 && end !== -1) {
  s = s.slice(0, start) + fs.readFileSync("C:/Users/varun/Desktop/Buildora/scratch/case-block.txt", "utf8") + "\n" + s.slice(end);
}
fs.writeFileSync(p, s);
console.log("done", start, end);
