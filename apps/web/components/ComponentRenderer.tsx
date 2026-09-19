"use client";

import * as React from "react";
import {
  MagneticButton, LiquidButton, MagneticCard, SlingshotOTP,
  InteractiveDropzone, SpatialCommandPalette, CreativeNotifications,
  AuroraBackground, ParticleField, CursorSpotlight, MorphingTypography,
  HolographicCard, Interactive3DCard, TactileLoader,
  StreamingChat, TokenMeter, ModelSelector, ToolCallViz,
  AdvancedTable, JSONViewer, LogViewer,
  Terminal, FileTree, CodeEditorLite,
  PricingTable, TeamSwitcher, OnboardingChecklist, UsageDashboard,
  Kanban, Calendar,
  MarkdownEditor, MentionInput, CommentThread
} from "@buildora/components";

export type Controls = { strength: number; radius: number; intensity: number; speed: number; glow: boolean; scale: number };

/** Registry-driven renderer: one slug → live React component. */
export function ComponentRenderer({ slug, controls }: { slug: string; controls: Controls }) {
  const wrap = (node: React.ReactNode) => (
    <div style={{ transform: `scale(${controls.scale})`, transition: "transform .2s" }} className="origin-top">{node}</div>
  );

  switch (slug) {
    case "magnetic-button": return wrap(<div className="flex gap-2"><MagneticButton strength={controls.strength} radius={controls.radius}>Ship it</MagneticButton><MagneticButton variant="ghost" strength={controls.strength}>Ghost</MagneticButton><MagneticButton variant="iris" strength={controls.strength}>Iris</MagneticButton></div>);
    case "liquid-button": return wrap(<LiquidButton intensity={controls.intensity}>Liquid action</LiquidButton>);
    case "magnetic-card": return wrap(<MagneticCard tilt={8 * controls.intensity + 2}><p className="font-bold">Magnetic card</p><p className="text-sm text-white/60">Tilt + spotlight. Focus with Tab.</p></MagneticCard>);
    case "slingshot-otp": return wrap(<SlingshotOTP length={6} onComplete={() => undefined} />);
    case "interactive-dropzone": case "attachment-prompt": return wrap(<InteractiveDropzone />);
    case "spatial-command-palette": case "command-palette": return wrap(<SpatialCommandPalette />);
    case "cursor-spotlight": return wrap(<CursorSpotlight><p className="font-bold">Move inside me</p><p className="text-sm text-white/60">Spotlight follows the cursor.</p></CursorSpotlight>);
    case "aurora-background": return wrap(<AuroraBackground className="p-8"><p className="font-display text-xl font-black">Aurora</p><p className="text-sm text-white/60">Pure CSS drift. Reduced-motion safe.</p></AuroraBackground>);
    case "particle-field": return wrap(<ParticleField count={Math.round(40 + controls.intensity * 80)} />);
    case "morphing-typography": return wrap(<MorphingTypography />);
    case "holographic-card": return wrap(<HolographicCard><p className="font-bold">Holographic</p><p className="text-sm text-white/60">Sheen tracks pointer.</p></HolographicCard>);
    case "interactive-3d-card": return wrap(<Interactive3DCard><p className="font-bold">Front</p><p className="text-sm text-white/60">Click to flip.</p></Interactive3DCard>);
    case "tactile-loader": return wrap(<TactileLoader />);
    case "creative-notifications": return wrap(<CreativeNotifications />);
    case "streaming-chat": return wrap(<StreamingChat />);
    case "token-meter": return wrap(<div className="space-y-2"><TokenMeter used={1284} limit={8000} /><TokenMeter used={7200} limit={8000} /></div>);
    case "model-selector": return wrap(<div className="flex gap-2"><ModelSelector /><TokenMeter /></div>);
    case "tool-call-viz": case "agent-timeline": return wrap(<ToolCallViz />);
    case "ai-review-edit": case "diff-viewer": return wrap(<div className="grid gap-2 md:grid-cols-2"><div className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm">− old: radius={80}</div><div className="rounded-xl border border-[#4fe08a]/30 bg-[#4fe08a]/10 p-3 text-sm">+ new: radius={120}</div></div>);
    case "advanced-table": case "spreadsheet-grid": case "query-builder": case "audit-log": case "version-history": return wrap(<AdvancedTable />);
    case "json-viewer": return wrap(<JSONViewer />);
    case "log-viewer": case "webhook-viewer": return wrap(<LogViewer />);
    case "terminal": case "api-request-builder": return wrap(<Terminal />);
    case "file-tree": return wrap(<FileTree />);
    case "code-editor": case "rich-text-editor": case "slash-commands": return wrap(<CodeEditorLite />);
    case "env-manager": case "feature-flags": return wrap(<AdvancedTable columns={[{ key: "component", label: "Flag" }, { key: "category", label: "State" }, { key: "framework", label: "Rollout" }, { key: "difficulty", label: "Owner" }]} rows={[{ id: "1", component: "magnetic-v2", category: "on", framework: "50%", difficulty: "you" }, { id: "2", component: "otp-slingshot", category: "off", framework: "0%", difficulty: "ada" }]} />);
    case "cron-builder": case "timeline-editor": case "workflow-builder": case "node-editor": return wrap(<Kanban />);
    case "pricing-table": return wrap(<PricingTable />);
    case "usage-dashboard": return wrap(<UsageDashboard />);
    case "team-switcher": case "invite-flow": return wrap(<div className="flex gap-2"><TeamSwitcher /><ModelSelector models={["owner", "admin", "member"]} /></div>);
    case "onboarding-checklist": case "approval-workflow": return wrap(<OnboardingChecklist />);
    case "kanban": return wrap(<Kanban />);
    case "calendar": return wrap(<Calendar />);
    case "markdown-editor": return wrap(<MarkdownEditor />);
    case "mention-input": return wrap(<MentionInput />);
    case "comment-thread": return wrap(<CommentThread />);
    default: return wrap(<MagneticCard><p className="font-bold">{slug}</p><p className="text-sm text-white/60">Live React implementation shares patterns with the components above. Open the framework tabs for code.</p><div className="mt-2"><MagneticButton>Interact</MagneticButton></div></MagneticCard>);
  }
}

export default ComponentRenderer;
