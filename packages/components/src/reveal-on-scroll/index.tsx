"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type RevealOnScrollVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom"
  | "blur";

export type RevealOnScrollProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Animation variant */
  variant?: RevealOnScrollVariant;
  /** Stagger delay (seconds) */
  delay?: number;
  /** Animation duration (seconds) */
  duration?: number;
  /** IntersectionObserver threshold */
  threshold?: number;
  /** Only animate once */
  once?: boolean;
  /** Root margin for earlier triggering */
  rootMargin?: string;
};

const variantMap: Record<RevealOnScrollVariant, { from: string; to: string }> = {
  "fade-up": {
    from: "opacity: 0; transform: translateY(2rem);",
    to: "opacity: 1; transform: translateY(0);",
  },
  "fade-down": {
    from: "opacity: 0; transform: translateY(-2rem);",
    to: "opacity: 1; transform: translateY(0);",
  },
  "fade-left": {
    from: "opacity: 0; transform: translateX(2rem);",
    to: "opacity: 1; transform: translateX(0);",
  },
  "fade-right": {
    from: "opacity: 0; transform: translateX(-2rem);",
    to: "opacity: 1; transform: translateX(0);",
  },
  zoom: {
    from: "opacity: 0; transform: scale(0.92);",
    to: "opacity: 1; transform: scale(1);",
  },
  blur: {
    from: "opacity: 0; filter: blur(8px); transform: translateY(1rem);",
    to: "opacity: 1; filter: blur(0); transform: translateY(0);",
  },
};

export function RevealOnScroll({
  variant = "fade-up",
  delay = 0,
  duration = 0.7,
  threshold = 0.15,
  once = true,
  rootMargin = "0px",
  className,
  children,
  style,
  ...rest
}: RevealOnScrollProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const reduced = useReducedMotion();

  React.useEffect(() => {
    if (reduced) {
      setIsVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once, reduced]);

  const v = variantMap[variant];

  return (
    <div
      ref={ref}
      className={cn("buildora-reveal", className)}
      style={{
        willChange: "opacity, transform, filter",
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1), filter ${duration}s ease-out`,
        transitionDelay: `${delay}s`,
        ...(reduced
          ? {}
          : isVisible
          ? Object.fromEntries(
              v.to
                .split(";")
                .filter(Boolean)
                .map((s) => {
                  const [k, ...rest] = s.trim().split(":");
                  return [
                    k.replace(/-([a-z])/g, (_, c) => c.toUpperCase()),
                    rest.join(":").trim(),
                  ];
                })
            )
          : Object.fromEntries(
              v.from
                .split(";")
                .filter(Boolean)
                .map((s) => {
                  const [k, ...rest] = s.trim().split(":");
                  return [
                    k.replace(/-([a-z])/g, (_, c) => c.toUpperCase()),
                    rest.join(":").trim(),
                  ];
                })
            )),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export default RevealOnScroll;
