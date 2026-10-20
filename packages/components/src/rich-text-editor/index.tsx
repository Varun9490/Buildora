"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type RichTextEditorProps = {
  /** Initial HTML content. Uncontrolled after mount. */
  initial?: string;
  /** Controlled HTML value. Pair with `onChange`. */
  value?: string;
  /** Called with the sanitised HTML whenever the content changes. */
  onChange?: (html: string) => void;
  /** Placeholder shown when the editor is empty. */
  placeholder?: string;
  className?: string;
};

type Format = {
  id: "bold" | "italic" | "underline" | "insertUnorderedList" | "insertOrderedList";
  label: string;
  glyph: string;
};

/**
 * Elements a rich-text document may contain. Anything else is unwrapped
 * (its text is kept) or dropped.
 */
const ALLOWED_TAGS = new Set([
  "B", "STRONG", "I", "EM", "U", "S", "P", "BR", "DIV", "SPAN",
  "UL", "OL", "LI", "H1", "H2", "H3", "BLOCKQUOTE", "CODE", "PRE", "A",
]);

/** Attributes that survive sanitisation. */
const ALLOWED_ATTRS: Record<string, Set<string>> = {
  A: new Set(["href", "title", "target", "rel"]),
};

/**
 * Strip everything that could execute or load: script/style/iframe/objects,
 * event handlers, and `javascript:` URLs.
 */
export function sanitizeRichText(html: string): string {
  if (typeof window === "undefined" || typeof DOMParser === "undefined") return html;

  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");
  const body = doc.body;

  const walk = (node: Element) => {
    for (const child of Array.from(node.children)) {
      const tag = child.tagName.toUpperCase();

      if (tag === "SCRIPT" || tag === "STYLE" || tag === "IFRAME" || tag === "OBJECT" || tag === "EMBED" || tag === "LINK" || tag === "META") {
        child.remove();
        continue;
      }

      if (!ALLOWED_TAGS.has(tag)) {
        // Keep the text, drop the element.
        child.replaceWith(...Array.from(child.childNodes));
        continue;
      }

      const allowed = ALLOWED_ATTRS[tag] ?? new Set<string>();
      for (const attr of Array.from(child.attributes)) {
        const name = attr.name.toLowerCase();
        const value = attr.value.trim().toLowerCase();
        if (name.startsWith("on") || !allowed.has(name) || value.startsWith("javascript:")) {
          child.removeAttribute(attr.name);
        }
      }

      if (tag === "A") {
        const href = child.getAttribute("href");
        if (href && !/^(https?:|mailto:|#|\/)/i.test(href.trim())) {
          child.removeAttribute("href");
        }
        if (child.getAttribute("target") === "_blank") {
          child.setAttribute("rel", "noopener noreferrer");
        }
      }

      walk(child);
    }
  };

  walk(body);
  return body.innerHTML;
}

const FORMATS: Format[] = [
  { id: "bold", label: "Bold", glyph: "B" },
  { id: "italic", label: "Italic", glyph: "I" },
  { id: "underline", label: "Underline", glyph: "U" },
  { id: "insertUnorderedList", label: "Bulleted list", glyph: "•" },
  { id: "insertOrderedList", label: "Numbered list", glyph: "1." },
];

/**
 * RichTextEditor — a small formatting surface over `contentEditable`.
 *
 * There is no editor engine behind it: the formatting commands are the
 * browser's own `execCommand`, which is deprecated but is still the only
 * dependency-free way to do this. Everything that comes out is sanitised
 * before it reaches `onChange`, so a consumer can store the HTML without
 * worrying about script tags or event handlers riding along.
 */
export function RichTextEditor({
  initial = "Ship with Buildora.",
  value,
  onChange,
  placeholder = "Start writing…",
  className,
}: RichTextEditorProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [words, setWords] = React.useState(
    initial.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length
  );
  const [active, setActive] = React.useState<Record<string, boolean>>({});
  const controlled = value !== undefined;

  // Keep the DOM in step with a controlled value, but never fight the user
  // while they are typing.
  React.useEffect(() => {
    if (!controlled || !ref.current) return;
    const current = sanitizeRichText(ref.current.innerHTML);
    if (current !== value) ref.current.innerHTML = value;
  }, [value, controlled]);

  const publish = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const html = sanitizeRichText(el.innerHTML);
    setWords(el.innerText.split(/\s+/).filter(Boolean).length);
    onChange?.(html);
  }, [onChange]);

  const readActive = React.useCallback(() => {
    const el = ref.current;
    // `queryCommandState` is deprecated and missing from the DOM typings.
    const query = (window as unknown as { queryCommandState?: (id: string) => boolean })
      .queryCommandState;
    if (!el || typeof window === "undefined" || typeof query !== "function") return;
    const next: Record<string, boolean> = {};
    for (const f of FORMATS) next[f.id] = query.call(window, f.id);
    setActive(next);
  }, []);

  const run = (id: Format["id"]) => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    if (typeof document !== "undefined" && typeof document.execCommand === "function") {
      document.execCommand(id, false);
    }
    publish();
    readActive();
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color:var(--b-bg)]",
        className
      )}
    >
      <div
        className="flex items-center gap-1.5 border-b border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] p-2"
        role="toolbar"
        aria-label="Formatting"
      >
        {FORMATS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => run(f.id)}
            aria-label={f.label}
            aria-pressed={Boolean(active[f.id])}
            className={cn(
              "rounded-lg border px-2.5 py-1 text-xs transition-colors",
              "border-[color-mix(in_oklab,var(--b-border)_10%,transparent)]",
              active[f.id]
                ? "bg-[color:var(--b-accent)] text-[color:var(--b-accent-foreground)]"
                : "text-[color-mix(in_oklab,var(--b-text)_70%,transparent)] hover:bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)]"
            )}
          >
            {f.glyph}
          </button>
        ))}
        <span
          className="ml-auto font-mono text-[11px] text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]"
          role="status"
        >
          {words} words
        </span>
      </div>
      <div className="relative">
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-label="Rich text"
          aria-multiline
          data-placeholder={placeholder}
          onInput={publish}
          onKeyUp={readActive}
          onMouseUp={readActive}
          onBlur={publish}
          className="min-h-28 p-3 text-sm text-[color-mix(in_oklab,var(--b-text)_85%,transparent)] outline-none empty:before:pointer-events-none empty:before:text-[color-mix(in_oklab,var(--b-text)_30%,transparent)] empty:before:content-[attr(data-placeholder)] focus:bg-[color-mix(in_oklab,var(--b-text)_2%,transparent)]"
          dangerouslySetInnerHTML={{ __html: controlled ? value : initial }}
        />
      </div>
    </div>
  );
}

export default RichTextEditor;
