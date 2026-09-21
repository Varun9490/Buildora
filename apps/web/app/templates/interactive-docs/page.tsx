"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Book, ChevronRight, FileText, Settings, ShieldCheck, History } from "lucide-react";
import { RichTextEditor, VersionHistory } from "@buildora/components";

export default function InteractiveDocsTemplate() {
  const versions = [
    { id: "v4.2", label: "Annual Review - ISO 27001", at: "Today 10:42 AM", author: "S. Chan", current: true },
    { id: "v4.1", label: "Key Rotation Update", at: "Mar 12, 2026", author: "J. Doe" },
    { id: "v4.0", label: "Major Information Security Overhaul", at: "Jan 01, 2026", author: "Admin" },
  ];

  const initialContent = `<h2>1. Access Control Policy</h2>
<p>All systems must enforce principle of least privilege. Access rights must be reviewed quarterly. Authentication requires multi-factor authentication (MFA) for all external facing systems.</p>
<br>
<h2>2. Data Encryption</h2>
<p>Data at rest must be encrypted using AES-256 or better. Data in transit must utilize TLS 1.3. Cryptographic keys must be rotated every 90 days.</p>
`;

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
            
            {/* Main Article with RichTextEditor */}
            <article className="xl:col-span-8 flex flex-col h-full min-h-[500px]">
              <p className="lead text-xl text-zinc-600 leading-relaxed mb-8">
                This document outlines the standard operating procedures and required controls to maintain ISO 27001 certification compliance across all organizational units.
              </p>
              
              <div className="flex-1 overflow-hidden rounded-2xl border-2 border-[#E5E0D8] bg-white shadow-sm">
                <RichTextEditor 
                  initialHTML={initialContent} 
                  className="h-full border-none bg-transparent"
                />
              </div>
            </article>

            {/* Right Sidebar - Version History */}
            <aside className="hidden xl:block xl:col-span-4 space-y-8">
              <div className="p-6 rounded-2xl border-2 border-[#E5E0D8] bg-white shadow-sm">
                <h3 className="font-serif text-[#002D56] text-lg mb-6 flex items-center gap-2">
                  <History className="w-5 h-5" /> Version History
                </h3>
                
                <VersionHistory 
                  versions={versions} 
                  className="[&_li]:bg-white [&_li]:border-[#E5E0D8] [&_button]:bg-[#F9F7F1] [&_button]:text-[#002D56]"
                />
              </div>
            </aside>
            
          </div>
        </div>

      </main>
    </div>
  );
}
