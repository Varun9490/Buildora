"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Activity, Database, Server, ShieldAlert } from "lucide-react";
import { AdvancedTable, Kanban } from "@buildora/components";

export default function SaaSAdminDashboardTemplate() {
  const [activeView, setActiveView] = React.useState<"overview" | "clusters" | "datastores">("overview");

  const scrollToSection = React.useCallback((id: "overview" | "clusters" | "datastores") => {
    setActiveView(id);
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const views = [
    { id: "overview" as const, label: "Overview", Icon: Activity },
    { id: "clusters" as const, label: "Clusters", Icon: Server },
    { id: "datastores" as const, label: "Datastores", Icon: Database },
  ];
  const tableCols = [
    { key: "node", label: "NODE_ID", sortable: true },
    { key: "region", label: "REGION", sortable: true },
    { key: "status", label: "STATUS", sortable: true },
    { key: "uptime", label: "UPTIME", sortable: true },
  ];

  const tableRows = [
    { id: "1", node: "n-001", region: "us-east-1a", status: "HEALTHY", uptime: "99.99%" },
    { id: "2", node: "n-002", region: "us-east-1b", status: "HEALTHY", uptime: "99.98%" },
    { id: "3", node: "n-003", region: "us-east-1c", status: "WARNING", uptime: "99.90%" },
    { id: "4", node: "n-004", region: "eu-west-1a", status: "HEALTHY", uptime: "100.0%" },
    { id: "5", node: "n-005", region: "eu-west-1b", status: "CRITICAL", uptime: "88.42%" },
    { id: "6", node: "n-006", region: "ap-south-1a", status: "HEALTHY", uptime: "99.99%" },
    { id: "7", node: "n-007", region: "ap-south-1b", status: "HEALTHY", uptime: "99.95%" },
    { id: "8", node: "n-008", region: "us-west-2a", status: "HEALTHY", uptime: "100.0%" },
  ];

  const kanbanCols = [
    { id: "backlog", title: "Incident Backlog", cards: [{ id: "i1", title: "High memory usage in eu-west-1b", tag: "critical" }] },
    { id: "active", title: "Active Investigation", cards: [{ id: "i2", title: "us-east-1c latency spikes", tag: "warning" }] },
    { id: "resolved", title: "Resolved", cards: [{ id: "i3", title: "Database connection pool exhausted", tag: "resolved" }] }
  ];

  return (
    <div className="min-h-[100dvh] bg-[var(--b-bg)] text-[color:var(--b-text)] font-sans selection:bg-[color:var(--b-accent)] selection:text-white p-4 md:p-8 flex flex-col">
      {/* Go Back Link */}
      <Link href="/templates" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[color-mix(in_oklab,var(--b-text)_40%,transparent)] hover:text-[color:var(--b-text)] mb-8 w-fit transition-colors">
        <ArrowLeft className="w-3 h-3" /> Return to Templates
      </Link>

      <div className="flex-1 border-2 border-[color:var(--b-border)] flex flex-col">
        {/* Top Header */}
        <header className="border-b-2 border-[color:var(--b-border)] p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-1">Central Command</h1>
            <p className="font-mono text-xs text-[color-mix(in_oklab,var(--b-text)_40%,transparent)] uppercase tracking-widest">Global Infrastructure Monitoring &middot; Active</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="border border-[color:var(--b-border)] px-4 py-2 flex items-center gap-3">
              <ShieldAlert className="w-4 h-4 text-[color:var(--b-accent)]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[color:var(--b-accent)]">2 Critical Alerts</span>
            </div>
            <div className="w-12 h-12 bg-[var(--b-surface)] flex items-center justify-center font-black">
              OP
            </div>
          </div>
        </header>

        {/* Main Grid Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 bg-[var(--b-bg)]">
          
          {/* Side Navigation */}
          <aside className="border-r-2 border-[color:var(--b-border)] lg:col-span-2 hidden lg:flex flex-col">
            <nav className="flex-1 flex flex-col" aria-label="Dashboard views">
              <div className="p-4 border-b border-[color:var(--b-border)] font-mono text-[10px] text-[color-mix(in_oklab,var(--b-text)_40%,transparent)] uppercase tracking-widest">Views</div>
              {views.map(({ id, label, Icon }) => {
                const isActive = activeView === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => scrollToSection(id)}
                    aria-current={isActive ? "page" : undefined}
                    className={`p-4 border-b border-[color:var(--b-border)] hover:bg-[var(--b-surface)] flex items-center gap-3 text-left w-full transition-colors ${isActive ? "bg-[color-mix(in_oklab,var(--b-surface)_50%,transparent)] text-[color:var(--b-accent)]" : "text-[color:var(--b-muted)]"}`}
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Data Content */}
          <main className="lg:col-span-10 flex flex-col overflow-y-auto h-[100dvh]">
            
            {/* KPI Strip */}
            <div id="overview" className="grid grid-cols-2 md:grid-cols-4 border-b-2 border-[color:var(--b-border)] shrink-0 scroll-mt-4">
              <div className="p-6 border-r border-[color:var(--b-border)] flex flex-col">
                <span className="font-mono text-[10px] text-[color-mix(in_oklab,var(--b-text)_40%,transparent)] uppercase tracking-widest mb-2">Network In</span>
                <span className="font-mono text-2xl md:text-4xl text-[color:var(--b-text)]">1.24<span className="text-sm text-[color-mix(in_oklab,var(--b-text)_40%,transparent)] ml-1">TB/s</span></span>
              </div>
              <div className="p-6 border-r border-[color:var(--b-border)] flex flex-col bg-[color:var(--b-accent)]/5">
                <span className="font-mono text-[10px] text-[color-mix(in_oklab,var(--b-text)_40%,transparent)] uppercase tracking-widest mb-2">Error Rate</span>
                <span className="font-mono text-2xl md:text-4xl text-[color:var(--b-accent)]">0.08<span className="text-sm text-[color:var(--b-accent)] ml-1">%</span></span>
              </div>
              <div className="p-6 border-r border-[color:var(--b-border)] flex flex-col">
                <span className="font-mono text-[10px] text-[color-mix(in_oklab,var(--b-text)_40%,transparent)] uppercase tracking-widest mb-2">Active Nodes</span>
                <span className="font-mono text-2xl md:text-4xl text-[color:var(--b-text)]">4,291</span>
              </div>
              <div className="p-6 flex flex-col">
                <span className="font-mono text-[10px] text-[color-mix(in_oklab,var(--b-text)_40%,transparent)] uppercase tracking-widest mb-2">Avg Latency</span>
                <span className="font-mono text-2xl md:text-4xl text-[color:var(--b-text)]">42<span className="text-sm text-[color-mix(in_oklab,var(--b-text)_40%,transparent)] ml-1">ms</span></span>
              </div>
            </div>

            {/* Dense Data Section */}
            <div className="flex flex-col gap-6 p-6">
              <div id="clusters" className="flex flex-col scroll-mt-4">
                <h3 className="font-mono text-xs text-[color-mix(in_oklab,var(--b-text)_40%,transparent)] uppercase tracking-widest mb-4">[ NODE_STATUS ]</h3>
                <AdvancedTable 
                  columns={tableCols} 
                  rows={tableRows} 
                  pageSize={4}
                  className="bg-[var(--b-bg)] border-[color:var(--b-border)] rounded-none [&_th]:border-[color:var(--b-border)] [&_td]:border-[color:var(--b-border)] [&_input]:border-[color:var(--b-border)] [&_input]:bg-[var(--b-panel)]" 
                />
              </div>

              <div id="datastores" className="flex flex-col scroll-mt-4">
                <h3 className="font-mono text-xs text-[color-mix(in_oklab,var(--b-text)_40%,transparent)] uppercase tracking-widest mb-4">[ ACTIVE_INCIDENTS ]</h3>
                <Kanban 
                  initial={kanbanCols} 
                  className="[&>div]:border-[color:var(--b-border)] [&>div]:bg-[var(--b-bg)] [&_li]:border-[color:var(--b-border)] [&_li]:bg-[var(--b-panel)]" 
                />
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
