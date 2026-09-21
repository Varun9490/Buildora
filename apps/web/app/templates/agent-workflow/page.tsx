"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, BrainCircuit, Activity, Eye, Play } from "lucide-react";
import { AgentTimeline, StreamingChat, ToolCallViz, TokenMeter } from "@buildora/components";
import { motion } from "motion/react";

export default function AgentWorkflowTemplate() {
  const steps = [
    { id: "1", phase: "plan", title: "Analyze Intent", detail: "Extracted: [Generate Landing Page]", status: "done" },
    { id: "2", phase: "act", title: "search_registry", detail: "{ query: 'bento-grid' }", status: "done" },
    { id: "3", phase: "act", title: "write_to_file", detail: "page.tsx", status: "running" },
    { id: "4", phase: "observe", title: "Await user feedback", status: "queued" },
  ] as const;

  const calls = [
    { name: "read_file", args: "design-system.css", status: "done" },
    { name: "generate_image", args: "prompt: 'hero background'", status: "running" },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#030303] text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full p-6 z-50 mix-blend-difference">
        <Link href="/templates" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to templates
        </Link>
      </nav>

      {/* ATTENTION: Massive Hero */}
      <section className="min-h-[80vh] flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-32 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <span className="h-px w-12 bg-zinc-700" />
            <span className="text-xs uppercase tracking-[0.3em] text-zinc-400">Autonomous Orchestration</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter leading-[0.9] mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-zinc-600">
            Next-gen reasoning. <br />
            Visualized in real-time.
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl leading-relaxed font-light">
            Monitor, intervene, and orchestrate multiple autonomous agents working in parallel. A gapless telemetry surface designed for extreme clarity.
          </p>
        </motion.div>
      </section>

      {/* INTEREST/DESIRE: Gapless Bento Grid */}
      <section className="px-6 md:px-12 lg:px-24 pb-32">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-12 border border-zinc-800 rounded-3xl overflow-hidden bg-zinc-950"
        >
          
          {/* Bento 1: Streaming Chat */}
          <div className="md:col-span-8 border-b md:border-b-0 md:border-r border-zinc-800 p-8 md:p-12 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-medium flex items-center gap-3">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
                Primary Thread
              </h2>
              <span className="flex items-center gap-2 text-xs bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                Reasoning Active
              </span>
            </div>
            
            <div className="flex-1 min-h-[400px]">
              <StreamingChat className="h-full border-none bg-transparent" />
            </div>
          </div>

          {/* Bento 2: Agent Telemetry Sidebar */}
          <div className="md:col-span-4 flex flex-col">
            
            {/* Top right: Timeline */}
            <div className="flex-1 p-8 border-b border-zinc-800">
              <h3 className="text-sm font-medium text-zinc-400 mb-6 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Execution Trace
              </h3>
              <AgentTimeline steps={steps as any} className="[&_li>div]:bg-zinc-900/50 [&_li>div]:border-zinc-800" />
            </div>

            {/* Middle right: Tool Calls */}
            <div className="p-8 border-b border-zinc-800 bg-zinc-900/20">
              <h3 className="text-sm font-medium text-zinc-400 mb-6 flex items-center gap-2">
                <Eye className="w-4 h-4" /> Active Sub-routines
              </h3>
              <ToolCallViz calls={calls} className="[&_li]:bg-black/50 [&_li]:border-zinc-800" />
            </div>

            {/* Bottom right: Resource usage */}
            <div className="p-8 bg-zinc-950">
              <TokenMeter used={14285} limit={32000} className="border-none bg-zinc-900/50" />
            </div>

          </div>

        </motion.div>
      </section>

      {/* ACTION: Conversion */}
      <section className="min-h-[40vh] flex flex-col items-center justify-center text-center px-6 pb-24">
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-8">Deploy your first agent.</h2>
        <button className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-medium hover:scale-105 transition-transform active:scale-95">
          <Play className="w-5 h-5 fill-current" />
          Initialize Workspace
        </button>
      </section>

    </div>
  );
}
