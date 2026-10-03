"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export interface TUILogEntry {
  timestamp?: string;
  level?: "debug" | "info" | "warn" | "error" | "success";
  message: string;
  source?: string;
}

export interface TUILogViewerProps {
  entries: TUILogEntry[];
  maxLines?: number;
  autoScroll?: boolean;
  showTimestamps?: boolean;
  showLevel?: boolean;
  className?: string;
  filter?: string;
}

const levelColors = {
  debug: "text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]",
  info: "text-[color:var(--b-accent)]",
  warn: "text-[color:var(--b-warning)]",
  error: "text-[color:var(--b-danger)]",
  success: "text-[color:var(--b-success)]",
};

const levelLabels = {
  debug: "DBG",
  info: "INF",
  warn: "WRN",
  error: "ERR",
  success: "SUC",
};

export function TUILogViewer({
  entries,
  maxLines = 100,
  autoScroll = true,
  showTimestamps = true,
  showLevel = true,
  className,
  filter,
}: TUILogViewerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [following, setFollowing] = React.useState(autoScroll);

  const filteredEntries = React.useMemo(() => {
    let result = entries.slice(-maxLines);
    if (filter) {
      const re = new RegExp(filter, "i");
      result = result.filter(
        (e) =>
          re.test(e.message) ||
          (e.source && re.test(e.source)) ||
          (e.level && re.test(e.level))
      );
    }
    return result;
  }, [entries, maxLines, filter]);

  React.useEffect(() => {
    if (following && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [filteredEntries, following]);

  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 10;
    setFollowing(isAtBottom);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "font-mono text-xs bg-[var(--b-bg)] overflow-auto",
        className
      )}
      role="log"
      aria-label="Log viewer"
      onScroll={handleScroll}
    >
      <div className="p-2">
        {filteredEntries.length === 0 ? (
          <div className="text-[color-mix(in_oklab,var(--b-text)_30%,transparent)] text-center py-4">No log entries</div>
        ) : (
          filteredEntries.map((entry, i) => (
            <div
              key={i}
              className={cn(
                "flex items-start gap-2 py-0.5 border-b border-[color-mix(in_oklab,var(--b-border)_5%,transparent)] last:border-0",
                entry.level === "error" && "bg-[color:var(--b-danger)]/5",
                entry.level === "warn" && "bg-[color:var(--b-warning)]/5"
              )}
            >
              {showTimestamps && entry.timestamp && (
                <span className="text-[color-mix(in_oklab,var(--b-text)_30%,transparent)] shrink-0">{entry.timestamp}</span>
              )}
              {showLevel && entry.level && (
                <span className={cn("shrink-0 font-medium", levelColors[entry.level])}>
                  [{levelLabels[entry.level]}]
                </span>
              )}
              {entry.source && (
                <span className="text-[color:var(--b-accent)]/60 shrink-0">[{entry.source}]</span>
              )}
              <span className={cn("break-all", levelColors[entry.level || "info"])}>
                {entry.message}
              </span>
            </div>
          ))
        )}
      </div>
      {!following && (
        <div className="sticky bottom-0 left-0 right-0 bg-[color:var(--b-accent)]/10 border-t border-[color:var(--b-accent)]/20 px-2 py-0.5 text-[color:var(--b-accent)] text-[10px] text-center cursor-pointer">
          ⮕ New logs (click to follow)
        </div>
      )}
    </div>
  );
}
