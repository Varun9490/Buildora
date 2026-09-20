"use client";

import * as React from "react";
import { cn, clamp } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type SliderProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "defaultValue"> & {
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  onChange?: (value: number) => void;
  defaultValue?: number;
};

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({
    className,
    min = 0,
    max = 100,
    step = 1,
    value,
    defaultValue = 0,
    showValue = false,
    formatValue,
    onChange,
    disabled,
    ...props
  }, ref) => {
    const reducedMotion = useReducedMotion();
    const [internalValue, setInternalValue] = React.useState<number>(defaultValue);
    const currentValue = value !== undefined ? Number(value) : internalValue;
    const percentage = ((clamp(currentValue, min, max) - min) / (max - min)) * 100;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value);
      setInternalValue(newValue);
      onChange?.(newValue);
    };

    return (
      <div className={cn("w-full", className)}>
        <div className="relative w-full h-2 flex items-center">
          <div className="absolute inset-0 rounded-full bg-white/10 border border-white/5" />
          <div
            className={cn(
              "absolute left-0 top-0 h-full rounded-full bg-[#d4ff4f]/30 transition-all",
              !reducedMotion && "duration-100"
            )}
            style={{ width: `${percentage}%` }}
          />
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={currentValue}
            onChange={handleChange}
            disabled={disabled}
            className={cn(
              "absolute inset-0 w-full h-full opacity-0 cursor-pointer",
              disabled && "cursor-not-allowed opacity-50"
            )}
            {...props}
          />
          <div
            className={cn(
              "absolute w-4 h-4 rounded-full bg-[--b-accent] shadow-lg shadow-[#d4ff4f]/30 transition-all pointer-events-none",
              !reducedMotion && "duration-100",
              disabled && "opacity-50"
            )}
            style={{
              left: `calc(${percentage}% - 8px)`,
            }}
          />
        </div>
        {showValue && (
          <div className="mt-2 flex justify-between text-xs text-white/50">
            <span>{formatValue ? formatValue(min) : min}</span>
            <span className="text-[--b-accent] font-medium">
              {formatValue ? formatValue(currentValue) : currentValue}
            </span>
            <span>{formatValue ? formatValue(max) : max}</span>
          </div>
        )}
      </div>
    );
  }
);

Slider.displayName = "Slider";

export { Slider };
