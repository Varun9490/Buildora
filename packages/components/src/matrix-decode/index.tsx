"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { rafLoop } from "@buildora/animations";

export type MatrixDecodeProps = React.HTMLAttributes<HTMLSpanElement> & {
  text: string;
  speed?: number;
  delay?: number;
  charset?: string;
};

const DEFAULT_CHARS = "!<>-_\\/[]{}=+*^?#$%&@01";

/**
 * MatrixDecode — characters cycle through glyphs and lock in left-to-right
 * with stochastic jitter. rAF-driven, resolves once, static under reduced motion.
 */
export function MatrixDecode({ text, speed = 1, delay = 0, charset = DEFAULT_CHARS, className, ...rest }: MatrixDecodeProps) {
  const reduced = useReducedMotion();
  const [view, setView] = React.useState<string[]>(() => text.split(""));

  React.useEffect(() => {
    if (reduced) {
      setView(text.split(""));
      return;
    }
    let stop: (() => void) | null = null;
    let cancelled = false;
    const t0 = window.setTimeout(() => {
      if (cancelled) return;
      const chars = text.split("");
      const n = Math.max(1, chars.length);
      const base = 900 / Math.max(0.25, speed);
      const locks = chars.map((ch, i) => {
        const jitter = ch === " " ? 0 : (Math.random() - 0.5) * base * 0.35;
        return Math.max(0, (i / n) * base + jitter);
      });
      const total = Math.max(...locks, 0) + 80;
      const startedAt = performance.now();
      let lastPaint = 0;
      stop = rafLoop((_dt, now) => {
        if (cancelled) return false;
        const elapsed = now - startedAt;
        if (elapsed - lastPaint < 28) return;
        lastPaint = elapsed;
        if (elapsed >= total) {
          setView(chars);
          return false;
        }
        setView(
          chars.map((ch, i) => {
            if (ch === " ") return " ";
            if (elapsed >= locks[i]) return ch;
            return Math.random() < 0.7 ? charset[Math.floor(Math.random() * charset.length)] : ch;
          })
        );
      });
    }, delay);
    return () => {
      cancelled = true;
      window.clearTimeout(t0);
      if (stop) stop();
    };
  }, [text, speed, delay, charset, reduced]);

  return (
    <span aria-label={text} className={cn("inline", className)} {...rest}>
      <span aria-hidden className="inline-block">
        {view.join("")}
      </span>
    </span>
  );
}

export default MatrixDecode;
