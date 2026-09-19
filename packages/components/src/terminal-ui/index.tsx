"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { TerminalPane, type TerminalLine, createTerminalLine } from "./terminal-pane";
import { TerminalSidebar, type FileTreeNode, type TerminalSession } from "./terminal-sidebar";
import { TerminalTabBar, type TerminalTab, createTerminalTab } from "./terminal-tab-bar";
import { CommandInput } from "./command-input";
import {
  getTerminalTheme,
  type TerminalColorScheme,
  type TerminalThemeName,
} from "./terminal-theme";

export interface TerminalUIProps {
  theme?: TerminalThemeName | TerminalColorScheme;
  initialTabs?: TerminalTab[];
  initialCommands?: string[];
  files?: FileTreeNode[];
  sessions?: TerminalSession[];
  defaultCwd?: string;
  fontSize?: number;
  fontFamily?: string;
  scrollback?: number;
  showSidebar?: boolean;
  sidebarCollapsed?: boolean;
  showCommandInput?: boolean;
  multilineInput?: boolean;
  highlightSyntax?: boolean;
  autoFocus?: boolean;
  onCommand?: (command: string, tabId: string) => void;
  onTabChange?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  onTabAdd?: () => void;
  onFileClick?: (path: string) => void;
  onSessionClick?: (sessionId: string) => void;
  onSessionTerminate?: (sessionId: string) => void;
  onQuickAction?: (action: "new" | "split" | "settings") => void;
  className?: string;
}

const defaultFiles: FileTreeNode[] = [
  {
    name: "buildora",
    path: "/buildora",
    type: "folder",
    children: [
      {
        name: "packages",
        path: "/buildora/packages",
        type: "folder",
        children: [
          { name: "components", path: "/buildora/packages/components", type: "folder" },
          { name: "utils", path: "/buildora/packages/utils", type: "folder" },
          { name: "hooks", path: "/buildora/packages/hooks", type: "folder" },
          { name: "tokens", path: "/buildora/packages/tokens", type: "folder" },
        ],
      },
      {
        name: "apps",
        path: "/buildora/apps",
        type: "folder",
        children: [
          { name: "web", path: "/buildora/apps/web", type: "folder" },
        ],
      },
      { name: "package.json", path: "/buildora/package.json", type: "file" },
      { name: "pnpm-workspace.yaml", path: "/buildora/pnpm-workspace.yaml", type: "file" },
      { name: "tsconfig.json", path: "/buildora/tsconfig.json", type: "file" },
    ],
  },
];

