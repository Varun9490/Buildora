"use client";

import * as React from "react";
import { cn } from "../../utils";

export type SeparatorProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
};

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => {
    const semanticProps = decorative
      ? { role: "none" as const }
      : { role: "separator" as const, "aria-orientation": orientation };

    return (
      <div
        ref={ref}
        {...semanticProps}
        className={cn(
          "shrink-0 bg-white/10 border-0",
          orientation === "horizontal" ? "h-px w-full" : "w-px h-full",
          className
        )}
        {...props}
      />
    );
  }
);

Separator.displayName = "Separator";

export type DividerProps = React.HTMLAttributes<HTMLDivElement> & {
  label?: string;
};

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, label, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="separator"
        className={cn("flex items-center gap-4", className)}
        {...props}
      >
        <div className="flex-1 h-px bg-white/10" />
        {(label || children) && (
          <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
            {label || children}
          </span>
        )}
        <div className="flex-1 h-px bg-white/10" />
      </div>
    );
  }
);

Divider.displayName = "Divider";

export { Separator, Divider };
