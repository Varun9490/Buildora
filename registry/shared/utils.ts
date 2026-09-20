import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge class names. Installs to lib/buildora/utils.ts */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Simple fuzzy match for command-palette / search ranking */
export function fuzzyScore(query: string, target: string): number {
  const q = query.toLowerCase().trim();
  const s = target.toLowerCase();
  if (!q) return 1;
  if (s.includes(q)) return 2 + q.length / Math.max(s.length, 1);
  let qi = 0;
  let score = 0;
  for (let i = 0; i < s.length && qi < q.length; i++) {
    if (s[i] === q[qi]) {
      score += 1;
      qi++;
    }
  }
  return qi === q.length ? score / s.length : 0;
}

export function formatBytes(bytes: number) {
  if (bytes <= 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.min(sizes.length - 1, Math.floor(Math.log(bytes) / Math.log(k)));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
