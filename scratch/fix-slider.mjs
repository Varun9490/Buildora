import fs from "node:fs";
const p = "C:/Users/varun/Desktop/Buildora/packages/components/src/slider-glow/index.tsx";
let s = fs.readFileSync(p, "utf8");
s = s.replace('className="w-full accent-[color:var(--b-accent)]"', 'className="w-full accent-[color:var(--b-accent)]" aria-label="Volume"');
fs.writeFileSync(p, s);
console.log("done");
