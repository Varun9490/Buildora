"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type SpeechBubbleCursorProps = {
  /** Default bubble text (when no element is hovered) */
  defaultText?: string;
  /** CSS selector for elements with data-cursor attribute */
  selector?: string;
  /** Position: top-left, top-right, bottom-left, or follow cursor */
  bubblePosition?: "top-left" | "top-right" | "bottom-left" | "follow";
  /** Color scheme */
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  /** Children to render inside the provider */
  children: React.ReactNode;
};

export function SpeechBubbleCursor({
  defaultText,
  selector = "[data-cursor]",
  bubblePosition = "follow",
  backgroundColor,
  borderColor,
  textColor,
  children,
}: SpeechBubbleCursorProps) {
  const cursorRef = React.useRef<HTMLDivElement | null>(null);
  const [bubbleText, setBubbleText] = React.useState(defaultText || "");
  const [visible, setVisible] = React.useState(false);
  const posRef = React.useRef({ x: -200, y: -200 });
  const rafRef = React.useRef<number | null>(null);
  const reduced = useReducedMotion();

  React.useEffect(() => {
    if (reduced) return;

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
        }
      });
    };

    const onOver = (e: Event) => {
      const target = (e.target as HTMLElement)?.closest?.(selector);
      if (target) {
        const text = (target as HTMLElement).getAttribute("data-cursor");
        if (text) {
          setBubbleText(text);
          setVisible(true);
        }
      }
    };

    const onOut = (e: Event) => {
      const target = (e.target as HTMLElement)?.closest?.(selector);
      if (target) {
        setVisible(false);
        if (defaultText) setBubbleText(defaultText);
      }
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [selector, defaultText, reduced]);

  const resolvedBg = backgroundColor || "var(--b-surface, #fff)";
  const resolvedBorder = borderColor || "var(--b-accent, #2E90FA)";
  const resolvedText = textColor || "var(--b-fg, #000)";

  return (
    <>
      {children}

      {/* Custom cursor bubble */}
      {!reduced && (
        <div
          ref={cursorRef}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[100] hidden will-change-transform lg:block"
          style={{ transform: "translate3d(-200px, -200px, 0)" }}
        >
          <div
            className={cn(
              "origin-top-left whitespace-nowrap px-4 py-2 text-sm font-medium",
              "transition-[opacity,scale] duration-300",
              "rounded-[2px_24px_24px_24px]",
              "border-2 shadow-lg"
            )}
            style={{
              background: resolvedBg,
              borderColor: resolvedBorder,
              color: resolvedText,
              opacity: visible ? 1 : 0,
              scale: visible ? "1" : "0.75",
              transitionTimingFunction: "cubic-bezier(.34,1.56,.64,1)",
              filter: `drop-shadow(4px 4px 5px color-mix(in oklab, ${resolvedBorder} 16%, transparent))`,
            }}
          >
            {bubbleText || "\u00A0"}
          </div>
        </div>
      )}
    </>
  );
}

export default SpeechBubbleCursor;
