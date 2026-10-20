/**
 * Shared render fixtures.
 *
 * Every component in the barrel is auto-discovered by the SSR and a11y gates.
 * A component with required props needs a minimal valid instance, otherwise
 * rendering it says nothing about the property under test.
 *
 * Keep this list in sync with the barrel: a missing fixture shows up as a
 * failing render, not as a silent skip.
 */
export const NOT_STANDALONE = new Set([
  // hooks
  "useToast",
  "useModalStack",
  // context-only children
  "TabsTrigger",
  "TabsContent",
  "AccordionItem",
  "AccordionTrigger",
  "SidebarHeader",
  "SidebarContent",
  "SidebarFooter",
  "SidebarGroup",
  "SidebarMenu",
  "SidebarTrigger",
  "SidebarSection",
  "SidebarItem",
  "SidebarToggle",
  "ExpandableSidebarHeader",
  "ExpandableSidebarItem",
  "MobileNavItem",
  "StepNavItem",
  "PaginationButton",
  "PaginationPrev",
  "PaginationNext",
  "springStep",
  // terminal helpers re-exported next to the components
  "createTerminalLine",
  "createTerminalTab",
  "getTerminalTheme",
  "createCustomTheme",
  "ansiColorToCSS",
]);

/** A complete terminal colour scheme, so terminal parts can render. */
const TERMINAL_THEME = {
  name: "fixture",
  background: "#101010",
  foreground: "#e0e0e0",
  cursor: "#e0e0e0",
  cursorAccent: "#101010",
  selectionBackground: "#333333",
  black: "#101010",
  red: "#e06c75",
  green: "#98c379",
  yellow: "#e5c07b",
  blue: "#61afef",
  magenta: "#c678dd",
  cyan: "#56b6c2",
  white: "#dcdfe4",
  brightBlack: "#5a5a5a",
  brightRed: "#e06c75",
  brightGreen: "#98c379",
  brightYellow: "#e5c07b",
  brightBlue: "#61afef",
  brightMagenta: "#c678dd",
  brightCyan: "#56b6c2",
  brightWhite: "#ffffff",
};

export const PROPS: Record<string, Record<string, unknown>> = {
  // Controls that need a discernible name.
  Button: { children: "Press" },
  Chip: { children: "Tag" },
  FxButton: { children: "Press" },
  HoldButton: { children: "Hold" },
  MagneticButton: { children: "Press" },
  DialogTitle: { children: "Confirm" },
  DrawerTitle: { children: "Details" },
  SheetTitle: { children: "Panel" },
  // Form controls need an accessible name.
  Checkbox: { "aria-label": "Accept terms" },
  Input: { "aria-label": "Full name" },
  Radio: { "aria-label": "Option A", value: "a" },
  Slider: { "aria-label": "Volume" },
  Switch: { "aria-label": "Notifications" },
  Textarea: { "aria-label": "Notes" },
  // Content that needs an image alternative or a heading.
  FloatingObject: { src: "", alt: "A floating cube" },
  ProjectShowcaseCard: {
    number: "01",
    title: "Buildora",
    description: "A project",
    imageSrc: "",
    imageAlt: "Project screenshot",
  },
  MobileHeader: { title: "Inbox" },
  // Meters need a name and a value.
  Progress: { value: 40, label: "Loading" },
  BlurText: { text: "hello" },
  ScrambledText: { text: "hello" },
  KbdShortcut: { keys: ["Ctrl", "K"] },
  HandwrittenAnnotation: { text: "note" },
  VerticalTimeline: { entries: [{ title: "Kickoff" }] },
  MatrixDecode: { text: "hello" },
  RgbGlitchText: { text: "hello" },
  NumberWheel: { value: 42 },
  InlineWordRoll: { words: ["one", "two"] },
  EchoStack: { text: "hello" },
  SelectionSnap: { text: "hello" },
  PeriodDrop: { text: "hello" },
  TypeWall: { words: ["one", "two"] },
  SegmentedControl: { items: [{ value: "a", label: "A" }] },
  GooeyMenu: { items: [{ label: "Share", onSelect: () => undefined }] },
  ElasticSlider: { label: "Volume" },
  MorphSelect: { options: ["one", "two"] },
  ConfirmMorph: { label: "Rotate keys" },
  DetentDial: {},
  LiquidGauge: { value: 42 },
  BlueprintLoader: { rows: 3 },
  LetterWave: { text: "wave hello" },
  FocusBlurList: { items: [{ title: "one" }] },
  GrabRollerStrip: { labels: ["a", "b", "c"] },
  UnifiedLoginField: { onSubmit: async () => undefined },
  MagneticDropzone: { onFiles: () => undefined },
  DraggableCardPile: { cards: [{ title: "one" }] },
  CommentThread: {
    threads: [{ id: "1", author: "Ada", body: "Ship the gate.", time: "2m" }],
  },
  MagnificationDock: {
    items: [
      { label: "One", path: "M3 20h18M5 20V9l7-5 7 5v11" },
      { label: "Two", path: "M4 17l6-5-6-5M12 19h8" },
    ],
  },
  DynamicIsland: { status: "idle" },
  SplitText: { text: "Ship it with real physics" },
  SpringCarousel: { children: ["One", "Two"] },
  RubberBand: { children: "Pull me" },
  ScrollProgress: {},
  DragDismiss: { children: "Flick me away" },
  ParallaxStack: { layers: [{ speed: 0.2, children: "back" }, { speed: 0.6, children: "front" }] },
  ScrollLinkedPath: { path: "M20 120 C 90 20, 160 200, 230 80" },
  PinnedSection: { children: "Pinned" },
  PhysicsKanban: {
    columns: [
      { id: "todo", title: "To do", cards: [{ id: "c1", title: "One" }] },
      { id: "done", title: "Done", cards: [] },
    ],
  },
  CountUp: { value: 1284 },
  // Terminal parts need the data and the theme they display.
  TUISparkline: { data: [1, 2, 3] },
  TUIHelpOverlay: { bindings: [], visible: false },
  TerminalPane: { lines: [], theme: TERMINAL_THEME },
  CommandInput: { theme: TERMINAL_THEME },
  TerminalTabBar: {
    tabs: [{ id: "1", title: "bash" }],
    activeTab: "1",
    onTabChange: () => undefined,
    onTabClose: () => undefined,
    onTabAdd: () => undefined,
    theme: TERMINAL_THEME,
  },
  TerminalSidebar: {
    theme: TERMINAL_THEME,
    sessions: [{ id: "1", name: "bash" }],
    sections: [{ id: "a", label: "Files" }],
  },
  TerminalUI: {
    initialTabs: [{ id: "1", title: "bash" }],
    sessions: [{ id: "1", name: "bash" }],
  },
  // The popover trigger is a button; it needs a name of its own.
  Popover: { anchor: "Open" },
};
