"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  indeterminate?: boolean;
};

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, disabled, checked, indeterminate, onChange, ...props }, ref) => {
    const reducedMotion = useReducedMotion();
    const id = React.useId();
    const innerRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current!);

    React.useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = indeterminate || false;
      }
    }, [indeterminate]);

    return (
      <label
        htmlFor={id}
        className={cn(
          "inline-flex items-center gap-3 cursor-pointer select-none",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <div className="relative">
          <input
            ref={innerRef}
            id={id}
            type="checkbox"
            disabled={disabled}
            checked={checked}
            onChange={onChange}
            className="sr-only peer"
            aria-checked={indeterminate ? "mixed" : checked}
            {...props}
          />
          <div
            className={cn(
              "h-5 w-5 rounded-md border border-[color-mix(in_oklab,var(--b-border)_20%,transparent)] bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)] transition-all",
              !reducedMotion && "duration-200",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-[color-mix(in_oklab,var(--b-accent)_50%,transparent)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#08090d]",
              "peer-checked:bg-[color:var(--b-accent)] peer-checked:border-[color:var(--b-accent)] peer-checked:bg-opacity-100",
              className
            )}
          >
            <svg
              className={cn(
                "h-full w-full text-black opacity-0 scale-50 transition-transform",
                !reducedMotion && "duration-200",
                (checked || indeterminate) && "opacity-100 scale-100"
              )}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {indeterminate ? (
                <line x1="5" y1="12" x2="19" y2="12" />
              ) : (
                <polyline points="20 6 9 17 4 12" />
              )}
            </svg>
          </div>
        </div>
        {label && (
          <span className="text-sm text-[color-mix(in_oklab,var(--b-text)_70%,transparent)]">{label}</span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
