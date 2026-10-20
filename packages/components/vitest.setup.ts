import "@testing-library/jest-dom/vitest";
import { expect } from "vitest";
import type { AxeResults } from "axe-core";

/**
 * `expect(await axe(el)).toHaveNoViolations()`
 *
 * Implemented locally because vitest-axe@0.1.0 declares the matcher in its
 * types but does not export it at runtime.
 */
expect.extend({
  toHaveNoViolations(received: AxeResults) {
    const violations = received?.violations ?? [];
    const pass = violations.length === 0;
    const detail = violations
      .map((v) => {
        const nodes = (v.nodes ?? []).slice(0, 3).map((n) => n.target.join(" ")).join("\n      ");
        return `  - ${v.id} (${v.impact}): ${v.help}\n      ${nodes}`;
      })
      .join("\n");
    return {
      pass,
      message: () =>
        `Expected no axe violations, found ${violations.length}:\n${detail}`,
    };
  },
});

declare module "vitest" {
  interface Assertion<T = any> {
    toHaveNoViolations(): T;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): T;
  }
}

if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false
    })
  });
}

if (typeof Element !== "undefined" && !Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => undefined;
}

/**
 * jsdom has no canvas implementation, so axe's color-contrast rule throws.
 * Disable it for unit tests; contrast is covered separately in CI with a
 * real browser.
 */
if (typeof HTMLCanvasElement !== "undefined") {
  HTMLCanvasElement.prototype.getContext = (() => null) as HTMLCanvasElement["getContext"];
}

// jsdom lacks ResizeObserver/IntersectionObserver, which several components observe.
// jsdom does not implement scrollTo; components that keep a scroll position
// (terminal output, virtualised lists) call it on mount.
if (typeof Element !== "undefined" && !Element.prototype.scrollTo) {
  Element.prototype.scrollTo = function scrollTo() {} as Element["scrollTo"];
}

if (typeof globalThis.ResizeObserver === "undefined") {  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

if (typeof globalThis.IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver = class {
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds: ReadonlyArray<number> = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  } as unknown as typeof IntersectionObserver;
}

// jsdom has no PointerEvent global; motion-dom press gestures construct one on
// keyboard activation, so provide a minimal implementation.
if (typeof globalThis.PointerEvent === "undefined" && typeof MouseEvent !== "undefined") {
  class PointerEventPolyfill extends MouseEvent {
    pointerId: number;
    pointerType: string;
    isPrimary: boolean;
    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
      this.pointerId = params.pointerId ?? 1;
      this.pointerType = params.pointerType ?? "mouse";
      this.isPrimary = params.isPrimary ?? true;
    }
  }
  globalThis.PointerEvent = PointerEventPolyfill as unknown as typeof PointerEvent;
}