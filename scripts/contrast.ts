import fs from "node:fs";
import path from "node:path";
import { wcagContrast, parse } from "culori";

// The hardcoded output from packages/tokens/src/index.ts (since we can't easily import it without compiling it)
// We will just read the file and extract the OKLCH values with regex.

const tokensFile = path.resolve(process.cwd(), "packages/tokens/src/index.ts");
const content = fs.readFileSync(tokensFile, "utf-8");

const oklchRegex = /"oklch\(([^)]+)\)"/g;

// To make this simple and robust, let's extract the `baseThemes` and `accentPresets` objects
// by evaluating the file after transforming it slightly.
// Since it's TS, we can just compile it or use tsx. Let's use `tsx` to run a smaller script, or we can just import it dynamically using `tsx`.

import { baseThemes, accentPresets } from "../packages/tokens/src/index";

type ReportEntry = {
  background: string;
  foreground: string;
  ratio: number;
  AA: boolean;
  AAA: boolean;
};

const report: Record<string, Record<string, ReportEntry>> = {
  baseThemes: {},
  accentPresets: {}
};

function check(bgHexOrOklch: string, fgHexOrOklch: string, name: string, group: string) {
  // Strip opacity for contrast check
  const bgStr = bgHexOrOklch.split('/')[0].trim();
  const fgStr = fgHexOrOklch.split('/')[0].trim();
  
  const bg = parse(bgHexOrOklch);
  const fg = parse(fgHexOrOklch);
  
  if (!bg || !fg) return;
  
  const ratio = wcagContrast(bg, fg);
  report[group][name] = {
    background: bgHexOrOklch,
    foreground: fgHexOrOklch,
    ratio: Number(ratio.toFixed(2)),
    AA: ratio >= 4.5,
    AAA: ratio >= 7,
  };
  
  if (ratio < 4.5) {
    console.warn(`[WARNING] Contrast fail in ${group}.${name}: ${ratio.toFixed(2)} (requires 4.5)`);
  }
}

// Base Themes
check(baseThemes.light.bg, baseThemes.light.text, "light.bg_vs_text", "baseThemes");
check(baseThemes.light.panel, baseThemes.light.text, "light.panel_vs_text", "baseThemes");
check(baseThemes.light.surface, baseThemes.light.text, "light.surface_vs_text", "baseThemes");

check(baseThemes.dark.bg, baseThemes.dark.text, "dark.bg_vs_text", "baseThemes");
check(baseThemes.dark.panel, baseThemes.dark.text, "dark.panel_vs_text", "baseThemes");
check(baseThemes.dark.surface, baseThemes.dark.text, "dark.surface_vs_text", "baseThemes");

// Accent Presets
for (const [key, preset] of Object.entries(accentPresets)) {
  check(preset.light.accent, preset.light.foreground, `${key}.light`, "accentPresets");
  check(preset.dark.accent, preset.dark.foreground, `${key}.dark`, "accentPresets");
}

const outDir = path.resolve(process.cwd(), "registry/reports");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "contrast.json"), JSON.stringify(report, null, 2));

console.log("Contrast report generated at registry/reports/contrast.json");
