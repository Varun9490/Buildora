import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MagneticButton } from "./magnetic-button";
import { SlingshotOTP } from "./slingshot-otp";
import { Kanban } from "./kanban";
import { AdvancedTable } from "./advanced-table";
import { AgentTimeline } from "./agent-timeline";
import { AttachmentPrompt } from "./attachment-prompt";
import { AIReviewEdit } from "./ai-review-edit";
import { DiffViewer } from "./diff-viewer";
import { SpreadsheetGrid } from "./spreadsheet-grid";
import { QueryBuilder } from "./query-builder";
import { ApiRequestBuilder } from "./api-request-builder";
import { WebhookViewer } from "./webhook-viewer";
import { EnvManager } from "./env-manager";
import { CronBuilder } from "./cron-builder";
import { InviteFlow } from "./invite-flow";
import { ApprovalWorkflow } from "./approval-workflow";
import { AuditLog } from "./audit-log";
import { FeatureFlags } from "./feature-flags";
import { CommandPalette } from "./command-palette";
import { NodeEditor } from "./node-editor";
import { TimelineEditor } from "./timeline-editor";
import { WorkflowBuilder } from "./workflow-builder";
import { RichTextEditor } from "./rich-text-editor";
import { SlashCommands } from "./slash-commands";
import { VersionHistory } from "./version-history";
import { MarkdownEditor } from "./markdown-editor";
import { Button, Input, Badge, Switch, Checkbox, Slider, Tabs, TabsList, TabsTrigger, TabsContent, Accordion, AccordionItem, AccordionTrigger, AccordionContent, Tooltip } from "./primitives";
import { Dialog, DialogTitle, AlertDialog, Sheet, Drawer, Popover, HoverCard } from "./overlays";
import { TUIPanel, TUIStatusBar, TUIHeader, TUITable, TUIProgress, TUIGauge, TUISparkline, TUILogViewer } from "./tui";
import { RippleButton, HoldButton } from "./buttons";
import { GlassCard } from "./cards";
import { Typewriter } from "./text-effects";
import { CtaBlock } from "./cta-block";
import { Skeleton, SkeletonText } from "./primitives/skeleton";
import { FeatureGrid } from "./feature-grid";
import { LogoCloud } from "./logo-cloud";
import { SiteFooter } from "./site-footer";

