"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export interface TUIListItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
}

export interface TUIListProps {
  items: TUIListItem[];
  selectedId?: string;
  onSelect?: (item: TUIListItem) => void;
  onDoubleClick?: (item: TUIListItem) => void;
  className?: string;
  focusable?: boolean;
  showShortcuts?: boolean;
}

export function TUIList({
  items,
  selectedId,
  onSelect,
  onDoubleClick,
  className,
  focusable = true,
  showShortcuts = true,
}: TUIListProps) {
  const [focused, setFocused] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);

  React.useEffect(() => {
    if (selectedId) {
      const idx = items.findIndex((i) => i.id === selectedId);
      if (idx >= 0) setFocusedIndex(idx);
    }
  }, [selectedId, items]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((i) => {
        const next = Math.min(i + 1, items.length - 1);
        while (next < items.length && items[next].disabled) {
          return next;
        }
        return next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      const item = items[focusedIndex];
      if (!item.disabled) onSelect?.(item);
    }
  };

  return (
    <div
      className={cn("font-mono text-xs bg-[#0a0c10] overflow-auto", className)}
      role="listbox"
      tabIndex={focusable ? 0 : -1}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onKeyDown={handleKeyDown}
    >
      {items.map((item, i) => (
        <div
          key={item.id}
          className={cn(
            "flex items-center justify-between px-3 py-2 cursor-pointer border-b border-[color-mix(in_oklab,var(--b-border)_5%,transparent)]",
            item.disabled
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)]",
            selectedId === item.id && "bg-cyan-500/10",
            focused && focusedIndex === i && "bg-cyan-500/5"
          )}
          onClick={() => !item.disabled && onSelect?.(item)}
          onDoubleClick={() => !item.disabled && onDoubleClick?.(item)}
          role="option"
          aria-selected={selectedId === item.id}
          aria-disabled={item.disabled}
        >
          <div className="flex items-center gap-2 min-w-0">
            {item.icon && <span className="text-[color-mix(in_oklab,var(--b-text)_50%,transparent)]">{item.icon}</span>}
            <div className="min-w-0">
              <div className={cn("truncate", selectedId === item.id ? "text-cyan-400" : "text-[color-mix(in_oklab,var(--b-text)_80%,transparent)]")}>
                {item.label}
              </div>
              {item.description && (
                <div className="text-[10px] text-[color-mix(in_oklab,var(--b-text)_40%,transparent)] truncate">
                  {item.description}
                </div>
              )}
            </div>
          </div>
          {showShortcuts && item.shortcut && (
            <kbd className="px-1.5 py-0.5 bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)] border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] rounded text-[color-mix(in_oklab,var(--b-text)_50%,transparent)] text-[10px]">
              {item.shortcut}
            </kbd>
          )}
        </div>
      ))}
    </div>
  );
}
