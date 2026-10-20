/**
 * Contrast report + WCAG gate.
 *
 * Measures the colours that actually ship, not a parallel set of tokens:
 *   1. registry/shared/tokens.css  — the file a consumer installs
 *   2. apps/web/app/globals.css    — the site's own token engine
 *
 * Gates (WCAG 2.1):
 *   body text   (--b-text) on bg/panel/surface  → AAA (7:1)
 *   secondary   (--b-text-secondary) on bg      → AAA (7:1)
 *   muted       (--b-muted) on bg                → AA  (4.5:1)
 *   accent fg on accent bg                       → AAA (7:1)
 *   iris   fg on iris   bg                       → AAA (7:1)
 *
 * An accent pair that clears 7:1 also clears 7:1 against its own theme
 * background, so accent-coloured text is AAA too.
 *
 * The report is committed; CI regenerates it and fails on drift, so a
 * colour change can never silently invalidate a claim on the site.
 *
 * Run: pnpm registry:contrast          write the report, fail on a gate
 *      pnpm registry:contrast --solve  print corrected colours, write nothing
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { wcagContrast, parse, formatHex, converter } from "culori";

const root = process.cwd();
const SOLVE = process.argv.includes("--solve");

const toOklch = converter("oklch");
const toRgb = converter("rgb");

const AAA = 7;
const AA = 4.5;

type Level = "AAA" | "AA" | "FAIL";

type Measurement = {
  background: string;
  foreground: string;
  ratio: number;
  required: number;
  level: Level;
  pass: boolean;
};

const levelOf = (r: number, required: number): Level =>
  r >= AAA ? "AAA" : r >= AA ? "AA" : "FAIL";

/** Read the `--name: value;` pairs out of a CSS block body. */
function vars(body: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
    out[m[1]] = m[2].trim();
  }
  return out;
}

/** Find the body of the first block whose selector matches.
 *  Selector matching is whitespace-tolerant: the same file may use LF or
 *  CRLF, and `:root,\n[data-theme="dark"]` must find the same block either
 *  way. */
