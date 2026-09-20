"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type RadioProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
};

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, disabled, checked, onChange, value, ...props }, ref) => {
    const reducedMotion = useReducedMotion();
    const id = React.useId();

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
            ref={ref}
            id={id}
            type="radio"
            disabled={disabled}
            checked={checked}
            onChange={onChange}
            value={value}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              "h-5 w-5 rounded-full border border-white/20 bg-white/5 transition-all",
              !reducedMotion && "duration-200",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-[#d4ff4f]/50 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#08090d]",
              "peer-checked:border-[--b-accent] peer-checked:border-opacity-100",
              className
            )}
          >
            <div
              className={cn(
                "absolute inset-1 rounded-full bg-[--b-accent] transition-transform origin-center",
                !reducedMotion && "duration-200",
                checked ? "scale-100 opacity-100" : "scale-0 opacity-0"
              )}
            />
          </div>
        </div>
        {label && (
          <span className="text-sm text-white/70">{label}</span>
        )}
      </label>
    );
  }
);

Radio.displayName = "Radio";

export type RadioGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
};

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, defaultValue, onValueChange, name, disabled, children, ...props }, ref) => {
    const [selected, setSelected] = React.useState(value || defaultValue || "");

    React.useEffect(() => {
      if (value !== undefined) {
        setSelected(value);
      }
    }, [value]);

    const handleChange = (newValue: string) => {
      setSelected(newValue);
      onValueChange?.(newValue);
    };

    return (
      <div
        ref={ref}
        role="radiogroup"
        className={cn("flex flex-col gap-2", className)}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement<RadioProps>(child) && child.type === Radio) {
            const childValue = child.props.value;
            return React.cloneElement(child, {
              checked: childValue === selected,
              onChange: () => handleChange(childValue as string),
              name: name || child.props.name,
              disabled: disabled || child.props.disabled,
            } as RadioProps);
          }
          return child;
        })}
      </div>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

export { Radio, RadioGroup };
