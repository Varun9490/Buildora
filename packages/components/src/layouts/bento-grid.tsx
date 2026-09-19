"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type BentoGridProps = React.HTMLAttributes<HTMLDivElement> & {
  columns?: number;
  gap?: number;
  autoFill?: boolean;
};

export type BentoItemProps = React.HTMLAttributes<HTMLDivElement> & {
  rowSpan?: number;
  colSpan?: number;
};

const BentoItemContext = React.createContext<{ rowSpan?: number; colSpan?: number }>({});

function BentoGrid({
  columns = 4,
  gap = 16,
  autoFill = false,
  className,
  children,
  ...rest
}: BentoGridProps) {
  return (
    <div
      className={cn("grid", className)}
      style={{
        gridTemplateColumns: autoFill
          ? `repeat(auto-fill, minmax(280px, 1fr))`
          : `repeat(${columns}, minmax(0, 1fr))`,
        gap: `${gap}px`,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

function BentoItem({ rowSpan = 1, colSpan = 1, className, children, ...rest }: BentoItemProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-[#12141d] p-6",
        "transition-all duration-200 hover:border-white/20 hover:shadow-xl",
        className
      )}
      style={{
        gridRow: `span ${rowSpan}`,
        gridColumn: `span ${colSpan}`,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

BentoGrid.displayName = "BentoGrid";
BentoItem.displayName = "BentoGrid.Item";

export { BentoGrid, BentoItem };
