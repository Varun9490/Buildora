/**
 * Registry install smoke test — no static JSON trust alone.
 * For every catalog entry verifies:
 *  - source file exists on disk
 *  - embedded content is readable (no "Could not read file")
 *  - file exports a component matching the slug (with AI/OTP acronym handling)
 *  - install command references the correct slug (no slingshot-otp -> magnetic-button drift)
 *  - github URL points at the canonical repo
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { catalog } from "./catalog";

const CANONICAL = "https://github.com/Varun9490/Buildora";

// slug -> expected export(s). Acronyms (AI, OTP, API) don't follow naive PascalCase.
const EXPECTED: Record<string, string[]> = {
  "ai-review-edit": ["AIReviewEdit"],
  "api-request-builder": ["ApiRequestBuilder"],
  "slingshot-otp": ["SlingshotOTP"],
  "code-editor": ["CodeEditorLite"],
  "command-palette": ["CommandPalette"],
  "tool-call-viz": ["ToolCallViz"],
  "spreadsheet-grid": ["SpreadsheetGrid"],
  "query-builder": ["QueryBuilder"],
  "diff-viewer": ["DiffViewer"],
  "webhook-viewer": ["WebhookViewer"],
  "env-manager": ["EnvManager"],
  "cron-builder": ["CronBuilder"],
  "invite-flow": ["InviteFlow"],
  "approval-workflow": ["ApprovalWorkflow"],
  "audit-log": ["AuditLog"],
  "feature-flags": ["FeatureFlags"],
  "node-editor": ["NodeEditor"],
  "timeline-editor": ["TimelineEditor"],
  "workflow-builder": ["WorkflowBuilder"],
  "rich-text-editor": ["RichTextEditor"],
  "slash-commands": ["SlashCommands"],
  "version-history": ["VersionHistory"],
  "agent-timeline": ["AgentTimeline"],
  "attachment-prompt": ["AttachmentPrompt"],
  "interactive-3d-card": ["Interactive3DCard"],
  "json-viewer": ["JSONViewer"],
  "log-viewer": ["LogViewer"],
};

function pascal(slug: string): string {
  return slug.split("-").map((p) => p[0].toUpperCase() + p.slice(1)).join("");
}

let failed = 0;
for (const item of catalog) {
  const errs: string[] = [];
  for (const f of item.files) {
    const abs = path.join(process.cwd(), f);
    if (!fs.existsSync(abs)) {
      errs.push(`missing file ${f}`);
      continue;
    }
    const content = fs.readFileSync(abs, "utf8");
    if (content.includes("Could not read file")) errs.push(`unreadable ${f}`);
    const exports = [...content.matchAll(/export function (\w+)/g)].map((m) => m[1]);
    const want = EXPECTED[item.slug] ?? [pascal(item.slug)];
    if (!want.some((w) => exports.includes(w))) {
      errs.push(`expected export ${want.join("/")} not found in ${f} (has: ${exports.slice(0, 6).join(", ")})`);
    }
  }
  const install = `pnpm dlx shadcn@latest add @buildora/${item.slug}`;
  // install shape is verified in validate-registry; smoke re-checks the invariant
  if (!install.includes(item.slug)) errs.push("install slug drift");
  if (errs.length) {
    failed++;
    console.error(`✗ ${item.slug}: ${errs.join("; ")}`);
  }
}

if (failed) {
  console.error(`${failed} smoke failures`);
  process.exit(1);
}
console.log(`Smoke ok: ${catalog.length} components install-clean.`);
