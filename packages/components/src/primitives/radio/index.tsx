"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion } from "motion/react";

export type RadioProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & { label?: string };

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, disabled, checked, onChange, value, ...props }, ref) => {
    const reduced = useReducedMotion();
    const id = React.useId();
    return (
      <label htmlFor={id} className={cn("inline-flex items-center gap-3 cursor-pointer select-none group/radio", disabled && "cursor-not-allowed opacity-50")}>
        <div className="relative">
          <input ref={ref} id={id} type="radio" disabled={disabled} checked={!!checked} onChange={onChange} value={value} className="sr-only peer" {...props} />
          <div className={cn("h-5 w-5 rounded-full border flex items-center justify-center transition-colors", checked ? "border-[color:var(--b-accent)] bg-[color:var(--b-accent)]/10 shadow-[0_0_10px_var(--b-accent-glow)]" : "border-[color-mix(in_oklab,var(--b-border)_18%,transparent)] bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)] group-hover/radio:border-[color:var(--b-border-hover)]", "peer-focus-visible:ring-2 peer-focus-visible:ring-[color:var(--b-accent)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[color:var(--b-bg)]", className)}>
            <motion.div className="h-2.5 w-2.5 rounded-full bg-[color:var(--b-accent)]" initial={false} animate={checked ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 24 }} />
          </div>
        </div>
        {label && <span className="text-sm text-[color:var(--b-text-secondary)] group-hover/radio:text-[color:var(--b-text)] transition-colors">{label}</span>}
      </label>
    );
  }
);
Radio.displayName = "Radio";

export type RadioGroupProps = React.HTMLAttributes<HTMLDivElement> & { value?: string; defaultValue?: string; onValueChange?: (value: string) => void; name?: string; disabled?: boolean };

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, defaultValue, onValueChange, name, disabled, children, ...props }, ref) => {
    const isControlled = value !== undefined;
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue || "");
    const selected = isControlled ? value! : uncontrolled;
    const handleChange = (v: string) => { if (!isControlled) setUncontrolled(v); onValueChange?.(v); };
    return (
      <div ref={ref} role="radiogroup" className={cn("flex flex-col gap-2.5", className)} {...props}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement<RadioProps>(child) && child.type === Radio) {
            const childValue = child.props.value as string;
            return React.cloneElement(child, { checked: childValue === selected, onChange: () => handleChange(childValue), name: name || (child.props as RadioProps).name, disabled: disabled || (child.props as RadioProps).disabled } as RadioProps);
          }
          return child;
        })}
      </div>
    );
  }
);
RadioGroup.displayName = "RadioGroup";
export { Radio, RadioGroup };
