const fs = require("node:fs");
const path = require("node:path");

const filePath = path.join(process.cwd(), "apps/web/app/page.tsx");
let content = fs.readFileSync(filePath, "utf8");

const missing = [
  "MorphingTypography",
  "HolographicCard",
  "Interactive3DCard",
  "CursorSpotlight"
];

// Add FxCard and FxButton if not there
if (content.includes('@buildora/components')) {
  content = content.replace(/import\s+\{([^}]+)\}\s+from\s+["']@buildora\/components["'];/, (match, group) => {
    let newGroup = group;
    if (!newGroup.includes("FxCard")) newGroup += ", FxCard";
    if (!newGroup.includes("FxButton")) newGroup += ", FxButton";
    if (!newGroup.includes("CursorFx")) newGroup += ", CursorFx";
    if (!newGroup.includes("TextFx")) newGroup += ", TextFx";
    
    // Remove missing
    missing.forEach(m => {
      newGroup = newGroup.replace(new RegExp(`\\b${m}\\b\\s*,?`, 'g'), '');
    });
    
    return `import { ${newGroup} } from "@buildora/components";`;
  });
}

// Replace JSX
content = content.replace(/<MorphingTypography[^>]*>.*?<\/MorphingTypography>|<MorphingTypography[^>]*\/>/gs, '<TextFx kind="morph" text={["Morphing", "Typography"]} />');
content = content.replace(/<HolographicCard[^>]*>.*?<\/HolographicCard>|<HolographicCard[^>]*\/>/gs, '<FxCard effect="holographic" className="w-64 aspect-[3/4] p-4"><div className="h-full rounded-lg bg-[--b-surface]/50" /></FxCard>');
content = content.replace(/<Interactive3DCard[^>]*>.*?<\/Interactive3DCard>|<Interactive3DCard[^>]*\/>/gs, '<FxCard effect="tilt" className="w-64 aspect-[3/4] p-4"><div className="h-full rounded-lg bg-[--b-surface]/50" /></FxCard>');
content = content.replace(/<CursorSpotlight[^>]*>.*?<\/CursorSpotlight>|<CursorSpotlight[^>]*\/>/gs, '<CursorFx mode="spotlight" />');

fs.writeFileSync(filePath, content);
console.log("Fixed page.tsx imports and JSX.");
