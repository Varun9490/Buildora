"use client";

import * as React from "react";
import { cn } from "../utils";

export interface TUIMultiSelectOption {
  value: string;
  label: string;
  description?: string;
  group?: string;
  disabled?: boolean;
}

export interface TUIMultiSelectProps {
  options: TUIMultiSelectOption[];
  selected: string[];
  onChange?: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  maxVisible?: number;
  searchable?: boolean;
}

export function TUIMultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  className,
  maxVisible = 3,
  searchable = false,
}: TUIMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const filteredOptions = searchable
    ? options.filter(
        (o) =>
          o.label.toLowerCase().includes(search.toLowerCase()) ||
          o.value.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  const groups = React.useMemo(() => {
    const g = new Map<string, TUIMultiSelectOption[]>();
    filteredOptions.forEach((o) => {
      const group = o.group || "";
      if (!g.has(group)) g.set(group, []);
      g.get(group)!.push(o);
    });
    return g;
  }, [filteredOptions]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = (value: string, disabled: boolean) => {
    if (disabled) return;
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    onChange?.(newSelected);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((i) => Math.min(i + 1, filteredOptions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const opt = filteredOptions[focusedIndex];
      if (opt && !opt.disabled) {
        toggle(opt.value, false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const displayText =
    selected.length === 0
      ? placeholder
      : selected.length <= maxVisible
        ? selected
            .map((v) => options.find((o) => o.value === v)?.label)
            .filter(Boolean)
            .join(", ")
        : `${selected.length} items selected`;

  return (
    <div
      ref={containerRef}
      className={cn("relative font-mono text-xs", className)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 px-2 py-1.5 border border-white/10 rounded bg-[#0a0c10] text-left hover:border-white/20"
      >
        <span className={selected.length > 0 ? "text-white/80" : "text-white/40"}>
          {displayText}
        </span>
        <span className="text-white/40">☐ {open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-[#0a0c10] border border-white/10 rounded shadow-lg overflow-hidden">
          {searchable && (
            <div className="border-b border-white/10 p-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full px-2 py-1 bg-white/5 border border-white/10 rounded text-white/80 outline-none placeholder:text-white/30"
                autoFocus
              />
            </div>
          )}
          <div className="max-h-48 overflow-auto">
            {Array.from(groups.entries()).map(([group, items]) => (
              <div key={group}>
                {group && (
                  <div className="px-3 py-1 text-[10px] text-white/40 uppercase tracking-wider bg-white/[0.02]">
                    {group}
                  </div>
                )}
                {items.map((opt, i) => {
                  const globalIndex = filteredOptions.indexOf(opt);
                  const isSelected = selected.includes(opt.value);
                  return (
                    <div
                      key={opt.value}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 cursor-pointer",
                        opt.disabled
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:bg-white/5",
                        focusedIndex === globalIndex && "bg-cyan-500/10"
                      )}
                      onClick={() => toggle(opt.value, opt.disabled || false)}
                    >
                      <span
                        className={cn(
                          "w-3.5 h-3.5 border rounded flex items-center justify-center text-[10px]",
                          isSelected
                            ? "bg-cyan-500 border-cyan-500 text-white"
                            : "border-white/20"
                        )}
                      >
                        {isSelected && "✓"}
                      </span>
                      <div className="min-w-0">
                        <div className={cn("truncate", isSelected && "text-cyan-400")}>
                          {opt.label}
                        </div>
                        {opt.description && (
                          <div className="text-[10px] text-white/40 truncate">
                            {opt.description}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          {selected.length > 0 && (
            <div className="border-t border-white/10 px-3 py-1.5 text-[10px] text-white/40">
              {selected.length} selected
            </div>
          )}
        </div>
      )}
    </div>
  );
}
