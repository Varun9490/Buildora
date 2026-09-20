"use client";

import * as React from "react";
import { DEFAULT_RENDER_CONTROLS, type Controls } from "@/lib/render-controls";
import {
  MagneticButton,
  LiquidButton,
  MagneticCard,
  Backdrop,
  CursorFx,
  TextFx,
  FxCard,
  FxButton,
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
  AgentTimeline,
  AttachmentPrompt,
  AIReviewEdit,
  AdvancedTable,
  SpreadsheetGrid,
  QueryBuilder,
  DiffViewer,
  JSONViewer,
  LogViewer,
  Terminal,
  FileTree,
  CodeEditorLite,
  ApiRequestBuilder,
  WebhookViewer,
  EnvManager,
  CronBuilder,
  PricingTable,
  TeamSwitcher,
  OnboardingChecklist,
  UsageDashboard,
  InviteFlow,
  ApprovalWorkflow,
  AuditLog,
  FeatureFlags,
  Kanban,
  Calendar,
  CommandPalette,
  NodeEditor,
  TimelineEditor,
  WorkflowBuilder,
  MarkdownEditor,
  MentionInput,
  CommentThread,
  RichTextEditor,
  SlashCommands,
  VersionHistory,
  Button,
  Input,
  Textarea,
  Badge,
  Chip,
  Switch,
  Checkbox,
  Radio,
  RadioGroup,
  Slider,
  Progress,
  Spinner,
  Skeleton,
  Avatar,
  AvatarGroup,
  Kbd,
  Separator,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  ToastProvider,
  useToast,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  AlertDialog,
  Sheet,
  Drawer,
  Popover,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  ModalStack,
  ModalStackProvider,
  useModalStack,
  Navbar,
  NavbarLogo,
  NavbarCenter,
  NavbarRight,
  NavbarItem,
  FloatingNavbar,
  FloatingNavbarItem,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarItem,
  ExpandableSidebar,
  ExpandableSidebarItem,
  MobileNav,
  MobileNavItem,
  BreadcrumbNav,
  BreadcrumbItem,
  StepNav,
  StepNavItem,
  Pagination,
  PaginationButton,
  PaginationPrev,
  PaginationNext,
  CommandBar,
  CommandBarItem,
  CommandBarTrigger,
  TUIPanel,
  TUIStatusBar,
  TUIHeader,
  TUIFooter,
  TUITable,
  TUITree,
  TUIList,
  TUIForm,
  TUISelect,
  TUIMultiSelect,
  TUIProgress,
  TUISpinner,
  TUIGauge,
  TUISparkline,
  TUILogViewer,
  TUIHelpOverlay,
  TUIDiffViewer,
  TerminalUI,
  NoiseBackground,
  GridBackground,
  DotGridBackground,
  GradientMeshBackground,
  AuroraBeamBackground,
  RippleBackground,
  MeteorBackground,
  BeamBackground,
  GlowCursor,
  BlobCursor,
  TrailCursor,
  GhostCursor,
  SpotlightCursor,
  Typewriter,
  ScrambledText,
  BlurText,
  GradientText,
  GlitchText,
  RippleButton,
  ShimmerButton,
  GlowButton,
  GradientBorderButton,
  HoldButton,
  GlareCard,
  SpotlightCard,
  WobbleCard,
  GlassCard,
  BentoGrid,
  BentoItem,
  InfiniteMarquee,
  MasonryLayout,
  MasonryItem,
  CtaBlock,
  FeatureGrid,
  LogoCloud,
  SiteFooter,
} from "@buildora/components";

