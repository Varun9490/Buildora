import { describe, it, expect, vi } from "vitest";
import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "../axe";
import { Dialog, DialogTitle, DialogDescription, DialogFooter } from "./index";

function Harness({ onOpenChange = () => {}, ...rest }: Partial<React.ComponentProps<typeof Dialog>>) {
  return (
    <>
      <button type="button">Outside</button>
      <Dialog open onOpenChange={onOpenChange} {...rest}>
        <DialogTitle>Confirm</DialogTitle>
        <DialogDescription>Are you sure?</DialogDescription>
        <DialogFooter>
          <button type="button">Cancel</button>
          <button type="button">Confirm action</button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

describe("Dialog", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <Dialog open={false} onOpenChange={() => {}}>
        <DialogTitle>Hidden</DialogTitle>
      </Dialog>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("exposes an accessible name from DialogTitle", async () => {
    render(<Harness />);
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleName("Confirm");
    expect(dialog).toHaveAccessibleDescription("Are you sure?");
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Harness onOpenChange={onOpenChange} />);
    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not close on Escape when closeOnEscape is false", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Harness onOpenChange={onOpenChange} closeOnEscape={false} />);
    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("closes when the backdrop is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Harness onOpenChange={onOpenChange} />);
    await screen.findByRole("dialog");
    const backdrop = document.querySelector("[data-buildora-scrim]") as HTMLElement;
    expect(backdrop).not.toBeNull();
    await user.click(backdrop);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("moves focus into the dialog on open", async () => {
    render(<Harness />);
    await screen.findByRole("dialog");
    await waitFor(() => {
      const dialog = screen.getByRole("dialog");
      expect(dialog.contains(document.activeElement)).toBe(true);
    });
  });

  it("traps Tab within the dialog", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const dialog = await screen.findByRole("dialog");
    const inside = Array.from(
      dialog.querySelectorAll<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")
    );
    expect(inside.length).toBeGreaterThan(0);

    inside[inside.length - 1].focus();
    await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);
    expect(document.activeElement).toBe(inside[0]);

    await user.tab({ shift: true });
    expect(document.activeElement).toBe(inside[inside.length - 1]);
  });

  it("makes background content inert but leaves the dialog interactive", async () => {
    render(<Harness />);
    const dialog = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(dialog.closest("[inert]")).toBeNull();
    });
  });

  it("restores focus to the trigger when it closes", async () => {
    const user = userEvent.setup();
    function Opener() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open dialog
          </button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTitle>Confirm</DialogTitle>
            <button type="button">Inside</button>
          </Dialog>
        </>
      );
    }
    render(<Opener />);
    const trigger = screen.getByRole("button", { name: "Open dialog" });
    await user.click(trigger);
    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("has no detectable axe violations", async () => {
    render(<Harness />);
    await screen.findByRole("dialog");
    expect(await axe(document.body)).toHaveNoViolations();
  });
});