"use client";

import * as React from "react";
import { cn } from "../utils";

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
  debug: "text-white/40",
  info: "text-cyan-400",
  warn: "text-yellow-400",
  error: "text-red-400",
  success: "text-green-400",
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
        "font-mono text-xs bg-[#0a0c10] overflow-auto",
        className
      )}
      role="log"
      aria-label="Log viewer"
      onScroll={handleScroll}
    >
      <div className="p-2">
        {filteredEntries.length === 0 ? (
          <div className="text-white/30 text-center py-4">No log entries</div>
        ) : (
          filteredEntries.map((entry, i) => (
            <div
              key={i}
              className={cn(
                "flex items-start gap-2 py-0.5 border-b border-white/5 last:border-0",
                entry.level === "error" && "bg-red-500/5",
                entry.level === "warn" && "bg-yellow-500/5"
              )}
            >
              {showTimestamps && entry.timestamp && (
                <span className="text-white/30 shrink-0">{entry.timestamp}</span>
              )}
              {showLevel && entry.level && (
                <span className={cn("shrink-0 font-medium", levelColors[entry.level])}>
                  [{levelLabels[entry.level]}]
                </span>
              )}
              {entry.source && (
                <span className="text-cyan-400/60 shrink-0">[{entry.source}]</span>
              )}
              <span className={cn("break-all", levelColors[entry.level || "info"])}>
                {entry.message}
              </span>
            </div>
          ))
        )}
      </div>
      {!following && (
        <div className="sticky bottom-0 left-0 right-0 bg-cyan-500/10 border-t border-cyan-500/20 px-2 py-0.5 text-cyan-400 text-[10px] text-center cursor-pointer">
          ⮕ New logs (click to follow)
        </div>
      )}
    </div>
  );
}