export type { Controls } from "@/lib/render-controls";
export { DEFAULT_RENDER_CONTROLS } from "@/lib/render-controls";

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
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-[--b-danger]/40 bg-[--b-danger]/10 p-8 text-center">            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[--b-danger]/15">
              <svg className="h-5 w-5 text-[--b-danger]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-[--b-danger]">Component failed to render</p>
          <p className="font-mono text-[11px] text-[--b-muted]">{this.props.fallback}</p>
          <button
            onClick={() => this.setState({ error: false })}
            className="mt-2 rounded-md border border-[--b-border] bg-[--b-surface] px-4 py-1.5 font-mono text-[11px] text-[--b-text-secondary] transition-colors hover:bg-[--b-elevated]"
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
        <div className="flex flex-wrap gap-4 items-center">
          <MagneticButton
            strength={controls.strength}
            radius={controls.radius}
            variant={(controls.variant as "accent" | "ghost" | "iris") ?? "accent"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            Ship it
          </MagneticButton>
          <MagneticButton variant="ghost" strength={controls.strength} radius={controls.radius}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
               <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
               <path d="M12 12v9" />
               <path d="m8 17 4 4 4-4" />
            </svg>
            Ghost
          </MagneticButton>
          <MagneticButton variant="iris" strength={controls.strength} radius={controls.radius}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
               <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            </svg>
            Iris
          </MagneticButton>
        </div>
      );
    case "liquid-button":
      return wrap(<LiquidButton intensity={controls.intensity}>Liquid action</LiquidButton>);
    case "backdrop":
      return wrap(
        <Backdrop variant="aurora" className="w-full rounded-xl p-10 text-center">
          <p className="font-display text-xl font-bold">Backdrop · aurora</p>
          <p className="mt-1 text-sm text-[--b-muted]">Nine variants, one component.</p>
        </Backdrop>
      );
    case "cursor-fx":
      return wrap(
        <div className="w-full rounded-xl border border-[--b-border] p-10 text-center">
          <CursorFx mode="glow" />
          <p className="font-display text-xl font-bold">Move your pointer</p>
          <p className="mt-1 text-sm text-[--b-muted]">Glow · spotlight · trail · blob. Pointer-fine only.</p>
        </div>
      );
    case "text-fx":
      return wrap(
        <div className="flex flex-col items-center gap-3 p-6 text-center">
          <TextFx kind="typewriter" text={["Build", "Remix", "Ship"]} className="font-display text-3xl font-black" />
          <TextFx kind="glitch" text="No fake support" className="font-display text-xl font-bold" />
        </div>
      );
    case "fx-card":
      return wrap(
        <FxCard effect="spotlight" className="w-80">
          <p className="font-display text-lg font-bold">FxCard</p>
          <p className="mt-2 text-sm text-[--b-muted]">Six effects. Move your pointer across this card.</p>
        </FxCard>
      );
    case "fx-button":
      return wrap(
        <div className="flex flex-wrap gap-3">
          <FxButton effect="shimmer">Shimmer</FxButton>
          <FxButton effect="ripple">Ripple</FxButton>
          <FxButton effect="liquid">Liquid</FxButton>
        </div>
      );
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
      return wrap(<InteractiveDropzone />);
    case "attachment-prompt":
      return wrap(
        <div className="w-full max-w-xl">
          <AttachmentPrompt />
        </div>
      );
    case "spatial-command-palette":
      return wrap(<SpatialCommandPalette />);
    case "command-palette":
      return wrap(
        <div className="w-full max-w-md">
          <CommandPalette />
        </div>
      );
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
      return wrap(
        <div className="w-full max-w-2xl">
          <ToolCallViz />
        </div>
      );
    case "agent-timeline":
      return wrap(
        <div className="w-full max-w-2xl">
          <AgentTimeline />
        </div>
      );
    case "ai-review-edit":
      return wrap(
        <div className="w-full max-w-2xl">
          <AIReviewEdit />
        </div>
      );
    case "diff-viewer":
      return wrap(
        <div className="w-full max-w-3xl">
          <DiffViewer />
        </div>
      );
    case "advanced-table":
      return wrap(
        <div className="max-h-[440px] w-full max-w-4xl overflow-auto rounded-xl shadow-lg">
          <AdvancedTable className="w-full" pageSize={Math.round(controls.pageSize)} />
        </div>
      );
    case "spreadsheet-grid":
      return wrap(
        <div className="w-full max-w-4xl overflow-auto">
          <SpreadsheetGrid />
        </div>
      );
    case "query-builder":
      return wrap(
        <div className="w-full max-w-2xl">
          <QueryBuilder />
        </div>
      );
    case "audit-log":
      return wrap(
        <div className="w-full max-w-2xl">
          <AuditLog />
        </div>
      );
    case "version-history":
      return wrap(
        <div className="w-full max-w-xl">
          <VersionHistory />
        </div>
      );
    case "json-viewer":
      return wrap(
        <div className="w-full max-w-xl">
          <JSONViewer />
        </div>
      );
    case "log-viewer":
      return wrap(
        <div className="w-full max-w-xl">
          <LogViewer />
        </div>
      );
    case "webhook-viewer":
      return wrap(
        <div className="w-full max-w-3xl">
          <WebhookViewer />
        </div>
      );
    case "terminal":
      return wrap(<Terminal />);
    case "api-request-builder":
      return wrap(
        <div className="w-full max-w-3xl">
          <ApiRequestBuilder />
        </div>
      );
    case "file-tree":
      return wrap(<FileTree />);
    case "code-editor":
      return wrap(<CodeEditorLite />);
    case "rich-text-editor":
      return wrap(
        <div className="w-full max-w-2xl">
          <RichTextEditor />
        </div>
      );
    case "slash-commands":
      return wrap(
        <div className="w-full max-w-md">
          <SlashCommands />
        </div>
      );
    case "env-manager":
      return wrap(
        <div className="w-full max-w-3xl">
          <EnvManager />
        </div>
      );
    case "feature-flags":
      return wrap(
        <div className="w-full max-w-xl">
          <FeatureFlags />
        </div>
      );
    case "cron-builder":
      return wrap(
        <div className="w-full max-w-xl">
          <CronBuilder />
        </div>
      );
    case "timeline-editor":
      return wrap(
        <div className="w-full max-w-3xl">
          <TimelineEditor />
        </div>
      );
    case "workflow-builder":
      return wrap(
        <div className="w-full max-w-3xl">
          <WorkflowBuilder />
        </div>
      );
    case "node-editor":
      return wrap(
        <div className="w-full max-w-2xl">
          <NodeEditor />
        </div>
      );
    case "pricing-table":
      return wrap(<PricingTable />);
    case "usage-dashboard":
      return wrap(<UsageDashboard />);
    case "team-switcher":
      return wrap(<TeamSwitcher />);
    case "invite-flow":
      return wrap(
        <div className="w-full max-w-md">
          <InviteFlow />
        </div>
      );
    case "onboarding-checklist":
      return wrap(<OnboardingChecklist />);
    case "approval-workflow":
      return wrap(
        <div className="w-full max-w-xl">
          <ApprovalWorkflow />
        </div>
      );
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
    case "button":
      return wrap(
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      );
    case "input":
      return wrap(
        <div className="w-full max-w-sm space-y-3">
          <div>
            <label htmlFor="prim-name" className="mb-1 block text-xs text-[--b-text-secondary]">Name</label>
            <Input id="prim-name" placeholder="Ada Lovelace" />
          </div>
          <div>
            <label htmlFor="prim-email" className="mb-1 block text-xs text-[--b-text-secondary]">Email</label>
            <Input id="prim-email" type="email" placeholder="ada@example.com" />
          </div>
        </div>
      );
    case "textarea":
      return wrap(
        <div className="w-full max-w-sm">
          <label htmlFor="prim-notes" className="mb-1 block text-xs text-[--b-text-secondary]">Notes</label>
          <Textarea id="prim-notes" placeholder="Ship notes…" rows={4} />
        </div>
      );
    case "badge":
      return wrap(
        <div className="flex flex-wrap gap-2">
          <Badge>default</Badge>
          <Badge variant="success">stable</Badge>
          <Badge variant="warning">beta</Badge>
          <Chip>removable</Chip>
        </div>
      );
    case "switch":
      return wrap(
        <div className="flex flex-col gap-3">
          <Switch label="Enable notifications" defaultChecked />
          <Switch label="Reduced motion" />
        </div>
      );
    case "checkbox":
      return wrap(
        <div className="flex flex-col gap-2">
          <Checkbox label="I agree to the review" defaultChecked />
          <Checkbox label="Subscribe to changelog" />
        </div>
      );
    case "radio-group":
      return wrap(
        <RadioGroup defaultValue="react" name="framework">
          <Radio value="react" label="React" />
          <Radio value="vue" label="Vue" />
          <Radio value="svelte" label="Svelte" />
        </RadioGroup>
      );
    case "slider":
      return wrap(
        <div className="w-full max-w-xl">
          <span id="prim-slider-label" className="mb-1 block text-xs text-[--b-text-secondary]">Strength</span>
          <Slider defaultValue={35} showValue aria-labelledby="prim-slider-label" />
        </div>
      );
    case "progress":
      return wrap(
        <div className="w-full max-w-xl space-y-3">
          <Progress value={65} showValue />
          <Progress value={30} variant="warning" />
        </div>
      );
    case "spinner":
      return wrap(
        <div className="flex items-center gap-4">
          <Spinner label="Loading components" />
          <Spinner size="lg" variant="accent" />
        </div>
      );
    case "skeleton":
      return wrap(
        <div className="w-full max-w-xl space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      );
    case "avatar":
      return wrap(
        <div className="flex items-center gap-3">
          <Avatar fallback="AL" alt="Ada Lovelace" status="online" />
          <Avatar fallback="GH" alt="Grace Hopper" />
          <AvatarGroup max={3}>
            <Avatar fallback="AL" alt="Ada Lovelace" />
            <Avatar fallback="GH" alt="Grace Hopper" />
            <Avatar fallback="LT" alt="Linus Torvalds" />
            <Avatar fallback="MA" alt="Maya Angelou" />
          </AvatarGroup>
        </div>
      );
    case "kbd":
      return wrap(
        <div className="flex items-center gap-2">
          <Kbd>⌘</Kbd>
          <Kbd>P</Kbd>
        </div>
      );
    case "separator":
      return wrap(
        <div className="w-full max-w-sm space-y-4">
          <p className="text-sm">Above</p>
          <Separator />
          <p className="text-sm">Below</p>
        </div>
      );
    case "tabs":
      return wrap(
        <div className="w-full max-w-md">
          <Tabs defaultValue="preview">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
            <TabsContent value="preview">Live component preview.</TabsContent>
            <TabsContent value="code">Source code viewer.</TabsContent>
          </Tabs>
        </div>
      );
    case "accordion":
      return wrap(
        <div className="w-full max-w-md">
          <Accordion>
            <AccordionItem value="a">
              <AccordionTrigger>What is Buildora?</AccordionTrigger>
              <AccordionContent>A registry-driven component ecosystem.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="b">
              <AccordionTrigger>How do I install?</AccordionTrigger>
              <AccordionContent>Via the shadcn CLI from the component page.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      );
    case "toast":
      return wrap(
        <div className="w-full max-w-sm">
          <ToastDemo />
        </div>
      );
    case "tooltip":
      return wrap(
        <Tooltip content="Installs via shadcn CLI">
          <Button variant="outline">Hover me</Button>
        </Tooltip>
      );
    case "dialog":
      return wrap(<DialogDemo />);
    case "alert-dialog":
      return wrap(<AlertDialogDemo />);
    case "sheet":
      return wrap(<SheetDemo />);
    case "drawer":
      return wrap(<DrawerDemo />);
    case "popover":
      return wrap(<PopoverDemo />);
    case "dropdown-menu":
      return wrap(
        <DropdownMenu>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Install</DropdownMenuItem>
            <DropdownMenuItem>Copy code</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    case "context-menu":
      return wrap(
        <ContextMenu>
          <ContextMenuTrigger>
            <div className="rounded-xl border border-dashed border-[--b-border-hover] p-8 text-center text-sm text-[--b-text-secondary]">
              Right-click here
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Copy</ContextMenuItem>
            <ContextMenuItem>Inspect</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
    case "hover-card":
      return wrap(
        <HoverCard trigger={<Button variant="outline">Hover for preview</Button>}>
          <p className="text-sm font-bold">Magnetic Button</p>
          <p className="text-xs text-[--b-text-secondary]">Spring magnetic attraction.</p>
        </HoverCard>
      );
    case "modal-stack":
      return wrap(
        <div className="w-full max-w-sm">
          <ModalStackDemo />
        </div>
      );
    case "navbar":
      return wrap(
        <div className="w-full max-w-3xl">
          <Navbar>
            <NavbarLogo>Buildora</NavbarLogo>
            <NavbarCenter>
              <NavbarItem href="#">Components</NavbarItem>
              <NavbarItem href="#">Docs</NavbarItem>
            </NavbarCenter>
            <NavbarRight>
              <Button variant="accent">Install</Button>
            </NavbarRight>
          </Navbar>
        </div>
      );
    case "floating-navbar":
      return wrap(
        <div className="w-full max-w-2xl">
          <FloatingNavbar visible>
            <FloatingNavbarItem href="#" active>Home</FloatingNavbarItem>
            <FloatingNavbarItem href="#">Components</FloatingNavbarItem>
            <FloatingNavbarItem href="#">Docs</FloatingNavbarItem>
          </FloatingNavbar>
        </div>
      );
    case "sidebar":
      return wrap(
        <div className="h-72 w-64 overflow-hidden rounded-xl border border-[--b-border]">
          <Sidebar>
            <SidebarHeader>Workspace</SidebarHeader>
            <SidebarContent>
              <SidebarItem value="components">Components</SidebarItem>
              <SidebarItem value="docs">Docs</SidebarItem>
            </SidebarContent>
          </Sidebar>
        </div>
      );
    case "expandable-sidebar":
      return wrap(
        <div className="h-72 w-64 overflow-hidden rounded-xl border border-[--b-border]">
          <ExpandableSidebar>
            <ExpandableSidebarItem value="components">Components</ExpandableSidebarItem>
            <ExpandableSidebarItem value="playground">Playground</ExpandableSidebarItem>
          </ExpandableSidebar>
        </div>
      );
    case "mobile-nav":
      return wrap(
        <div className="w-full max-w-sm overflow-hidden rounded-xl border border-[--b-border]">
          <MobileNav defaultActiveItem="home">
            <MobileNavItem value="home" label="Home">Home</MobileNavItem>
            <MobileNavItem value="search" label="Search">Search</MobileNavItem>
            <MobileNavItem value="settings" label="Settings">Settings</MobileNavItem>
          </MobileNav>
        </div>
      );
    case "breadcrumb":
      return wrap(
        <BreadcrumbNav>
          <BreadcrumbItem href="#">Components</BreadcrumbItem>
          <BreadcrumbItem href="#">Creative</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>Magnetic Button</BreadcrumbItem>
        </BreadcrumbNav>
      );
    case "step-nav":
      return wrap(
        <div className="w-full max-w-xl">
          <StepNav totalSteps={3} defaultStep={1}>
            <StepNavItem step={0} title="Audit" />
            <StepNavItem step={1} title="Build" />
            <StepNavItem step={2} title="Ship" />
          </StepNav>
        </div>
      );
    case "pagination":
      return wrap(
        <Pagination totalPages={10} defaultPage={3}>
          <PaginationPrev />
          <PaginationButton page={2} />
          <PaginationButton page={3} />
          <PaginationButton page={4} />
          <PaginationNext />
        </Pagination>
      );
    case "command-bar":
      return wrap(
        <CommandBar defaultOpen>
          <CommandBarTrigger>Open commands</CommandBarTrigger>
          <CommandBarItem shortcut="⌘P">Open playground</CommandBarItem>
          <CommandBarItem shortcut="⌘K">Search components</CommandBarItem>
        </CommandBar>
      );
    case "tui-panel":
      return wrap(
        <div className="w-full max-w-md">
          <TUIPanel title="registry" focused>
            <p className="font-mono text-xs text-[--b-text-secondary]">54 components · valid</p>
          </TUIPanel>
        </div>
      );
    case "tui-status-bar":
      return wrap(
        <div className="w-full max-w-xl">
          <TUIStatusBar items={[{ label: "branch", value: "main", color: "success" }, { label: "tests", value: "30 pass", color: "accent" }]} />
        </div>
      );
    case "tui-header":
      return wrap(
        <div className="w-full max-w-xl">
          <TUIHeader title="buildora" subtitle="registry console" />
        </div>
      );
    case "tui-footer":
      return wrap(
        <div className="w-full max-w-xl">
          <TUIFooter shortcuts={[{ key: "q", label: "quit" }, { key: "?", label: "help" }]} />
        </div>
      );
    case "tui-table":
      return wrap(
        <div className="w-full max-w-2xl">
          <TUITable
            columns={[{ key: "name", header: "Component" }, { key: "status", header: "Status" }]}
            rows={[{ id: "1", name: "magnetic-button", status: "Full" }, { id: "2", name: "kanban", status: "Full" }]}
          />
        </div>
      );
    case "tui-tree":
      return wrap(
        <div className="w-full max-w-sm">
          <TUITree nodes={[{ id: "r", label: "registry", expanded: true, children: [{ id: "c1", label: "magnetic-button.json" }, { id: "c2", label: "kanban.json" }] }]} />
        </div>
      );
    case "tui-list":
      return wrap(
        <div className="w-full max-w-sm">
          <TUIList items={[{ id: "1", label: "magnetic-button" }, { id: "2", label: "streaming-chat" }, { id: "3", label: "kanban" }]} />
        </div>
      );
    case "tui-form":
      return wrap(
        <div className="w-full max-w-sm">
          <TUIForm fields={[{ name: "component", label: "Component", type: "text", value: "", placeholder: "magnetic-button" }, { name: "stable", label: "Mark stable", type: "checkbox", value: false }]} />
        </div>
      );
    case "tui-select":
      return wrap(
        <div className="w-full max-w-sm">
          <TUISelect options={[{ value: "react", label: "React" }, { value: "vue", label: "Vue" }, { value: "svelte", label: "Svelte" }]} placeholder="Pick framework" />
        </div>
      );
    case "tui-multi-select":
      return wrap(
        <div className="w-full max-w-sm">
          <TUIMultiSelect options={[{ value: "a11y", label: "Accessibility" }, { value: "perf", label: "Performance" }, { value: "docs", label: "Docs" }]} selected={["a11y"]} />
        </div>
      );
    case "tui-progress":
      return wrap(
        <div className="w-full max-w-sm">
          <TUIProgress value={68} label="registry build" showValue />
        </div>
      );
    case "tui-spinner":
      return wrap(<TUISpinner text="validating registry" />);
    case "tui-gauge":
      return wrap(<TUIGauge value={72} max={100} label="coverage" unit="%" showValue />);
    case "tui-sparkline":
      return wrap(<TUISparkline data={[4, 7, 5, 9, 6, 11, 8]} label="installs" showMinMax />);
    case "tui-log-viewer":
      return wrap(
        <div className="w-full max-w-xl">
          <TUILogViewer entries={[{ level: "info", message: "registry valid", source: "ci" }, { level: "warn", message: "large prop table", source: "docs" }, { level: "success", message: "30 tests pass", source: "ci" }]} />
        </div>
      );
    case "tui-help-overlay":
      return wrap(
        <div className="w-full max-w-md">
          <TUIHelpOverlay bindings={[{ key: "q", label: "Quit" }, { key: "?", label: "Help" }, { key: "j/k", label: "Navigate" }]} visible />
        </div>
      );
    case "tui-diff-viewer":
      return wrap(
        <div className="w-full max-w-2xl">
          <TUIDiffViewer hunks={[{ type: "header", content: "magnetic-button.tsx" }, { type: "delete", oldLine: 12, content: "strength={0.2}" }, { type: "add", newLine: 12, content: "strength={0.35}" }]} />
        </div>
      );
    case "terminal-workspace":
      return wrap(
        <div className="h-[420px] w-full max-w-4xl overflow-hidden rounded-xl">
          <TerminalUI />
        </div>
      );
    case "noise-background":
      return wrap(
        <NoiseBackground className="w-96 rounded-2xl p-8">
          <p className="font-display text-lg font-bold">Grain surface</p>
        </NoiseBackground>
      );
    case "grid-background":
      return wrap(
        <GridBackground className="w-96 rounded-2xl p-8">
          <p className="font-display text-lg font-bold">Grid surface</p>
        </GridBackground>
      );
    case "dot-grid-background":
      return wrap(
        <DotGridBackground className="w-96 rounded-2xl p-8">
          <p className="font-display text-lg font-bold">Dot lattice</p>
        </DotGridBackground>
      );
    case "gradient-mesh-background":
      return wrap(
        <GradientMeshBackground className="w-96 rounded-2xl p-8">
          <p className="font-display text-lg font-bold">Mesh field</p>
        </GradientMeshBackground>
      );
    case "aurora-beam-background":
      return wrap(
        <AuroraBeamBackground className="w-96 rounded-2xl p-8">
          <p className="font-display text-lg font-bold">Aurora beams</p>
        </AuroraBeamBackground>
      );
    case "ripple-background":
      return wrap(
        <RippleBackground className="w-96 rounded-2xl p-8">
          <p className="font-display text-lg font-bold">Ripple field</p>
        </RippleBackground>
      );
    case "meteor-background":
      return wrap(
        <MeteorBackground className="w-96 rounded-2xl p-8">
          <p className="font-display text-lg font-bold">Meteor shower</p>
        </MeteorBackground>
      );
    case "beam-background":
      return wrap(
        <BeamBackground className="w-96 rounded-2xl p-8">
          <p className="font-display text-lg font-bold">Light beams</p>
        </BeamBackground>
      );
    case "glow-cursor":
      return wrap(
        <div className="relative">
          <GlowCursor />
          <div className="rounded-2xl border border-[--b-border] p-8 text-center text-sm text-[--b-text-secondary]">Move to see glow</div>
        </div>
      );
    case "blob-cursor":
      return wrap(
        <div className="relative">
          <BlobCursor />
          <div className="rounded-2xl border border-[--b-border] p-8 text-center text-sm text-[--b-text-secondary]">Move to see blob</div>
        </div>
      );
    case "trail-cursor":
      return wrap(
        <div className="relative">
          <TrailCursor />
          <div className="rounded-2xl border border-[--b-border] p-8 text-center text-sm text-[--b-text-secondary]">Move to see trail</div>
        </div>
      );
    case "ghost-cursor":
      return wrap(
        <div className="relative">
          <GhostCursor />
          <div className="rounded-2xl border border-[--b-border] p-8 text-center text-sm text-[--b-text-secondary]">Move to see ghost</div>
        </div>
      );
    case "spotlight-cursor":
      return wrap(
        <div className="relative">
          <SpotlightCursor />
          <div className="rounded-2xl border border-[--b-border] p-8 text-center text-sm text-[--b-text-secondary]">Move to see spotlight</div>
        </div>
      );
    case "typewriter":
      return wrap(<Typewriter text={["Build.", "Remix.", "Ship."]} />);
    case "scrambled-text":
      return wrap(<ScrambledText text="registry-driven" />);
    case "blur-text":
      return wrap(<BlurText text="Clarity on entry" />);
    case "gradient-text":
      return wrap(<GradientText>Buildora</GradientText>);
    case "glitch-text":
      return wrap(<GlitchText text="SHIP IT" />);
    case "ripple-button":
      return wrap(<RippleButton>Ripple action</RippleButton>);
    case "shimmer-button":
      return wrap(<ShimmerButton>Shimmer action</ShimmerButton>);
    case "glow-button":
      return wrap(<GlowButton>Glow action</GlowButton>);
    case "gradient-border-button":
      return wrap(<GradientBorderButton>Gradient frame</GradientBorderButton>);
    case "hold-button":
      return wrap(<HoldButton>Hold to confirm</HoldButton>);
    case "glare-card":
      return wrap(
        <GlareCard className="w-80">
          <p className="font-display text-lg font-bold">Glare card</p>
          <p className="mt-2 text-sm text-[--b-muted]">Specular sweep on pointer.</p>
        </GlareCard>
      );
    case "spotlight-card":
      return wrap(
        <SpotlightCard className="w-80">
          <p className="font-display text-lg font-bold">Spotlight card</p>
          <p className="mt-2 text-sm text-[--b-muted]">Calm cursor light.</p>
        </SpotlightCard>
      );
    case "wobble-card":
      return wrap(
        <WobbleCard className="w-80">
          <p className="font-display text-lg font-bold">Wobble card</p>
          <p className="mt-2 text-sm text-[--b-muted]">Spring response on enter.</p>
        </WobbleCard>
      );
    case "glass-card":
      return wrap(
        <GlassCard className="w-80">
          <p className="font-display text-lg font-bold">Glass card</p>
          <p className="mt-2 text-sm text-[--b-muted]">Frosted surface.</p>
        </GlassCard>
      );
    case "bento-grid":
      return wrap(
        <div className="w-full max-w-3xl">
          <BentoGrid>
            <BentoItem colSpan={2}>Wide tile</BentoItem>
            <BentoItem>Tile</BentoItem>
            <BentoItem>Tile</BentoItem>
          </BentoGrid>
        </div>
      );
    case "infinite-marquee":
      return wrap(
        <div className="w-full max-w-3xl overflow-hidden">
          <InfiniteMarquee>
            <span className="mx-4 font-mono text-sm">magnetic-button</span>
            <span className="mx-4 font-mono text-sm">kanban</span>
            <span className="mx-4 font-mono text-sm">terminal</span>
          </InfiniteMarquee>
        </div>
      );
    case "masonry-layout":
      return wrap(
        <div className="w-full max-w-3xl">
          <MasonryLayout>
            <MasonryItem>Short</MasonryItem>
            <MasonryItem>Taller content block with more text inside the column.</MasonryItem>
            <MasonryItem>Medium block</MasonryItem>
          </MasonryLayout>
        </div>
      );
    case "cta-block":
      return wrap(
        <div className="w-full max-w-3xl">
          <CtaBlock stats={[{ value: "138", label: "components" }, { value: "46", label: "tests" }, { value: "13", label: "categories" }]} />
        </div>
      );
    case "feature-grid":
      return wrap(
        <div className="w-full max-w-4xl">
          <FeatureGrid />
        </div>
      );
    case "logo-cloud":
      return wrap(
        <div className="w-full max-w-3xl">
          <LogoCloud />
        </div>
      );
    case "site-footer":
      return wrap(
        <div className="w-full max-w-4xl">
          <SiteFooter />
        </div>
      );
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

function ToastDemo() {
  return (
    <ToastProvider>
      <ToastTriggerButton />
    </ToastProvider>
  );
}

function ToastTriggerButton() {
  const { toast } = useToast();
  return (
    <Button onClick={() => toast({ title: "Installed", description: "@buildora/magnetic-button added." })}>
      Show toast
    </Button>
  );
}

function DialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <DialogTitle>Install component</DialogTitle>
          <DialogDescription>Runs the shadcn CLI for this entry.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Install</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

function AlertDialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Delete entry</Button>
      <AlertDialog open={open} onOpenChange={setOpen} title="Remove component?" description="This removes the entry from the workspace." variant="destructive" />
    </div>
  );
}

function SheetDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open sheet</Button>
      <Sheet open={open} onOpenChange={setOpen} side="right">
        <p className="p-4 text-sm">Sheet content with focus management.</p>
      </Sheet>
    </div>
  );
}

function DrawerDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer open={open} onOpenChange={setOpen}>
        <p className="p-4 text-sm">Drawer content for mobile-first flows.</p>
      </Drawer>
    </div>
  );
}

function PopoverDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen} anchor={<Button onClick={() => setOpen((o) => !o)}>Toggle popover</Button>}>
      <p className="p-3 text-sm">Anchored panel with placement control.</p>
    </Popover>
  );
}

function ModalStackDemo() {
  return (
    <ModalStackProvider>
      <ModalStackTrigger />
      <ModalStack />
    </ModalStackProvider>
  );
}

function ModalStackTrigger() {
  const stack = useModalStack();
  return (
    <Button
      onClick={() =>
        stack.push(
          <div className="flex h-full items-center justify-center bg-black/60 p-8">
            <div className="rounded-2xl border border-[--b-border] bg-[--b-elevated] p-6">
              <p className="text-sm font-bold">Stacked modal</p>
              <p className="mt-1 text-xs text-[--b-text-secondary]">Pushed via modal-stack API.</p>
            </div>
          </div>
        )
      }
    >
      Push modal
    </Button>
  );
}

export default ComponentRenderer;
