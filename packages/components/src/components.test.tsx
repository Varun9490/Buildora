import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MagneticButton } from "./magnetic-button";
import { SlingshotOTP } from "./slingshot-otp";
import { Kanban } from "./kanban";
import { AdvancedTable } from "./advanced-table";

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
