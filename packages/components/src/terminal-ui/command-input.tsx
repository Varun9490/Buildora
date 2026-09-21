"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { type TerminalColorScheme } from "./terminal-theme";

export interface CommandSuggestion {
  text: string;
  display?: string;
  description?: string;
  icon?: React.ReactNode;
  type?: "command" | "file" | "directory" | "option" | "history";
}

export interface CommandInputProps {
  theme: TerminalColorScheme;
  prompt?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  history?: string[];
  suggestions?: CommandSuggestion[];
  multiline?: boolean;
  showLineNumbers?: boolean;
  autoFocus?: boolean;
  highlight?: boolean;
  highlightRules?: Array<{
    pattern: RegExp;
    color: string;
  }>;
  className?: string;
}

const defaultHighlightRules = [
  { pattern: /^#.*/g, color: "#6a9955" },
  { pattern: /\b(if|then|else|fi|for|while|do|done|case|esac|function|return|exit|break|continue)\b/g, color: "#c586c0" },
  { pattern: /\b(echo|printf|read|cd|ls|cat|grep|find|mkdir|rm|cp|mv|touch|chmod|chown)\b/g, color: "#dcdcaa" },
  { pattern: /\b(-[a-zA-Z0-9]+|--[a-zA-Z0-9-]+)\b/g, color: "#4ec9b0" },
  { pattern: /(["'])(?:(?=(\\?))\2.)*?\1/g, color: "#ce9178" },
  { pattern: /(\$\w+|\${[^}]+})/g, color: "#9cdcfe" },
  { pattern: /@[a-zA-Z0-9_-]+/g, color: "#6a9955" },
];

function highlightSyntax(text: string, rules: Array<{ pattern: RegExp; color: string }>): React.ReactNode[] {
  let elements: React.ReactNode[] = [text];
  
  rules.forEach((rule, ruleIdx) => {
    const newElements: React.ReactNode[] = [];
    elements.forEach((el, elIdx) => {
      if (typeof el === "string") {
        const parts = el.split(rule.pattern);
        let lastIndex = 0;
        let match;
        const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
        while ((match = regex.exec(el)) !== null) {
          if (match.index > lastIndex) {
            newElements.push(el.slice(lastIndex, match.index));
          }
          newElements.push(
            <span key={`${ruleIdx}-${elIdx}-${match.index}`} style={{ color: rule.color }}>
              {match[0]}
            </span>
          );
          lastIndex = match.index + match[0].length;
        }
        if (lastIndex < el.length) {
          newElements.push(el.slice(lastIndex));
        }
      } else {
        newElements.push(el);
      }
    });
    elements = newElements;
  });
  
  return elements;
}

export function CommandInput({
  theme,
  prompt = "$",
  value: controlledValue,
  onChange,
  onSubmit,
  history = [],
  suggestions = [],
  multiline = false,
  showLineNumbers = false,
  autoFocus = false,
  highlight = true,
  highlightRules = defaultHighlightRules,
  className,
}: CommandInputProps) {
  const [internalValue, setInternalValue] = React.useState("");
  const [historyIndex, setHistoryIndex] = React.useState(-1);
  const [tabIndex, setTabIndex] = React.useState(-1);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  
  const uncontrolledRef = React.useRef<HTMLTextAreaElement>(null);
  const controlledRef = React.useRef<HTMLTextAreaElement>(null);
  const textareaRef = controlledValue !== undefined ? controlledRef : uncontrolledRef;
  
  const value = controlledValue ?? internalValue;
  
  const filteredSuggestions = React.useMemo(() => {
    if (!value.trim()) return suggestions.slice(0, 10);
    const parts = value.trim().split(/\s+/);
    const lastPart = parts[parts.length - 1];
    return suggestions.filter(
      (s) => s.text === value || s.text.startsWith(lastPart)
    ).slice(0, 10);
  }, [value, suggestions]);
  
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (highlight) e.preventDefault();
      if (!e.shiftKey || !multiline) {
        if (value.trim()) {
          onSubmit?.(value);
          onChange?.("");
          setInternalValue("");
          setHistoryIndex(-1);
        }
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIdx = Math.min(historyIndex + 1, history.length - 1);
        setHistoryIndex(newIdx);
        const newVal = history[history.length - 1 - newIdx] ?? "";
        onChange?.(newVal);
        setInternalValue(newVal);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIdx = historyIndex - 1;
        setHistoryIndex(newIdx);
        const newVal = history[history.length - 1 - newIdx] ?? "";
        onChange?.(newVal);
        setInternalValue(newVal);
      } else {
        setHistoryIndex(-1);
        onChange?.("");
        setInternalValue("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (filteredSuggestions.length > 0) {
        const newIdx = (tabIndex + 1) % filteredSuggestions.length;
        setTabIndex(newIdx);
        const suggestion = filteredSuggestions[newIdx];
        onChange?.(suggestion.text);
        setInternalValue(suggestion.text);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setTabIndex(-1);
    }
  }, [value, history, historyIndex, filteredSuggestions, tabIndex, onChange, onSubmit, multiline, highlight]);
  
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange?.(newValue);
    setInternalValue(newValue);
    setShowSuggestions(true);
    setTabIndex(-1);
  }, [onChange]);
  
  const lines = value.split("\n");
  const lineCount = lines.length;
  
  return (
    <div className={cn("relative", className)}>
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          className="absolute bottom-full left-0 right-0 mb-1 overflow-hidden rounded border shadow-lg"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.brightBlack,
          }}
          role="listbox"
          aria-label="Command suggestions"
        >
          {filteredSuggestions.map((s, idx) => (
            <div
              key={s.text}
              role="option"
              aria-selected={idx === tabIndex}
              className={cn(
                "flex items-center gap-2 px-2 py-1 cursor-pointer",
                idx === tabIndex && "bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)]"
              )}
              style={{ color: theme.foreground }}
              onClick={() => {
                onChange?.(s.text);
                setInternalValue(s.text);
                setShowSuggestions(false);
                setTabIndex(-1);
              }}
            >
              {s.icon && <span style={{ color: theme.brightBlack }}>{s.icon}</span>}
              <span className="text-xs font-mono">{s.display ?? s.text}</span>
              <span className="text-[10px] ml-auto" style={{ color: theme.brightBlack }}>
                {s.description}
              </span>
            </div>
          ))}
        </div>
      )}
      
      <div
        className="flex overflow-hidden rounded"
        style={{
          backgroundColor: theme.black,
          border: `1px solid ${theme.brightBlack}`,
        }}
      >
        {showLineNumbers && (
          <div
            className="flex flex-col shrink-0 select-none"
            style={{
              color: theme.brightBlack,
              font: `12px/1.4 'JetBrains Mono', 'Fira Code', Menlo, monospace`,
              width: "2.5rem",
              paddingRight: "0.5rem",
              textAlign: "right",
            }}
            aria-hidden
          >
            {Array.from({ length: Math.max(lineCount, 1)}, (_, i) => (
              <div key={i} style={{ height: `${1.4}em` }}>{i + 1}</div>
            ))}
          </div>
        )}
        
        <div
          className="flex items-start shrink-0 pt-0.5 px-2 border-r"
          style={{ borderColor: theme.brightBlack }}
          aria-hidden
        >
          {lines.map((_, idx) => (
            <div
              key={idx}
              className={cn(idx > 0 && "hidden")}
              style={{
                color: theme.cyan,
                fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, monospace",
                fontSize: 12,
                height: `${1.4}em`,
                lineHeight: 1.4,
              }}
            >
              {prompt}
            </div>
          ))}
        </div>
        
        <div className="relative flex-1">
          {highlight && multiline && (
            <div
              className="absolute inset-0 pointer-events-none overflow-hidden px-2 py-0.5"
              style={{
                color: "transparent",
                fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, monospace",
                fontSize: 12,
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
                lineHeight: 1.4,
              }}
              aria-hidden
            >
              {highlightSyntax(value, highlightRules)}
            </div>
          )}
          <textarea
            ref={textareaRef as React.RefObject<HTMLTextAreaElement>}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            autoFocus={autoFocus}
            rows={multiline ? Math.max(3, lineCount) : 1}
            className={cn(
              "w-full bg-transparent px-2 py-0.5 outline-none resize-none",
              highlight && multiline && "caret-[color:var(--b-text)]"
            )}
            style={{
              color: highlight && multiline ? "transparent" : theme.foreground,
              fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, monospace",
              fontSize: 12,
              lineHeight: 1.4,
              caretColor: theme.cursor,
            }}
            spellCheck={false}
            role="textbox"
            aria-label={multiline ? "Multi-line command input" : "Command input"}
          />
        </div>
      </div>
    </div>
  );
}
