"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export interface TUIFooterProps {
  shortcuts?: Array<{ key: string; label: string }>;
  message?: { text: string; type?: "info" | "success" | "warning" | "error" };
  className?: string;
}

const messageColors = {
  info: "text-cyan-400",
  success: "text-green-400",
  warning: "text-yellow-400",
  error: "text-red-400",
};

export function TUIFooter({ shortcuts, message, className }: TUIFooterProps) {
  return (
    <footer
      className={cn(
        "flex items-center justify-between px-3 py-1.5 bg-[#0a0c10] border-t border-white/10 font-mono text-[11px]",
        className
      )}
      role="contentinfo"
    >
      <div className="flex items-center gap-4">
        {shortcuts?.map((s, i) => (
          <span key={i} className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-white/70">
              {s.key}
            </kbd>
            <span className="text-white/40">{s.label}</span>
          </span>
        ))}
      </div>
      {message && (
        <span className={messageColors[message.type || "info"]}>
          {message.text}
        </span>
      )}
    </footer>
  );
}
