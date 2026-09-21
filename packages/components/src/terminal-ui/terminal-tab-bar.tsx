"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { type TerminalColorScheme } from "./terminal-theme";

export interface TerminalTab {
  id: string;
  title: string;
  icon?: React.ReactNode;
  type?: "terminal" | "ssh" | "task" | "split";
  cwd?: string;
  process?: string;
  closable?: boolean;
}

export interface TerminalTabBarProps {
  tabs: TerminalTab[];
  activeTab: string | null;
  onTabChange: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onTabAdd: () => void;
  onTabReorder?: (oldIndex: number, newIndex: number) => void;
  onTabSplit?: (tabId: string) => void;
  theme: TerminalColorScheme;
  className?: string;
}

const typeIcons: Record<string, React.ReactNode> = {
  terminal: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  ssh: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  task: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  split: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
    </svg>
  ),
};

export function TerminalTabBar({
  tabs,
  activeTab,
  onTabChange,
  onTabClose,
  onTabAdd,
  onTabReorder,
  onTabSplit,
  theme,
  className,
}: TerminalTabBarProps) {
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [dropIndex, setDropIndex] = React.useState<number | null>(null);
  
  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDragIndex(idx);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", idx.toString());
  };
  
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== idx) {
      setDropIndex(idx);
    }
  };
  
  const handleDrop = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    const fromIdx = parseInt(e.dataTransfer.getData("text/plain"), 10);
    if (fromIdx !== idx && onTabReorder) {
      onTabReorder(fromIdx, idx);
    }
    setDragIndex(null);
    setDropIndex(null);
  };
  
  const handleDragEnd = () => {
    setDragIndex(null);
    setDropIndex(null);
  };
  
  return (
    <div
      className={cn(
        "flex items-center h-8 min-h-8 gap-0.5 px-1",
        className
      )}
      style={{
        backgroundColor: theme.background,
        borderBottom: `1px solid ${theme.brightBlack}`,
      }}
      role="tablist"
      aria-label="Terminal tabs"
    >
      {tabs.map((tab, idx) => {
        const isActive = tab.id === activeTab;
        const icon = tab.icon ?? typeIcons[tab.type ?? "terminal"];
        
        return (
          <div
            key={tab.id}
            className={cn(
              "group flex items-center gap-1 px-2 h-6 rounded-t cursor-pointer",
              "transition-colors duration-150",
              "focus-within:outline-none"
            )}
            style={{
              backgroundColor: isActive ? theme.black : "transparent",
              borderLeft: dropIndex === idx && dragIndex !== null ? `2px solid ${theme.cyan}` : "none",
            }}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            draggable={onTabReorder !== undefined}
            onClick={() => onTabChange(tab.id)}
            onDragStart={(e) => handleDragStart(e, idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDrop={(e) => handleDrop(e, idx)}
            onDragEnd={handleDragEnd}
          >
            {icon && (
              <span
                className="shrink-0"
                style={{ color: isActive ? theme.foreground : theme.brightBlack }}
              >
                {icon}
              </span>
            )}
            <span
              className="text-xs truncate max-w-[120px]"
              style={{
                color: isActive ? theme.foreground : theme.brightBlack,
                fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, monospace",
              }}
            >
              {tab.title}
            </span>
            {tab.closable !== false && (
              <button
                type="button"
                className={cn(
                  "ml-1 p-0.5 rounded opacity-0 group-hover:opacity-100",
                  "hover:bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)] transition-opacity"
                )}
                style={{ color: theme.brightBlack }}
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
                aria-label={`Close ${tab.title}`}
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
            {onTabSplit && (
              <button
                type="button"
                className={cn(
                  "p-0.5 rounded opacity-0 group-hover:opacity-100",
                  "hover:bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)] transition-opacity"
                )}
                style={{ color: theme.brightBlack }}
                onClick={(e) => {
                  e.stopPropagation();
                  onTabSplit(tab.id);
                }}
                aria-label={`Split ${tab.title}`}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </button>
            )}
          </div>
        );
      })}
      <button
        type="button"
        className="flex items-center justify-center w-6 h-6 rounded hover:bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)] transition-colors"
        style={{ color: theme.brightBlack }}
        onClick={onTabAdd}
        aria-label="New terminal tab"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}

export function createTerminalTab(
  title: string,
  options?: Partial<TerminalTab>
): TerminalTab {
  return {
    id: `tab-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    title,
    type: "terminal",
    closable: true,
    ...options,
  };
}
