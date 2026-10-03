import { describe, it, expect, vi } from "vitest";
import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "../../axe";
import { Switch } from "./index";


describe("Switch", () => {
  it("exposes the switch role and reflects checked state", () => {
    render(<Switch label="Reduce motion" checked={false} onChange={() => {}} />);
    const el = screen.getByRole("switch");
    expect(el).toHaveAttribute("aria-checked", "false");
  });

  it("reports aria-checked=true when checked", () => {
    render(<Switch label="On" checked onChange={() => {}} />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("is operable by keyboard via Space", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch label="Toggle" checked={false} onChange={onChange} />);
    await user.tab();
    expect(screen.getByRole("switch")).toHaveFocus();
    await user.keyboard(" ");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("associates the visible label with the control", () => {
    render(<Switch label="Notifications" checked={false} onChange={() => {}} />);
    expect(screen.getByRole("switch", { name: "Notifications" })).toBeInTheDocument();
  });

  it("does not fire onChange when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch label="Off" checked={false} disabled onChange={onChange} />);
    expect(screen.getByRole("switch")).toBeDisabled();
    await user.click(screen.getByRole("switch"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("has no detectable axe violations", async () => {
    const { container } = render(<Switch label="A11y" checked onChange={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});