"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

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
              "h-6 w-11 rounded-full bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)] border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] transition-colors",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-[color-mix(in_oklab,var(--b-accent)_50%,transparent)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#08090d]",
              "peer-checked:bg-[color-mix(in_oklab,var(--b-accent)_20%,transparent)] peer-checked:border-[color-mix(in_oklab,var(--b-accent)_30%,transparent)]",
              className
            )}
          />
          <div
            className={cn(
              "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-[color-mix(in_oklab,var(--b-text)_80%,transparent)] shadow-lg transition-all",
              !reducedMotion && "duration-200",
              "peer-checked:translate-x-5 peer-checked:bg-[color:var(--b-accent)]"
            )}
          />
        </div>
        {label && (
          <span className="text-sm text-[color-mix(in_oklab,var(--b-text)_70%,transparent)]">{label}</span>
        )}
      </label>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
