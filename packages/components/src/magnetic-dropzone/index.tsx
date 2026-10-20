"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion, AnimatePresence } from "motion/react";

export type MagneticDropzoneProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Called with dropped files (or picked ones). */
  onFiles?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  hint?: string;
  maxMagnet?: number;
};

/**
 * MagneticDropzone — a dropzone that hunts for the cursor: during a drag
 * with files anywhere outside, the zone leans toward the pointer and
 * pulses its field. Drop adds file rows. Input fallback for keyboard.
 */
export function MagneticDropzone({
  onFiles,
  accept,
  multiple = true,
  label = "Drop files to attach",
  hint = "or browse",
  maxMagnet = 10,
  className,
  ...rest
}: MagneticDropzoneProps) {
  const reduced = useReducedMotion();
  const [dragging, setDragging] = React.useState(false);
  const [lean, setLean] = React.useState({ x: 0, y: 0 });
  const [hovered, setHovered] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);
  const zoneRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const depth = React.useRef(0);

  React.useEffect(() => {
    const onWindowDragOver = (e: DragEvent) => {
      if (!e.dataTransfer || ![...e.dataTransfer.types].includes("Files")) return;
      e.preventDefault();
      setDragging(true);
      if (!reduced && zoneRef.current) {
        const r = zoneRef.current.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const dist = Math.hypot(dx, dy);
        const k = Math.max(0, 1 - dist / 420);
        setLean({ x: -dx * k * 0.06, y: -dy * k * 0.06 });
      }
    };
    const onWindowLeave = () => {
      depth.current = Math.max(0, depth.current - 1);
      if (depth.current === 0) {
        setDragging(false);
        setLean({ x: 0, y: 0 });
      }
    };
    const onWindowEnter = () => {
      depth.current += 1;
    };
    window.addEventListener("dragover", onWindowDragOver);
    window.addEventListener("dragenter", onWindowEnter);
    window.addEventListener("dragleave", onWindowLeave);
    window.addEventListener("drop", onWindowLeave);
    return () => {
      window.removeEventListener("dragover", onWindowDragOver);
      window.removeEventListener("dragenter", onWindowEnter);
      window.removeEventListener("dragleave", onWindowLeave);
      window.removeEventListener("drop", onWindowLeave);
    };
  }, [reduced]);

  const addFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const incoming = Array.from(list);
    setFiles((f) => (multiple ? [...f, ...incoming] : incoming.slice(0, 1)));
    onFiles?.(incoming);
  };

  return (
    <div className={cn("flex w-full max-w-sm flex-col gap-2", className)} {...rest}>
      <motion.div
        ref={zoneRef}
        onDragEnter={(e) => {
          e.preventDefault();
          setHovered(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => setHovered(false)}
        onDrop={(e) => {
          e.preventDefault();
          setHovered(false);
          setDragging(false);
          setLean({ x: 0, y: 0 });
          addFiles(e.dataTransfer?.files ?? null);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed px-6 py-9 outline-none",
          "transition-colors focus-visible:ring-2 focus-visible:ring-[color:var(--b-accent)]",
          hovered ? "border-[color:var(--b-accent)] bg-[color:color-mix(in_oklab,var(--b-accent)_8%,transparent)]" : "border-[color:var(--b-border-hover)] bg-[color:var(--b-surface)]"
        )}
        animate={reduced ? undefined : { x: lean.x, y: lean.y }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        aria-live="polite"
      >
        {dragging && !reduced && (
          <motion.span
            aria-hidden="true"
            className="absolute -inset-2 rounded-3xl border border-[color:color-mix(in_oklab,var(--b-accent)_45%,transparent)]"
            animate={{ opacity: [0.25, 0.7, 0.25], scale: [0.985, 1.01, 0.985] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        )}
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={hovered ? "var(--b-accent)" : "var(--b-muted)"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 16V6m0 0-4 4m4-4 4 4" />
          <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        </svg>
        <p className="text-sm font-semibold text-[color:var(--b-text)]">
          {label} <span className="font-normal text-[color:var(--b-muted)]">({hint})</span>
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
          aria-label={`Browse for ${label.toLowerCase()}`}
        />
      </motion.div>

      <AnimatePresence initial={false}>
        {files.map((f) => (
          <motion.div
            key={f.name + f.size}
            layout
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ type: "spring", bounce: 0.22, duration: 0.45 }}
            className="flex items-center justify-between gap-3 rounded-xl border border-[color:var(--b-border)] bg-[color:var(--b-panel)] px-3.5 py-2.5"
          >
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-semibold text-[color:var(--b-text)]">{f.name}</span>
              <span className="block text-[10px] text-[color:var(--b-muted)]">{(f.size / 1024).toFixed(0)} KB</span>
            </span>
            <button
              type="button"
              onClick={() => setFiles((prev) => prev.filter((x) => x !== f))}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[color:var(--b-muted)] hover:text-[color:var(--b-danger)]"
              aria-label={`Remove ${f.name}`}
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="m2.5 2.5 7 7m0-7-7 7" /></svg>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default MagneticDropzone;
