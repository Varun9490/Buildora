"use client";

import * as React from "react";
import { cn } from "../utils";
import { useReducedMotion } from "../hooks/use-reduced-motion";

export type RippleButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  rippleColor?: string;
  duration?: number;
};

export function RippleButton({
  rippleColor = "rgba(255, 255, 255, 0.35)",
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
        "relative overflow-hidden rounded-xl bg-gradient-to-br from-[#7c6cf6] to-[#5a4ad1] px-6 py-2.5 text-sm font-semibold text-white",
        "transition-all duration-200 hover:brightness-110 active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-[#7c6cf6]/50 focus:ring-offset-2 focus:ring-offset-[#0a0b10]",
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
          className="absolute rounded-full animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: "10px",
            height: "10px",
            marginLeft: "-5px",
            marginTop: "-5px",
            background: rippleColor,
            animationDuration: `${duration}ms`,
          }}
        />
      ))}
      <style jsx global>{`
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(20);
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: ripple ease-out forwards;
        }
      `}</style>
    </button>
  );
}

export default RippleButton;
