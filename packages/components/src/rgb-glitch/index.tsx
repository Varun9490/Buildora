"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type RgbGlitchTextProps = React.HTMLAttributes<HTMLSpanElement> & {
  text: string;
  intensity?: number;
  cycle?: number;
};

const GLITCH_CSS = `
.bk-glitch-layer{position:absolute;inset:0;opacity:0;pointer-events:none}
.bk-glitch[data-on="true"] .bk-glitch-layer{opacity:.9}
.bk-glitch-danger{color:var(--b-danger);animation:bk-glitch-a var(--bk-glitch-cycle,3.4s) steps(1,end) infinite}
.bk-glitch-iris{color:var(--b-iris);animation:bk-glitch-b var(--bk-glitch-cycle,3.4s) steps(1,end) infinite}
.bk-glitch-accent{color:var(--b-accent);animation:bk-glitch-c var(--bk-glitch-cycle,3.4s) steps(1,end) infinite}
@keyframes bk-glitch-a{
  0%,86%{transform:translate(0,0);clip-path:inset(0 0 0 0);opacity:0}
  87%{transform:translate(calc(var(--bk-glitch-i,1)*-3px),1px);clip-path:inset(6% 0 64% 0);opacity:.9}
  89%{transform:translate(calc(var(--bk-glitch-i,1)*2px),-1px) skewX(-8deg);clip-path:inset(58% 0 10% 0);opacity:.9}
  91%{transform:translate(calc(var(--bk-glitch-i,1)*-2px),0);clip-path:inset(34% 0 40% 0);opacity:.85}
  94%{transform:translate(0,0);clip-path:inset(0 0 0 0);opacity:0}
  100%{opacity:0}
}
@keyframes bk-glitch-b{
  0%,88%{transform:translate(0,0);clip-path:inset(0 0 0 0);opacity:0}
  89%{transform:translate(calc(var(--bk-glitch-i,1)*2px),-1px);clip-path:inset(48% 0 22% 0);opacity:.85}
  91%{transform:translate(calc(var(--bk-glitch-i,1)*-3px),1px) skewX(6deg);clip-path:inset(12% 0 70% 0);opacity:.9}
  93%{transform:translate(calc(var(--bk-glitch-i,1)*2px),0);clip-path:inset(70% 0 6% 0);opacity:.85}
  96%{transform:translate(0,0);clip-path:inset(0 0 0 0);opacity:0}
  100%{opacity:0}
}
@keyframes bk-glitch-c{
  0%,87%{transform:translate(0,0);clip-path:inset(0 0 0 0);opacity:0}
  88%{transform:translate(calc(var(--bk-glitch-i,1)*3px),0);clip-path:inset(76% 0 4% 0);opacity:.8}
  90%{transform:translate(calc(var(--bk-glitch-i,1)*-2px),1px) skewX(-4deg);clip-path:inset(20% 0 55% 0);opacity:.85}
  92%{transform:translate(calc(var(--bk-glitch-i,1)*1px),-1px);clip-path:inset(42% 0 30% 0);opacity:.8}
  95%{transform:translate(0,0);clip-path:inset(0 0 0 0);opacity:0}
  100%{opacity:0}
}
`;

/**
 * RGBGlitchText — channel-split glitch bursts with clip-path slices and skew.
 * Colors adapt to the active theme tokens. Pure CSS, deterministic burst cycle.
 */
export function RgbGlitchText({ text, intensity = 1, cycle = 3400, className, style, ...rest }: RgbGlitchTextProps) {
  const reduced = useReducedMotion();
  const [on, setOn] = React.useState(false);

  React.useEffect(() => {
    if (!reduced) setOn(true);
  }, [reduced]);

  return (
    <span
      aria-label={text}
      className={cn("bk-glitch relative inline-block", className)}
      data-on={on ? "true" : "false"}
      style={{
        ...style,
        "--bk-glitch-i": intensity,
        "--bk-glitch-cycle": `${cycle}ms`,
      } as React.CSSProperties}
      {...rest}
    >
      <style>{GLITCH_CSS}</style>
      <span aria-hidden className="inline-block whitespace-nowrap">
        {text}
        {!reduced && (
          <>
            <span aria-hidden className="bk-glitch-layer bk-glitch-danger">
              {text}
            </span>
            <span aria-hidden className="bk-glitch-layer bk-glitch-iris" style={{ animationDelay: "110ms" }}>
              {text}
            </span>
            <span aria-hidden className="bk-glitch-layer bk-glitch-accent" style={{ animationDelay: "220ms" }}>
              {text}
            </span>
          </>
        )}
      </span>
    </span>
  );
}

export default RgbGlitchText;
