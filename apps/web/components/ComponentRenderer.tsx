"use client";

import * as React from "react";
import { DEFAULT_RENDER_CONTROLS, type Controls } from "@/lib/render-controls";
import {
  MagneticButton,
  Backdrop,
  CursorFx,
  TextFx,
  MatrixDecode,
  RgbGlitchText,
  NumberWheel,
  InlineWordRoll,
  EchoStack,
  SelectionSnap,
  PeriodDrop,
  TypeWall,
  FxCard,
  FxButton,
  SlingshotOTP,
  InteractiveDropzone,
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
  QueryBuilder,
  DiffViewer,
  JSONViewer,
  LogViewer,
  Terminal,
  FileTree,
  CodeEditorLite,
  Kanban,
  Calendar,
  CommandPalette,
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
   SheetHeader,
   SheetTitle,
   SheetContent,
   SheetFooter,
   Drawer,
   DrawerHeader,
   DrawerTitle,
   DrawerContent,
   SkeletonText,
   SkeletonAvatar,
   SkeletonCard,
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
  MobileHeader,
  MobileSectionHeader,
  MobileGroup,
  MobileGroupRow,
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
  SiteFooter
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
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-[color-mix(in_oklab,var(--b-danger)_40%,transparent)] bg-[color-mix(in_oklab,var(--b-danger)_10%,transparent)] p-8 text-center">            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color-mix(in_oklab,var(--b-danger)_15%,transparent)]">
              <svg className="h-5 w-5 text-[color:var(--b-danger)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-[color:var(--b-danger)]">Component failed to render</p>
          <p className="font-mono text-[11px] text-[color:var(--b-muted)]">{this.props.fallback}</p>
          <button
            onClick={() => this.setState({ error: false })}
            className="mt-2 rounded-md border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-4 py-1.5 font-mono text-[11px] text-[color:var(--b-text-secondary)] transition-colors hover:bg-[color:var(--b-elevated)]"
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
    // removed liquid-button
    case "backdrop":
      return wrap(
        <Backdrop variant="aurora" className="w-full rounded-xl p-10 text-center">
          <p className="font-display text-xl font-bold">Backdrop · aurora</p>
          <p className="mt-1 text-sm text-[color:var(--b-muted)]">Nine variants, one component.</p>
        </Backdrop>
      );
    case "cursor-fx":
      return wrap(
        <div className="w-full rounded-xl border border-[color:var(--b-border)] p-10 text-center">
          <CursorFx mode="glow" />
          <p className="font-display text-xl font-bold">Move your pointer</p>
          <p className="mt-1 text-sm text-[color:var(--b-muted)]">Glow · spotlight · trail · blob. Pointer-fine only.</p>
        </div>
      );
    case "text-fx":
      return wrap(
        <div className="flex flex-col items-center gap-3 p-6 text-center">
          <TextFx kind="typewriter" text={["Build", "Remix", "Ship"]} className="font-display text-3xl font-black" />
          <TextFx kind="glitch" text="No fake support" className="font-display text-xl font-bold" />
        </div>
      );
    case "matrix-decode":
      return wrap(
        <div className="flex flex-col items-center gap-2 p-6 text-center">
          <MatrixDecode text="Ship with physics" className="font-display text-3xl font-black" />
          <p className="text-sm text-[color:var(--b-muted)]">Glyphs lock in left-to-right. Replay to decode again.</p>
        </div>
      );
    case "rgb-glitch":
      return wrap(
        <div className="flex flex-col items-center gap-2 p-6 text-center">
          <RgbGlitchText text="Signal intact" className="font-display text-3xl font-black" />
          <p className="text-sm text-[color:var(--b-muted)]">Channel-split bursts on a deterministic cycle.</p>
        </div>
      );
    case "number-wheel":
      return wrap(
        <div className="flex flex-col items-center gap-2 p-6 text-center">
          <OdometerDemo />
          <p className="text-sm text-[color:var(--b-muted)]">Digits roll on reels with staggered cascades.</p>
        </div>
      );
    case "inline-word-roll":
      return wrap(
        <div className="flex flex-col items-center gap-2 p-6 text-center">
          <InlineWordRoll prefix="Deploy in " words={["seconds", "one line", "minutes"]} className="font-display text-3xl font-black" />
          <p className="text-sm text-[color:var(--b-muted)]">Slot width eases to each word as it rolls up.</p>
        </div>
      );
    case "echo-stack":
      return wrap(
        <div className="flex flex-col items-center gap-2 p-6 text-center">
          <EchoStack text="Echo" layers={2} spread={14} className="font-display text-5xl font-black" />
          <p className="text-sm text-[color:var(--b-muted)]">Outlined copies drift above. Hover to widen.</p>
        </div>
      );
    case "selection-snap":
      return wrap(
        <div className="flex flex-col items-center gap-2 p-6 text-center">
          <SelectionSnap text="Hover to select" className="font-display text-3xl" />
          <p className="text-sm text-[color:var(--b-muted)]">Hairline snaps to black under a selection box.</p>
        </div>
      );
    case "period-drop":
      return wrap(
        <div className="flex flex-col items-center gap-2 p-6 text-center">
          <PeriodDrop text="Motion that lands" className="font-display text-3xl font-black" />
          <p className="text-sm text-[color:var(--b-muted)]">The full stop falls, squashes, and settles.</p>
        </div>
      );
    case "type-wall":
      return wrap(
        <div className="w-full">
          <TypeWall rows={4} className="w-full" />
        </div>
      );
    case "fx-card":
      return wrap(
        <FxCard effect="spotlight" className="w-80">
          <p className="font-display text-lg font-bold">FxCard</p>
          <p className="mt-2 text-sm text-[color:var(--b-muted)]">Six effects. Move your pointer across this card.</p>
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
    // removed magnetic-card
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
    // removed spatial-command-palette
    // removed command-palette
    // removed cursor-spotlight
    // removed aurora-background
    // removed particle-field
    // removed morphing-typography
    // removed holographic-card
    // removed interactive-3d-card
    // removed tactile-loader
    // removed creative-notifications
    case "streaming-chat":
      return wrap(
        <div className="w-full max-w-2xl">
          <StreamingChat />
        </div>
      );
    case "token-meter":
      return wrap(
        <div className="w-full max-w-sm space-y-3">
          <TokenMeter used={1284} limit={8000} label="Chat context" />
          <TokenMeter used={7200} limit={8000} label="Agent budget" />
        </div>
      );
    case "model-selector":
      return wrap(
        <div className="flex w-full max-w-lg flex-wrap items-start gap-4">
          <ModelSelector
            defaultValue="buildora-1-pro"
            models={[
              { id: "buildora-1-pro", name: "Buildora-1 Pro", context: "128k", latency: "240ms", grade: "flagship" },
              { id: "buildora-1-flash", name: "Buildora-1 Flash", context: "32k", latency: "85ms", grade: "fast" },
              { id: "oss-70b", name: "OSS-70B", context: "64k", latency: "410ms", grade: "oss" },
            ]}
          />
          <TokenMeter used={6480} limit={8000} />
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
    // removed spreadsheet-grid
    case "query-builder":
      return wrap(
        <div className="w-full max-w-2xl">
          <QueryBuilder />
        </div>
      );
    // removed audit-log
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
    // removed webhook-viewer
    case "terminal":
      return wrap(<Terminal />);
    // removed api-request-builder
    case "file-tree":
      return wrap(<FileTree />);
    // removed code-editor
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
    // removed env-manager
    // removed feature-flags
    // removed cron-builder
    // removed timeline-editor
    // removed workflow-builder
    // removed node-editor
    // removed pricing-table
    // removed usage-dashboard
    // removed team-switcher
    // removed invite-flow
    // removed onboarding-checklist
    // removed approval-workflow
    // removed kanban
    case "calendar":
      return wrap(<Calendar />);
    // removed markdown-editor
    // removed mention-input
    // removed comment-thread
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
            <label htmlFor="prim-name" className="mb-1 block text-xs text-[color:var(--b-text-secondary)]">Name</label>
            <Input id="prim-name" placeholder="Ada Lovelace" />
          </div>
          <div>
            <label htmlFor="prim-email" className="mb-1 block text-xs text-[color:var(--b-text-secondary)]">Email</label>
            <Input id="prim-email" type="email" placeholder="ada@example.com" />
          </div>
        </div>
      );
    case "textarea":
      return wrap(
        <div className="w-full max-w-sm">
          <label htmlFor="prim-notes" className="mb-1 block text-xs text-[color:var(--b-text-secondary)]">Notes</label>
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
          <span id="prim-slider-label" className="mb-1 block text-xs text-[color:var(--b-text-secondary)]">Strength</span>
          <Slider defaultValue={35} showValue aria-labelledby="prim-slider-label" />
        </div>
      );
    case "progress":
      return wrap(
        <div className="w-full max-w-xl space-y-4">
          <Progress value={65} showValue label="Uploading build" />
          <Progress value={30} variant="warning" label="Cache warming" />
          <Progress indeterminate variant="accent" label="Resolving" />
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
        <div className="flex w-full max-w-xl flex-wrap items-start gap-6">
          <div className="w-full max-w-xs">
            <SkeletonText lines={3} lastLine="45%" label="Loading article" />
          </div>
          <div className="flex items-center gap-3">
            <SkeletonAvatar size="lg" />
            <div className="w-32 space-y-2">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <div className="w-full max-w-xs">
            <SkeletonCard cover lines={2} />
          </div>
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
            <div className="rounded-xl border border-dashed border-[color:var(--b-border-hover)] p-8 text-center text-sm text-[color:var(--b-text-secondary)]">
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
          <p className="text-xs text-[color:var(--b-text-secondary)]">Spring magnetic attraction.</p>
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
        <div className="h-72 w-64 overflow-hidden rounded-xl border border-[color:var(--b-border)]">
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
        <div className="h-72 w-64 overflow-hidden rounded-xl border border-[color:var(--b-border)]">
          <ExpandableSidebar>
            <ExpandableSidebarItem value="components">Components</ExpandableSidebarItem>
            <ExpandableSidebarItem value="playground">Playground</ExpandableSidebarItem>
          </ExpandableSidebar>
        </div>
      );
    case "mobile-nav":
      return wrap(
        <div className="w-full max-w-sm overflow-hidden rounded-xl border border-[color:var(--b-border)] shadow-inner">
          <MobileNav position="static" defaultActiveItem="home">
            <MobileNavItem value="home" label="Home" href="#" icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 9 9-7 9 7v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" /><path d="M9 22V12h6v10" /></svg>} />
            <MobileNavItem value="search" label="Search" href="#" icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" /></svg>} />
            <MobileNavItem value="inbox" label="Inbox" href="#" badge={3} icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>} />
            <MobileNavItem value="settings" label="Account" href="#" icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>} />
          </MobileNav>
        </div>
      );
    case "mobile-header":
      return wrap(
        <div className="flex w-full flex-wrap items-start justify-center gap-8">
          <div className="w-[300px] max-w-full shrink-0 overflow-hidden rounded-2xl border border-[color:var(--b-border)] bg-[color:var(--b-surface)] shadow-inner">
            <MobileHeader
              title="Settings"
              largeTitle="Settings"
              subtitle="2 unfinished items"
              back
              backLabel="Back"
              actions={
                <button type="button" className="rounded-md px-2 py-1 text-sm font-medium text-[color:var(--b-accent)] transition-colors hover:bg-[color:color-mix(in_oklab,var(--b-text)_6%,transparent)]">Edit</button>
              }
            />
            <MobileGroup label="Workspace">
              <MobileGroupRow title="General" trailing="Product" />
              <MobileGroupRow title="Appearance" trailing="Dark" />
              <MobileGroupRow title="Notifications" trailing="On" />
            </MobileGroup>
          </div>
          <div className="w-[300px] max-w-full shrink-0 overflow-hidden rounded-2xl border border-[color:var(--b-border)] bg-[color:var(--b-surface)] shadow-inner">
            <MobileHeader title="Activity" back actions={<Badge variant="accent">Live</Badge>} />
            <div className="border-b border-[color:var(--b-border)] px-4 pb-3 pt-1">
              <p className="text-[30px] font-bold leading-[1.15] tracking-[-0.02em] text-[color:var(--b-text)]">Studio</p>
            </div>
            <MobileSectionHeader label="Recent" trailing={<span className="text-[color:var(--b-accent)]">See all</span>} />
            <div className="flex flex-col gap-2 px-3 pb-5 pt-2">
              <SkeletonCard lines={2} />
            </div>
          </div>
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
    // removed command-bar
    // removed tui-panel
    // removed tui-status-bar
    // removed tui-header
    // removed tui-footer
    // removed tui-table
    // removed tui-tree
    // removed tui-list
    // removed tui-form
    // removed tui-select
    // removed tui-multi-select
    // removed tui-progress
    // removed tui-spinner
    // removed tui-gauge
    // removed tui-sparkline
    // removed tui-log-viewer
    // removed tui-help-overlay
    // removed tui-diff-viewer
    // removed terminal-workspace
    // removed noise-background
    // removed grid-background
    // removed dot-grid-background
    // removed gradient-mesh-background
    // removed aurora-beam-background
    // removed ripple-background
    // removed meteor-background
    // removed beam-background
    // removed glow-cursor
    // removed blob-cursor
    // removed trail-cursor
    // removed ghost-cursor
    // removed spotlight-cursor
    // removed typewriter
    // removed scrambled-text
    // removed blur-text
    // removed gradient-text
    // removed glitch-text
    // removed ripple-button
    // removed shimmer-button
    // removed glow-button
    // removed gradient-border-button
    // removed hold-button
    // removed glare-card
    // removed spotlight-card
    // removed wobble-card
    // removed glass-card
    // removed bento-grid
    // removed infinite-marquee
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
        <div className="w-80 rounded-xl border border-[color:var(--b-border)] bg-[color:var(--b-surface)] p-6 shadow-card">
          <p className="font-display text-lg font-bold">{slug}</p>
          <p className="mt-2 text-sm text-[color:var(--b-muted)]">
            Live React implementation shares patterns with the components above. Open the framework tabs
            to see the code.
          </p>
        </div>
      );
  }
}

