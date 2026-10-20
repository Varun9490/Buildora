"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion, AnimatePresence } from "motion/react";

export type GooeyItem = {
  label: string;
  href?: string;
  onSelect?: () => void;
  icon?: React.ReactNode;
};

export type GooeyMenuProps = React.HTMLAttributes<HTMLDivElement> & {
  items: GooeyItem[];
  /** Fan half-angle in degrees. Items spread around the bottom arc. */
  spread?: number;
  /** Radius of the fan in px. */
  radius?: number;
  openLabel?: string;
  label?: string;
  onItemSelect?: (item: GooeyItem, index: number) => void;
};

/**
 * GooeyMenu — an action button whose children fan out as fused blobs
 * (SVG goo filter) with crisp labels riding on top. Escape closes,
 * labels are real buttons, decorative blobs are aria-hidden.
 */
export function GooeyMenu({
  items,
  spread = 64,
  radius = 108,
  openLabel = "+",
  label = "Actions",
  onItemSelect,
  className,
  ...rest
}: GooeyMenuProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  const id = React.useId();
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const positions = items.map((_, i) => {
    const t = items.length === 1 ? 0 : i / (items.length - 1) - 0.5;
    const deg = t * spread * 2 * 0.5 + 90; // fan around the top arc
    const rad = (deg * Math.PI) / 180;
    return { x: Math.cos(rad) * -radius, y: -Math.sin(rad) * radius };
  });

  const size = 56;

  return (
    <div ref={rootRef} className={cn("relative inline-block", className)} {...rest}>
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <filter id={`${id}-goo`}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
          <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </svg>

      <div className="relative" style={{ width: radius * 2 + size, height: radius + size + 6 }}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-1.5 left-1/2 -translate-x-1/2"
          style={{ filter: reduced ? undefined : `url(#${id}-goo)`, width: radius * 2 + size, height: radius + size }}
        >
          {open &&
            positions.map((p, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0.2, opacity: 0, x: 0, y: 0 }}
                animate={{ scale: 1, opacity: 0.92, x: p.x, y: p.y }}
                exit={{ scale: 0.2, opacity: 0, x: 0, y: 0 }}
                transition={reduced ? { duration: 0 } : { type: "spring", bounce: 0.32, duration: 0.55, delay: i * 0.03 }}
                className="absolute bottom-3 left-1/2 -ml-6 h-12 w-12 rounded-full bg-[color:var(--b-accent)]"
              />
            ))}
        </div>

        <AnimatePresence>
          {open &&
            items.map((item, i) => (
              <motion.span
                key={item.label}
                initial={{ opacity: 0, scale: 0.6, x: 0, y: 0 }}
                animate={{ opacity: 1, scale: 1, x: positions[i].x, y: positions[i].y }}
                exit={{ opacity: 0, scale: 0.6, x: 0, y: 0 }}
                transition={reduced ? { duration: 0 } : { type: "spring", bounce: 0.3, duration: 0.5, delay: (items.length - i) * 0.02 }}
                className="absolute bottom-1.5 left-1/2 z-10 -ml-6"
              >
                {item.href ? (
                  <a
                    href={item.href}
                    onClick={() => onItemSelect?.(item, i)}
                    className="flex h-12 w-12 flex-col items-center justify-center gap-0.5 rounded-full text-[color:var(--b-accent-foreground)] outline-none transition-transform focus-visible:ring-2 focus-visible:ring-[color:var(--b-accent-foreground)]"
                    title={item.label}
                  >
                    {item.icon}
                    <span className="text-[9px] font-semibold leading-none">{item.label}</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onItemSelect?.(item, i);
                      item.onSelect?.();
                      setOpen(false);
                    }}
                    className="flex h-12 w-12 flex-col items-center justify-center gap-0.5 rounded-full text-[color:var(--b-accent-foreground)] outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-[color:var(--b-accent-foreground)]"
                    title={item.label}
                  >
                    {item.icon}
                    <span className="text-[9px] font-semibold leading-none">{item.label}</span>
                  </button>
                )}
              </motion.span>
            ))}
        </AnimatePresence>

        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="true"
          aria-label={label}
          onClick={() => setOpen((v) => !v)}
          className="absolute bottom-1 left-1/2 z-20 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border border-[color:color-mix(in_oklab,var(--b-border)_20%,transparent)] bg-[color:var(--b-accent)] text-[color:var(--b-accent-foreground)] shadow-lg outline-none transition-transform focus-visible:ring-2 focus-visible:ring-[color:var(--b-accent)] focus-visible:ring-offset-2"
        >
          <motion.svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            animate={reduced ? undefined : { rotate: open ? 45 : 0 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.45 }}
          >
            <path d="M10 3v14M3 10h14" />
          </motion.svg>
        </button>
      </div>
    </div>
  );
}

export default GooeyMenu;
