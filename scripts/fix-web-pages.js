const fs = require("node:fs");
const path = require("node:path");

const filesToFix = [
  "apps/web/app/page.tsx",
  "apps/web/app/templates/ai-agent/page.tsx",
  "apps/web/components/SiteChrome.tsx",
  "apps/web/app/templates/creative-portfolio/page.tsx"
];

for (const file of filesToFix) {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, "utf8");
  
  const missing = ["MagneticCard", "LiquidButton", "SpatialCommandPalette", "SpreadsheetGrid", "ApiRequestBuilder"];
  
  for (const m of missing) {
    // Replace JSX usages first
    const jsxRegex = new RegExp(`<${m}[^>]*>(.*?)</${m}>|<${m}[^>]*/>`, 'gs');
    content = content.replace(jsxRegex, `<div className="border border-red-500 p-4">Missing Component: ${m}</div>`);
    
    // Remove from imports (import { ..., X, ... } from ...)
    const importRegex = new RegExp(`\\b${m}\\b\\s*,?`, 'g');
    // Only replace inside import statements
    content = content.replace(/import\s+\{([^}]+)\}\s+from\s+["']@buildora\/components["'];/g, (match, group) => {
      return match.replace(importRegex, '');
    });
  }
  
  // Cleanup empty imports if any
  content = content.replace(/import\s*\{\s*\}\s*from\s*['"]@buildora\/components['"];/g, '');
  
  fs.writeFileSync(filePath, content);
}

console.log("Fixed web pages correctly.");
