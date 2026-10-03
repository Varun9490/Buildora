"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type FloatingObjectProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Width/height of the container (CSS value) */
  size?: string;
  /** Animation delay for staggered groups (seconds) */
  animationDelay?: number;
  /** Maximum tilt angle in degrees on hover */
  maxTilt?: number;
  /** Whether to show the floating shadow */
  showShadow?: boolean;
  /** Optional speech-bubble text on hover */
  bubbleText?: string;
};

export function FloatingObject({
  src,
  alt,
  size = "10rem",
  animationDelay = 0,
  maxTilt = 15,
  showShadow = true,
  bubbleText,
  className,
  ...rest
}: FloatingObjectProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const [tilt, setTilt] = React.useState({ x: 0, y: 0, scale: 1 });
  const [showBubble, setShowBubble] = React.useState(false);

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reduced || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      setTilt({
        x: dy * -maxTilt,
        y: dx * maxTilt,
        scale: 1.08,
      });
    },
    [reduced, maxTilt]
  );

  const handlePointerLeave = React.useCallback(() => {
    setTilt({ x: 0, y: 0, scale: 1 });
    setShowBubble(false);
  }, []);

  const handlePointerEnter = React.useCallback(() => {
    if (bubbleText) setShowBubble(true);
  }, [bubbleText]);

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerEnter={handlePointerEnter}
      className={cn("buildora-floating-object relative shrink-0", className)}
      style={{ perspective: "900px", width: size, height: size }}
      {...rest}
    >
      {/* Drop shadow */}
      {showShadow && (
        <div
          aria-hidden
          className="absolute bottom-[6%] left-1/2 h-4 w-1/2 rounded-[50%] blur-md transition-all duration-500"
          style={{
            background: "var(--b-fg, currentColor)",
            opacity: 0.2,
            transform: `translateX(-50%) scale(${tilt.scale > 1 ? 0.85 : 1})`,
          }}
        />
      )}

      {/* Floating animation wrapper */}
      <div
        className="h-full w-full"
        style={{
          animation: reduced
            ? "none"
            : `buildora-float ${3 + animationDelay}s ease-in-out infinite`,
          animationDelay: `${animationDelay}s`,
        }}
      >
        <img
          src={src}
          alt={alt}
          decoding="async"
          draggable={false}
          className="h-full w-full select-none object-contain transition-transform duration-500"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.scale}) translateZ(0)`,
            transitionTimingFunction: "cubic-bezier(.34,1.56,.64,1)",
          }}
        />
      </div>

      {/* Speech bubble */}
      {bubbleText && (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute z-40 w-max whitespace-pre-line",
            "left-1/2 -translate-x-1/2 bottom-[calc(100%+4px)]",
            "rounded-[18px_18px_18px_5px] border px-4 py-2 text-sm shadow-lg",
            "transition-all duration-300",
            showBubble
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-3 scale-90 opacity-0"
          )}
          style={{
            maxWidth: "min(16rem, calc(100vw - 2rem))",
            borderColor: "var(--b-border, #e5e7eb)",
            background: "var(--b-surface, #fff)",
            color: "var(--b-fg, #000)",
            transitionTimingFunction: "cubic-bezier(.34,1.56,.64,1)",
          }}
        >
          {bubbleText}
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes buildora-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}
          `,
        }}
      />
    </div>
  );
}

export default FloatingObject;
