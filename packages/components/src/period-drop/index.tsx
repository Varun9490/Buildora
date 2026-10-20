"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type PeriodDropProps = React.HTMLAttributes<HTMLSpanElement> & {
  text: string;
  delay?: number;
};

const DROP_CSS = `
@keyframes bk-period-drop{
  0%{transform:translateY(-1.2em) scale(1.15,.8);opacity:0;animation-timing-function:cubic-bezier(.55,0,1,.45)}
  8%{opacity:1}
  55%{transform:translateY(0) scale(1,1);animation-timing-function:linear}
  64%{transform:translateY(0) scale(1.5,.5)}
  78%{transform:translateY(-.22em) scale(.9,1.15)}
  100%{transform:translateY(0) scale(1,1)}
}
`;

/**
 * PeriodDrop — the full stop falls in with gravity, squashes on impact, and
 * settles into the sentence. One-shot keyframes, plays once when in view.
 */
export function PeriodDrop({ text, delay = 300, className, ...rest }: PeriodDropProps) {
  const reduced = useReducedMotion();
  const [on, setOn] = React.useState(false);
  const ref = React.useRef<HTMLSpanElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (typeof IntersectionObserver === "undefined") {
      const t = window.setTimeout(() => setOn(true), delay);
      return () => window.clearTimeout(t);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, delay]);

  return (
    <span ref={ref} className={cn("inline", className)} {...rest}>
      <span className="sr-only">{`${text}.`}</span>
      <style>{DROP_CSS}</style>
      <span aria-hidden className="inline">
        {text}
        <span
          aria-hidden
          className="inline-block rounded-full"
          style={{
            width: "0.16em",
            height: "0.16em",
            marginLeft: "0.14em",
            background: "currentColor",
            transformOrigin: "50% 100%",
            opacity: reduced || on ? undefined : 0,
            animation: on && !reduced ? `bk-period-drop 780ms ${delay}ms both` : undefined,
          }}
        />
      </span>
    </span>
  );
}

export default PeriodDrop;
