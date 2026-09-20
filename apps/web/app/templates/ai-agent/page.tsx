"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SpatialCommandPalette, StreamingChat } from "@buildora/components";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";
import { cn } from "@buildora/utils";

export default function AIAgentTemplate() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#ededed] font-sans selection:bg-[#d4ff4f]/30">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
             <div className="flex h-6 w-6 items-center justify-center rounded bg-[#d4ff4f] text-[#050505]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 4h16v16H4z"/></svg>
             </div>
             <span className="font-mono text-xs font-bold tracking-widest uppercase">Agent Console</span>
          </div>
          <div className="flex items-center gap-4">
             <ThemeCustomizer />
             <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] text-white/50">
               <span className="h-1.5 w-1.5 rounded-full bg-[#d4ff4f] shadow-[0_0_8px_#d4ff4f]"></span>
               System Online
             </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-10 lg:flex lg:gap-8">
        
        {/* Left: Chat Interface */}
        <section className="flex-1 lg:max-w-[800px]">
           <header className="mb-6">
             <h1 className="font-display text-4xl font-black tracking-tight text-white">Neural Interface</h1>
             <p className="mt-2 text-sm text-white/40 max-w-xl">
               Direct connection to the generative reasoning engine. Supports tool use, parallel function calling, and token-level streaming.
             </p>
           </header>
           
           <div className="h-[600px] rounded-2xl border border-white/10 bg-[#0C0C0C] shadow-2xl overflow-hidden relative">
              <StreamingChat />
           </div>
        </section>

        {/* Right: Metrics & Tools Sidebar */}
        <aside className="mt-10 flex w-full flex-col gap-6 lg:mt-0 lg:w-[320px]">
          
          <div className="rounded-xl border border-white/5 bg-[#0a0a0a] p-5">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-white/40">Active Session</h3>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <div className="text-3xl font-light text-white">12.4k</div>
                <div className="text-xs text-[#d4ff4f]">Tokens generated</div>
              </div>
              <svg width="60" height="30" className="text-white/20" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M0 30 Q 15 10 30 20 T 60 5" />
              </svg>
            </div>
            
            <div className="mt-6 space-y-3">
               {[
                 { label: "Latency", val: "42ms" },
                 { label: "Model", val: "Claude 3.5 Sonnet" },
                 { label: "Temp", val: "0.7" }
               ].map(m => (
                 <div key={m.label} className="flex justify-between border-b border-white/5 pb-2 text-xs">
                   <span className="text-white/40">{m.label}</span>
                   <span className="font-mono text-white">{m.val}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#0a0a0a] p-5">
            <h3 className="mb-4 font-mono text-[10px] uppercase tracking-widest text-white/40">Available Tools</h3>
            <ul className="space-y-2">
               {[
                 { name: "read_file", active: true },
                 { name: "write_file", active: true },
                 { name: "search_web", active: false },
                 { name: "bash_cmd", active: true }
               ].map(t => (
                 <li key={t.name} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 px-3 py-2">
                   <div className={cn("h-2 w-2 rounded-full", t.active ? "bg-[#d4ff4f]" : "bg-white/10")} />
                   <span className="font-mono text-[11px] text-white/70">{t.name}</span>
                 </li>
               ))}
            </ul>
          </div>
          
        </aside>
      </main>

      <SpatialCommandPalette />
    </div>
  );
}
