import { describe, it, expect, afterEach, afterAll } from "vitest";
import * as React from "react";
import { render, cleanup } from "@testing-library/react";
import * as fs from "node:fs";
import * as path from "node:path";
import { axe } from "./axe";
import * as Components from "./index";
import { NOT_STANDALONE, PROPS } from "./fixtures";

/**
 * Accessibility gate for the whole library.
 *
 * The site claims "axe-core is a build gate, not a badge". This file is what
 * makes that true: every component exported from the barrel is rendered and
 * scanned by axe-core, so a new component cannot ship without passing.
 *
 * `color-contrast` is excluded because jsdom has no canvas — contrast is
 * gated separately by `pnpm registry:contrast`, which measures the real
 * token palette in both themes.
 *
 * The result is written to registry/reports/a11y.json so the claim on the
 * site can be backed by a committed artifact rather than a badge.
 */

/**
 * Page-level axe rules describe the *document*, not a component. A component
 * rendered into a test page has no landmarks and no <h1>, so those rules
 * would fail every component for a reason that has nothing to do with it.
 */
const PAGE_RULES = [
  "region",
  "landmark-one-main",
  "page-has-heading-one",
  "html-has-lang",
  "document-title",
  "bypass",
  "color-contrast",
];

const AXE_OPTIONS = {
  rules: Object.fromEntries(PAGE_RULES.map((id) => [id, { enabled: false }])),
};

/**
 * A minimal host for components that are only valid inside a particular
 * parent. `aria-required-parent` is not satisfied by rendering the child on
 * its own — the parent role has to exist — so the gate supplies the smallest
 * legal host rather than skipping the component.
 */
const HOST: Record<string, (C: React.ComponentType<Record<string, unknown>>) => React.ReactElement> = {
  DropdownMenuItem: (C) => (
    <div role="menu">
      <C>Item</C>
    </div>
  ),
  DropdownMenuCheckboxItem: (C) => (
    <div role="menu">
      <C checked={false} onChange={() => undefined}>
        Item
      </C>
    </div>
  ),
  ContextMenuItem: (C) => (
    <div role="menu">
      <C>Item</C>
    </div>
  ),
  ContextMenuCheckboxItem: (C) => (
    <div role="menu">
      <C checked={false} onChange={() => undefined}>
        Item
      </C>
    </div>
  ),
  NavbarItem: (C) => (
    <div role="menu">
      <C>Item</C>
    </div>
  ),
  FloatingNavbarItem: (C) => (
    <div role="menu">
      <C>Item</C>
    </div>
  ),
  BreadcrumbItem: (C) => (
    <ul>
      <C>Item</C>
    </ul>
  ),
  MobileGroupRow: (C) => (
    <ul>
      <C>Item</C>
    </ul>
  ),
  // A toast is a list item inside the provider's ordered list.
  Toast: (C) => (
    <ol>
      <C />
    </ol>
  ),
  // A table needs a caption and a header row to be meaningful.
  AdvancedTable: (C) => (
    <table>
      <caption>Data</caption>
      <tbody>
        <tr>
          <td>
            <C />
          </td>
        </tr>
      </tbody>
    </table>
  ),
};

function isComponentType(v: unknown): v is React.ComponentType<Record<string, unknown>> {
  if (typeof v === "function") return true;
  if (typeof v !== "object" || v === null) return false;
  const tag = (v as { $$typeof?: symbol }).$$typeof;
  return tag === Symbol.for("react.memo") || tag === Symbol.for("react.forward_ref");
}

const exported = Object.entries(Components).filter(
  ([name, value]) => isComponentType(value) && !NOT_STANDALONE.has(name)
);

type Violation = { rule: string; impact: string; help: string; targets: string[]; html: string[] };
type Result = { component: string; violations: Violation[]; pass: boolean };
const results: Result[] = [];

afterEach(() => cleanup());

afterAll(() => {
  const report = {
    tool: "axe-core",
    scope: "every component exported from @buildora/components",
    excludedRules: PAGE_RULES,
    components: results.length,
    componentsWithViolations: results.filter((r) => !r.pass).length,
    violations: results.reduce((n, r) => n + r.violations.length, 0),
    allPass: results.every((r) => r.pass),
    results: results
      .slice()
      .sort((a, b) => a.component.localeCompare(b.component))
      .map((r) => ({ component: r.component, pass: r.pass, violations: r.violations })),
  };
  const outDir = path.resolve(process.cwd(), "..", "..", "registry", "reports");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "a11y.json"), `${JSON.stringify(report, null, 2)}\n`);
});

describe("Accessibility gate", () => {
  it("discovers components from the barrel", () => {
    expect(exported.length).toBeGreaterThan(50);
  });

  it.each(exported.map(([name, value]) => [name, value] as const))(
    "%s has no detectable axe violations",
    async (name, Component) => {
      const props = PROPS[name] ?? {};
      const host = HOST[name];
      const { container } = render(
        host
          ? host(Component as React.ComponentType<Record<string, unknown>>)
          : React.createElement(Component, props)
      );
      const outcome = await axe(container, AXE_OPTIONS);
      const violations: Violation[] = outcome.violations.map((v) => ({
        rule: v.id,
        impact: v.impact ?? "unknown",
        help: v.help,
        targets: v.nodes.slice(0, 3).map((n) => n.target.join(" ")),
        html: v.nodes.slice(0, 2).map((n) => n.html.slice(0, 220)),
      }));
      results.push({ component: name, violations, pass: violations.length === 0 });
      expect(outcome).toHaveNoViolations();
    }
  );
});
