const fs = require("node:fs");
const path = require("node:path");

function replaceComponent(filePath, missingText, replacementJsx, importToAdd) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, "utf8");
  
  if (content.includes(`Missing Component: ${missingText}`)) {
    content = content.replace(new RegExp(`<div className="border border-red-500 p-4">Missing Component: ${missingText}</div>`, "g"), replacementJsx);
    
    // Add import if needed
    if (importToAdd && !content.includes(importToAdd)) {
      // Find the existing import from @buildora/components and add it
      if (content.includes('@buildora/components')) {
        content = content.replace(/import\s+\{([^}]+)\}\s+from\s+["']@buildora\/components["'];/, (match, group) => {
          if (!group.includes(importToAdd)) {
            return `import { ${importToAdd}, ${group} } from "@buildora/components";`;
          }
          return match;
        });
      } else {
        // Just add it after the last import
        const lines = content.split('\n');
        let lastImport = -1;
        for (let i=0; i<lines.length; i++) {
          if (lines[i].startsWith("import ")) lastImport = i;
        }
        if (lastImport !== -1) {
          lines.splice(lastImport + 1, 0, `import { ${importToAdd} } from "@buildora/components";`);
          content = lines.join('\n');
        }
      }
    }
    
    fs.writeFileSync(filePath, content);
  }
}

const siteChromePath = path.join(process.cwd(), "apps/web/components/SiteChrome.tsx");
replaceComponent(siteChromePath, "SpatialCommandPalette", "<CommandPalette />", "CommandPalette");

const aiAgentPath = path.join(process.cwd(), "apps/web/app/templates/ai-agent/page.tsx");
replaceComponent(aiAgentPath, "SpatialCommandPalette", "<CommandPalette />", "CommandPalette");

const homePath = path.join(process.cwd(), "apps/web/app/page.tsx");
replaceComponent(homePath, "MagneticCard", '<FxCard effect="tilt" className="w-64 aspect-[3/4] p-4"><div className="h-full rounded-lg bg-[--b-surface]/50" /></FxCard>', "FxCard");
replaceComponent(homePath, "LiquidButton", '<FxButton effect="liquid">Explore</FxButton>', "FxButton");

console.log("Fixed missing component fallbacks.");
