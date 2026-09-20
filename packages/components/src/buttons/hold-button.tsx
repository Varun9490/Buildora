"use client";

import * as React from "react";
import { cn } from "../utils";
import { useReducedMotion } from "../hooks/use-reduced-motion";

export type HoldButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  holdDuration?: number;
  onHoldComplete?: () => void;
  progressColor?: string;
};

export function HoldButton({
  holdDuration = 1000,
  onHoldComplete,
  progressColor = "#d4ff4f",
  className,
  children,
  disabled,
  ...rest
}: HoldButtonProps) {
  const [progress, setProgress] = React.useState(0);
  const [isHolding, setIsHolding] = React.useState(false);
  const reduced = useReducedMotion();
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const startHold = React.useCallback(() => {
    if (disabled || reduced) return;
    setIsHolding(true);

    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / holdDuration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        onHoldComplete?.();
      }
    }, 16);

    timerRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsHolding(false);
      setProgress(0);
    }, holdDuration + 100);
  }, [holdDuration, onHoldComplete, disabled, reduced]);

  const cancelHold = React.useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsHolding(false);
    setProgress(0);
  }, []);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <button
      onPointerDown={startHold}
      onPointerUp={cancelHold}
      onPointerLeave={cancelHold}
      disabled={disabled}
      className={cn(
        "relative overflow-hidden rounded-xl bg-[#1a1c25] px-6 py-2.5 text-sm font-medium text-white",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-[#d4ff4f]/50",
        "disabled:opacity-50 disabled:pointer-events-none",
        isHolding && "scale-95",
        className
      )}
      {...rest}
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 transition-all ease-linear"
        style={{
          width: `${progress}%`,
          background: progressColor,
          opacity: 0.2,
          transitionDuration: reduced ? "0ms" : `${holdDuration}ms`,
        }}
      />
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {isHolding && !reduced && (
          <span className="text-xs opacity-60">{Math.round(progress)}%</span>
        )}
      </span>
    </button>
  );
}

export default HoldButton;
