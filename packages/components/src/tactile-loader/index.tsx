"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

/**
 * TactileLoader — three bouncing dots that announce themselves once.
 *
 * The dots are decorative; the label is what a screen reader hears, so the
 * component carries role="status" and a visually hidden copy of the label.
 */
export type TactileLoaderProps = {
  label?: string;
  className?: string;
};

export function TactileLoader({ label = "Loading", className }: TactileLoaderProps) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)} role="status">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden
          className="h-2 w-2 rounded-full bg-[color:var(--b-accent)] animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default TactileLoader;