export function TerminalUI({
  theme: themeProp = "dracula",
  initialTabs,
  initialCommands,
  files = defaultFiles,
  sessions = [],
  defaultCwd = "~/buildora",
  fontSize = 12,
  fontFamily = "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, monospace",
  scrollback = 10000,
  showSidebar = true,
  sidebarCollapsed = false,
  showCommandInput = true,
  multilineInput = false,
  highlightSyntax = true,
  autoFocus = true,
  onCommand,
  onTabChange,
  onTabClose,
  onTabAdd,
  onFileClick,
  onSessionClick,
  onSessionTerminate,
  onQuickAction,
  className,
}: TerminalUIProps) {
  const theme: TerminalColorScheme = typeof themeProp === "string"
    ? getTerminalTheme(themeProp)
    : themeProp;
  
  const [tabs, setTabs] = React.useState<TerminalTab[]>(
    initialTabs ?? [createTerminalTab("bash", { cwd: defaultCwd, process: "bash" })]
  );
  const [activeTab, setActiveTab] = React.useState<string>(tabs[0]?.id ?? "");
  const [sidebarCollapsedState, setSidebarCollapsedState] = React.useState(sidebarCollapsed);
  
  const [terminalBuffers, setTerminalBuffers] = React.useState<Record<string, TerminalLine[]>>(() => {
    const initial: Record<string, TerminalLine[]> = {};
    const welcomeLines = [
      createTerminalLine(`Welcome to Buildora Terminal`, { type: "system" }),
      createTerminalLine(`Theme: ${theme.name}`, { type: "system", ansi: false }),
      createTerminalLine(``, { type: "output" }),
    ];
    
    if (initialCommands) {
      initialCommands.forEach((cmd) => {
        welcomeLines.push(createTerminalLine(`$ ${cmd}`, { type: "input" }));
        welcomeLines.push(createTerminalLine(`→ executed: ${cmd}`, { type: "success" }));
      });
    }
    
    tabs.forEach((tab) => {
      initial[tab.id] = [...welcomeLines];
    });
    return initial;
  });
  
  const [commandHistory, setCommandHistory] = React.useState<string[]>([]);
  
  const handleCommandSubmit = React.useCallback((command: string) => {
    if (!command.trim()) return;
    
    const newLine = createTerminalLine(`$ ${command}`, { type: "input" });
    const outputLine = createTerminalLine(`→ Running: ${command}`, { type: "output" });
    
    setCommandHistory((prev) => [...prev, command]);
    setTerminalBuffers((prev) => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] ?? []), newLine, outputLine],
    }));
    
    onCommand?.(command, activeTab);
  }, [activeTab, onCommand]);
  
  const handleTabChange = React.useCallback((tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  }, [onTabChange]);
  
  const handleTabClose = React.useCallback((tabId: string) => {
    setTabs((prev) => {
      const newTabs = prev.filter((t) => t.id !== tabId);
      if (newTabs.length === 0) {
        newTabs.push(createTerminalTab("bash", { cwd: defaultCwd }));
        setTerminalBuffers((prevBuffs) => {
          const newBuffer: Record<string, TerminalLine[]> = {};
          newTabs.forEach((t) => {
            newBuffer[t.id] = prevBuffs[t.id] ?? [];
          });
          return newBuffer;
        });
      }
      if (activeTab === tabId) {
        setActiveTab(newTabs[0]?.id ?? "");
      }
      return newTabs;
    });
    onTabClose?.(tabId);
  }, [activeTab, defaultCwd, onTabClose]);
  
  const handleTabAdd = React.useCallback(() => {
    const newTab = createTerminalTab(`term-${tabs.length + 1}`, { cwd: defaultCwd });
    setTabs((prev) => [...prev, newTab]);
    setTerminalBuffers((prev) => ({
      ...prev,
      [newTab.id]: [createTerminalLine(`New terminal session`, { type: "system" })],
    }));
    setActiveTab(newTab.id);
    onTabAdd?.();
  }, [tabs.length, defaultCwd, onTabAdd]);
  
  const handleQuickAction = React.useCallback((action: "new" | "split" | "settings") => {
    if (action === "new") {
      handleTabAdd();
    }
    onQuickAction?.(action);
  }, [handleTabAdd, onQuickAction]);
  
  const activeLines = terminalBuffers[activeTab] ?? [];
  
  return (
    <div
      className={cn(
        "flex h-full w-full overflow-hidden",
        className
      )}
      style={{ backgroundColor: theme.background }}
    >
      {showSidebar && (
        <TerminalSidebar
          theme={theme}
          collapsed={sidebarCollapsedState}
          onCollapseChange={setSidebarCollapsedState}
          files={files}
          sessions={sessions}
          processes={sessions.map((s) => ({ ...s, pid: Math.floor(Math.random() * 10000) }))}
          activeSession={activeTab}
          onFileClick={onFileClick ?? (() => {})}
          onSessionClick={onSessionClick}
          onSessionTerminate={onSessionTerminate}
          onQuickAction={handleQuickAction}
        />
      )}
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <TerminalTabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onTabClose={handleTabClose}
          onTabAdd={handleTabAdd}
          theme={theme}
        />
        
        <TerminalPane
          lines={activeLines}
          theme={theme}
          scrollback={scrollback}
          fontSize={fontSize}
          fontFamily={fontFamily}
          className="flex-1"
        />
        
        {showCommandInput && (
          <div className="border-t" style={{ borderColor: theme.brightBlack, padding: "8px" }}>
            <CommandInput
              theme={theme}
              history={commandHistory}
              onSubmit={handleCommandSubmit}
              multiline={multilineInput}
              showLineNumbers={multilineInput}
              highlight={highlightSyntax}
              autoFocus={autoFocus}
              suggestions={[
                { text: "npm install", description: "Install dependencies" },
                { text: "npm run dev", description: "Start dev server" },
                { text: "npm run build", description: "Build project" },
                { text: "npm run test", description: "Run tests" },
                { text: "git status", description: "Check git status" },
                { text: "git diff", description: "Show changes" },
                { text: "pnpm install", description: "Install with pnpm" },
                { text: "pnpm dev", description: "Start dev server" },
                { text: "clear", description: "Clear terminal" },
                { text: "ls -la", description: "List files" },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export {
  TerminalPane,
  TerminalSidebar,
  TerminalTabBar,
  CommandInput,
  createTerminalLine,
  createTerminalTab,
  getTerminalTheme,
};

export {
  terminalThemes,
  createCustomTheme,
  ansiColorToCSS,
} from "./terminal-theme";

export type {
  TerminalLine,
  TerminalPaneProps,
} from "./terminal-pane";

export type {
  TerminalTab,
  TerminalTabBarProps,
} from "./terminal-tab-bar";

export type {
  FileTreeNode,
  TerminalSession,
  TerminalSidebarProps,
} from "./terminal-sidebar";

export type {
  CommandSuggestion,
  CommandInputProps,
} from "./command-input";

export type {
  TerminalColorScheme,
  TerminalThemeName,
} from "./terminal-theme";
