"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export interface TUITreeNode {
  id: string;
  label: string;
  icon?: string;
  children?: TUITreeNode[];
  expanded?: boolean;
}

export interface TUITreeProps {
  nodes: TUITreeNode[];
  selectedId?: string;
  onSelect?: (node: TUITreeNode) => void;
  onExpand?: (node: TUITreeNode) => void;
  className?: string;
  showLines?: boolean;
  dense?: boolean;
}

export function TUITree({
  nodes,
  selectedId,
  onSelect,
  onExpand,
  className,
  showLines = true,
  dense = false,
}: TUITreeProps) {
  const [expandedNodes, setExpandedNodes] = React.useState<Set<string>>(
    new Set(nodes.filter((n) => n.expanded).map((n) => n.id))
  );

  const toggle = (node: TUITreeNode) => {
    setExpandedNodes((s) => {
      const n = new Set(s);
      if (n.has(node.id)) n.delete(node.id);
      else n.add(node.id);
      return n;
    });
    onExpand?.(node);
  };

  const renderNode = (node: TUITreeNode, depth: number, isLast: boolean) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedId === node.id;

    return (
      <div key={node.id} role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined}>
        <div
          className={cn(
            "flex items-center gap-1 cursor-pointer hover:bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)]",
            dense ? "py-0.5" : "py-1",
            isSelected && "bg-cyan-500/10"
          )}
          style={{ paddingLeft: depth * 12 + 4 }}
          onClick={() => onSelect?.(node)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && hasChildren) toggle(node);
          }}
        >
          {showLines && depth > 0 && (
            <span className="text-[color-mix(in_oklab,var(--b-text)_20%,transparent)]" aria-hidden>
              {isLast ? "└─" : "├─"}
            </span>
          )}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggle(node);
              }}
              className="text-[color-mix(in_oklab,var(--b-text)_40%,transparent)] hover:text-[color-mix(in_oklab,var(--b-text)_60%,transparent)] w-4 text-left"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? "▼" : "▶"}
            </button>
          )}
          {!hasChildren && <span className="w-4" />}
          {node.icon && <span className="text-[color-mix(in_oklab,var(--b-text)_60%,transparent)]">{node.icon}</span>}
          <span className={cn(isSelected ? "text-cyan-400" : "text-[color-mix(in_oklab,var(--b-text)_80%,transparent)]")}>
            {node.label}
          </span>
        </div>
        {hasChildren && isExpanded && (
          <div role="group">
            {node.children!.map((child, i) =>
              renderNode(child, depth + 1, i === node.children!.length - 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn("font-mono text-xs bg-[#0a0c10] overflow-auto", className)}
      role="tree"
      aria-label="File tree"
    >
      {nodes.map((n, i) => renderNode(n, 0, i === nodes.length - 1))}
    </div>
  );
}
