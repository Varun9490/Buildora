"use client";

import * as React from "react";
import {
  MagneticButton,
  LiquidButton,
  MagneticCard,
  SlingshotOTP,
  InteractiveDropzone,
  SpatialCommandPalette,
  CreativeNotifications,
  AuroraBackground,
  ParticleField,
  CursorSpotlight,
  MorphingTypography,
  HolographicCard,
  Interactive3DCard,
  TactileLoader,
  StreamingChat,
  TokenMeter,
  ModelSelector,
  ToolCallViz,
  AdvancedTable,
  JSONViewer,
  LogViewer,
  Terminal,
  FileTree,
  CodeEditorLite,
  PricingTable,
  TeamSwitcher,
  OnboardingChecklist,
  UsageDashboard,
  Kanban,
  Calendar,
  MarkdownEditor,
  MentionInput,
  CommentThread,
} from "@buildora/components";

export type Controls = {
  strength: number;
  radius: number;
  intensity: number;
  speed: number;
  glow: boolean;
  scale: number;
  /** Real component props (component-specific controls). */
  count: number;
  length: number;
  pageSize: number;
  tilt: number;
  variant: string;
};

export const DEFAULT_RENDER_CONTROLS: Controls = {
  strength: 0.35,
  radius: 120,
  intensity: 0.6,
  speed: 1,
  glow: true,
  scale: 1,
  count: 70,
  length: 6,
  pageSize: 6,
  tilt: 8,
  variant: "accent",
};

class RenderBoundary extends React.Component<
  { fallback: string; children: React.ReactNode },
  { error: boolean }
