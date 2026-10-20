"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type TreeNode = { name: string; children?: TreeNode[] };

export type FileTreeProps = {
  tree?: TreeNode;
  className?: string;
};

/**
 * FileTree — a keyboard-navigable tree.
 *
 * The treeitem itself is the focusable control (ARIA tree pattern): a button
 * inside a treeitem would nest two interactive elements, which screen
 * readers never announce reliably.
 */
export function FileTree({ tree, className }: FileTreeProps) {
  const root: TreeNode = tree ?? {
    name: "buildora",
    children: [
      {
        name: "registry",
        children: [{ name: "magnetic-button.json" }, { name: "slingshot-otp.json" }],
      },
      {
        name: "packages",
        children: [{ name: "components" }, { name: "tokens" }],
      },
      { name: "apps", children: [{ name: "web" }] },
    ],
  };
  const [open, setOpen] = React.useState<Set<string>>(new Set(["buildora", "registry"]));

  const toggle = (p: string) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(p)) n.delete(p);
      else n.add(p);
      return n;
    });

  const render = (n: TreeNode, path: string, depth: number) => {
    const p = `${path}/${n.name}`;
    const isOpen = open.has(n.name) || open.has(p);
    const hasKids = !!n.children?.length;
    return (
      <li
        key={p}
        role="treeitem"
        aria-expanded={hasKids ? isOpen : undefined}
        tabIndex={0}
        onClick={() => hasKids && toggle(n.name)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (hasKids) toggle(n.name);
          }
        }}
        className="list-none rounded outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--b-accent)]"
      >
        <span
          className="flex w-full cursor-pointer items-center gap-1.5 rounded px-2 py-1 text-left font-mono text-xs hover:bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)]"
          style={{ paddingLeft: 8 + depth * 14 }}
        >
          <span
            aria-hidden
            className="text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]"
          >
            {hasKids ? (isOpen ? "▾" : "▸") : "·"}
          </span>
          <span
            className={
              hasKids
                ? "text-[color:var(--b-iris)]"
                : "text-[color-mix(in_oklab,var(--b-text)_75%,transparent)]"
            }
          >
            {n.name}
          </span>
        </span>
        {hasKids && isOpen && (
          <ul role="group">{n.children!.map((c) => render(c, p, depth + 1))}</ul>
        )}
      </li>
    );
  };

  return (
    <ul
      className={cn(
        "rounded-2xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color:var(--b-bg)] p-2",
        className
      )}
      role="tree"
      aria-label="File tree"
    >
      {render(root, "", 0)}
    </ul>
  );
}

export default FileTree;
