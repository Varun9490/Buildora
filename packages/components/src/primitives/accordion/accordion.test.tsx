import { describe, it, expect, vi } from "vitest";
import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "../../axe";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./index";

function Basic(props: Partial<React.ComponentProps<typeof Accordion>> = {}) {
  return (
    <Accordion {...props}>
      <AccordionItem value="one">
        <AccordionTrigger>First</AccordionTrigger>
        <AccordionContent>First body</AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionTrigger>Second</AccordionTrigger>
        <AccordionContent>Second body</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe("Accordion", () => {
  it("starts collapsed and reveals content on click", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    expect(screen.queryByText("First body")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /First/ }));
    expect(screen.getByText("First body")).toBeInTheDocument();
  });

  it("keeps only one item open in single mode", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.click(screen.getByRole("button", { name: /First/ }));
    await user.click(screen.getByRole("button", { name: /Second/ }));

    expect(screen.getByText("Second body")).toBeInTheDocument();
    expect(screen.queryByText("First body")).not.toBeInTheDocument();
  });

  it("allows multiple open items in multiple mode", async () => {
    const user = userEvent.setup();
    render(<Basic type="multiple" />);
    await user.click(screen.getByRole("button", { name: /First/ }));
    await user.click(screen.getByRole("button", { name: /Second/ }));

    expect(screen.getByText("First body")).toBeInTheDocument();
    expect(screen.getByText("Second body")).toBeInTheDocument();
  });

  it("collapses an open item when clicked again", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: /First/ });
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("reflects aria-expanded on the trigger", async () => {
    const user = userEvent.setup();
    render(<Basic defaultValue="one" />);
    expect(screen.getByRole("button", { name: /First/ })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: /Second/ })).toHaveAttribute("aria-expanded", "false");
    await user.click(screen.getByRole("button", { name: /Second/ }));
  });

  it("is operable by keyboard", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.tab();
    expect(screen.getByRole("button", { name: /First/ })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByText("First body")).toBeInTheDocument();
  });

  it("reports onValueChange with a string in single mode", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Basic onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: /First/ }));
    expect(onValueChange).toHaveBeenCalledWith("one");
  });

  it("reports onValueChange with an array in multiple mode", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Basic type="multiple" onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: /First/ }));
    expect(onValueChange).toHaveBeenCalledWith(["one"]);
  });

  it("stays controlled when the parent rejects a change", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Basic value="one" onValueChange={onValueChange} />);

    expect(screen.getByText("First body")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Second/ }));

    expect(onValueChange).toHaveBeenCalledWith("two");
    // The parent kept value="one", so the panel must not move.
    expect(screen.getByText("First body")).toBeInTheDocument();
    expect(screen.queryByText("Second body")).not.toBeInTheDocument();
  });

  it("has no detectable axe violations", async () => {
    const { container } = render(<Basic defaultValue="one" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});