> {
  constructor(props: { fallback: string; children: React.ReactNode }) {
    super(props);
    this.state = { error: false };
  }
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-red-400/20 bg-red-500/[0.06] p-8 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-red-300/80">Component failed to render</p>
          <p className="font-mono text-[11px] text-[--b-muted]">{this.props.fallback}</p>
          <button
            onClick={() => this.setState({ error: false })}
            className="mt-2 rounded-md bg-white/[0.06] px-4 py-1.5 font-mono text-[11px] text-[--b-text-secondary] transition-colors hover:bg-white/[0.1]"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function ComponentSkeleton() {
  return (
    <div className="w-full space-y-4 rounded-lg p-6">
      <div className="flex items-center gap-3">
        <div className="skeleton h-10 w-24 rounded-md" />
        <div className="skeleton h-10 w-20 rounded-md" />
      </div>
      <div className="space-y-2">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="skeleton h-6 w-16 rounded-md" />
        <div className="skeleton h-6 w-20 rounded-md" />
      </div>
    </div>
  );
}

export function ComponentRenderer({ slug, controls }: { slug: string; controls: Controls }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return <ComponentSkeleton />;

  const wrap = (node: React.ReactNode) => (
    <RenderBoundary fallback={slug}>
      <div
        style={{ transform: `scale(${controls.scale})`, transition: "transform 0.2s ease" }}
        className="max-w-full origin-top"
      >
        {node}
      </div>
    </RenderBoundary>
  );

  switch (slug) {
    case "magnetic-button":
      return wrap(
        <div className="flex flex-wrap gap-3">
          <MagneticButton
            strength={controls.strength}
            radius={controls.radius}
            variant={(controls.variant as "accent" | "ghost" | "iris") ?? "accent"}
          >
            Ship it
          </MagneticButton>
          <MagneticButton variant="ghost" strength={controls.strength} radius={controls.radius}>
            Ghost
          </MagneticButton>
          <MagneticButton variant="iris" strength={controls.strength} radius={controls.radius}>
            Iris
          </MagneticButton>
        </div>
      );
    case "liquid-button":
      return wrap(<LiquidButton intensity={controls.intensity}>Liquid action</LiquidButton>);
    case "magnetic-card":
      return wrap(
        <MagneticCard tilt={controls.tilt} className="w-80">
          <p className="font-display text-lg font-bold">Magnetic card</p>
          <p className="mt-2 text-sm text-[--b-muted]">Tilt + spotlight. Focus with Tab.</p>
        </MagneticCard>
      );
    case "slingshot-otp":
      return wrap(<SlingshotOTP length={Math.round(controls.length)} onComplete={() => undefined} />);
    case "interactive-dropzone":
    case "attachment-prompt":
      return wrap(<InteractiveDropzone />);
    case "spatial-command-palette":
    case "command-palette":
      return wrap(<SpatialCommandPalette />);
    case "cursor-spotlight":
      return wrap(
        <CursorSpotlight className="w-80 rounded-2xl p-6">
          <p className="font-display text-lg font-bold">Move inside me</p>
          <p className="mt-2 text-sm text-[--b-muted]">Spotlight follows the cursor.</p>
        </CursorSpotlight>
      );
    case "aurora-background":
      return wrap(
        <AuroraBackground className="w-96 rounded-2xl p-8">
          <p className="font-display text-xl font-black">Aurora</p>
          <p className="mt-2 text-sm text-[--b-muted]">Pure CSS drift. Reduced-motion safe.</p>
        </AuroraBackground>
      );
    case "particle-field":
      return wrap(<ParticleField count={Math.round(controls.count)} />);
    case "morphing-typography":
      return wrap(<MorphingTypography />);
    case "holographic-card":
      return wrap(
        <HolographicCard className="w-80">
          <p className="font-display text-lg font-bold">Holographic</p>
          <p className="mt-2 text-sm text-[--b-muted]">Sheen tracks pointer.</p>
        </HolographicCard>
      );
    case "interactive-3d-card":
      return wrap(
        <Interactive3DCard className="w-80 h-48">
          <p className="font-display text-lg font-bold">Front</p>
          <p className="mt-2 text-sm text-[--b-muted]">Click to flip.</p>
        </Interactive3DCard>
      );
    case "tactile-loader":
      return wrap(<TactileLoader />);
    case "creative-notifications":
      return wrap(
        <div className="flex min-h-[280px] w-full max-w-sm flex-col items-center justify-start pt-4">
          <CreativeNotifications />
        </div>
      );
    case "streaming-chat":
      return wrap(
        <div className="w-full max-w-2xl">
          <StreamingChat />
        </div>
      );
    case "token-meter":
      return wrap(
        <div className="w-full max-w-sm space-y-3">
          <TokenMeter used={1284} limit={8000} />
          <TokenMeter used={7200} limit={8000} />
        </div>
      );
    case "model-selector":
      return wrap(
        <div className="flex w-full max-w-md flex-col items-center gap-4">
          <div className="flex gap-3">
            <ModelSelector />
            <TokenMeter />
          </div>
        </div>
      );
    case "tool-call-viz":
    case "agent-timeline":
      return wrap(
        <div className="w-full max-w-2xl">
          <ToolCallViz />
        </div>
      );
    case "ai-review-edit":
    case "diff-viewer":
      return wrap(
        <div className="grid w-full max-w-2xl gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm">− old: radius={"{80}"}</div>
          <div className="rounded-xl border border-[#4fe08a]/30 bg-[#4fe08a]/10 p-4 text-sm">+ new: radius={"{120}"}</div>
        </div>
      );
    case "advanced-table":
    case "spreadsheet-grid":
    case "query-builder":
    case "audit-log":
    case "version-history":
      return wrap(
        <div className="max-h-[440px] w-full max-w-4xl overflow-auto rounded-xl shadow-lg">
          <AdvancedTable className="w-full" pageSize={Math.round(controls.pageSize)} />
        </div>
      );
    case "json-viewer":
      return wrap(
        <div className="w-full max-w-xl">
          <JSONViewer />
        </div>
      );
    case "log-viewer":
    case "webhook-viewer":
      return wrap(
        <div className="w-full max-w-xl">
          <LogViewer />
        </div>
      );
    case "terminal":
    case "api-request-builder":
      return wrap(<Terminal />);
    case "file-tree":
      return wrap(<FileTree />);
    case "code-editor":
    case "rich-text-editor":
    case "slash-commands":
      return wrap(<CodeEditorLite />);
    case "env-manager":
    case "feature-flags":
      return wrap(
        <AdvancedTable
          columns={[
            { key: "component", label: "Flag" },
            { key: "category", label: "State" },
            { key: "framework", label: "Rollout" },
            { key: "difficulty", label: "Owner" },
          ]}
          rows={[
            { id: "1", component: "magnetic-v2", category: "on", framework: "50%", difficulty: "you" },
            { id: "2", component: "otp-slingshot", category: "off", framework: "0%", difficulty: "ada" },
          ]}
        />
      );
    case "cron-builder":
    case "timeline-editor":
    case "workflow-builder":
    case "node-editor":
      return wrap(<Kanban />);
    case "pricing-table":
      return wrap(<PricingTable />);
    case "usage-dashboard":
      return wrap(<UsageDashboard />);
    case "team-switcher":
    case "invite-flow":
      return wrap(
        <div className="flex gap-3">
          <TeamSwitcher />
          <ModelSelector models={["owner", "admin", "member"]} />
        </div>
      );
    case "onboarding-checklist":
    case "approval-workflow":
      return wrap(<OnboardingChecklist />);
    case "kanban":
      return wrap(
        <div className="max-h-[400px] overflow-auto rounded-xl">
          <Kanban />
        </div>
      );
    case "calendar":
      return wrap(<Calendar />);
    case "markdown-editor":
      return wrap(<MarkdownEditor />);
    case "mention-input":
      return wrap(<MentionInput />);
    case "comment-thread":
      return wrap(<CommentThread />);
    default:
      return wrap(
        <MagneticCard className="w-80">
          <p className="font-display text-lg font-bold">{slug}</p>
          <p className="mt-2 text-sm text-[--b-muted]">
            Live React implementation shares patterns with the components above. Open the framework tabs
            for code.
          </p>
          <div className="mt-4">
            <MagneticButton>Interact</MagneticButton>
          </div>
        </MagneticCard>
      );
  }
}

export default ComponentRenderer;
