import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge class names with Tailwind conflict resolution. Installs to lib/buildora/utils.ts */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Linear interpolation between a and b at t (0..1) */
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Deterministic id for SSR-safe useId fallback */
let nextIdCounter = 0;
export function nextId(prefix = "b") {
  nextIdCounter += 1;
  return `${prefix}-${nextIdCounter}`;
}

export function formatBytes(bytes: number, decimals = 1) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const k = 1024;
  const dm = Math.max(0, decimals);
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.min(sizes.length - 1, Math.floor(Math.log(bytes) / Math.log(k)));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/** Clipboard write with a non-secure-context fallback. Never throws. */
export function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(
      () => true,
      () => copyViaExecCommand(text)
    );
  }
  return copyViaExecCommand(text);
}

function copyViaExecCommand(text: string): Promise<boolean> {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return Promise.resolve(ok);
  } catch {
    return Promise.resolve(false);
  }
}

export function debounce<T extends (...args: never[]) => void>(fn: T, ms: number) {
  let t: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

/** Fuzzy match score (0..1+, higher is better) for command-palette / search ranking */
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
