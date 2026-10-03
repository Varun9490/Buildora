import { describe, it, expect } from "vitest";
import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "./index";

/**
 * The Switch was written for controlled use only: it forwards `checked`
 * straight through, so an uncontrolled consumer gets a permanently disabled
 * checkbox. These tests pin the behaviour that must work.
 */
describe("Switch (uncontrolled)", () => {
  it("toggles when used without a checked prop", async () => {
    const user = userEvent.setup();
    render(<Switch label="Wi-Fi" />);
    const el = screen.getByRole("switch");
    expect(el).not.toBeChecked();

    await user.click(el);
    expect(el).toBeChecked();

    await user.click(el);
    expect(el).not.toBeChecked();
  });

  it("honours defaultChecked", () => {
    render(<Switch label="Bluetooth" defaultChecked />);
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("reports aria-checked in uncontrolled mode", async () => {
    const user = userEvent.setup();
    render(<Switch label="Auto" />);
    const el = screen.getByRole("switch");
    expect(el).toHaveAttribute("aria-checked", "false");
    await user.click(el);
    expect(el).toHaveAttribute("aria-checked", "true");
  });
});