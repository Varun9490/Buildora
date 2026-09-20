"use client";

import * as React from "react";
import { cn, clamp } from "../../utils";
import { useReducedMotion } from "../../hooks/use-reduced-motion";
import { motion, useMotionValue, useTransform } from "framer-motion";

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
      <div className={cn("w-full max-w-sm", className)}>
        <div className="relative w-full h-3 flex items-center group">
          <div className="absolute inset-0 rounded-full bg-white/10 border border-white/5 transition-colors group-hover:bg-white/15" />
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full bg-[--b-accent]/40"
            animate={{ width: `${percentage}%` }}
            transition={{ type: "spring", bounce: 0, duration: 0.2 }}
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
              "absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10",
              disabled && "cursor-not-allowed opacity-50"
            )}
            {...props}
          />
          <motion.div
            className={cn(
              "absolute w-5 h-5 rounded-full bg-white shadow-xl shadow-[--b-accent]/30 border border-white/20 pointer-events-none z-0",
              disabled && "opacity-50"
            )}
            animate={{ left: `calc(${percentage}% - 10px)` }}
            transition={{ type: "spring", bounce: 0, duration: 0.2 }}
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
