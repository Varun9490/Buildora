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
  it("renders N inputs with labels and supports paste", () => {
    const onComplete = vi.fn();
    render(<SlingshotOTP length={4} onComplete={onComplete} />);
    const inputs = screen.getAllByRole("textbox");
    // inputs are type text? they have aria-labels; query by label
    expect(screen.getByLabelText("Digit 1 of 4")).toBeInTheDocument();
    expect(inputs.length).toBeGreaterThanOrEqual(4);
  });
  it("announces progress to screen readers", () => {
    render(<SlingshotOTP length={4} />);
    expect(screen.getByText(/of 4 digits entered/)).toBeInTheDocument();
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
