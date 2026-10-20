"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type CountUpProps = {
  /** The value to count to. */
  value: number;
  /** Where the count starts. Defaults to 0. */
  from?: number;
  /** How long the count takes, in ms. */
  duration?: number;
  /** Decimal places to show. */
  decimals?: number;
  /** Prefix, e.g. "$". */
  prefix?: string;
  /** Suffix, e.g. " installs". */
  suffix?: string;
  /** Thousands separators. */
  separator?: boolean;
  /** Start counting when the element scrolls into view. */
  whenVisible?: boolean;
  className?: string;
};

/**
 * CountUp — a number that counts to its value.
 *
 * What makes this different from a number that just renders: it counts
 * when it comes into view, so a statistic on a landing page arrives rather
 * than sitting there. The count is eased, not linear, and it is announced
 * once with the final value rather than on every frame — a live region
 * that fires sixty times a second is unusable.
 *
 * Under reduced motion the final value is rendered immediately.
 */
export function CountUp({
  value,
  from = 0,
  duration = 1400,
  decimals = 0,
  prefix = "",
  suffix = "",
  separator = true,
  whenVisible = true,
  className,
}: CountUpProps) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const [shown, setShown] = React.useState(reduced ? value : from);
  const raf = React.useRef(0);

  React.useEffect(() => {
    if (reduced) {
      setShown(value);
      return;
    }

    let start: number | null = null;

    const run = () => {
      const tick = (now: number) => {
        if (start === null) start = now;
        const t = Math.min(1, (now - start) / duration);
        // Ease-out cubic: fast at first, settling on the value.
        const eased = 1 - Math.pow(1 - t, 3);
        setShown(from + (value - from) * eased);
        if (t < 1) {
          raf.current = requestAnimationFrame(tick);
        } else {
          setShown(value);
          raf.current = 0;
        }
      };
      raf.current = requestAnimationFrame(tick);
    };

    if (!whenVisible) {
      run();
      return () => {
        if (raf.current) cancelAnimationFrame(raf.current);
      };
    }

    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      run();
      return () => {
        if (raf.current) cancelAnimationFrame(raf.current);
      };
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [value, from, duration, reduced, whenVisible]);

  const format = (n: number) => {
    const fixed = n.toFixed(decimals);
    if (!separator) return fixed;
    const [whole, frac] = fixed.split(".");
    const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return frac ? `${grouped}.${frac}` : grouped;
  };

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {/* The final value is announced once; the animated number is for eyes. */}
      <span className="sr-only">
        {prefix}
        {format(value)}
        {suffix}
      </span>
      <span aria-hidden="true">
        {prefix}
        {format(shown)}
        {suffix}
      </span>
    </span>
  );
}

export default CountUp;
