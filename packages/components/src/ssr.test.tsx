// @vitest-environment node
import { describe, it, expect } from "vitest";
import * as React from "react";
import { renderToString } from "react-dom/server";
import * as Components from "./index";

/**
 * Server-render safety net.
 *
 * This file runs in the `node` environment, so `window` and `document` do not
 * exist at all — the same condition as a real SSR request. jsdom-based tests
 * can never catch this class of bug because jsdom always supplies a DOM.
 *
 * Reading either global during render is a bug: it either throws on the server
 * or causes a hydration mismatch, because the client's first render can differ
 * from the server's HTML.
 */

/** Hooks and context-only subcomponents are not standalone; they are covered by
 * tests for the components that provide their context. */
const NOT_STANDALONE = new Set([
  // hooks
  "useToast",
  "useModalStack",
  // context-only children
  "TabsTrigger",
  "TabsContent",
  "AccordionItem",
  "AccordionTrigger",
  "SidebarHeader",
  "SidebarContent",
  "SidebarFooter",
  "SidebarGroup",
  "SidebarMenu",
  "SidebarTrigger",
  "SidebarSection",
  "SidebarItem",
  "SidebarToggle",
  "ExpandableSidebarHeader",
  "ExpandableSidebarItem",
  "MobileNavItem",
  "StepNavItem",
  "PaginationButton",
  "PaginationPrev",
  "PaginationNext",
  "CommandBarItem",
  "CommandBarTrigger",
  "springStep",
  // terminal helpers re-exported next to the components
  "createTerminalLine",
  "createTerminalTab",
  "getTerminalTheme",
  "createCustomTheme",
  "ansiColorToCSS",
]);

/** Fixtures for components with required props. Rendering them bare would fail
 * on a missing prop, which says nothing about SSR safety. */
const PROPS: Record<string, Record<string, unknown>> = {
  BlurText: { text: "hello" },
  TUIStatusBar: { items: [{ label: "ok", value: "ready" }] },
  TUITable: { columns: [{ key: "a", label: "A" }], rows: [{ id: "1", a: "1" }] },
  TUITree: { nodes: [{ id: "1", label: "root" }] },
  TUIList: { items: [{ id: "1", label: "one" }] },
  TUIForm: { fields: [{ name: "a", label: "A" }] },
  TUISelect: { options: [{ value: "a", label: "A" }] },
  TUIMultiSelect: { options: [{ value: "a", label: "A" }], selected: [] },
  TUISparkline: { data: [1, 2, 3] },
  TUILogViewer: { entries: [{ id: "1", level: "info", message: "ready", timestamp: "00:00" }] },
  TUIHelpOverlay: { bindings: [], visible: false },
  TUIDiffViewer: { hunks: [] },
  TerminalPane: { lines: [], theme: {} },
  TerminalSidebar: { theme: {} },
  TerminalTabBar: { theme: {}, tabs: [], activeTab: null },
  CommandInput: { theme: {} },
  KbdShortcut: { keys: ["Ctrl", "K"] },
  HandwrittenAnnotation: { text: "note" },
  VerticalTimeline: { entries: [{ title: "Kickoff" }] },
  MatrixDecode: { text: "hello" },
  RgbGlitchText: { text: "hello" },
  NumberWheel: { value: 42 },
  InlineWordRoll: { words: ["one", "two"] },
  EchoStack: { text: "hello" },
  SelectionSnap: { text: "hello" },
  PeriodDrop: { text: "hello" },
  TypeWall: { words: ["one", "two"] },
};

/** Functions are components; objects are components only when they are a memo or
 * forwardRef wrapper. Plain objects re-exported alongside components (e.g.
 * `createTerminalLine`) are helpers and must not be rendered. */
function isComponentType(v: unknown): v is React.ComponentType<Record<string, unknown>> {
  if (typeof v === "function") return true;
  if (typeof v !== "object" || v === null) return false;
  const tag = (v as { $$typeof?: symbol }).$$typeof;
  return tag === Symbol.for("react.memo") || tag === Symbol.for("react.forward_ref");
}

const exported = Object.entries(Components).filter(
  ([name, value]) => isComponentType(value) && !NOT_STANDALONE.has(name)
);

describe("SSR safety", () => {
  it("runs without a DOM present", () => {
    expect(typeof window).toBe("undefined");
    expect(typeof document).toBe("undefined");
  });

  it("discovers components from the barrel", () => {
    expect(exported.length).toBeGreaterThan(50);
  });

  it.each(exported.map(([name, value]) => [name, value] as const))(
    "%s renders to a string on the server",
    (name, Component) => {
      const html = renderToString(React.createElement(Component, PROPS[name] ?? {}));
      expect(typeof html).toBe("string");
    }
  );
});