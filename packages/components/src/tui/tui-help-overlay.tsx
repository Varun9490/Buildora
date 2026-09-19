"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export interface TUIKeyBinding {
  key: string;
  label: string;
  description?: string;
}

export interface TUIHelpOverlayProps {
  bindings: TUIKeyBinding[];
  visible?: boolean;
  onClose?: () => void;
  title?: string;
  columns?: number;
  className?: string;
}

export function TUIHelpOverlay({
  bindings,
  visible = true,
  onClose,
  title = "Keyboard Shortcuts",
  columns = 2,
  className,
}: TUIHelpOverlayProps) {
  React.useEffect(() => {
    if (visible) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" || e.key === "?") {
          onClose?.();
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  const columnBindings = React.useMemo(() => {
    const perColumn = Math.ceil(bindings.length / columns);
    const cols: TUIKeyBinding[][] = [];
    for (let i = 0; i < columns; i++) {
      cols.push(bindings.slice(i * perColumn, (i + 1) * perColumn));
    }
    return cols;
  }, [bindings, columns]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/80",
        className
      )}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="bg-[#0a0c10] border border-white/20 rounded-lg shadow-2xl max-w-2xl w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h2 className="font-mono text-sm text-white/90">{title}</h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/80 text-xs"
            aria-label="Close"
          >
            ✕ Esc
          </button>
        </div>
        <div className={cn("grid gap-4 p-4", `grid-cols-${columns}`)}>
          {columnBindings.map((col, i) => (
            <div key={i} className="space-y-1">
              {col.map((binding, j) => (
                <div
                  key={j}
                  className="flex items-center justify-between gap-4 px-2 py-1.5 rounded hover:bg-white/5"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <kbd className="px-2 py-1 bg-white/5 border border-white/20 rounded font-mono text-[11px] text-cyan-400 min-w-[3rem] text-center">
                      {binding.key}
                    </kbd>
                    <span className="text-white/70 text-xs truncate">
                      {binding.label}
                    </span>
                  </div>
                  {binding.description && (
                    <span className="text-white/40 text-[10px] truncate">
                      {binding.description}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="px-4 py-2 border-t border-white/10 text-center">
          <span className="text-white/30 text-[10px]">
            Press <kbd className="px-1 bg-white/5 border border-white/10 rounded text-white/50">?</kbd> to toggle
          </span>
        </div>
      </div>
    </div>
  );
}
