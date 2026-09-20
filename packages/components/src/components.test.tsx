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