function ToastDemo() {
  return (
    <ToastProvider>
      <ToastVariantsDemo />
    </ToastProvider>
  );
}

const VARIANTS: Array<{ variant: "default" | "success" | "warning" | "danger"; title: string; description: string }> = [
  { variant: "default", title: "Draft saved", description: "Resume from any device." },
  { variant: "success", title: "Deployment passed", description: "Edge build verified in 42s." },
  { variant: "warning", title: "Slow response", description: "Region us-east is degraded." },
  { variant: "danger", title: "Build failed", description: "Type errors in app/lib/registry." },
];

function ToastVariantsDemo() {
  const { toast } = useToast();
  const firedRef = React.useRef(false);
  React.useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    const timers = VARIANTS.map((v, i) =>
      window.setTimeout(() => toast({ variant: v.variant, title: v.title, description: v.description }), 350 + i * 620)
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [toast]);
  return (
    <Button
      onClick={() =>
        toast({ title: "Installed", description: "@buildora/magnetic-button added." })
      }
    >
      Show toast
    </Button>
  );
}

function DialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog open={open} onOpenChange={setOpen} showClose>
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

function OdometerDemo() {
  const [v, setV] = React.useState(42910);
  React.useEffect(() => {
    const values = [42910, 986, 128480, 7];
    let k = 0;
    const id = window.setInterval(() => {
      k = (k + 1) % values.length;
      setV(values[k]);
    }, 2600);
    return () => window.clearInterval(id);
  }, []);
  return <NumberWheel value={v} className="font-display text-4xl font-black" />;
}

function SheetDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open sheet</Button>
      <Sheet open={open} onOpenChange={setOpen} side="right">
        <SheetHeader>
          <SheetTitle>Panel settings</SheetTitle>
          <p className="text-xs text-[color:var(--b-text-secondary)]">Swipe toward the edge to dismiss.</p>
        </SheetHeader>
        <SheetContent>
          <p className="text-sm">Sheet content with focus management.</p>
          <div className="mt-4">
            <Switch label="Compact rows" defaultChecked />
          </div>
        </SheetContent>
        <SheetFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
        </SheetFooter>
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
        <DrawerHeader>
          <DrawerTitle>Activity details</DrawerTitle>
        </DrawerHeader>
        <DrawerContent>
          <p className="text-sm">Drawer content for mobile-first flows. Drag the handle down to dismiss.</p>
        </DrawerContent>
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
            <div className="rounded-2xl border border-[color:var(--b-border)] bg-[color:var(--b-elevated)] p-6">
              <p className="text-sm font-bold">Stacked modal</p>
              <p className="mt-1 text-xs text-[color:var(--b-text-secondary)]">Pushed via modal-stack API.</p>
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
