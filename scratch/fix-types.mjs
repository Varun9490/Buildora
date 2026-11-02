import fs from "node:fs";
const comps = ["animated-counter-badge","animated-gradient-text","tooltip-fade","elastic-underline"];
for (const c of comps) {
  const p = `C:/Users/varun/Desktop/Buildora/packages/components/src/${c}/index.tsx`;
  let s = fs.readFileSync(p, "utf8");
  s = s.replace("React.HTMLAttributes<HTMLDivElement>", "React.HTMLAttributes<HTMLSpanElement>");
  fs.writeFileSync(p, s);
}
console.log("done");
