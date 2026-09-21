import React from "react";
import Link from "next/link";
import { ArrowLeft, Book, ChevronRight, FileText, Settings, ShieldCheck, History } from "lucide-react";

export default function InteractiveDocsTemplate() {
  return (
    <div className="min-h-[100dvh] bg-[#FDFBF7] text-[#111827] font-sans selection:bg-[#002D56] selection:text-white flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-[#E5E0D8] bg-[#FDFBF7]">
        <div className="flex items-center gap-2 text-[#002D56] font-bold">
          <Book className="w-5 h-5" /> DocuFlow
        </div>
        <Link href="/templates" className="text-xs uppercase tracking-widest text-zinc-500 hover:text-[#002D56] transition-colors">
          Return
        </Link>
      </header>

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 border-r border-[#E5E0D8] bg-[#F9F7F1] flex-col hidden md:flex h-[100dvh] sticky top-0">
        <div className="p-6 border-b border-[#E5E0D8]">
          <Link href="/templates" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500 hover:text-[#002D56] mb-8 w-fit transition-colors">
            <ArrowLeft className="w-3 h-3" /> Templates
          </Link>
          <div className="flex items-center gap-2 text-[#002D56] font-display font-black text-xl">
            <Book className="w-5 h-5" /> DocuFlow
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <h4 className="font-serif text-[11px] text-zinc-500 uppercase tracking-widest mb-3 px-2">Compliance Standards</h4>
            <div className="space-y-1 text-sm">
              <a href="#" className="flex items-center justify-between px-2 py-1.5 bg-[#002D56] text-white rounded-md">
                <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> ISO 27001</span>
              </a>
              <a href="#" className="flex items-center justify-between px-2 py-1.5 text-zinc-600 hover:text-[#002D56] hover:bg-zinc-200/50 rounded-md transition-colors">
                <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> SOC 2 Type II</span>
              </a>
              <a href="#" className="flex items-center justify-between px-2 py-1.5 text-zinc-600 hover:text-[#002D56] hover:bg-zinc-200/50 rounded-md transition-colors">
                <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> GDPR Guidelines</span>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-serif text-[11px] text-zinc-500 uppercase tracking-widest mb-3 px-2">Configuration</h4>
            <div className="space-y-1 text-sm">
              <a href="#" className="flex items-center justify-between px-2 py-1.5 text-zinc-600 hover:text-[#002D56] hover:bg-zinc-200/50 rounded-md transition-colors">
                <span className="flex items-center gap-2"><Settings className="w-4 h-4" /> Access Control</span>
              </a>
              <a href="#" className="flex items-center justify-between px-2 py-1.5 text-zinc-600 hover:text-[#002D56] hover:bg-zinc-200/50 rounded-md transition-colors">
                <span className="flex items-center gap-2"><History className="w-4 h-4" /> Audit Logs</span>
              </a>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-[100dvh] overflow-hidden">
        
        {/* Document Header */}
        <header className="border-b border-[#E5E0D8] p-6 lg:px-12 flex flex-col md:flex-row md:items-end justify-between gap-4 bg-[#FDFBF7] shrink-0">
          <div>
            <div className="flex items-center gap-2 text-[11px] text-zinc-500 uppercase tracking-widest mb-4 font-serif">
              Compliance Standards <ChevronRight className="w-3 h-3" /> ISO 27001
            </div>
            <h1 className="text-3xl md:text-5xl font-serif text-[#002D56]">Information Security</h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <span className="px-3 py-1 bg-[#F0ECE1] text-[#002D56] rounded-full text-xs">v4.2</span>
            <span className="px-3 py-1 bg-[#D4AF37]/10 text-[#B8860B] border border-[#D4AF37]/30 rounded-full text-xs flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Verified
            </span>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-12">
          <div className="max-w-[65ch] mx-auto xl:mx-0 xl:max-w-none xl:grid xl:grid-cols-12 xl:gap-12">
            
            {/* Main Article */}
            <article className="xl:col-span-8 prose prose-zinc prose-h2:font-serif prose-h3:font-serif prose-headings:text-[#002D56] max-w-none">
              <p className="lead text-xl text-zinc-600 leading-relaxed mb-8">
                This document outlines the standard operating procedures and required controls to maintain ISO 27001 certification compliance across all organizational units.
              </p>
              
              <h2>1. Access Control Policy</h2>
              <p>
                All systems must enforce principle of least privilege. Access rights must be reviewed quarterly. Authentication requires multi-factor authentication (MFA) for all external facing systems.
              </p>

              <div className="my-8 p-6 bg-[#F9F7F1] border-l-4 border-[#D4AF37] rounded-r-lg">
                <h4 className="mt-0 font-serif text-[#002D56]">Crucial Requirement</h4>
                <p className="mb-0 text-sm">Any deviation from the access control policy requires explicit written approval from the Chief Information Security Officer (CISO).</p>
              </div>

              <h2>2. Data Encryption</h2>
              <p>
                Data at rest must be encrypted using AES-256 or better. Data in transit must utilize TLS 1.3. Cryptographic keys must be rotated every 90 days.
              </p>
              
              <pre className="bg-[#111827] text-zinc-300 p-4 rounded-xl overflow-x-auto text-sm font-mono mt-4">
                <code>
{`{
  "encryption": {
    "algorithm": "AES-256-GCM",
    "key_rotation_days": 90,
    "transit": "TLS_1_3_STRICT"
  }
}`}
                </code>
              </pre>
            </article>

            {/* Right Sidebar - Version History */}
            <aside className="hidden xl:block xl:col-span-4 space-y-8">
              <div className="p-6 rounded-2xl border border-[#E5E0D8] bg-white shadow-sm">
                <h3 className="font-serif text-[#002D56] text-lg mb-6">Version History</h3>
                
                <div className="relative pl-4 border-l border-[#E5E0D8] space-y-6">
                  
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#002D56] ring-4 ring-white" />
                    <p className="text-sm font-medium text-[#111827]">v4.2 - Annual Review</p>
                    <p className="text-xs text-zinc-500 mt-1">Today at 10:42 AM by S. Chan</p>
                  </div>
                  
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#E5E0D8] ring-4 ring-white" />
                    <p className="text-sm font-medium text-zinc-600">v4.1 - Key Rotation Update</p>
                    <p className="text-xs text-zinc-500 mt-1">Mar 12, 2026 by J. Doe</p>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#E5E0D8] ring-4 ring-white" />
                    <p className="text-sm font-medium text-zinc-600">v4.0 - Major Overhaul</p>
                    <p className="text-xs text-zinc-500 mt-1">Jan 01, 2026 by Admin</p>
                  </div>

                </div>
                
                <button className="mt-6 w-full py-2 px-4 bg-[#F9F7F1] hover:bg-[#F0ECE1] text-[#002D56] text-sm font-medium rounded-lg transition-colors border border-[#E5E0D8]">
                  View Full History
                </button>
              </div>
            </aside>
            
          </div>
        </div>

      </main>
    </div>
  );
}
