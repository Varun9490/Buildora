"use client";

import * as React from "react";
import { cn } from "../utils";

export interface TUIDiffHunk {
  type: "add" | "delete" | "context" | "header";
  oldLine?: number;
  newLine?: number;
  content: string;
}

export interface TUIDiffViewerProps {
  hunks: TUIDiffHunk[];
  className?: string;
  showLineNumbers?: boolean;
  showUnified?: boolean;
  title?: { left?: string; right?: string };
}

export function TUIDiffViewer({
  hunks,
  className,
  showLineNumbers = true,
  showUnified = false,
  title,
}: TUIDiffViewerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((i) => Math.min(i + 1, hunks.length - 1));
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((i) => Math.max(i - 1, 0));
      }
    };
    containerRef.current?.addEventListener("keydown", handleKeyDown);
    return () => containerRef.current?.removeEventListener("keydown", handleKeyDown);
  }, [hunks.length]);

  const lineStyles = {
    add: "bg-green-500/10 text-green-400",
    delete: "bg-red-500/10 text-red-400",
    context: "text-white/70",
    header: "bg-cyan-500/10 text-cyan-400",
  };

  const linePrefixes = {
    add: "+",
    delete: "-",
    context: " ",
    header: "@",
  };

  if (showUnified) {
    return (
      <div
        ref={containerRef}
        className={cn(
          "font-mono text-xs bg-[#0a0c10] overflow-auto",
          className
        )}
        role="region"
        aria-label="Diff viewer"
        tabIndex={0}
      >
        {title && (
          <div className="flex border-b border-white/10">
            <div className="flex-1 px-2 py-1 text-white/50 text-[10px] truncate">
              {title.left || "Original"}
            </div>
          </div>
        )}
        {hunks.map((hunk, i) => (
          <div
            key={i}
            className={cn(
              "flex px-2 py-0.5",
              lineStyles[hunk.type],
              focusedIndex === i && "bg-white/5"
            )}
          >
            {showLineNumbers && hunk.type !== "header" && (
              <span className="w-8 text-right pr-2 text-white/30 shrink-0 select-none">
                {hunk.oldLine ?? hunk.newLine}
              </span>
            )}
            <span className={cn("w-4 shrink-0 select-none", lineStyles[hunk.type])}>
              {linePrefixes[hunk.type]}
            </span>
            <span className="whitespace-pre">{hunk.content}</span>
          </div>
        ))}
      </div>
    );
  }

  const leftHunks = hunks.filter((h) => h.type !== "add");
  const rightHunks = hunks.filter((h) => h.type !== "delete");

  return (
    <div
      ref={containerRef}
      className={cn(
        "font-mono text-xs bg-[#0a0c10] overflow-hidden",
        className
      )}
      role="region"
      aria-label="Diff viewer"
      tabIndex={0}
    >
      {title && (
        <div className="flex border-b border-white/10">
          <div className="flex-1 px-2 py-1 text-white/50 text-[10px] truncate border-r border-white/10">
            {title.left || "Original"}
          </div>
          <div className="flex-1 px-2 py-1 text-white/50 text-[10px] truncate">
            {title.right || "Modified"}
          </div>
        </div>
      )}
      <div className="flex">
        <div className="flex-1 border-r border-white/10 overflow-auto">
          {leftHunks.map((hunk, i) => (
            <div
              key={`left-${i}`}
              className={cn(
                "flex px-1 py-0.5 min-h-[1.25rem]",
                lineStyles[hunk.type],
                hunk.type === "delete" && "bg-red-500/20"
              )}
            >
              {showLineNumbers && hunk.type !== "header" && (
                <span className="w-8 text-right pr-1 text-white/30 shrink-0 select-none">
                  {hunk.oldLine ?? ""}
                </span>
              )}
              <span className={cn("w-4 shrink-0 select-none", lineStyles[hunk.type])}>
                {hunk.type === "delete" ? "-" : " "}
              </span>
              <span className="whitespace-pre truncate">{hunk.content}</span>
            </div>
          ))}
        </div>
        <div className="flex-1 overflow-auto">
          {rightHunks.map((hunk, i) => (
            <div
              key={`right-${i}`}
              className={cn(
                "flex px-1 py-0.5 min-h-[1.25rem]",
                lineStyles[hunk.type],
                hunk.type === "add" && "bg-green-500/20"
              )}
            >
              {showLineNumbers && hunk.type !== "header" && (
                <span className="w-8 text-right pr-1 text-white/30 shrink-0 select-none">
                  {hunk.newLine ?? ""}
                </span>
              )}
              <span className={cn("w-4 shrink-0 select-none", lineStyles[hunk.type])}>
                {hunk.type === "add" ? "+" : " "}
              </span>
              <span className="whitespace-pre truncate">{hunk.content}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
