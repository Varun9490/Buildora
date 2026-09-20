"use client";

import * as React from "react";
import { cn } from "../../utils";
import { useReducedMotion } from "../../hooks/use-reduced-motion";

export type SwitchProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
};

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, disabled, checked, onChange, ...props }, ref) => {
    const reducedMotion = useReducedMotion();
    const id = React.useId();

    return (
      <label
        htmlFor={id}
        className={cn(
          "inline-flex items-center gap-3 cursor-pointer",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            checked={checked}
            onChange={onChange}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              "h-6 w-11 rounded-full bg-white/10 border border-white/10 transition-colors",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-[#d4ff4f]/50 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#08090d]",
              "peer-checked:bg-[#d4ff4f]/20 peer-checked:border-[#d4ff4f]/30",
              className
            )}
          />
          <div
            className={cn(
              "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white/80 shadow-lg transition-all",
              !reducedMotion && "duration-200",
              "peer-checked:translate-x-5 peer-checked:bg-[--b-accent]"
            )}
          />
        </div>
        {label && (
          <span className="text-sm text-white/70">{label}</span>
        )}
      </label>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
