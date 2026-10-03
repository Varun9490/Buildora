import axeCore, { type AxeResults, type RunOptions } from "axe-core";

/**
 * axe-core, configured for jsdom.
 *
 * `color-contrast` is disabled because axe resolves contrast through a canvas
 * 2D context, which jsdom does not implement; the rule would either throw or
 * report meaningless results. Contrast is verified separately against a real
 * browser.
 */
const DEFAULT_OPTIONS: RunOptions = {
  rules: {
    "color-contrast": { enabled: false },
  },
};

export function axe(element: Element, options: RunOptions = {}): Promise<AxeResults> {
  return axeCore.run(element, {
    ...DEFAULT_OPTIONS,
    ...options,
    rules: { ...DEFAULT_OPTIONS.rules, ...options.rules },
  });
}