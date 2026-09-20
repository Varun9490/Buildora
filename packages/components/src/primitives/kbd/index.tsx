"use client";

import * as React from "react";
import { cn } from "../utils";

export type KbdSize = "default" | "sm" | "lg";

export type KbdProps = React.HTMLAttributes<HTMLElement> & {
  size?: KbdSize;
};

const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, size = "default", children, ...props }, ref) => {
    const sizeStyles: Record<KbdSize, string> = {
      default: "h-6 min-w-6 px-2 text-xs",
      sm: "h-5 min-w-5 px-1.5 text-[10px]",
      lg: "h-7 min-w-7 px-2.5 text-sm",
    };

    return (
      <kbd
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-mono font-medium",
          "bg-white/5 text-white/70 border border-white/10",
          "shadow-[0_2px_0_0_rgba(255,255,255,0.05)]",
          sizeStyles[size],
          "mx-0.5 first:ml-0 last:mr-0",
          className
        )}
        {...props}
      >
        {children}
      </kbd>
    );
  }
);

Kbd.displayName = "Kbd";

export type KbdShortcutProps = React.HTMLAttributes<HTMLDivElement> & {
  keys: string[];
  size?: KbdSize;
};

const KbdShortcut = React.forwardRef<HTMLDivElement, KbdShortcutProps>(
  ({ className, keys, size = "default", ...props }, ref) => {
    return (
      <div ref={ref} className={cn("inline-flex items-center", className)} {...props}>
        {keys.map((key, index) => (
          <React.Fragment key={index}>
            <Kbd size={size}>{key}</Kbd>
            {index < keys.length - 1 && (
              <span className="mx-0.5 text-white/30">+</span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }
);

KbdShortcut.displayName = "KbdShortcut";

export { Kbd, KbdShortcut };
