"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn, copyToClipboard } from "@buildora/utils";
import { CodeBlock } from "./CodeBlock";
import { installCommand } from "@/lib/design";
import { requestInspect } from "@/lib/inspect";

function ChromeButton({
  label,
  onClick,
  active,
  children,
}: {
  label: string;
  onClick?: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-lg text-[color:var(--b-muted)] transition-colors hover:bg-[color:color-mix(in_oklab,var(--b-text)_5%,transparent)] hover:text-[color:var(--b-text)]",
        active && "text-[color:var(--b-text)]"
      )}
    >
      {children}
    </button>
  );
}

export function BentoShell({
  span,
  category,
  title,
  slug,
  demo,
  code,
  stageClassName,
}: {
  span: "lg:col-span-6" | "lg:col-span-4";
  category: string;
  title: string;
  slug: string;
  demo: React.ReactNode;
  code: string;
  stageClassName?: string;
}) {
  const [view, setView] = React.useState<"preview" | "code">("preview");
  const [resetKey, setResetKey] = React.useState(0);
  const [copied, setCopied] = React.useState(false);
  const copyTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const cli = installCommand("pnpm", slug);

  React.useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    []
  );

  const copyCli = async () => {
    const ok = await copyToClipboard(cli);
    if (!ok) return;
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 160, damping: 26 }}
      className={cn("group relative flex flex-col", span)}
    >
      {/* ── Chrome: title + controls only ── */}
      <header className="mb-3 flex items-center justify-between gap-3 px-1">
        <div className="flex min-w-0 items-baseline gap-2.5">
          <h3 className="truncate text-[14px] font-medium tracking-tight text-[color:var(--b-text)]">
            {title}
          </h3>
          <span className="flex shrink-0 items-center gap-1.5 text-[11px] text-[color:var(--b-muted)]">
            <span className="h-1 w-1 rounded-full bg-[color:var(--b-muted)]" aria-hidden="true" />
            {category}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <div
            className="mr-1 flex rounded-lg border border-[color:var(--b-border)] p-0.5"
            role="group"
            aria-label={`${title} view`}
          >
            {(["preview", "code"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={cn(
                  "rounded-md px-2 py-[3px] text-[11px] transition-colors",
                  view === v
                    ? "bg-[color:color-mix(in_oklab,var(--b-text)_7%,transparent)] font-medium text-[color:var(--b-text)]"
                    : "text-[color:var(--b-muted)] hover:text-[color:var(--b-text-secondary)]"
                )}
              >
                {v === "preview" ? "Preview" : "Code"}
              </button>
            ))}
          </div>

          <ChromeButton
            label="Replay demo"
            onClick={() => {
              setView("preview");
              setResetKey((k) => k + 1);
            }}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 3-6.7" />
              <path d="M3 4v4h4" />
            </svg>
          </ChromeButton>

          <ChromeButton label={copied ? "CLI copied" : "Copy install command"} onClick={copyCli} active={copied}>
            {copied ? (
              <svg className="h-3.5 w-3.5 text-[color:var(--b-success)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="12" height="12" rx="2.5" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </ChromeButton>

          <ChromeButton label={`Open ${title} in the explorer`} onClick={() => requestInspect(slug)}>
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7" />
              <path d="M8 7h9v9" />
            </svg>
          </ChromeButton>
        </div>
      </header>

      {/* ── Stage: the only bordered surface ── */}
      <div
        className={cn(
          "relative flex-1 overflow-hidden rounded-2xl border border-[color:var(--b-border)] bg-[color:var(--b-panel)]",
          stageClassName ?? "min-h-[340px]"
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {view === "preview" ? (
            <motion.div
              key={`preview-${resetKey}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex h-full min-h-[inherit] w-full items-center justify-center px-4 py-6"
            >
              {demo}
            </motion.div>
          ) : (
            <motion.div
              key="code"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="h-full w-full p-3"
            >
              <CodeBlock
                code={code}
                file={`${slug}.tsx`}
                showLineNumbers
                maxHeight={360}
                className="h-full !border-transparent !bg-transparent"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}
