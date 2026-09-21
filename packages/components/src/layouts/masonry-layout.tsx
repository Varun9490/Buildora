"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type MasonryLayoutProps = React.HTMLAttributes<HTMLDivElement> & {
  columns?: number;
  gap?: number;
};

export type MasonryItemProps = React.HTMLAttributes<HTMLDivElement>;

function MasonryLayout({
  columns = 3,
  gap = 16,
  className,
  children,
  ...rest
}: MasonryLayoutProps) {
  const [columnHeights, setColumnHeights] = React.useState<number[]>([]);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const childArray = React.Children.toArray(children);

  const distributedItems = React.useMemo(() => {
    if (childArray.length === 0) return [];

    const columnItems: Array<Array<{ child: React.ReactNode; index: number }>> = 
      Array.from({ length: columns }, () => []);
    
    const columnHeights = new Array(columns).fill(0);

    childArray.forEach((child, index) => {
      const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
      columnItems[shortestColumn].push({ child, index });
      columnHeights[shortestColumn] += 100;
    });

    return columnItems;
  }, [childArray, columns]);

  return (
    <div
      ref={containerRef}
      className={cn("flex", className)}
      style={{ gap: `${gap}px` }}
      {...rest}
    >
      {distributedItems.map((columnItems, colIndex) => (
        <div
          key={colIndex}
          className="flex flex-1 flex-col"
          style={{ gap: `${gap}px` }}
        >
          {columnItems.map(({ child, index }) => (
            <React.Fragment key={index}>{child}</React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}

function MasonryItem({ className, children, ...rest }: MasonryItemProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[#12141d] p-4",
        "transition-all duration-200 hover:border-[color-mix(in_oklab,var(--b-border)_20%,transparent)]",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

MasonryLayout.displayName = "MasonryLayout";
MasonryItem.displayName = "MasonryLayout.Item";

export { MasonryLayout, MasonryItem };
