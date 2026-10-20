"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type InlineWordRollProps = React.HTMLAttributes<HTMLSpanElement> & {
  prefix?: string;
  words?: string[];
  suffix?: string;
  interval?: number;
};

const ROLL_CSS = `@keyframes bk-roll-in{from{transform:translateY(.9em);opacity:.2}to{transform:translateY(0);opacity:1}}`;

/**
 * InlineWordRoll — rolling word slot for inline headlines. Slot width eases to
 * the measured word width; each word slides up into place, clipped.
 */
export function InlineWordRoll({
  prefix = "",
  words,
  suffix = "",
  interval = 2400,
  className,
  ...rest
}: InlineWordRollProps) {
  const list = words && words.length > 0 ? words : ["motion", "momentum", "clarity"];
  const reduced = useReducedMotion();
  const [i, setI] = React.useState(0);
  const [w, setW] = React.useState<number | null>(null);
  const mRef = React.useRef<HTMLSpanElement | null>(null);

  React.useEffect(() => {
    if (list.length < 2) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % list.length), Math.max(400, interval));
    return () => window.clearInterval(id);
  }, [list.length, interval]);

  React.useEffect(() => {
    const measure = () => {
      const el = mRef.current;
      if (el) setW(el.offsetWidth);
    };
    const raf = window.requestAnimationFrame(measure);
    const fonts = (document as Document & { fonts?: { ready?: Promise<void> } }).fonts;
    if (fonts?.ready) fonts.ready.then(measure).catch(() => undefined);
    return () => window.cancelAnimationFrame(raf);
  }, [i, list]);

  const word = list[i] ?? "";

  return (
    <span className={cn("inline", className)} {...rest}>
      <span className="sr-only">{`${prefix}${word}${suffix}`}</span>
      <style>{ROLL_CSS}</style>
      <span aria-hidden className="inline">
        {prefix}
        <span
          className="relative inline-block overflow-hidden align-bottom"
          style={{
            height: "1.12em",
            width: w ?? undefined,
            transition: reduced ? undefined : "width 400ms cubic-bezier(.22,1,.36,1)",
          }}
        >
          <span
            key={i}
            className="inline-block leading-[1.12]"
            style={reduced ? undefined : { animation: "bk-roll-in 400ms cubic-bezier(.22,1,.36,1) both" }}
          >
            {word}
          </span>
        </span>
        {suffix}
        <span ref={mRef} aria-hidden className="absolute whitespace-nowrap opacity-0" style={{ pointerEvents: "none" }}>
          {word}
        </span>
      </span>
    </span>
  );
}

export default InlineWordRoll;
