"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type RippleButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  rippleColor?: string;
  duration?: number;
};

export function RippleButton({
  rippleColor = "color-mix(in oklab, var(--b-text) 35%, transparent)",
  duration = 600,
  className,
  children,
  onClick,
  ...rest
}: RippleButtonProps) {
  const ref = React.useRef<HTMLButtonElement | null>(null);
  const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);
  const reduced = useReducedMotion();
  const idCounter = React.useRef(0);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reduced) {
      onClick?.(e);
      return;
    }

    const button = ref.current;
    if (!button) {
      onClick?.(e);
      return;
    }

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = idCounter.current++;

    setRipples((prev) => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, duration);

    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      onClick={handleClick}
      className={cn(
        "relative overflow-hidden rounded-xl bg-gradient-to-br from-[color:var(--b-accent)] to-[color:var(--b-iris)] px-6 py-2.5 text-sm font-semibold text-[color:var(--b-accent-foreground)]",
        "transition-all duration-200 hover:brightness-110 active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-[color:var(--b-accent)] focus:ring-offset-2 focus:ring-offset-[color:var(--b-bg)]",
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      {...rest}
    >
      <span className="relative z-10">{children}</span>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          aria-hidden
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: "10px",
            height: "10px",
            background: rippleColor,
            animation: `buildora-ripple-dot ${duration}ms ease-out forwards`,
          }}
        />
      ))}
    </button>
  );
}

export default RippleButton;
