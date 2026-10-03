import { describe, it, expect, vi } from "vitest";
import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "../../axe";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "./index";

function Basic(props: Partial<React.ComponentProps<typeof Tabs>> = {}) {
  return (
    <Tabs {...props}>
      <TabsList aria-label="Sections">
        <TabsTrigger value="a">Alpha</TabsTrigger>
        <TabsTrigger value="b">Beta</TabsTrigger>
        <TabsTrigger value="c">Gamma</TabsTrigger>
      </TabsList>
      <TabsContent value="a">Panel A</TabsContent>
      <TabsContent value="b">Panel B</TabsContent>
      <TabsContent value="c">Panel C</TabsContent>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("renders only the selected panel by defaultValue", () => {
    render(<Basic defaultValue="b" />);
    expect(screen.getByText("Panel B")).toBeInTheDocument();
    expect(screen.queryByText("Panel A")).not.toBeInTheDocument();
  });

  it("wires role/aria between trigger and panel", () => {
    render(<Basic defaultValue="a" />);
    const trigger = screen.getByRole("tab", { name: "Alpha" });
    const panel = screen.getByRole("tabpanel");
    expect(trigger).toHaveAttribute("aria-selected", "true");
    expect(trigger).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAttribute("aria-labelledby", trigger.id);
  });

  it("moves selection on click and reports onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Basic defaultValue="a" onValueChange={onValueChange} />);
    await user.click(screen.getByRole("tab", { name: "Beta" }));
    expect(onValueChange).toHaveBeenCalledWith("b");
    expect(screen.getByText("Panel B")).toBeInTheDocument();
  });

  it("moves focus with ArrowRight and wraps around", async () => {
    const user = userEvent.setup();
    render(<Basic defaultValue="a" />);
    const alpha = screen.getByRole("tab", { name: "Alpha" });
    const beta = screen.getByRole("tab", { name: "Beta" });
    const gamma = screen.getByRole("tab", { name: "Gamma" });

    alpha.focus();
    await user.keyboard("{ArrowRight}");
    expect(beta).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(gamma).toHaveFocus();

    // wraps forward past the last tab
    await user.keyboard("{ArrowRight}");
    expect(alpha).toHaveFocus();
  });

  it("moves focus with ArrowLeft and wraps backward", async () => {
    const user = userEvent.setup();
    render(<Basic defaultValue="a" />);
    const alpha = screen.getByRole("tab", { name: "Alpha" });
    const gamma = screen.getByRole("tab", { name: "Gamma" });

    alpha.focus();
    await user.keyboard("{ArrowLeft}");
    expect(gamma).toHaveFocus();
  });

  it("keeps exactly one tab in the tab order (roving tabindex)", () => {
    render(<Basic defaultValue="b" />);
    const tabs = screen.getAllByRole("tab");
    const focusable = tabs.filter((t) => t.getAttribute("tabindex") === "0");
    expect(focusable).toHaveLength(1);
    expect(focusable[0]).toHaveTextContent("Beta");
  });

  it("stays controlled when value is supplied", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(<Basic value="a" onValueChange={onValueChange} />);

    await user.click(screen.getByRole("tab", { name: "Beta" }));
    expect(onValueChange).toHaveBeenCalledWith("b");
    // parent did not accept the change, so the panel must not move
    expect(screen.getByText("Panel A")).toBeInTheDocument();

    rerender(<Basic value="c" onValueChange={onValueChange} />);
    expect(screen.getByText("Panel C")).toBeInTheDocument();
  });

  it("has no detectable axe violations", async () => {
    const { container } = render(<Basic defaultValue="a" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});