# Security Audit — Buildora (TASK-063)

Date: 2026-09-26 (UTC)
Scope: `pnpm audit` (read-only), `package.json` deps, `scripts/*.ts` unsafe patterns (`eval`/`execCommand`/`innerHTML`/`dangerouslySetInnerHTML`), secrets in committed files (excluding `.env.local`), client-side env leakage (`NEXT_PUBLIC_*`).
Method: no source modifications. Commands: `pnpm audit --prod`, `git grep`, `grep` for unsafe sinks, inspection of `apps/web/package.json`, `apps/web/app/layout.tsx`, `scripts/verify-install.ts`, `registry/**/rich-text-editor.json`.

## Summary counts
- `pnpm audit --prod`: **27 vulnerabilities — 2 critical, 10 high, 13 moderate, 2 low**
- Unsafe sinks in `scripts/`: **0 × eval / new Function / innerHTML / dangerouslySetInnerHTML**; `execSync` present in 1 dev-only script
- Unsafe sinks in app/registry: **1 × dangerouslySetInnerHTML (safe pattern), 1 × document.execCommand (deprecated)**
- Committed secrets: **none found**
- `NEXT_PUBLIC_*` leakage: **none (only public site URL)**

## Findings

| ID | Area | Finding | Evidence | Severity | Recommendation |
|----|------|---------|----------|----------|----------------|
| F1 | deps: `next@14.2.x` | 2× Critical RCE: Windows-hosted RCE (GHSA-p293-qw3h-jr36), Image Optimization AVIF RCE (GHSA-2xp9-vwfh-vxw4). Vulnerable range includes `^14.2.18`; patched `>=15.5.24` | `apps/web/package.json:21` `"next": "^14.2.18"`; `pnpm audit` paths `apps__web>next` | **Critical** | Upgrade `apps/web` to `next >=15.5.24` (or latest 15.x). Test `next build`, templates, `registry:verify-install` matrix. If staying on 14.x is required, backport patches / isolate Windows hosts, disable AVIF optimization, add WAF rules — upgrade is strongly preferred |
| F2 | deps: `next@14.2.x` | 8× High: RSC deserialization DoS, Server Components DoS (×2), SSRF via WebSocket upgrade, middleware/proxy bypass (i18n Pages Router), Server Actions DoS + SSRF, SSRF via rewrites | `pnpm audit` — GHSA-h25m-26qc-wcjf, -q4gf-8mx6-v5v3, -8h8q-6873-q5fj, -c4j6-fc7j-m34r, -36qx-fr4f-26g5, -m99w-x7hq-7vfj, -89xv-2m56-2m9x, -p9j2-gv94-2wf4 | **High** | Same fix as F1: upgrade Next.js. Interim: validate `rewrites` destinations allowlist, restrict WebSocket upgrades, rate-limit Server Actions |
| F3 | deps: `postcss` via `next` | 2× High arbitrary file read / path traversal via `sourceMappingURL` (GHSA-6g55-p6wh-862q, GHSA-r28c-9q8g-f849). Patched `>=8.5.12` / `>=8.5.18`; repo pulls `postcss ^8.4.47` via Next | `apps/web/package.json:33`; audit paths `apps__web>next>postcss` | **High** | Upgrade Next.js (pulls fixed postcss) and/or force `postcss >=8.5.18` via pnpm overrides. Do not build untrusted CSS with sourcemaps in CI |
| F4 | deps: moderate/low | 13× Moderate + 2× Low: image-optimizer DoS, request-smuggling in rewrites, next/image disk-cache growth, postcss XSS via `</style>`, Next XSS in App Router / beforeInteractive, RSC cache poisoning/confusion, Server Action payload, internal Server info disclosure | `pnpm audit` severity line: `2 low \| 13 moderate \| 10 high \| 2 critical` | **Medium** | Covered by Next.js + postcss upgrade. Add `images.remotePatterns` allowlist, set `experimental.serverActions.bodySizeLimit`, enable disk-cache limits, deploy CSP |
| F5 | registry: `rich-text-editor` | Uses deprecated `document.execCommand(c)` + `contentEditable` div, reads `innerText`, no sanitization, no controlled `value`/`onChange` | `registry/components/rich-text-editor.json:115`, `registry/generated/rich-text-editor.json:20`: `document.execCommand(c, false)` | **Medium** | Migrate off `execCommand` (deprecated, inconsistent) to `Selection`/`Range` API or Tiptap/Slate/Lexical. Sanitize paste/output (e.g. DOMPurify), add controlled `value`/`onChange`, document XSS risk if HTML is persisted/rendered |
| F6 | app: `layout.tsx` theme inline script | `dangerouslySetInnerHTML={{ __html: \`(${themeInit.toString()})()\` }}` — only static local function, no user input; standard FOUC-avoidance pattern | `apps/web/app/layout.tsx:41-57,72` | **Low (info)** | Keep, but consider `next/script` with `strategy="beforeInteractive"` + CSP `nonce`/`hash`, keep function self-contained (no closures/imports) as it is now |
| F7 | scripts: `verify-install.ts` | 6× `execSync` with `shell: powershell.exe | /bin/sh`; interpolates temp `dir` (quoted) and static scaffold strings; `REGISTRY_URL` from env into `shadcn add --registry "${REGISTRY_URL}"` (quoted). Matrix mode only (`--matrix`), not default CI | `scripts/verify-install.ts:25,164-174,157` | **Low** | Keep matrix opt-in. Harden: prefer `execFileSync` + arg arrays, validate `BUILDORA_REGISTRY_URL` against `https://` allowlist, keep quoting as-is. Never pass untrusted `--only`/`--app` into shell without validation |
| F8 | secrets in repo | `git grep -i api_key\|secret\|token\|password\|private_key` (excluding `.env.local`, lockfiles): only false positives (`design tokens`, `token strategy`, `compliance token`, `SHOPIFY_API_KEY` placeholder in skill docs, `serverToken` in impeccable scripts). No keys, no private keys, no passwords committed | `git ls-files` shows no `.env*` tracked; `.gitignore` has `.env*.local` + `.env*` | **None (pass)** | No action. Keep `.env*` ignored, add pre-commit secret scan (gitleaks/trufflehog) + GitHub secret scanning |
| F9 | client env leakage | Only `NEXT_PUBLIC_SITE_URL` with public fallback `https://buildora-hazel.vercel.app`; used for `metadataBase`/site URL. No `NEXT_PUBLIC_*` secrets | `apps/web/app/layout.tsx:29`, `apps/web/lib/site.ts:2`; `.env.local` (untracked, not audited for values) contains only `VERCEL_OIDC_TOKEN` placeholder per name-masked read | **None (pass)** | No action. Policy: never add `NEXT_PUBLIC_*` secrets; keep server-only keys in server env, document in README |

## Notes / non-issues
- Root `package.json` deps are minimal (`next`, `tsx`, `typescript`, `culori`, `glob` as devDeps) — no typosquat / install-script red flags observed.
- `scripts/audit.ts` mentions `execCommand` only as a detector keyword, not a sink.
- No `eval(`, `new Function(`, `innerHTML`, `child_process spawn` sinks in `scripts/` besides F7.
- `.env.local` exists locally but is gitignored; values were not copied into this report (names only).

## Recommended next steps (no code changed)
1. Upgrade `next` → `>=15.5.24` + `postcss >=8.5.18`, run `pnpm audit`, `pnpm build`, `registry:verify-install`.
2. Harden/replace `rich-text-editor` (F5) if shipped to users.
3. Add CSP + `remotePatterns` + Server Action limits on deploy.
4. Add gitleaks step to CI (read-only enforcement).
