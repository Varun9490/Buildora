import { describe, it, expect, vi } from "vitest";
import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "../../axe";
import { Button } from "./index";


describe("Button", () => {
  it("renders children and fires onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is reachable and activatable by keyboard", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Commit</Button>);
    await user.tab();
    const btn = screen.getByRole("button");
    expect(btn).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies variant and size classes", () => {
    const { rerender } = render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole("button").className).toContain("text-[color:var(--b-danger)]");
    rerender(<Button size="lg">Big</Button>);
    expect(screen.getByRole("button").className).toContain("px-6");
  });

  it("disables interaction and hides icons while loading", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick} leftIcon={<span>L</span>} rightIcon={<span>R</span>}>
        Saving
      </Button>
    );
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.queryByText("L")).not.toBeInTheDocument();
    expect(screen.queryByText("R")).not.toBeInTheDocument();
  });

  it("forwards refs to the underlying button element", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("merges caller className over defaults", () => {
    render(<Button className="custom-marker">X</Button>);
    expect(screen.getByRole("button").className).toContain("custom-marker");
  });

  it("has no detectable axe violations", async () => {
    const { container } = render(<Button>Accessible</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});