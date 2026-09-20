"use client";

import * as React from "react";
import { cn } from "../utils";

export type DNode = { id: string; label: string; x: number; y: number };
export type DEdge = { from: string; to: string };

export function NodeEditor({
  nodes: ns,
  edges: es,
  className,
}: {
  nodes?: DNode[];
  edges?: DEdge[];
  className?: string;
}) {
  const nodes: DNode[] = ns ?? [
    { id: "n1", label: "registry", x: 40, y: 60 },
    { id: "n2", label: "playground", x: 220, y: 40 },
    { id: "n3", label: "docs", x: 220, y: 120 },
  ];
  const edges: DEdge[] = es ?? [
    { from: "n1", to: "n2" },
    { from: "n1", to: "n3" },
  ];
  const [zoom, setZoom] = React.useState(1);
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-white/10 bg-[#0a0c11]", className)}>
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
        <span className="font-mono text-[11px] text-white/40">nodes · {nodes.length}</span>
        <span className="ml-auto flex items-center gap-1.5">
          <button onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))} aria-label="Zoom out" className="rounded border border-white/10 px-2 py-0.5 font-mono">−</button>
          <span className="font-mono text-[11px] text-white/60" role="status">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom((z) => Math.min(1.8, +(z + 0.1).toFixed(2)))} aria-label="Zoom in" className="rounded border border-white/10 px-2 py-0.5 font-mono">+</button>
        </span>
      </div>
      <svg viewBox="0 0 360 200" role="img" aria-label="Node diagram" className="h-52 w-full" style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}>
        {edges.map((e, i) => {
          const a = byId[e.from];
          const b = byId[e.to];
          if (!a || !b) return null;
          return <line key={i} x1={a.x + 40} y1={a.y + 14} x2={b.x} y2={b.y + 14} stroke="rgba(255,255,255,.25)" strokeWidth={1.5} />;
        })}
        {nodes.map((n) => (
          <g key={n.id}>
            <rect x={n.x} y={n.y} width={90} height={28} rx={8} fill="#141726" stroke="rgba(255,255,255,.15)" />
            <text x={n.x + 45} y={n.y + 18} textAnchor="middle" fill="#fff" fontSize={11} fontFamily="monospace">{n.label}</text>
          </g>
        ))}
      </svg>
      <ul className="border-t border-white/10 p-2 text-xs text-white/60" aria-label="Nodes list">
        {nodes.map((n) => (
          <li key={n.id} className="font-mono">· {n.label} ({n.x}, {n.y})</li>
        ))}
      </ul>
    </div>
  );
}

export default NodeEditor;
