import * as fs from "node:fs";
import * as path from "node:path";

const root = process.cwd();
const srcDir = path.join(root, "packages/components/src");

const dirs = ["utils", "hooks", "animations", "tokens"].map(d => path.join(srcDir, d));
dirs.forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

const utilsContent = 'import { clsx, type ClassValue } from "clsx";\nimport { twMerge } from "tailwind-merge";\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}\n\nexport function copyToClipboard(text: string) {\n  return navigator.clipboard.writeText(text);\n}\n';
fs.writeFileSync(path.join(srcDir, "utils/index.ts"), utilsContent);

const reducedMotionContent = '"use client";\nimport * as React from "react";\n\nexport function useReducedMotion() {\n  const [reduced, setReduced] = React.useState(false);\n  React.useEffect(() => {\n    const media = window.matchMedia("(prefers-reduced-motion: reduce)");\n    setReduced(media.matches);\n    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);\n    media.addEventListener("change", listener);\n    return () => media.removeEventListener("change", listener);\n  }, []);\n  return reduced;\n}\n';
fs.writeFileSync(path.join(srcDir, "hooks/use-reduced-motion.ts"), reducedMotionContent);

const pointerProximityContent = '"use client";\nimport * as React from "react";\n\nexport function usePointerProximity(ref: React.RefObject<HTMLElement | null>, radius: number) {\n  const [proximity, setProximity] = React.useState(0);\n  React.useEffect(() => {\n    const onMove = (e: PointerEvent) => {\n      if (!ref.current) return;\n      const r = ref.current.getBoundingClientRect();\n      const cx = r.left + r.width / 2;\n      const cy = r.top + r.height / 2;\n      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);\n      setProximity(Math.max(0, 1 - dist / radius));\n    };\n    window.addEventListener("pointermove", onMove);\n    return () => window.removeEventListener("pointermove", onMove);\n  }, [ref, radius]);\n  return proximity;\n}\n';
fs.writeFileSync(path.join(srcDir, "hooks/use-pointer-proximity.ts"), pointerProximityContent);

const springContent = 'export function springStep(x: number, v: number, target: number, { stiffness = 170, damping = 26, mass = 1, dt = 0.016 } = {}) {\n  const f = -stiffness * (x - target) - damping * v;\n  const a = f / mass;\n  const newV = v + a * dt;\n  const newX = x + newV * dt;\n  return { x: newX, v: newV };\n}\n';
fs.writeFileSync(path.join(srcDir, "animations/spring.ts"), springContent);

const tokensContent = '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n@layer base {\n  :root {\n    --b-background: #ffffff;\n    --b-foreground: #09090b;\n    --b-muted: #f4f4f5;\n    --b-accent: #d4ff4f;\n    --b-panel: #fafafa;\n    --b-surface: #ffffff;\n    --b-border: #e4e4e7;\n    --b-border-hover: #d4d4d8;\n    --b-elevated: #f4f4f5;\n    --b-text: #18181b;\n    --b-text-secondary: #71717a;\n    --b-bg: #ffffff;\n  }\n  .dark {\n    --b-background: #09090b;\n    --b-foreground: #fafafa;\n    --b-muted: #27272a;\n    --b-accent: #d4ff4f;\n    --b-panel: #0d0f16;\n    --b-surface: #12141d;\n    --b-border: #27272a;\n    --b-border-hover: #3f3f46;\n    --b-elevated: #18181b;\n    --b-text: #fafafa;\n    --b-text-secondary: #a1a1aa;\n    --b-bg: #09090b;\n  }\n}\n';
fs.writeFileSync(path.join(srcDir, "tokens/index.css"), tokensContent);

function walk(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(p);
    } else if (p.endsWith(".tsx") || p.endsWith(".ts")) {
      let content = fs.readFileSync(p, "utf8");
      let changed = false;
      
      const componentDir = path.dirname(p);
      const isBaseDir = componentDir === srcDir || componentDir.startsWith(path.join(srcDir, "utils")) || componentDir.startsWith(path.join(srcDir, "hooks")) || componentDir.startsWith(path.join(srcDir, "animations")) || componentDir.startsWith(path.join(srcDir, "tokens"));
      
      if (!isBaseDir) {
        if (content.includes("@buildora/utils")) {
          content = content.replace(/@buildora\/utils/g, "../utils");
          changed = true;
        }
        if (content.includes("@buildora/hooks")) {
          content = content.replace(/import\s+\{\s*([^\}]+)\s*\}\s+from\s+['"]@buildora\/hooks['"]/g, (m, imports) => {
            let res = [];
            if (imports.includes("useReducedMotion")) res.push("useReducedMotion");
            if (imports.includes("usePointerProximity")) res.push("usePointerProximity");
            if (res.includes("useReducedMotion") && res.includes("usePointerProximity")) {
               return 'import { useReducedMotion } from "../hooks/use-reduced-motion";\nimport { usePointerProximity } from "../hooks/use-pointer-proximity"';
            } else if (res.includes("useReducedMotion")) {
               return 'import { useReducedMotion } from "../hooks/use-reduced-motion"';
            } else if (res.includes("usePointerProximity")) {
               return 'import { usePointerProximity } from "../hooks/use-pointer-proximity"';
            }
            return m;
          });
          changed = true;
        }
        if (content.includes("@buildora/animations")) {
          content = content.replace(/import\s+\{\s*([^\}]+)\s*\}\s+from\s+['"]@buildora\/animations['"]/g, (m, imports) => {
            if (imports.includes("springStep")) {
              return 'import { springStep } from "../animations/spring"';
            }
            return m;
          });
          changed = true;
        }
        if (content.includes("@buildora/tokens")) {
          content = content.replace(/@buildora\/tokens/g, "../tokens");
          changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(p, content);
      }
    }
  }
}

walk(srcDir);
console.log("Phase 0 replacement script completed.");
