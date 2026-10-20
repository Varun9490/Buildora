"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type SplitTextProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** The text to split. */
  text: string;
  /** How to break it apart. */
  by?: "word" | "char" | "line";
  /** How each piece enters. */
  variant?: "fade-up" | "fade" | "blur" | "slide" | "scale";
  /** Delay between pieces, in ms. */
  stagger?: number;
  /** Delay before the first piece, in ms. */
  delay?: number;
  /** Duration of one piece's animation, in ms. */
  duration?: number;
  /** Render as a heading instead of a span. */
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
  /** Change this to replay the animation. */
  runKey?: string | number;
};

/** The offset each piece starts from, per variant. */
const VARIANT_FROM: Record<NonNullable<SplitTextProps["variant"]>, string> = {
  "fade-up": "translateY(0.55em)",
  fade: "translateY(0)",
  blur: "translateY(0.15em)",
  slide: "translateX(-0.45em)",
  scale: "scale(0.82)",
};

/**
 * SplitText — reveal a headline one piece at a time.
 *
 * What makes this different from a plain fade-in: the pieces are real text
 * nodes, not a masked image, so the headline stays selectable, searchable
 * and translatable. The animation is one shared keyframe with a per-piece
 * delay, so it costs a single paint and survives a server render.
 *
 * The whole string is exposed to assistive technology as one phrase: a
 * screen reader should hear the headline, not read it letter by letter.
 */
export function SplitText({
  text,
  by = "word",
  variant = "fade-up",
  stagger = 40,
  delay = 0,
  duration = 620,
  as: Tag = "span",
  runKey,
  className,
  style,
  ...rest
}: SplitTextProps) {
  const reduced = useReducedMotion();
  const [run, setRun] = React.useState(0);

  React.useEffect(() => {
    if (runKey === undefined) return;
    setRun((r) => r + 1);
  }, [runKey]);

  const parts = React.useMemo(() => {
    if (by === "char") return Array.from(text);
    if (by === "line") return text.split("\n");
    return text.split(" ");
  }, [text, by]);

  return (
    <Tag
      className={cn("inline-block", className)}
      style={style}
      {...rest}
    >
      {/* The headline is announced once, as a phrase. The pieces below are
          the animated copy and are hidden from assistive technology. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline-block">
        {parts.map((part, i) => (
          <React.Fragment key={`${part}-${i}`}>
            <span
              className="inline-block will-change-transform"
              style={
                reduced
                  ? undefined
                  : ({
                      animationName: "buildora-split-in",
                      animationDuration: `${duration}ms`,
                      animationDelay: `${delay + i * stagger}ms`,
                      animationTimingFunction: "cubic-bezier(.22,1,.36,1)",
                      animationFillMode: "both",
                      ["--buildora-split-from" as string]: VARIANT_FROM[variant],
                      ["--buildora-split-blur" as string]:
                        variant === "blur" ? "6px" : "0px",
                    } as React.CSSProperties)
              }
            >
              {part}
            </span>
            {by === "word" && i < parts.length - 1 ? " " : ""}
          </React.Fragment>
        ))}
      </span>
      <style>{`
@keyframes buildora-split-in {
  from {
    opacity: 0;
    transform: var(--buildora-split-from, translateY(0.55em));
    filter: blur(var(--buildora-split-blur, 0px));
  }
  to {
    opacity: 1;
    transform: translateY(0) translateX(0) scale(1);
    filter: blur(0px);
  }
}
`}</style>
    </Tag>
  );
}

export default SplitText;
