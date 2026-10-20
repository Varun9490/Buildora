"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type SelectionSnapProps = React.HTMLAttributes<HTMLSpanElement> & {
  text: string;
  weightTo?: number;
  weightFrom?: number;
};

const HANDLES = [
  { pos: { left: -3, top: -3 }, delay: 40 },
  { pos: { right: -3, top: -3 }, delay: 70 },
  { pos: { left: -3, bottom: -3 }, delay: 100 },
  { pos: { right: -3, bottom: -3 }, delay: 130 },
];

/**
 * SelectionSnap — the word snaps from hairline to black weight while a
 * designer-style selection box with corner handles springs into place.
 * Hover or focus to play.
 */
export function SelectionSnap({ text, weightFrom = 250, weightTo = 900, className, style, ...rest }: SelectionSnapProps) {
  const reduced = useReducedMotion();
  const [on, setOn] = React.useState(false);
  const active = on;
  const snapEase = "cubic-bezier(.34,1.56,.64,1)";

  return (
    <span
      tabIndex={0}
      className={cn("relative inline-block cursor-default outline-none", className)}
      style={{ ...style, fontWeight: reduced ? weightTo : active ? weightTo : weightFrom, transition: "font-weight 240ms ease" }}
      onPointerEnter={() => setOn(true)}
      onPointerLeave={() => setOn(false)}
      onFocus={() => setOn(true)}
      onBlur={() => setOn(false)}
      {...rest}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline-block">
        {text}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-x-2 -inset-y-1 rounded-[2px] border"
          style={{
            borderColor: "var(--b-accent)",
            opacity: active ? 1 : 0,
            transform: active ? "scale(1)" : "scale(.94)",
            transition: reduced ? "opacity 140ms ease" : `opacity 140ms ease, transform 260ms ${snapEase}`,
          }}
        >
          {HANDLES.map((h, i) => (
            <span
              key={i}
              className="absolute h-1.5 w-1.5"
              style={{
                ...h.pos,
                background: "var(--b-accent)",
                opacity: active ? 1 : 0,
                transition: reduced ? "opacity 140ms ease" : `opacity 140ms ease ${active ? h.delay : 0}ms`,
              }}
            />
          ))}
        </span>
      </span>
    </span>
  );
}

export default SelectionSnap;
