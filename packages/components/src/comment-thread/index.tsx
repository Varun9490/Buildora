"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export interface Comment {
  id: string;
  author: string;
  body: string;
  time: string;
  resolved?: boolean;
}

export interface CommentThreadProps {
  threads: Comment[];
  onResolve?: (id: string) => void;
  onReply?: (id: string) => void;
  className?: string;
}

function CommentThread({ threads, onResolve, onReply, className }: CommentThreadProps) {
  const [focusedId, setFocusedId] = React.useState<string | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentIndex = threads.findIndex((t) => t.id === focusedId);
    if (e.key === "ArrowDown" && currentIndex < threads.length - 1) {
      e.preventDefault();
      setFocusedId(threads[currentIndex + 1].id);
    } else if (e.key === "ArrowUp" && currentIndex > 0) {
      e.preventDefault();
      setFocusedId(threads[currentIndex - 1].id);
    } else if (e.key === "Enter" && focusedId) {
      e.preventDefault();
      if (e.shiftKey) {
        onResolve?.(focusedId);
      } else {
        onReply?.(focusedId);
      }
    }
  };

  const handleResolveToggle = (id: string, resolved: boolean) => {
    onResolve?.(id);
  };

  return (
    <article
      className={cn(
        "rounded-xl border border-[color:var(--b-border)] bg-[color:var(--b-surface)] p-4",
        className
      )}
      aria-label="Comment thread"
    >
      <ul className="space-y-3" role="list" onKeyDown={handleKeyDown}>
        {threads.map((comment) => (
          <li
            key={comment.id}
            className={cn(
              "rounded-lg p-3 transition-colors",
              focusedId === comment.id && "bg-[color-mix(in_oklab,var(--b-accent)_8%,transparent)]",
              comment.resolved && "opacity-60"
            )}
            tabIndex={0}
            onFocus={() => setFocusedId(comment.id)}
            onBlur={() => setFocusedId(null)}
            role="article"
            aria-label={`Comment by ${comment.author}`}
          >
            <header className="mb-2 flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)] text-xs font-semibold text-[color-mix(in_oklab,var(--b-text)_80%,transparent)]"
                aria-hidden="true"
              >
                {comment.author
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[color:var(--b-text)]">{comment.author}</span>
                <time className="text-xs text-[color:var(--b-text-secondary)]" dateTime={comment.time}>
                  {comment.time}
                </time>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => handleResolveToggle(comment.id, comment.resolved ?? false)}
                  aria-pressed={comment.resolved ?? false}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-mono font-medium transition-all",
                    comment.resolved
                      ? "border-[color-mix(in_oklab,var(--b-success)_25%,transparent)] bg-[color-mix(in_oklab,var(--b-success)_10%,transparent)] text-[color:var(--b-success)]"
                      : "border-[color:var(--b-border)] bg-transparent text-[color:var(--b-text-secondary)] hover:bg-[color:var(--b-elevated)]"
                  )}
                >
                  {comment.resolved ? "Resolved" : "Resolve"}
                </button>
                {onReply && !comment.resolved && (
                  <button
                    onClick={() => onReply(comment.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-mono font-medium transition-all",
                      "border-[color-mix(in_oklab,var(--b-accent)_20%,transparent)] bg-[color:var(--b-accent-muted)] text-[color:var(--b-accent)]",
                      "hover:bg-[color-mix(in_oklab,var(--b-accent)_15%,transparent)]"
                    )}
                  >
                    Reply
                  </button>
                )}
              </div>
            </header>
            <p className="text-sm text-[color-mix(in_oklab,var(--b-text)_85%,transparent)]">{comment.body}</p>
          </li>
        ))}
      </ul>
    </article>
  );
}

CommentThread.displayName = "CommentThread";

export { CommentThread };
