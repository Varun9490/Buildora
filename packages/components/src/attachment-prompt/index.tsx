"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type Attachment = { id: string; name: string; size?: string };

export function AttachmentPrompt({
  initial = [{ id: "a1", name: "magnetic-button.tsx", size: "4.2 KB" }],
  onSend,
  className,
}: {
  initial?: Attachment[];
  onSend?: (text: string, attachments: Attachment[]) => void;
  className?: string;
}) {
  const [files, setFiles] = React.useState<Attachment[]>(initial);
  const [text, setText] = React.useState("");
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-[#0d0f16] p-3", className)}>
      {files.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-1.5" aria-label="Attachments">
          {files.map((f) => (
            <li
              key={f.id}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs"
            >
              <span className="text-white/80">{f.name}</span>
              {f.size && <span className="text-white/40">{f.size}</span>}
              <button
                onClick={() => setFiles((fs) => fs.filter((x) => x.id !== f.id))}
                aria-label={`Remove ${f.name}`}
                className="rounded px-1 text-white/40 hover:bg-white/10 hover:text-white"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <label htmlFor="attachment-prompt-input" className="sr-only">
        Prompt with attachments
      </label>
      <textarea
        id="attachment-prompt-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask with context from attachments…"
        rows={3}
        className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm outline-none placeholder:text-white/30 focus:border-[#d4ff4f]/60"
      />
      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={() =>
            setFiles((fs) => [...fs, { id: `a-${Date.now()}`, name: `snippet-${fs.length + 1}.tsx`, size: "1.1 KB" }])
          }
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/70 hover:bg-white/5"
        >
          + Attach
        </button>
        <button
          onClick={() => {
            onSend?.(text, files);
            setText("");
          }}
          disabled={!text.trim() && files.length === 0}
          className="ml-auto rounded-lg bg-[--b-accent] px-4 py-1.5 text-xs font-bold text-[--b-accent-foreground] disabled:opacity-40"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default AttachmentPrompt;
