import * as fs from "node:fs";
import * as path from "node:path";

const toDelete = [
  // TUI
  "tui-panel", "tui-status-bar", "tui-header", "tui-footer", "tui-table", "tui-tree", 
  "tui-list", "tui-form", "tui-select", "tui-multi-select", "tui-progress", "tui-spinner", 
  "tui-gauge", "tui-sparkline", "tui-log-viewer", "tui-help-overlay", "tui-diff-viewer", 
  "terminal-workspace",
  // Demos
  "pricing-table", "team-switcher", "invite-flow", "onboarding-checklist", "approval-workflow", 
  "audit-log", "feature-flags", "env-manager", "cron-builder", "webhook-viewer", 
  "api-request-builder", "usage-dashboard",
  // Fake implementations
  "code-editor", "markdown-editor", "spreadsheet-grid", "node-editor", "timeline-editor", "workflow-builder",
  // Components to be merged
  "noise-background", "grid-background", "dot-grid-background", "gradient-mesh-background", 
  "aurora-beam-background", "ripple-background", "meteor-background", "beam-background",
  "glow-cursor", "blob-cursor", "trail-cursor", "ghost-cursor", "spotlight-cursor",
  "ripple-button", "shimmer-button", "glow-button", "gradient-border-button",
  "glare-card", "spotlight-card", "wobble-card", "glass-card",
  "typewriter", "scrambled-text", "blur-text", "gradient-text", "glitch-text",
  "spatial-command-palette", "command-bar"
];

const catalogPath = path.join(process.cwd(), "scripts/catalog.ts");
let catalog = fs.readFileSync(catalogPath, "utf8");

for (const slug of toDelete) {
  const dirPath = path.join(process.cwd(), "packages/components/src", slug);
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`Deleted folder: ${slug}`);
  }
  
  // R("slug" ... ) or R('slug' ... )
  // We need to match R("slug" followed by anything until the next R( or the end of array ]
  const regex = new RegExp(`\\s*R\\(["']${slug}["'].*?\\)(?=\\s*,?\\s*(?:R\\(|//|\\]))`, 'gs');
  catalog = catalog.replace(regex, '');
}

fs.writeFileSync(catalogPath, catalog);
console.log(`Cleanup script completed. Original length: ${catalog.length}.`);
