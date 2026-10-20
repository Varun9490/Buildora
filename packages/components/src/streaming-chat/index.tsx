"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "tool";
  text: string;
  citations?: string[];
};

export type StreamingChatProps = {
  /** The conversation. Pass it to control the chat; omit for the local demo. */
  messages?: ChatMessage[];
  /** Called when the user sends a message. Omit to run in demo mode. */
  onSend?: (text: string) => void;
  /** The in-flight assistant text. Rendered as it arrives. */
  streamingText?: string;
  /** Show the "demo only" note. Turn it off when you wire a real transport. */
  demo?: boolean;
  placeholder?: string;
  className?: string;
};

const DEMO_REPLY =
  "Buildora components stream token-by-token. This is a frontend-only component — plug in any LLM backend. Citations, tool calls, and review states compose around the stream.";

/**
 * StreamingChat — the chat surface for a token stream.
 *
 * There is no transport in here. The component renders whatever messages it
 * is given and hands the user's input to `onSend`; how those messages arrive
 * is the consumer's business. Pass `messages` and `onSend` to control it,
 * or leave them out for the local demo.
 */
export function StreamingChat({
  messages,
  onSend,
  streamingText = "",
  demo = false,
  placeholder = "Ask about components…",
  className,
}: StreamingChatProps) {
  const [input, setInput] = React.useState("");
  const [demoMessages, setDemoMessages] = React.useState<ChatMessage[]>([
    { id: "m1", role: "user", text: "Show me a magnetic button" },
  ]);
  const [demoStream, setDemoStream] = React.useState("");

  const controlled = messages !== undefined;
  const list = controlled ? messages : demoMessages;
  const inFlight = controlled ? streamingText : demoStream;

  const runDemo = React.useCallback((seed: string) => {
    setDemoStream("");
    let i = 0;
    const t = setInterval(() => {
      i += 2;
      setDemoStream(seed.slice(0, i));
      if (i >= seed.length) {
        clearInterval(t);
        setDemoMessages((m) => [
          ...m,
          {
            id: `a-${Date.now()}`,
            role: "assistant",
            text: seed,
            citations: ["registry/magnetic-button.json", "docs/accessibility.md"],
          },
        ]);
        setDemoStream("");
      }
    }, 24);
    return () => clearInterval(t);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    if (onSend) {
      onSend(text);
      return;
    }
    setDemoMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", text }]);
    runDemo(DEMO_REPLY);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-[400px] rounded-2xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color:var(--b-bg)]",
        className
      )}
    >
      <div
        className="flex-1 overflow-y-auto space-y-3 p-4 b-scroll"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {list.map((m) => (
          <div
            key={m.id}
            className={cn(
              "max-w-[85%] rounded-xl px-3 py-2 text-sm",
              m.role === "user"
                ? "ml-auto bg-[color:var(--b-accent)] text-[color:var(--b-accent-foreground)]"
                : "bg-[color-mix(in_oklab,var(--b-text)_6%,transparent)] text-[color-mix(in_oklab,var(--b-text)_90%,transparent)]"
            )}
          >
            <p>{m.text}</p>
            {m.citations && (
              <div className="mt-2 flex flex-wrap gap-1">
                {m.citations.map((c) => (
                  <span
                    key={c}
                    className="rounded bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)] px-1.5 py-0.5 font-mono text-[10px] text-[color-mix(in_oklab,var(--b-text)_70%,transparent)]"
                  >
                    [{c}]
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        {inFlight ? (
          // The in-flight text is hidden from assistive technology: a live
          // region that fires per token is unusable. The completed message is
          // announced once, when it lands.
          <div
            className="max-w-[85%] rounded-xl bg-[color-mix(in_oklab,var(--b-text)_6%,transparent)] px-3 py-2 text-sm text-[color-mix(in_oklab,var(--b-text)_90%,transparent)]"
            aria-hidden="true"
          >
            <p>
              {inFlight}
              <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-[color:var(--b-accent)] align-middle" />
            </p>
          </div>
        ) : null}
      </div>
      <form
        className="flex gap-2 border-t border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] p-3"
        onSubmit={submit}
      >
        <label htmlFor="chat-input" className="sr-only">
          Message
        </label>
        <input
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="min-h-[44px] min-w-0 flex-1 rounded-xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color-mix(in_oklab,var(--b-text)_4%,transparent)] px-3 py-2 text-sm outline-none focus:border-[color:var(--b-accent)]"
        />
        <button
          type="submit"
          className="min-h-[44px] min-w-[44px] rounded-xl bg-[color:var(--b-accent)] px-4 py-2 text-sm font-bold text-[color:var(--b-accent-foreground)] disabled:opacity-50"
          disabled={Boolean(inFlight)}
        >
          Send
        </button>
      </form>
      {demo ? (
        <p className="px-4 pb-3 text-[11px] text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">
          Frontend component only. No Buildora AI backend.
        </p>
      ) : null}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   TOKEN METER — a context window you can *read*: segments
   of the window render as bars, threshold tiers change the
   color rail (ok → warm → danger), and the split readout
   (used / reserved / free) announces honestly to AT.
   ───────────────────────────────────────────────────────── */

export default StreamingChat;
