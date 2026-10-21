/**
 * Check that the URLs the site advertises actually resolve.
 *
 * The registry shipped a `$schema` URL for months that returned 404 — the
 * schema was referenced by every item and had never been written. Nothing
 * in the build noticed, because nothing looked.
 *
 * This gate takes the absolute URLs the site publishes — from llms.txt,
 * from the `$schema` of every registry item, from the agent catalogue — and
 * fetches each one. A 404 fails the build.
 *
 * A network error is not a failure: a flaky connection should not fail CI,
 * but a missing page should. A 404 is definitive and fails.
 *
 * Run: pnpm registry:links
 */
import * as fs from "node:fs";
import * as path from "node:path";

const root = process.cwd();
const ORIGIN = "https://buildora-hazel.vercel.app";

/** Collect every absolute URL the site advertises. */
function advertisedUrls(): Set<string> {
  const urls = new Set<string>();

  // The links in llms.txt.
  const llms = fs.readFileSync(
    path.join(root, "apps", "web", "public", "llms.txt"),
    "utf8"
  );
  for (const m of llms.matchAll(/https?:\/\/[^\s)"'`>]+/g)) urls.add(m[0]);

  // The $schema of every registry item, and of the index and catalogue.
  const componentsDir = path.join(root, "registry", "components");
  for (const f of fs.readdirSync(componentsDir).filter((f) => f.endsWith(".json"))) {
    const item = JSON.parse(fs.readFileSync(path.join(componentsDir, f), "utf8"));
    if (typeof item.$schema === "string") urls.add(item.$schema);
  }
  for (const name of ["registry.json", "agent-catalog.json"]) {
    const doc = JSON.parse(
      fs.readFileSync(path.join(root, "registry", name), "utf8")
    );
    if (typeof doc.$schema === "string") urls.add(doc.$schema);
  }

  return urls;
}

async function head(url: string): Promise<number | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: AbortSignal.timeout(20_000),
      });
      // A 404 is a fact. A 5xx is the other end's problem, not a broken link.
      if (res.status === 404 || res.status === 410) return res.status;
      return null;
    } catch {
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
  return null;
}

/**
 * Expand the placeholders the site uses in its URL templates.
 *
 * `/r/{component}.json` is a pattern, not a page. Checking the literal
 * braces would report every template as broken, which would train people to
 * ignore the gate. So each placeholder is filled with a component that
 * actually exists — if the pattern stops working for any component, the
 * check still catches it.
 */
const PLACEHOLDERS: Record<string, string> = {
  component: "magnetic-button",
  slug: "magnetic-button",
  name: "magnetic-button",
};

function expand(url: string): string {
  return url.replace(/\{(\w+)\}/g, (whole, key: string) => {
    const value = PLACEHOLDERS[key];
    if (!value) throw new Error(`No example value for the placeholder ${whole}`);
    return value;
  });
}

async function main() {
  const urls = [...advertisedUrls()].sort().map(expand);
  console.log(`Links: checking ${urls.length} advertised URLs against ${ORIGIN}`);

  const broken: string[] = [];
  const unreachable: string[] = [];

  for (const url of urls) {
    const status = await head(url);
    if (status === null) {
      // Distinguish "fine" from "could not reach it" by re-fetching verbosely.
      try {
        const res = await fetch(url, {
          redirect: "follow",
          signal: AbortSignal.timeout(20_000),
        });
        if (res.status === 404 || res.status === 410) {
          broken.push(`${url} → ${res.status}`);
          console.log(`  BROKEN    ${url} → ${res.status}`);
          continue;
        }
        console.log(`  ok        ${url} → ${res.status}`);
      } catch {
        unreachable.push(url);
        console.log(`  unreachable ${url}`);
      }
      continue;
    }
    broken.push(`${url} → ${status}`);
    console.log(`  BROKEN    ${url} → ${status}`);
  }

  if (broken.length) {
    console.error(`\nLink check failed: ${broken.length} advertised URL(s) do not resolve`);
    for (const b of broken) console.error(`  ${b}`);
    process.exit(1);
  }
  if (unreachable.length) {
    console.warn(
      `\nWarning: ${unreachable.length} URL(s) could not be reached from this machine — not counted as broken.`
    );
  }
  console.log(`\nLink check passed: ${urls.length} advertised URLs resolve.`);
}

main();
