import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyToClipboard(text: string) {
  return navigator.clipboard.writeText(text);
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024, dm = decimals < 0 ? 0 : decimals, sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function fuzzyScore(query: string, target: string): number {
  if (!query) return 1;
  const targetLower = target.toLowerCase();
  const queryLower = query.toLowerCase();
  let score = 0;
  let qIdx = 0;
  for (let i = 0; i < targetLower.length; i++) {
    if (targetLower[i] === queryLower[qIdx]) {
      score += 1;
      qIdx++;
      if (qIdx === queryLower.length) return score;
    }
  }
  return qIdx === queryLower.length ? score : 0;
}
