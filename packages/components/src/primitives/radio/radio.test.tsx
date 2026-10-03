import { describe, it, expect, vi } from "vitest";
import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "../../axe";
import { Radio, RadioGroup } from "./index";

function Basic(props: Partial<React.ComponentProps<typeof RadioGroup>> = {}) {
  return (
    <RadioGroup {...props}>
      <Radio value="a" label="Alpha" />
      <Radio value="b" label="Beta" />
      <Radio value="c" label="Gamma" />
    </RadioGroup>
  );
}

describe("RadioGroup", () => {
  it("marks only the selected radio as checked", () => {
    render(<Basic defaultValue="b" />);
    expect(screen.getByRole("radio", { name: "Beta" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Alpha" })).not.toBeChecked();
  });

  it("selects on click and reports onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Basic onValueChange={onValueChange} />);
    await user.click(screen.getByRole("radio", { name: "Gamma" }));
    expect(onValueChange).toHaveBeenCalledWith("c");
    expect(screen.getByRole("radio", { name: "Gamma" })).toBeChecked();
  });

  it("exposes the radiogroup role with an accessible name", () => {
    render(<Basic aria-label="Pick one" />);
    expect(screen.getByRole("radiogroup", { name: "Pick one" })).toBeInTheDocument();
  });

  it("shares a name across the group so the browser treats it as one set", () => {
    render(<Basic name="choice" />);
    const radios = screen.getAllByRole("radio");
    expect(radios.every((r) => r.getAttribute("name") === "choice")).toBe(true);
  });

  it("does not fire onValueChange for a disabled radio", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup onValueChange={onValueChange}>
        <Radio value="a" label="Alpha" />
        <Radio value="b" label="Beta" disabled />
      </RadioGroup>
    );
    await user.click(screen.getByRole("radio", { name: "Beta" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("stays controlled when the parent rejects a change", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Basic value="a" onValueChange={onValueChange} />);

    await user.click(screen.getByRole("radio", { name: "Gamma" }));
    expect(onValueChange).toHaveBeenCalledWith("c");
    // Parent kept value="a", so selection must not move.
    expect(screen.getByRole("radio", { name: "Alpha" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Gamma" })).not.toBeChecked();
  });

  it("follows the value prop when the parent accepts it", () => {
    const { rerender } = render(<Basic value="a" />);
    expect(screen.getByRole("radio", { name: "Alpha" })).toBeChecked();
    rerender(<Basic value="c" />);
    expect(screen.getByRole("radio", { name: "Gamma" })).toBeChecked();
  });

  it("has no detectable axe violations", async () => {
    const { container } = render(<Basic aria-label="Pick one" defaultValue="a" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});