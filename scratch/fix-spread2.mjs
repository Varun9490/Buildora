import fs from "node:fs";
const p = "C:/Users/varun/Desktop/Buildora/packages/components/src/animated-gradient-text/index.tsx";
let s = fs.readFileSync(p, "utf8");
s = s.replace('      {...rest}\n    >', '    >');
fs.writeFileSync(p, s);
console.log("done");
