import React from "react";
import Link from "next/link";
import { ArrowLeft, Activity, Database, Server, ShieldAlert } from "lucide-react";

export default function SaaSAdminDashboardTemplate() {
  return (
    <div className="min-h-[100dvh] bg-[#0A0A0A] text-[#EAEAEA] font-sans selection:bg-[#FF2A2A] selection:text-white p-4 md:p-8 flex flex-col">
      {/* Go Back Link */}
      <Link href="/templates" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500 hover:text-[#EAEAEA] mb-8 w-fit transition-colors">
        <ArrowLeft className="w-3 h-3" /> Return to Templates
      </Link>

      <div className="flex-1 border-2 border-zinc-800 flex flex-col">
        {/* Top Header */}
        <header className="border-b-2 border-zinc-800 p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-1">Central Command</h1>
            <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Global Infrastructure Monitoring &middot; Active</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="border border-zinc-800 px-4 py-2 flex items-center gap-3">
              <ShieldAlert className="w-4 h-4 text-[#FF2A2A]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#FF2A2A]">2 Critical Alerts</span>
            </div>
            <div className="w-12 h-12 bg-zinc-800 flex items-center justify-center font-black">
              OP
            </div>
          </div>
        </header>

        {/* Main Grid Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 bg-zinc-900/20">
          
          {/* Side Navigation */}
          <aside className="border-r-2 border-zinc-800 lg:col-span-2 hidden lg:flex flex-col">
            <nav className="flex-1 flex flex-col">
              <div className="p-4 border-b border-zinc-800 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Views</div>
              <a href="#" className="p-4 border-b border-zinc-800 hover:bg-zinc-800 flex items-center gap-3 bg-zinc-800/50 text-[#FF2A2A]">
                <Activity className="w-4 h-4" /> Overview
              </a>
              <a href="#" className="p-4 border-b border-zinc-800 hover:bg-zinc-800 flex items-center gap-3 text-zinc-400">
                <Server className="w-4 h-4" /> Clusters
              </a>
              <a href="#" className="p-4 border-b border-zinc-800 hover:bg-zinc-800 flex items-center gap-3 text-zinc-400">
                <Database className="w-4 h-4" /> Datastores
              </a>
            </nav>
          </aside>

          {/* Data Content */}
          <main className="lg:col-span-10 flex flex-col">
            
            {/* KPI Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 border-b-2 border-zinc-800">
              <div className="p-6 border-r border-zinc-800 flex flex-col">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Network In</span>
                <span className="font-mono text-2xl md:text-4xl text-[#EAEAEA]">1.24<span className="text-sm text-zinc-500 ml-1">TB/s</span></span>
              </div>
              <div className="p-6 border-r border-zinc-800 flex flex-col bg-zinc-900/50">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Error Rate</span>
                <span className="font-mono text-2xl md:text-4xl text-[#FF2A2A]">0.08<span className="text-sm text-[#FF2A2A] ml-1">%</span></span>
              </div>
              <div className="p-6 border-r border-zinc-800 flex flex-col">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Active Nodes</span>
                <span className="font-mono text-2xl md:text-4xl text-[#EAEAEA]">4,291</span>
              </div>
              <div className="p-6 flex flex-col">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Avg Latency</span>
                <span className="font-mono text-2xl md:text-4xl text-[#EAEAEA]">42<span className="text-sm text-zinc-500 ml-1">ms</span></span>
              </div>
            </div>

            {/* Dense Data Section */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
              <div className="border-r-2 border-zinc-800 p-6 flex flex-col">
                <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-6">[ NODE_STATUS ]</h3>
                
                <div className="flex-1 flex flex-col gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="border border-zinc-800 p-3 flex items-center justify-between font-mono text-xs">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 ${i === 2 ? "bg-[#FF2A2A]" : "bg-[#4AF626]"}`}></span>
                        <span>us-east-{i}a</span>
                      </div>
                      <div className="text-zinc-500">
                        {i === 2 ? "RESTARTING" : "HEALTHY"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 flex flex-col">
                <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-6">[ RESOURCE_ALLOCATION ]</h3>
                
                <div className="flex-1 flex flex-col gap-6 font-mono text-xs">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>COMPUTE</span>
                      <span className="text-[#FF2A2A]">88%</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2">
                      <div className="bg-[#FF2A2A] h-full w-[88%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>MEMORY</span>
                      <span>64%</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2">
                      <div className="bg-[#EAEAEA] h-full w-[64%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>STORAGE</span>
                      <span>42%</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2">
                      <div className="bg-[#EAEAEA] h-full w-[42%]"></div>
                    </div>
                  </div>

                  <div className="mt-auto border border-[#FF2A2A]/30 bg-[#FF2A2A]/10 p-4 text-[#FF2A2A]">
                    WARNING: Compute capacity in us-east reaching critical thresholds. Recommend immediate auto-scale provisioning.
                  </div>
                </div>
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
