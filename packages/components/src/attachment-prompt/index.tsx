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
    <div className={cn("rounded-2xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[var(--b-bg)] p-3", className)}>
      {files.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-1.5" aria-label="Attachments">
          {files.map((f) => (
            <li
              key={f.id}
              className="flex items-center gap-2 rounded-lg border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color-mix(in_oklab,var(--b-text)_4%,transparent)] px-2 py-1 font-mono text-xs"
            >
              <span className="text-[color-mix(in_oklab,var(--b-text)_80%,transparent)]">{f.name}</span>
              {f.size && <span className="text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">{f.size}</span>}
              <button
                onClick={() => setFiles((fs) => fs.filter((x) => x.id !== f.id))}
                aria-label={`Remove ${f.name}`}
                className="rounded px-1 text-[color-mix(in_oklab,var(--b-text)_40%,transparent)] hover:bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)] hover:text-[color:var(--b-text)]"
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
        className="w-full resize-none rounded-xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color-mix(in_oklab,var(--b-text)_3%,transparent)] p-3 text-sm outline-none placeholder:text-[color-mix(in_oklab,var(--b-text)_30%,transparent)] focus:border-[color-mix(in_oklab,var(--b-accent)_60%,transparent)]"
      />
      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={() =>
            setFiles((fs) => [...fs, { id: `a-${Date.now()}`, name: `snippet-${fs.length + 1}.tsx`, size: "1.1 KB" }])
          }
          className="rounded-lg border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] px-3 py-1.5 text-xs text-[color-mix(in_oklab,var(--b-text)_70%,transparent)] hover:bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)]"
        >
          + Attach
        </button>
        <button
          onClick={() => {
            onSend?.(text, files);
            setText("");
          }}
          disabled={!text.trim() && files.length === 0}
          className="ml-auto rounded-lg bg-[color:var(--b-accent)] px-4 py-1.5 text-xs font-bold text-[color:var(--b-accent-foreground)] disabled:opacity-40"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default AttachmentPrompt;
