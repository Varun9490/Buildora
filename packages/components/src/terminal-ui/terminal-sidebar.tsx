"use client";

import * as React from "react";
import { cn } from "../utils";
import { type TerminalColorScheme } from "./terminal-theme";

export interface FileTreeNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileTreeNode[];
  icon?: React.ReactNode;
}

export interface TerminalSession {
  id: string;
  name: string;
  cwd?: string;
  processName?: string;
  pid?: number;
  status?: "active" | "stopped" | "exited";
  connections?: number;
}

export interface TerminalSidebarProps {
  theme: TerminalColorScheme;
  collapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  files?: FileTreeNode[];
  sessions?: TerminalSession[];
  processes?: TerminalSession[];
  activeSession?: string | null;
  onFileClick?: (path: string) => void;
  onSessionClick?: (sessionId: string) => void;
  onProcessClick?: (pid: number) => void;
  onSessionTerminate?: (sessionId: string) => void;
  onQuickAction?: (action: "new" | "split" | "settings") => void;
  className?: string;
}

const folderIcon = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const fileIcon = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

function FileTreeItem({
  node,
  theme,
  depth,
  onFileClick,
}: {
  node: FileTreeNode;
  theme: TerminalColorScheme;
  depth: number;
  onFileClick: (path: string) => void;
}) {
  const [expanded, setExpanded] = React.useState(depth < 1);
  const hasChildren = node.children && node.children.length > 0;
  
  return (
    <li role="treeitem" aria-expanded={hasChildren ? expanded : undefined}>
      <div
        className={cn(
          "flex items-center gap-1 px-1 py-0.5 rounded cursor-pointer",
          "hover:bg-white/5 transition-colors"
        )}
        style={{
          paddingLeft: `${8 + depth * 12}px`,
          color: theme.foreground,
        }}
        onClick={() => {
          if (hasChildren) {
            setExpanded(!expanded);
          } else {
            onFileClick(node.path);
          }
        }}
      >
        <span className="shrink-0" style={{ color: theme.brightBlack }}>
          {hasChildren ? (expanded ? "▾" : "▸") : " "}
        </span>
        <span className="shrink-0" style={{ color: node.type === "folder" ? theme.yellow : theme.cyan }}>
          {node.icon ?? (node.type === "folder" ? folderIcon : fileIcon)}
        </span>
        <span className="truncate text-xs font-mono">{node.name}</span>
      </div>
      {hasChildren && expanded && (
        <ul role="group" className="m-0 p-0 list-none">
          {node.children!.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              theme={theme}
              depth={depth + 1}
              onFileClick={onFileClick}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

const statusColors: Record<string, string> = {
  active: "bg-green-500",
  stopped: "bg-yellow-500",
  exited: "bg-red-500",
};

export function TerminalSidebar({
  theme,
  collapsed = false,
  onCollapseChange,
  files,
  sessions = [],
  processes = [],
  activeSession,
  onFileClick = () => {},
  onSessionClick,
  onProcessClick,
  onSessionTerminate,
  onQuickAction,
  className,
}: TerminalSidebarProps) {
  const [activeSection, setActiveSection] = React.useState<"files" | "sessions" | "processes">("files");
  
  if (collapsed) {
    return (
      <aside
        className={cn(
          "flex flex-col w-12 border-r items-center py-2 gap-2",
          className
        )}
        style={{
          backgroundColor: theme.background,
          borderColor: theme.brightBlack,
        }}
      >
        <button
          type="button"
          className="p-2 rounded hover:bg-white/5"
          style={{ color: theme.foreground }}
          onClick={() => onCollapseChange?.(false)}
          aria-label="Expand sidebar"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </aside>
    );
  }
  
  return (
    <aside
      className={cn(
        "flex flex-col w-56 h-full border-r overflow-hidden",
        className
      )}
      style={{
        backgroundColor: theme.background,
        borderColor: theme.brightBlack,
      }}
    >
      <div
        className="flex items-center justify-between px-3 py-2 border-b"
        style={{ borderColor: theme.brightBlack }}
      >
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: theme.brightBlack }}
        >
          Explorer
        </span>
        <button
          type="button"
          className="p-1 rounded hover:bg-white/5"
          style={{ color: theme.brightBlack }}
          onClick={() => onCollapseChange?.(true)}
          aria-label="Collapse sidebar"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      <div className="flex border-b" style={{ borderColor: theme.brightBlack }}>
        {["files", "sessions", "processes"].map((section) => (
          <button
            key={section}
            type="button"
            className={cn(
              "flex-1 px-3 py-2 text-xs font-mono capitalize transition-colors",
              activeSection === section && "border-b-2"
            )}
            style={{
              color: activeSection === section ? theme.foreground : theme.brightBlack,
              borderColor: activeSection === section ? theme.cyan : "transparent",
            }}
            onClick={() => setActiveSection(section as typeof activeSection)}
            aria-selected={activeSection === section}
            role="tab"
          >
            {section}
          </button>
        ))}
      </div>
      
      <div className="flex-1 overflow-auto py-2">
        {activeSection === "files" && files && (
          <ul role="tree" className="m-0 p-0 list-none">
            {files.map((node) => (
              <FileTreeItem
                key={node.path}
                node={node}
                theme={theme}
                depth={0}
                onFileClick={onFileClick}
              />
            ))}
          </ul>
        )}
        
        {activeSection === "sessions" && (
          <ul className="m-0 p-0 list-none">
            {sessions.length === 0 ? (
              <p className="text-xs px-3" style={{ color: theme.brightBlack }}>No sessions</p>
            ) : (
              sessions.map((session) => (
                <li key={session.id}>
                  <div
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 cursor-pointer",
                      activeSession === session.id && "bg-white/10"
                    )}
                    onClick={() => onSessionClick?.(session.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full",
                        statusColors[session.status ?? "active"]
                      )}
                    />
                    <span
                      className="text-xs font-mono truncate flex-1"
                      style={{ color: theme.foreground }}
                    >
                      {session.name}
                    </span>
                    {onSessionTerminate && (
                      <button
                        type="button"
                        className="p-0.5 rounded opacity-0 hover:bg-white/10 group-hover:opacity-100 focus:opacity-100"
                        style={{ color: theme.red }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSessionTerminate(session.id);
                        }}
                        aria-label={`Terminate ${session.name}`}
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
        
        {activeSection === "processes" && (
          <ul className="m-0 p-0 list-none">
            {processes.length === 0 ? (
              <p className="text-xs px-3" style={{ color: theme.brightBlack }}>No processes</p>
            ) : (
              processes.map((proc) => (
                <li key={proc.id}>
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-white/5"
                    onClick={() => proc.pid && onProcessClick?.(proc.pid)}
                    role="button"
                    tabIndex={0}
                  >
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full",
                        statusColors[proc.status ?? "active"]
                      )}
                    />
                    <span
                      className="text-xs font-mono"
                      style={{ color: theme.foreground }}
                    >
                      {proc.processName}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: theme.brightBlack }}
                    >
                      PID: {proc.pid}
                    </span>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      
      {onQuickAction && (
        <div
          className="flex items-center gap-1 px-2 py-2 border-t"
          style={{ borderColor: theme.brightBlack }}
        >
          <button
            type="button"
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 text-xs rounded transition-colors",
              "hover:bg-white/10 focus:bg-white/10"
            )}
            style={{ color: theme.foreground }}
            onClick={() => onQuickAction("new")}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New
          </button>
          <button
            type="button"
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 text-xs rounded transition-colors",
              "hover:bg-white/10 focus:bg-white/10"
            )}
            style={{ color: theme.foreground }}
            onClick={() => onQuickAction("split")}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Split
          </button>
          <button
            type="button"
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 text-xs rounded transition-colors",
              "hover:bg-white/10 focus:bg-white/10"
            )}
            style={{ color: theme.foreground }}
            onClick={() => onQuickAction("settings")}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      )}
    </aside>
  );
}
