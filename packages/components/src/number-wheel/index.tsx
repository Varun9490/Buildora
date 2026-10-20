"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type NumberWheelProps = React.HTMLAttributes<HTMLSpanElement> & {
  value: number;
  prefix?: string;
  suffix?: string;
  group?: boolean;
  countUp?: boolean;
  from?: number;
};

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/**
 * NumberWheel — odometer counters: each digit rolls on a vertical reel with a
 * staggered cascade. Locale grouping, prefix and suffix, count-up on mount.
 */
export function NumberWheel({
  value,
  prefix = "",
  suffix = "",
  group = true,
  countUp = false,
  from = 0,
  className,
  ...rest
}: NumberWheelProps) {
  const reduced = useReducedMotion();
  const [shown, setShown] = React.useState(value);
  const [teleport, setTeleport] = React.useState(false);

  React.useEffect(() => {
    if (countUp && !reduced) {
      setTeleport(true);
      setShown(from);
      const raf = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setTeleport(false);
          setShown(value);
        });
      });
      return () => window.cancelAnimationFrame(raf);
    }
    setShown(value);
  }, [value, countUp, from, reduced]);

  const fmt = (n: number) => (group ? n.toLocaleString("en-US") : String(n));
  const chars = fmt(shown).split("");

  let dn = 0;
  const parts = chars.map((ch) => {
    if (ch >= "0" && ch <= "9") {
      const part = { digit: Number(ch), delay: dn * 45 };
      dn += 1;
      return part;
    }
    return null;
  });

  return (
    <span
      className={cn("inline-flex items-center leading-[1]", className)}
      style={{ fontVariantNumeric: "tabular-nums" }}
      {...rest}
    >
      <span className="sr-only">{`${prefix}${fmt(value)}${suffix}`}</span>
      <span aria-hidden className="inline-flex items-center leading-[1]">
        {prefix}
        {parts.map((part, i) =>
          part ? (
            <span key={i} className="relative inline-block h-[1em] w-[1ch] overflow-hidden">
              <span
                className="absolute left-0 top-0 flex flex-col"
                style={{
                  transform: `translateY(-${part.digit}em)`,
                  transition: teleport || reduced ? undefined : "transform 560ms cubic-bezier(.22,1,.36,1)",
                  transitionDelay: teleport || reduced ? undefined : `${part.delay}ms`,
                }}
              >
                {DIGITS.map((d) => (
                  <span key={d} className="flex h-[1em] w-[1ch] items-center justify-center">
                    {d}
                  </span>
                ))}
              </span>
            </span>
          ) : (
            <span key={i} className="inline-flex h-[1em] items-center">
              {chars[i]}
            </span>
          )
        )}
        {suffix}
      </span>
    </span>
  );
}

export default NumberWheel;
