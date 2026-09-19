"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type InputVariant = "default" | "filled" | "ghost";
export type InputSize = "default" | "sm" | "lg";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  variant?: InputVariant;
  inputSize?: InputSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
  errorMessage?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = "default",
      inputSize = "default",
      leftIcon,
      rightIcon,
      error,
      errorMessage,
      type = "text",
      ...props
    },
    ref
  ) => {
    const variantStyles: Record<InputVariant, string> = {
      default:
        "bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-[#d4ff4f]/50",
      filled:
        "bg-white/[0.08] border border-transparent hover:bg-white/[0.1] focus:bg-white/[0.1] focus:border-[#d4ff4f]/50",
      ghost: "bg-transparent border border-transparent hover:bg-white/[0.03] focus:bg-white/[0.03]",
    };

    const sizeStyles: Record<InputSize, string> = {
      default: "py-2.5 text-sm",
      sm: "py-2 text-xs",
      lg: "py-3 text-base",
    };

    return (
      <div className="w-full">
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              "block w-full rounded-xl px-4 text-white outline-none transition-all duration-200",
              "placeholder:text-white/30",
              "focus:outline-none focus:ring-2 focus:ring-[#d4ff4f]/10",
              "disabled:cursor-not-allowed disabled:opacity-50",
              variantStyles[variant],
              sizeStyles[inputSize],
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/10",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
              {rightIcon}
            </div>
          )}
        </div>
        {error && errorMessage && (
          <p className="mt-1.5 text-xs text-red-400">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variant?: InputVariant;
  error?: boolean;
  errorMessage?: string;
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, variant = "default", error, errorMessage, ...props },
    ref
  ) => {
    const variantStyles: Record<InputVariant, string> = {
      default:
        "bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-[#d4ff4f]/50",
      filled:
        "bg-white/[0.08] border border-transparent hover:bg-white/[0.1] focus:bg-white/[0.1] focus:border-[#d4ff4f]/50",
      ghost: "bg-transparent border border-transparent hover:bg-white/[0.03] focus:bg-white/[0.03]",
    };

    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={cn(
            "block w-full resize-none rounded-xl border px-4 py-3 text-sm text-white outline-none transition-all duration-200",
            "placeholder:text-white/30",
            "focus:outline-none focus:ring-2 focus:ring-[#d4ff4f]/10",
            "disabled:cursor-not-allowed disabled:opacity-50",
            variantStyles[variant],
            error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/10",
            className
          )}
          {...props}
        />
        {error && errorMessage && (
          <p className="mt-1.5 text-xs text-red-400">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Input, Textarea };
