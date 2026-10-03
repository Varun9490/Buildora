"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Terminal, FileTree } from "@buildora/components";

export default function DeveloperTUITemplate() {
  const treeData = {
    name: "root",
    children: [
      { name: "bin" },
      { name: "etc" },
      { name: "var", children: [{ name: "log" }, { name: "tmp" }] },
      { name: "sys" }
    ]
  };

  const initialTerminalLines = [
    "Starting sequence... OK",
    "Loading kernel modules... OK",
    "Mounting filesystems... OK",
    "WARN: Unrecognized device on bus 4",
    "System ready."
  ];

  return (
    <div className="min-h-[100dvh] bg-[var(--b-bg)] text-[color:var(--b-text)] font-mono selection:bg-[color:var(--b-accent)] selection:text-white flex flex-col p-4 md:p-8">
      {/* Go Back Link */}
      <Link href="/templates" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[color-mix(in_oklab,var(--b-text)_40%,transparent)] hover:text-[color:var(--b-text)] mb-8 w-fit transition-colors">
        <ArrowLeft className="w-3 h-3" /> Return to Templates
      </Link>

      <div className="flex-1 border border-[color:var(--b-border)] rounded-sm overflow-hidden flex flex-col shadow-2xl relative">
        {/* CRT Scanline Overlay */}
        <div className="pointer-events-none absolute inset-0 z-50 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)" }}></div>
        
        {/* Header Bar */}
        <header className="border-b border-[color:var(--b-border)] bg-[#121212] px-4 py-3 flex items-center justify-between text-xs tracking-[0.1em] uppercase">
          <div className="flex items-center gap-4">
            <span className="font-bold text-[color:var(--b-accent)]">SYS.CTRL</span>
            <span className="text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">v2.4.19</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><span className="w-2 h-2 bg-[#4AF626] rounded-full animate-pulse"></span> ONLINE</span>
            <span className="text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">USER: ADMIN</span>
          </div>
        </header>

        {/* Main Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-[var(--b-bg)]">
          {/* Sidebar */}
          <aside className="border-r border-[color:var(--b-border)] md:col-span-3 flex flex-col hidden md:flex">
            <div className="p-3 border-b border-[color:var(--b-border)] text-[10px] text-[color-mix(in_oklab,var(--b-text)_40%,transparent)] uppercase tracking-widest">
              [ DIRECTORY_TREE ]
            </div>
            <div className="flex-1 overflow-y-auto p-4 text-xs">
              {/* Actual Interactive File Tree Component */}
              <FileTree tree={treeData} className="bg-transparent border-none p-0 w-full" />
            </div>
            <div className="p-4 border-t border-[color:var(--b-border)]">
              <div className="w-full bg-[var(--b-panel)] h-1 mt-1">
                <div className="bg-[color:var(--b-accent)] h-full w-[78%]"></div>
              </div>
              <div className="flex justify-between text-[10px] mt-2">
                <span className="text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">STORAGE</span>
                <span>78% FULL</span>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="md:col-span-9 flex flex-col">
            {/* Top Metrics */}
            <div className="grid grid-cols-3 border-b border-[color:var(--b-border)]">
              <div className="p-4 border-r border-[color:var(--b-border)] flex flex-col justify-between">
                <span className="text-[10px] text-[color-mix(in_oklab,var(--b-text)_40%,transparent)] uppercase tracking-widest mb-4">CPU_LOAD</span>
                <span className="text-3xl tracking-tighter">42.8%</span>
              </div>
              <div className="p-4 border-r border-[color:var(--b-border)] flex flex-col justify-between">
                <span className="text-[10px] text-[color-mix(in_oklab,var(--b-text)_40%,transparent)] uppercase tracking-widest mb-4">MEM_USAGE</span>
                <span className="text-3xl tracking-tighter">12.4<span className="text-sm text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">GB</span></span>
              </div>
              <div className="p-4 flex flex-col justify-between">
                <span className="text-[10px] text-[color-mix(in_oklab,var(--b-text)_40%,transparent)] uppercase tracking-widest mb-4">NET_TX</span>
                <span className="text-3xl tracking-tighter text-[#4AF626]">84<span className="text-sm text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">Mb/s</span></span>
              </div>
            </div>

            {/* Terminal Window */}
            <div className="flex-1 flex flex-col p-6 overflow-hidden">
              <pre className="text-[10px] leading-tight text-zinc-700 mb-8 select-none hidden md:block">
{`    ____  __  __ __  __ ____  ___    
   / __ )/ / / / / / / / __ \\/   |   
  / __  / / / / / / / / / / / /| |   
 / /_/ / /_/ / / /_/ / /_/ / ___ |   
/_____/\\____/  \\____/_____/_/  |_|   `}
              </pre>
              
              <div className="flex-1 mt-auto">
                <Terminal 
                  lines={initialTerminalLines} 
                  className="h-full border-[color:var(--b-border)] bg-[var(--b-bg)] rounded-none [&>div:first-child]:hidden" 
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
