"use client";

import * as React from "react";
import { cn } from "../../utils";

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

const inputVariantStyles: Record<InputVariant, string> = {
  default:
    "bg-[--b-panel] border border-[--b-border] hover:border-[--b-border-hover] focus:border-[--b-accent]",
  filled:
    "bg-[--b-surface] border border-transparent hover:bg-[--b-elevated] focus:bg-[--b-panel] focus:border-[--b-accent]",
  ghost: "bg-transparent border border-transparent hover:bg-[--b-surface] focus:bg-[--b-surface]",
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
    const sizeStyles: Record<InputSize, string> = {
      default: "py-2.5 text-sm",
      sm: "py-2 text-xs",
      lg: "py-3 text-base",
    };

    return (
      <div className="w-full">
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[--b-muted]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              "block w-full rounded-[10px] px-4 text-[--b-text] outline-none transition-all duration-200",
              "placeholder:text-[--b-muted]",
              "focus:outline-none focus:ring-2 focus:ring-[--b-accent]/20",
              "disabled:cursor-not-allowed disabled:opacity-50",
              inputVariantStyles[variant],
              sizeStyles[inputSize],
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-[--b-danger]/60 focus:border-[--b-danger] focus:ring-[--b-danger]/15",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[--b-muted]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && errorMessage && (
          <p className="mt-1.5 text-xs text-[--b-danger]">{errorMessage}</p>
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
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={cn(
            "block w-full resize-none rounded-[10px] border px-4 py-3 text-sm text-[--b-text] outline-none transition-all duration-200",
            "placeholder:text-[--b-muted]",
            "focus:outline-none focus:ring-2 focus:ring-[--b-accent]/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            inputVariantStyles[variant],
            error && "border-[--b-danger]/60 focus:border-[--b-danger] focus:ring-[--b-danger]/15",
            className
          )}
          {...props}
        />
        {error && errorMessage && (
          <p className="mt-1.5 text-xs text-[--b-danger]">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Input, Textarea };
