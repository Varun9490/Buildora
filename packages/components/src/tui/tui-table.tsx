"use client";

import * as React from "react";
import { cn } from "../utils";

export interface TUITableColumn {
  key: string;
  header: string;
  width?: string | number;
  align?: "left" | "center" | "right";
  render?: (value: unknown, row: TUITableRow) => React.ReactNode;
}

export interface TUITableRow {
  id: string;
  [key: string]: unknown;
}

export interface TUITableProps {
  columns: TUITableColumn[];
  rows: TUITableRow[];
  selectedId?: string;
  onSelect?: (row: TUITableRow) => void;
  onDoubleClick?: (row: TUITableRow) => void;
  className?: string;
  dense?: boolean;
  showHeader?: boolean;
  zebra?: boolean;
}

export function TUITable({
  columns,
  rows,
  selectedId,
  onSelect,
  onDoubleClick,
  className,
  dense = false,
  showHeader = true,
  zebra = true,
}: TUITableProps) {
  const [focused, setFocused] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((i) => Math.min(i + 1, rows.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      onSelect?.(rows[focusedIndex]);
    }
  };

  return (
    <div
      className={cn(
        "font-mono text-xs overflow-auto bg-[#0a0c10]",
        className
      )}
      role="grid"
      tabIndex={0}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onKeyDown={handleKeyDown}
    >
      {showHeader && (
        <div
          className="flex items-center border-b border-white/10 bg-white/[0.02]"
          role="row"
        >
          {columns.map((col) => (
            <div
              key={col.key}
              className={cn(
                "px-2 py-1 text-[11px] text-white/50 uppercase tracking-wider",
                col.align === "center" && "text-center",
                col.align === "right" && "text-right"
              )}
              style={{ width: col.width }}
              role="columnheader"
            >
              {col.header}
            </div>
          ))}
        </div>
      )}
      <div role="rowgroup">
        {rows.map((row, rowIndex) => (
          <div
            key={row.id}
            className={cn(
              "flex items-center border-b border-white/5 cursor-pointer",
              dense ? "py-0.5" : "py-1",
              zebra && rowIndex % 2 === 1 && "bg-white/[0.015]",
              selectedId === row.id && "bg-cyan-500/10",
              focused && focusedIndex === rowIndex && "bg-cyan-500/5"
            )}
            onClick={() => onSelect?.(row)}
            onDoubleClick={() => onDoubleClick?.(row)}
            role="row"
            aria-selected={selectedId === row.id}
          >
            {columns.map((col) => (
              <div
                key={col.key}
                className={cn(
                  "px-2 truncate",
                  col.align === "center" && "text-center",
                  col.align === "right" && "text-right"
                )}
                style={{ width: col.width }}
                role="cell"
              >
                {col.render
                  ? col.render(row[col.key], row)
                  : String(row[col.key] ?? "")}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
