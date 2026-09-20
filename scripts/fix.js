const fs = require("node:fs");
const path = require("node:path");

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
  const matchString1 = \`R("\${slug}", { \`;
  const matchString2 = \`R("\${slug}", {\\n\`;
  const matchString3 = \`R("\${slug}", {}, {\`;
  const matchString4 = \`R("\${slug}", { \`;
  
  // Just find R("slug" and replace the next { with { dependencies: ["framer-motion"],
  const regex = new RegExp(\`R\\\\("\${slug}"(.*?), \\\\{\`, "s");
  catalogContent = catalogContent.replace(regex, (m, group1) => {
    return \`R("\${slug}"\${group1}, { dependencies: ["framer-motion"],\`;
  });
}

fs.writeFileSync(catalogPath, catalogContent);
console.log("Fixed framer-motion deps.");
