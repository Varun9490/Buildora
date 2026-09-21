import fs from 'fs';
import { parse, formatCss, converter } from 'culori';

const toOklch = converter('oklch');

const filePath = 'packages/tokens/src/index.ts';
let content = fs.readFileSync(filePath, 'utf-8');

// Regex to find HEX or RGBA
const hexRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g;
const rgbaRegex = /rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)/g;

function replaceColor(match: string) {
  const parsed = parse(match);
  if (!parsed) return match;
  
  const oklch = toOklch(parsed);
  if (!oklch) return match;
  
  let l = (oklch.l !== undefined ? (oklch.l * 100).toFixed(2) + '%' : '0%');
  let c = (oklch.c !== undefined ? oklch.c.toFixed(4) : '0');
  let h = (oklch.h !== undefined ? oklch.h.toFixed(1) : '0');
  
  // Format as oklch(l c h / alpha)
  let alphaStr = '';
  if (parsed.alpha !== undefined && parsed.alpha < 1) {
    alphaStr = ` / ${parsed.alpha}`;
  }
  
  return `oklch(${l} ${c} ${h}${alphaStr})`;
}

content = content.replace(hexRegex, replaceColor);
content = content.replace(rgbaRegex, replaceColor);

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Replaced colors with OKLCH in packages/tokens/src/index.ts");
