"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type LetterWaveProps = React.HTMLAttributes<HTMLSpanElement> & {
  text: string;
  /** Per-letter hover bob amplitude in px. */
  lift?: number;
  /** Stagger between letters, ms. */
  stagger?: number;
  /** Period of the autoloop in ms; omit to react to hover/focus only. */
  waveEvery?: number;
};

/**
 * LetterWave — hover (or focus, or an optional autoloop) sends a sine
 * wave rippling through the letters. Real text exposed via aria-label,
 * glyphs decorative. Static under reduced motion.
 */
export function LetterWave({
  text,
  lift = 8,
  stagger = 34,
  waveEvery,
  className,
  ...rest
}: LetterWaveProps) {
  const reduced = useReducedMotion();
  const [tick, setTick] = React.useState(0);
  const [hovering, setHovering] = React.useState(false);

  React.useEffect(() => {
    if (!waveEvery || reduced || hovering) return;
    const on = () => setTick((t) => t + 1);
    const id = window.setInterval(on, waveEvery);
    return () => window.clearInterval(id);
  }, [waveEvery, reduced, hovering]);

  const play = hovering || tick > 0;

  return (
    <span
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
      tabIndex={waveEvery ? undefined : 0}
      className={cn("inline-block whitespace-pre select-none", className)}
      {...rest}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline-block">
        {text.split("").map((ch, i) => (
        <span key={`${i}-${tick > 0 ? "T" : "H"}`} className="inline-block" style={{ willChange: "transform" }}>
          <span
            aria-hidden
            className="inline-block"
            style={
              reduced
                ? undefined
                : play
                  ? {
                      animation: `bk-letter-bob ${620 + i * 24}ms cubic-bezier(.34,1.56,.64,1) ${i * stagger}ms both`,
                    }
                  : undefined
            }
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        </span>
      ))}
      </span>
      <style>
        {`@keyframes bk-letter-bob{0%{transform:translateY(0)}40%{transform:translateY(-${lift}px)}72%{transform:translateY(${lift * 0.18}px)}100%{transform:translateY(0)}}`}
      </style>
    </span>
  );
}

export default LetterWave;