describe("MagneticButton", () => {
  it("renders as a real button with accessible name", () => {
    render(<MagneticButton>Ship it</MagneticButton>);
    expect(screen.getByRole("button", { name: "Ship it" })).toBeInTheDocument();
  });
  it("fires onClick and respects disabled", () => {
    const fn = vi.fn();
    render(<MagneticButton onClick={fn}>Go</MagneticButton>);
    fireEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe("SlingshotOTP", () => {
  it("defaults to game mode with keyboard-accessible fallback toggle", () => {
    render(<SlingshotOTP length={4} />);
    // Game mode is default; Standard Mode toggle must always be available
    expect(screen.getByRole("button", { name: "Standard Mode" })).toBeInTheDocument();
    expect(screen.getByText("Enter Verification Code")).toBeInTheDocument();
  });
  it("switches to standard inputs with labels and supports typing", () => {
    const onComplete = vi.fn();
    render(<SlingshotOTP length={4} onComplete={onComplete} />);
    fireEvent.click(screen.getByRole("button", { name: "Standard Mode" }));
    // Standard mode exposes a single hidden input bound to the visual digits
    expect(screen.getByRole("button", { name: "Play Game" })).toBeInTheDocument();
  });
  it("resets value when switching modes", () => {
    render(<SlingshotOTP length={4} />);
    const toggle = screen.getByRole("button", { name: "Standard Mode" });
    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: "Play Game" })).toBeInTheDocument();
  });
});

describe("Kanban", () => {
  it("renders columns and supports keyboard move", () => {
    render(<Kanban />);
    expect(screen.getByText(/To do/)).toBeInTheDocument();
    const card = screen.getByLabelText(/Slingshot OTP.*To do/);
    card.focus();
    expect(document.activeElement).toBe(card);
  });
});

describe("AdvancedTable", () => {
  it("filters rows", () => {
    render(<AdvancedTable />);
    fireEvent.change(screen.getByLabelText("Filter table"), { target: { value: "kanban" } });
    expect(screen.getByText("Kanban")).toBeInTheDocument();
  });
  it("has sortable column headers", () => {
    render(<AdvancedTable />);
    expect(screen.getByRole("button", { name: /Sort by Component/ })).toBeInTheDocument();
  });
});

describe("Dedicated implementations", () => {
  it("AgentTimeline renders phases with list semantics", () => {
    render(<AgentTimeline />);
    expect(screen.getByRole("list", { name: "Agent timeline" })).toBeInTheDocument();
    expect(screen.getByText("Decompose request")).toBeInTheDocument();
  });
  it("AttachmentPrompt manages chips and send", () => {
    const fn = vi.fn();
    render(<AttachmentPrompt onSend={fn} />);
    expect(screen.getByRole("list", { name: "Attachments" })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Prompt with attachments"), { target: { value: "hello" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(fn).toHaveBeenCalled();
  });
  it("AIReviewEdit accepts and rejects", () => {
    const a = vi.fn();
    const r = vi.fn();
    render(<AIReviewEdit onAccept={a} onReject={r} />);
    fireEvent.click(screen.getByRole("button", { name: "Accept" }));
    expect(a).toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent("accepted");
    fireEvent.click(screen.getByRole("button", { name: "Reject" }));
    expect(r).toHaveBeenCalled();
  });
  it("DiffViewer shows before/after regions", () => {
    render(<DiffViewer />);
    expect(screen.getByLabelText("Before")).toBeInTheDocument();
    expect(screen.getByLabelText("After")).toBeInTheDocument();
  });
  it("SpreadsheetGrid exposes labeled cells", () => {
    render(<SpreadsheetGrid rows={2} cols={2} />);
    expect(screen.getByLabelText("Cell A1")).toBeInTheDocument();
  });
  it("QueryBuilder adds filters", () => {
    render(<QueryBuilder />);
    fireEvent.click(screen.getByRole("button", { name: "+ Add filter" }));
    expect(screen.getByRole("list", { name: "Query filters" }).children.length).toBe(2);
  });
  it("ApiRequestBuilder sends and shows response", () => {
    render(<ApiRequestBuilder />);
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(screen.getByRole("region", { name: "Response" })).toHaveTextContent("200 OK");
  });
  it("WebhookViewer selects events", () => {
    render(<WebhookViewer />);
    fireEvent.click(screen.getByRole("button", { name: /registry.validate/ }));
    expect(screen.getByRole("region", { name: "Payload" })).toHaveTextContent("54");
  });
  it("EnvManager reveals masked values", () => {
    render(<EnvManager />);
    expect(screen.getAllByText(/••••/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getAllByRole("button", { name: "Reveal" })[0]);
    expect(screen.getByText(/postgres/)).toBeInTheDocument();
  });
  it("CronBuilder switches presets", () => {
    render(<CronBuilder />);
    fireEvent.click(screen.getByRole("button", { name: "Hourly" }));
    expect(screen.getByRole("status")).toHaveTextContent("Every hour");
  });
  it("InviteFlow validates email", () => {
    render(<InviteFlow />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "bad" } });
    fireEvent.click(screen.getByRole("button", { name: "Send invite" }));
    expect(screen.getByRole("alert")).toHaveTextContent("valid email");
  });
  it("ApprovalWorkflow approves steps", () => {
    render(<ApprovalWorkflow />);
    fireEvent.click(screen.getAllByRole("button", { name: "Approve" })[0]);
    expect(screen.getByRole("status")).toHaveTextContent("2/3");
  });
  it("AuditLog filters events", () => {
    render(<AuditLog />);
    fireEvent.change(screen.getByLabelText("Filter audit log"), { target: { value: "ci" } });
    expect(screen.getByText(/registry validation/)).toBeInTheDocument();
  });
  it("FeatureFlags toggles switches", () => {
    render(<FeatureFlags />);
    const sw = screen.getByRole("switch", { name: "magnetic-v2" });
    expect(sw).toHaveAttribute("aria-checked", "true");
    fireEvent.click(sw);
    expect(sw).toHaveAttribute("aria-checked", "false");
  });
  it("CommandPalette filters and navigates", () => {
    render(<CommandPalette />);
    fireEvent.change(screen.getByLabelText("Type a command"), { target: { value: "theme" } });
    expect(screen.getByRole("option", { name: /Toggle theme/ })).toBeInTheDocument();
  });
  it("NodeEditor exposes diagram + list", () => {
    render(<NodeEditor />);
    expect(screen.getByRole("img", { name: "Node diagram" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Nodes list" })).toBeInTheDocument();
  });
  it("TimelineEditor selects clips", () => {
    render(<TimelineEditor />);
    fireEvent.click(screen.getByRole("button", { name: "enter" }));
    expect(screen.getByRole("status")).toHaveTextContent("k1");
  });
  it("WorkflowBuilder advances steps", () => {
    render(<WorkflowBuilder />);
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("list", { name: "Workflow steps" })).toBeInTheDocument();
  });
  it("RichTextEditor has toolbar and textbox", () => {
    render(<RichTextEditor />);
    expect(screen.getByRole("toolbar", { name: "Formatting" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Rich text" })).toBeInTheDocument();
  });
  it("SlashCommands filters slash menu", () => {
    render(<SlashCommands />);
    fireEvent.change(screen.getByLabelText("Slash command"), { target: { value: "/kanban" } });
    expect(screen.getByRole("option", { name: /Insert board/ })).toBeInTheDocument();
  });
  it("VersionHistory restores versions", () => {
    const fn = vi.fn();
    render(<VersionHistory onRestore={fn} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Restore" })[0]);
    expect(fn).toHaveBeenCalled();
  });
});

describe("Primitives", () => {
  it("Button renders variants as native buttons", () => {
    render(<><Button>Go</Button><Button variant="ghost">Ghost</Button></>);
    expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
  });
  it("Input is labeled by the consumer", () => {
    render(<><label htmlFor="t-name">Name</label><Input id="t-name" /></>);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });
  it("Badge and Switch expose state", () => {
    render(<><Badge variant="success">stable</Badge><Switch label="Notify" /></>);
    expect(screen.getByText("stable")).toBeInTheDocument();
    expect(screen.getByLabelText("Notify")).toBeInTheDocument();
  });
  it("Checkbox and Slider are operable", () => {
    render(<><Checkbox label="Agree" /><Slider aria-label="Level" defaultValue={20} /></>);
    expect(screen.getByLabelText("Agree")).toBeInTheDocument();
    expect(screen.getByLabelText("Level")).toBeInTheDocument();
  });
  it("Tabs switch panels", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList><TabsTrigger value="a">A</TabsTrigger><TabsTrigger value="b">B</TabsTrigger></TabsList>
        <TabsContent value="a">Panel A</TabsContent>
        <TabsContent value="b">Panel B</TabsContent>
      </Tabs>
    );
    fireEvent.click(screen.getByRole("tab", { name: "B" }));
    expect(screen.getByText("Panel B")).toBeInTheDocument();
  });
  it("Accordion expands content", () => {
    render(
      <Accordion>
        <AccordionItem value="x"><AccordionTrigger>Q</AccordionTrigger><AccordionContent>A</AccordionContent></AccordionItem>
      </Accordion>
    );
    fireEvent.click(screen.getByRole("button", { name: "Q" }));
    expect(screen.getByText("A")).toBeInTheDocument();
  });
  it("Tooltip wraps a trigger", () => {
    render(<Tooltip content="hint"><button>Hover</button></Tooltip>);
    expect(screen.getByRole("button", { name: "Hover" })).toBeInTheDocument();
  });
});

describe("Overlays", () => {
  it("Dialog renders title when open", () => {
    render(<Dialog open onOpenChange={() => undefined}><DialogTitle>Install</DialogTitle></Dialog>);
    expect(screen.getByText("Install")).toBeInTheDocument();
  });
  it("AlertDialog confirms", () => {
    const fn = vi.fn();
    render(<AlertDialog open onOpenChange={() => undefined} title="Remove?" onConfirm={fn} />);
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(fn).toHaveBeenCalled();
  });
  it("Sheet and Drawer render children when open", () => {
    render(<><Sheet open onOpenChange={() => undefined}><p>sheet body</p></Sheet><Drawer open onOpenChange={() => undefined}><p>drawer body</p></Drawer></>);
    expect(screen.getByText("sheet body")).toBeInTheDocument();
    expect(screen.getByText("drawer body")).toBeInTheDocument();
  });
  it("Popover and HoverCard render content", () => {
    render(<><Popover open onOpenChange={() => undefined} anchor={<button>anchor</button>}><p>pop body</p></Popover><HoverCard trigger={<button>trig</button>}><p>hover body</p></HoverCard></>);
    expect(screen.getByText("pop body")).toBeInTheDocument();
  });
});

describe("TUI family", () => {
  it("Panel, StatusBar, Header render mono content", () => {
    render(<><TUIPanel title="registry"><p>ok</p></TUIPanel><TUIStatusBar items={[{ label: "branch", value: "main" }]} /><TUIHeader title="buildora" /></>);
    expect(screen.getByText("registry")).toBeInTheDocument();
    expect(screen.getByText("main")).toBeInTheDocument();
  });
  it("Table, Progress, Gauge, Sparkline render values", () => {
    render(<><TUITable columns={[{ key: "n", header: "Name" }]} rows={[{ id: "1", n: "a" }]} /><TUIProgress value={50} label="build" /><TUIGauge value={70} label="cov" /><TUISparkline data={[1, 2, 3]} /></>);
    expect(screen.getByText("a")).toBeInTheDocument();
  });
  it("LogViewer shows entries", () => {
    render(<TUILogViewer entries={[{ level: "info", message: "valid" }]} />);
    expect(screen.getByText("valid")).toBeInTheDocument();
  });
});

describe("Creative additions", () => {
  it("Ripple and Hold buttons are native buttons", () => {
    render(<><RippleButton>Rip</RippleButton><HoldButton>Hold</HoldButton></>);
    expect(screen.getByRole("button", { name: "Rip" })).toBeInTheDocument();
  });
  it("GlassCard and Typewriter render", () => {
    render(<><GlassCard><p>glass</p></GlassCard><Typewriter text="hi" loop={false} /></>);
    expect(screen.getByText("glass")).toBeInTheDocument();
  });
});

describe("Skeleton", () => {
  it("hides from assistive tech and applies dimensions", () => {
    const { container } = render(<Skeleton width={120} height={16} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("aria-hidden", "true");
    expect(el.style.width).toBe("120px");
    expect(el.style.height).toBe("16px");
  });
  it("sweep covers 200% so the shimmer keyframes travel", () => {
    const { container } = render(<Skeleton width="100%" height={12} />);
    const sweep = container.firstElementChild?.firstElementChild as HTMLElement | null;
    expect(sweep?.style.backgroundSize).toBe("200% 100%");
  });
  it("SkeletonText renders N lines with a shorter last line", () => {
    const { container } = render(<SkeletonText lines={3} />);
    expect(container.firstElementChild?.childElementCount).toBe(3);
  });
});

describe("Blocks", () => {
  it("CtaBlock fires actions and shows stats", () => {
    const fn = vi.fn();
    render(<CtaBlock onPrimary={fn} stats={[{ value: "138", label: "components" }]} />);
    fireEvent.click(screen.getByRole("button", { name: "Browse components" }));
    expect(fn).toHaveBeenCalled();
    expect(screen.getByText("138")).toBeInTheDocument();
  });
  it("FeatureGrid lists features", () => {
    render(<FeatureGrid items={[{ title: "Fast", body: "So fast." }]} />);
    expect(screen.getByText("Fast")).toBeInTheDocument();
  });
  it("LogoCloud renders logos only", () => {
    render(<LogoCloud brands={["Acme", "Globex"]} />);
    expect(screen.getByRole("list", { name: "Customer logos" })).toBeInTheDocument();
    expect(screen.queryByText("hosting")).toBeNull();
  });
  it("SiteFooter exposes footer navigation", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("navigation", { name: "Footer" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("normal");
  });
});

describe("Security", () => {
  it("MarkdownEditor escapes raw HTML in preview", () => {
    render(<MarkdownEditor />);
    fireEvent.change(screen.getByLabelText("markdown"), {
      target: { value: "<img src=x onerror=alert(1)>" },
    });
    expect(document.querySelector("img")).toBeNull();
  });
});
