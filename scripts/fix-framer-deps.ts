import * as fs from "node:fs";
import * as path from "node:path";

const catalogPath = path.join(process.cwd(), "scripts/catalog.ts");
let catalogContent = fs.readFileSync(catalogPath, "utf8");

const missingFramer = [
  "command-palette",
  "mobile-nav",
  "navbar",
  "onboarding-checklist",
  "pricing-table",
  "progress",
  "sidebar",
  "slider",
  "tabs",
  "team-switcher",
  "usage-dashboard",
  "slingshot-otp"
];

for (const slug of missingFramer) {
  const regex = new RegExp('R\\\\(["\\']' + slug + '["\\'].*?\\\\)', 's');
  catalogContent = catalogContent.replace(regex, (match) => {
    if (match.includes("dependencies:")) {
       return match.replace(/dependencies:\\s*\\[(.*?)\\]/, (m, deps) => {
         if (!deps.includes("framer-motion")) {
           const prefix = deps.trim() ? deps + ", " : "";
           return 'dependencies: [' + prefix + '"framer-motion"]';
         }
         return m;
       });
    } else {
       return match.replace(/\\{/, '{ dependencies: ["framer-motion"],');
    }
  });
}

fs.writeFileSync(catalogPath, catalogContent);
console.log("Fixed framer-motion dependencies.");
