"use client";

import * as React from "react";
import { cn } from "../utils";

export interface TUISelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
}

export interface TUISelectProps {
  options: TUISelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  searchable?: boolean;
}

export function TUISelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
  disabled = false,
  searchable = false,
}: TUISelectProps) {
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

  const selectedOption = options.find((o) => o.value === value);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = filteredOptions[focusedIndex];
      if (opt && !opt.disabled) {
        onChange?.(opt.value);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative font-mono text-xs", className)}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      role="combobox"
      aria-expanded={open}
      aria-disabled={disabled}
    >
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-2 py-1.5 border rounded bg-[#0a0c10] text-left",
          open ? "border-cyan-500/50" : "border-white/10",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span className={selectedOption ? "text-white/80" : "text-white/40"}>
          {selectedOption ? (
            <span className="flex items-center gap-1">
              {selectedOption.icon && <span>{selectedOption.icon}</span>}
              {selectedOption.label}
            </span>
          ) : (
            placeholder
          )}
        </span>
        <span className="text-white/40">▼</span>
      </button>
      {open && (
        <div
          className="absolute z-50 w-full mt-1 bg-[#0a0c10] border border-white/10 rounded shadow-lg overflow-hidden"
          role="listbox"
        >
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
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-white/40">No options</div>
            ) : (
              filteredOptions.map((opt, i) => (
                <div
                  key={opt.value}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 cursor-pointer",
                    opt.disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-white/5",
                    focusedIndex === i && "bg-cyan-500/10",
                    value === opt.value && "text-cyan-400"
                  )}
                  onClick={() => {
                    if (!opt.disabled) {
                      onChange?.(opt.value);
                      setOpen(false);
                    }
                  }}
                  role="option"
                  aria-selected={value === opt.value}
                >
                  {opt.icon && <span className="text-white/50">{opt.icon}</span>}
                  <div className="min-w-0">
                    <div className="truncate">{opt.label}</div>
                    {opt.description && (
                      <div className="text-[10px] text-white/40 truncate">
                        {opt.description}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
