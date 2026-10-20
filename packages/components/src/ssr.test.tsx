// @vitest-environment node
import { describe, it, expect } from "vitest";
import * as React from "react";
import { renderToString } from "react-dom/server";
import * as Components from "./index";
import { NOT_STANDALONE, PROPS } from "./fixtures";

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

/** Functions are components; objects are components only when they are a memo or
 * forwardRef wrapper. Plain objects re-exported alongside components (e.g.
 * `createTerminalLine`) are helpers and must not be rendered. */
export function isComponentType(v: unknown): v is React.ComponentType<Record<string, unknown>> {
  if (typeof v === "function") return true;
  if (typeof v !== "object" || v === null) return false;
  const tag = (v as { $$typeof?: symbol }).$$typeof;
  return tag === Symbol.for("react.memo") || tag === Symbol.for("react.forward_ref");
}

export const exported = Object.entries(Components).filter(
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