function block(css: string, selector: string): string {
  const pattern = selector
    .split(",")
    .map((s) => s.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+"))
    .join(",\\s*");
  const re = new RegExp(`(?:^|[{};,])\\s*${pattern}\\s*\\{`, "m");
  const m = re.exec(css);
  if (!m) return "";
  const open = css.indexOf("{", m.index);
  if (open < 0) return "";
  let depth = 0;
  for (let j = open; j < css.length; j++) {
    if (css[j] === "{") depth++;
    else if (css[j] === "}") {
      depth--;
      if (depth === 0) return css.slice(open + 1, j);
    }
  }
  return "";
}

/** Measure one foreground/background pair. Returns null for unparseable input. */
function measure(bg: string, fg: string, required: number): Measurement | null {
  const b = parse(bg);
  const f = parse(fg);
  if (!b || !f) return null;
  const ratio = Number(wcagContrast(b, f).toFixed(2));
  return {
    background: bg,
    foreground: fg,
    ratio,
    required,
    level: levelOf(ratio, required),
    pass: ratio >= required,
  };
}

/**
 * Move `color` along OKLCH lightness until it clears `target` against
 * `against`. `direction` is the safe direction for the theme:
 *   "darker"  — light theme (accent must stay readable as text on paper)
 *   "lighter" — dark theme  (accent must stay luminous)
 */
function solveLightness(
  color: string,
  against: string,
  target: number,
  direction: "darker" | "lighter"
): string {
  const base = parse(color);
  const againstColor = parse(against);
  if (!base || !againstColor) return color;
  const ok = toOklch(base) as { l: number; c: number; h: number };
  const step = direction === "darker" ? -0.002 : 0.002;
  let best = color;
  for (let l = ok.l; l >= 0 && l <= 1.001; l += step) {
    const hex = formatHex(toRgb({ ...ok, l }));
    if (!hex) continue;
    const r = wcagContrast(parse(hex)!, againstColor);
    if (r >= target) {
      best = hex;
      break;
    }
  }
  return best;
}

const failures: string[] = [];

/* ── 1. The shipped token file ────────────────────────────────────────────
   This is the file a consumer installs via `shadcn add @buildora/tokens`. */
const shippedCss = fs.readFileSync(path.join(root, "registry/shared/tokens.css"), "utf8");
const shippedLight = vars(block(shippedCss, ':root,\n[data-theme="light"]'));
const shippedDark = vars(block(shippedCss, '[data-theme="dark"]'));

/* ── 2. The site's own token engine ─────────────────────────────────────── */
const siteCss = fs.readFileSync(path.join(root, "apps/web/app/globals.css"), "utf8");
const siteDark = vars(block(siteCss, ':root,\n[data-theme="dark"]'));
const siteLight = vars(block(siteCss, '[data-theme="light"]'));

type Group = Record<string, Measurement>;

function baseThemes(
  label: string,
  theme: Record<string, string>,
  target: Group
): Group {
  const bg = theme["b-bg"];
  const panel = theme["b-panel"];
  const surface = theme["b-surface"];
  const text = theme["b-text"];
  const pairs: Array<[string, string, string, number]> = [
    [`${label}.bg_vs_text`, bg, text, AAA],
    [`${label}.panel_vs_text`, panel, text, AAA],
    [`${label}.surface_vs_text`, surface, text, AAA],
    [`${label}.secondary_vs_bg`, bg, theme["b-text-secondary"], AAA],
    [`${label}.muted_vs_bg`, bg, theme["b-muted"], AA],
    [`${label}.accent_fg_on_accent`, theme["b-accent"], theme["b-accent-foreground"], AAA],
    [`${label}.iris_fg_on_iris`, theme["b-iris"], theme["b-iris-foreground"], AAA],
    [`${label}.success_vs_bg`, bg, theme["b-success"], AAA],
    [`${label}.warning_vs_bg`, bg, theme["b-warning"], AAA],
    [`${label}.danger_vs_bg`, bg, theme["b-danger"], AAA],
  ];
  for (const [name, b, f, req] of pairs) {
    if (!b || !f) continue;
    const m = measure(b, f, req);
    if (!m) continue;
    target[name] = m;
    if (!m.pass) failures.push(`${name}: ${m.ratio}:1 (needs ${m.required}:1)`);
  }
  return target;
}

const report = {
  gates: { bodyText: AAA, accentPair: AAA, mutedText: AA },
  shippedTokens: {} as Group,
  siteTheme: {} as Group,
  siteAccents: {} as Group,
};

baseThemes("shipped.light", shippedLight, report.shippedTokens);
baseThemes("shipped.dark", shippedDark, report.shippedTokens);
baseThemes("site.dark", siteDark, report.siteTheme);
baseThemes("site.light", siteLight, report.siteTheme);

/* ── 3. The five site accents, per theme ────────────────────────────────── */
const ACCENTS = ["acid", "iris", "amber", "emerald", "crimson"] as const;

for (const theme of ["light", "dark"] as const) {
  const direction = theme === "light" ? "darker" : "lighter";
  // The default accent lives on the base theme block; the rest override it.
  const baseAccent = (theme === "light" ? siteLight : siteDark)["b-accent"];
  const baseFg = (theme === "light" ? siteLight : siteDark)["b-accent-foreground"];

  for (const accent of ACCENTS) {
    const blockVars = vars(
      block(siteCss, `[data-theme="${theme}"][data-accent="${accent}"]`)
    );
    let bg = blockVars["b-accent"] ?? baseAccent;
    let fg = blockVars["b-accent-foreground"] ?? baseFg;
    if (!bg || !fg) continue;

    const name = `${accent}.${theme}`;
    const m = measure(bg, fg, AAA);
    if (!m) continue;
    report.siteAccents[name] = m;

    if (!m.pass) {
      if (SOLVE) {
        const fixed = solveLightness(bg, fg, AAA, direction);
        const after = measure(fixed, fg, AAA);
        console.log(
          `${name}: ${bg} on ${fg} = ${m.ratio}:1 → ${fixed} = ${after?.ratio}:1`
        );
      } else {
        failures.push(`${name}: ${m.ratio}:1 (needs ${AAA}:1)`);
      }
    }
  }
}

/* ── 4. Suggested fixes for the base themes ─────────────────────────────── */
if (SOLVE) {
  for (const [label, theme, direction] of [
    ["shipped.light", shippedLight, "darker"],
    ["shipped.dark", shippedDark, "lighter"],
    ["site.light", siteLight, "darker"],
    ["site.dark", siteDark, "lighter"],
  ] as const) {
    for (const [token, fgToken] of [
      ["b-accent", "b-accent-foreground"],
      ["b-iris", "b-iris-foreground"],
    ] as const) {
      const c = theme[token];
      const fg = theme[fgToken];
      if (!c || !fg) continue;
      const m = measure(c, fg, AAA);
      if (!m || m.pass) continue;
      const fixed = solveLightness(c, fg, AAA, direction);
      const after = measure(fixed, fg, AAA);
      console.log(`${label} --${token}: ${c} → ${fixed} (${m.ratio}:1 → ${after?.ratio}:1)`);
    }
    // Status colours are used as text on the theme background.
    const themeBg = theme["b-bg"];
    for (const token of ["b-success", "b-warning", "b-danger"] as const) {
      const c = theme[token];
      if (!c || !themeBg) continue;
      const m = measure(themeBg, c, AAA);
      if (!m || m.pass) continue;
      const fixed = solveLightness(c, themeBg, AAA, direction);
      const after = measure(themeBg, fixed, AAA);
      console.log(`${label} --${token}: ${c} → ${fixed} (${m.ratio}:1 → ${after?.ratio}:1)`);
    }
    const muted = theme["b-muted"];
    const bg = theme["b-bg"];
    if (muted && bg) {
      const m = measure(bg, muted, AA);
      if (m && !m.pass) {
        const fixed = solveLightness(muted, bg, AA, direction);
        const after = measure(bg, fixed, AA);
        console.log(`${label} --b-muted: ${muted} → ${fixed} (${m.ratio}:1 → ${after?.ratio}:1)`);
      }
    }
  }
}

if (SOLVE) {
  console.log("\n--solve: nothing written. Apply the values above by hand.");
  process.exit(failures.length ? 0 : 0);
}

/* ── 5. The shipped tokens and the site must ship the same palette ──────── */
const SHARED_TOKENS = [
  "b-bg", "b-panel", "b-surface", "b-elevated", "b-border", "b-border-hover",
  "b-text", "b-text-secondary", "b-muted", "b-ring", "b-success", "b-warning",
  "b-danger", "b-accent", "b-accent-foreground", "b-iris", "b-iris-foreground",
];
for (const [label, a, b] of [
  ["light", shippedLight, siteLight],
  ["dark", shippedDark, siteDark],
] as const) {
  for (const token of SHARED_TOKENS) {
    const shipped = a[token];
    const site = b[token];
    if (!shipped || !site) continue;
    if (shipped.toLowerCase() !== site.toLowerCase()) {
      failures.push(
        `palette drift ${label} --${token}: shipped ${shipped} ≠ site ${site}`
      );
    }
  }
}

/* ── 6. Write the report ────────────────────────────────────────────────── */
const bodyPairs = Object.entries(report.siteTheme).filter(([, m]) => m.required === AAA);
const mutedPairs = Object.entries(report.siteTheme).filter(([, m]) => m.required === AA);
const accentPairs = Object.values(report.siteAccents);
const all = [...Object.values(report.shippedTokens), ...Object.values(report.siteTheme), ...accentPairs];

report.summary = {
  allPass: failures.length === 0,
  checks: all.length,
  accents: Object.keys(report.siteAccents).length,
  themes: 2,
  worstAccentRatio: accentPairs.length ? Math.min(...accentPairs.map((m) => m.ratio)) : 0,
  worstBodyRatio: bodyPairs.length ? Math.min(...bodyPairs.map(([, m]) => m.ratio)) : 0,
  worstMutedRatio: mutedPairs.length ? Math.min(...mutedPairs.map(([, m]) => m.ratio)) : 0,
};

const outDir = path.join(root, "registry/reports");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "contrast.json"), `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error(`\n✗ contrast gate failed (${failures.length}):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(
  `Contrast gate passed: ${all.length} checks · worst accent ${report.summary.worstAccentRatio}:1 (AAA) · worst body ${report.summary.worstBodyRatio}:1 (AAA) · worst muted ${report.summary.worstMutedRatio}:1 (AA) → registry/reports/contrast.json`
);
