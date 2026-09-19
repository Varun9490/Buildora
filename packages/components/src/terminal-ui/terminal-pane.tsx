"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { type TerminalColorScheme, ansiColorToCSS } from "./terminal-theme";

export interface TerminalLine {
  id: string;
  content: string;
  timestamp?: number;
  type?: "input" | "output" | "error" | "warning" | "success" | "system";
  ansi?: boolean;
}

export interface TerminalPaneProps {
  lines: TerminalLine[];
  theme: TerminalColorScheme;
  scrollback?: number;
  fontSize?: number;
  fontFamily?: string;
  lineHeight?: number;
  cursor?: boolean;
  cursorBlink?: boolean;
  className?: string;
  onSelect?: (text: string, range: { start: number; end: number }) => void;
  onScroll?: (position: number) => void;
}

const ansiRegex = /\x1b\[([0-9;]*)m/g;

function parseAnsi(text: string): Array<{ text: string; styles: React.CSSProperties }> {
  const parts: Array<{ text: string; styles: React.CSSProperties }> = [];
  let currentStyles: React.CSSProperties = {};
  let remaining = text;
  
  while (remaining.length > 0) {
    const match = remaining.match(ansiRegex);
    if (!match || match.index === undefined) {
      if (remaining.length > 0) {
        parts.push({ text: remaining, styles: currentStyles });
      }
      break;
    }
    
    if (match.index > 0) {
      parts.push({ text: remaining.slice(0, match.index), styles: currentStyles });
    }
    
    const codes = match[1].split(";").map(Number);
    codes.forEach((code) => {
      currentStyles = applyAnsiCode(currentStyles, code);
    });
    
    remaining = remaining.slice(match.index! + match[0].length);
  }
  
  return parts;
}

function applyAnsiCode(styles: React.CSSProperties, code: number): React.CSSProperties {
  const newStyles = { ...styles };
  
  if (code === 0) {
    return {};
  } else if (code === 1) {
    newStyles.fontWeight = "bold";
  } else if (code === 3) {
    newStyles.fontStyle = "italic";
  } else if (code === 4) {
    newStyles.textDecoration = "underline";
  } else if (code === 7) {
    const bg = newStyles.backgroundColor as string | undefined;
    const fg = newStyles.color as string | undefined;
    if (bg) newStyles.color = bg;
    if (fg) newStyles.backgroundColor = fg;
  } else if (code === 22) {
    newStyles.fontWeight = "normal";
  } else if (code === 23) {
    newStyles.fontStyle = "normal";
  } else if (code === 24) {
    newStyles.textDecoration = "none";
  } else if (code === 30) {
    newStyles.color = ansiColorToCSS("30");
  } else if (code === 31) {
    newStyles.color = ansiColorToCSS("31");
  } else if (code === 32) {
    newStyles.color = ansiColorToCSS("32");
  } else if (code === 33) {
    newStyles.color = ansiColorToCSS("33");
  } else if (code === 34) {
    newStyles.color = ansiColorToCSS("34");
  } else if (code === 35) {
    newStyles.color = ansiColorToCSS("35");
  } else if (code === 36) {
    newStyles.color = ansiColorToCSS("36");
  } else if (code === 37) {
    newStyles.color = ansiColorToCSS("37");
  } else if (code === 90) {
    newStyles.color = ansiColorToCSS("90");
  } else if (code === 91) {
    newStyles.color = ansiColorToCSS("91");
  } else if (code === 92) {
    newStyles.color = ansiColorToCSS("92");
  } else if (code === 93) {
    newStyles.color = ansiColorToCSS("93");
  } else if (code === 94) {
    newStyles.color = ansiColorToCSS("94");
  } else if (code === 95) {
    newStyles.color = ansiColorToCSS("95");
  } else if (code === 96) {
    newStyles.color = ansiColorToCSS("96");
  } else if (code === 97) {
    newStyles.color = ansiColorToCSS("97");
  }
  
  return newStyles;
}

function renderLineContent(line: TerminalLine, theme: TerminalColorScheme) {
  if (!line.ansi) {
    let color = theme.foreground;
    if (line.type === "input") color = theme.cyan;
    else if (line.type === "error") color = theme.red;
    else if (line.type === "warning") color = theme.yellow;
    else if (line.type === "success") color = theme.green;
    else if (line.type === "system") color = theme.magenta;
    
    return <span style={{ color }}>{line.content}</span>;
  }
  
  const parts = parseAnsi(line.content);
  return parts.map((part, idx) => (
    <span key={idx} style={part.styles}>{part.text}</span>
  ));
}

export function TerminalPane({
  lines,
  theme,
  scrollback = 10000,
  fontSize = 12,
  fontFamily = "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, monospace",
  lineHeight = 1.4,
  cursor = true,
  cursorBlink = true,
  className,
  onSelect,
  onScroll,
}: TerminalPaneProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [selection, setSelection] = React.useState<{ start: number; end: number } | null>(null);
  const [isSelecting, setIsSelecting] = React.useState(false);
  const [autoScroll, setAutoScroll] = React.useState(true);
  
  const displayLines = React.useMemo(() => {
    return lines.slice(-scrollback);
  }, [lines, scrollback]);
  
  React.useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayLines.length, autoScroll]);
  
  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 5;
    setAutoScroll(isAtBottom);
    onScroll?.(target.scrollTop);
  }, [onScroll]);
  
  const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
    if (e.shiftKey) return;
    setIsSelecting(true);
    setSelection(null);
  }, []);
  
  const handleMouseUp = React.useCallback(() => {
    setIsSelecting(false);
    const selectedText = window.getSelection()?.toString() ?? "";
    if (selectedText && selection && onSelect) {
      onSelect(selectedText, selection);
    }
  }, [selection, onSelect]);
  
  const handleMouseMove = React.useCallback(() => {
    if (!isSelecting) return;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      setSelection({
        start: range.startOffset,
        end: range.endOffset,
      });
    }
  }, [isSelecting]);
  
  return (
    <div
      ref={containerRef}
      className={cn(
        "flex-1 overflow-auto outline-none select-text",
        className
      )}
      style={{
        fontSize,
        fontFamily,
        lineHeight,
        backgroundColor: theme.background,
        color: theme.foreground,
        cursor: "text",
      }}
      tabIndex={0}
      role="textbox"
      aria-label="Terminal output"
      aria-multiline="true"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onScroll={handleScroll}
    >
      <div className="min-h-full" style={{ padding: "4px 8px" }}>
        {displayLines.map((line, idx) => (
          <div
            key={line.id ?? `${idx}-${line.timestamp}`}
            className="whitespace-pre-wrap break-all"
          >
            {renderLineContent(line, theme)}
          </div>
        ))}
        {cursor && (
          <span
            className={cn(
              "inline-block w-2 h-[1.1em] align-middle",
              cursorBlink && "animate-[terminal-blink_1s_step-end_infinite]"
            )}
            style={{ backgroundColor: theme.cursor }}
            aria-hidden
          />
        )}
      </div>
      <style>{`
        @keyframes terminal-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export function createTerminalLine(
  content: string,
  options?: Partial<TerminalLine>
): TerminalLine {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    content,
    timestamp: Date.now(),
    type: "output",
    ansi: false,
    ...options,
  };
}
