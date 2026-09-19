export {
  TerminalUI,
  TerminalPane,
  TerminalSidebar,
  TerminalTabBar,
  CommandInput,
  createTerminalLine,
  createTerminalTab,
  getTerminalTheme,
} from "./index";

export {
  terminalThemes,
  createCustomTheme,
  ansiColorToCSS,
  getTerminalTheme as getTheme,
  createCustomTheme as createTheme,
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
  TerminalColorScheme as TerminalTheme,
} from "./terminal-theme";

export type { TerminalUIProps } from "./index";
