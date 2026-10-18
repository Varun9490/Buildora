"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type EchoStackProps = React.HTMLAttributes<HTMLSpanElement> & {
  text: string;
  layers?: number;
  spread?: number;
};

const ECHO_CSS = `
.bk-echo-layer{position:absolute;left:0;right:0;top:0;transition:transform 320ms cubic-bezier(.22,1,.36,1)}
.bk-echo-root:hover .bk-echo-layer{transform:translateY(calc(var(--bk-echo-step,14px) * -.35))}
@keyframes bk-echo-float{from{transform:translateY(-1.5px)}to{transform:translateY(1.5px)}}
`;

/**
 * EchoStack — outlined echo copies drift above the word and intensify on
 * hover. Pure CSS, zero re-renders, static under reduced motion.
 */
export function EchoStack({ text, layers = 2, spread = 14, className, style, ...rest }: EchoStackProps) {
  const reduced = useReducedMotion();
  const n = Math.max(0, Math.min(4, layers));

  return (
    <span
      aria-label={text}
      className={cn("bk-echo-root relative inline-block", className)}
      style={{
        ...style,
        "--bk-echo-spread": `${spread}px`,
        "--bk-echo-step": `${spread}px`,
      } as React.CSSProperties}
      {...rest}
    >
      <style>{ECHO_CSS}</style>
      <span aria-hidden className="relative inline-block">
        <span className="relative">{text}</span>
        {Array.from({ length: n }, (_, i) => (
          <span
            key={i}
            className="bk-echo-layer"
            style={{
              top: `calc(var(--bk-echo-spread) * ${-(i + 1)})`,
              opacity: 1 - (i + 1) * 0.35,
              WebkitTextStroke: "1px color-mix(in oklab, var(--b-text) 45%, transparent)",
              color: "transparent",
            }}
          >
            <span
              className="block"
              style={
                reduced
                  ? undefined
                  : { animation: `bk-echo-float ${3 + i * 0.4}s ease-in-out ${i * 0.35}s infinite alternate` }
              }
            >
              {text}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}

export default EchoStack;
