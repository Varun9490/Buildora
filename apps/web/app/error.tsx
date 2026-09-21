"use client";

import * as React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Buildora page error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-24 text-center">
      <p className="b-section-label">Something broke on our side</p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">This page failed to render</h1>
      <p className="mt-3 text-sm leading-relaxed text-[color:var(--b-text-secondary)]">
        The error was logged. Retrying usually fixes a transient render failure; if it persists, the page itself may have a bug worth reporting.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-[11px] text-[color:var(--b-muted)]">digest: {error.digest}</p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-[10px] bg-[color:var(--b-accent)] px-5 py-2.5 text-sm font-semibold text-[color:var(--b-accent-foreground)] transition-transform active:scale-[0.98]"
        >
          Retry
        </button>
        <a
          href="/components"
          className="rounded-[10px] border border-[color:var(--b-border)] px-5 py-2.5 text-sm font-medium text-[color:var(--b-text-secondary)] transition-colors hover:bg-[color:var(--b-surface)]"
        >
          Browse components
        </a>
      </div>
    </div>
  );
}
