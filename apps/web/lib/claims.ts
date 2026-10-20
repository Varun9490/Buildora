import contrast from "../../../registry/reports/contrast.json";
import a11y from "../../../registry/reports/a11y.json";

/**
 * Every public claim on the site is read from a generated report, so the
 * numbers on the page cannot drift from the numbers CI measured.
 *
 *   registry/reports/contrast.json — written by `pnpm registry:contrast`
 *   registry/reports/a11y.json     — written by the axe-core gate in CI
 */

export const a11yClaims = {
  /** Worst measured accent pair, in both themes. */
  worstAccentRatio: contrast.summary.worstAccentRatio,
  /** Worst measured body-text pair (text, secondary, status colours). */
  worstBodyRatio: contrast.summary.worstBodyRatio,
  /** Muted text is gated at AA, not AAA — de-emphasised by design. */
  worstMutedRatio: contrast.summary.worstMutedRatio,
  /** How many colour pairs the gate measures. */
  contrastChecks: contrast.summary.checks,
  /** How many accent/theme combinations are gated. */
  accents: contrast.summary.accents,
  /** Components scanned by axe-core in CI. */
  axeComponents: a11y.components,
  /** Violations found. Zero, or the build is red. */
  axeViolations: a11y.violations,
  axeAllPass: a11y.allPass,
};

export const contrastReport = contrast;
export const a11yReport = a11y;
