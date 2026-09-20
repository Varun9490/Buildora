"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../overlays/dropdown-menu";

const ROLES = ["owner", "admin", "member"] as const;

export function InviteFlow({
  onInvite,
  className,
}: {
  onInvite?: (email: string, role: (typeof ROLES)[number]) => void;
  className?: string;
}) {
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<(typeof ROLES)[number]>("member");
  const [done, setDone] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  return (
    <form
      noValidate
      className={cn("space-y-3 rounded-2xl border border-white/10 bg-[#0d0f16] p-4", className)}
      onSubmit={(e) => {
        e.preventDefault();
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
          setError("Enter a valid email.");
          return;
        }
        setError(null);
        onInvite?.(email, role);
        setDone(`Invited ${email} as ${role}.`);
        setEmail("");
      }}
    >
      <div>
        <label htmlFor="invite-email" className="mb-1 block text-xs font-medium text-white/60">Email</label>
        <input
          id="invite-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ada@example.com"
          aria-describedby={error ? "invite-error" : undefined}
          aria-invalid={Boolean(error)}
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-[#d4ff4f]/60"
        />
        {error && <p id="invite-error" role="alert" className="mt-1 text-xs text-red-300">{error}</p>}
      </div>
      <div>
        <label htmlFor="invite-role" className="mb-1 block text-xs font-medium text-white/60">Role</label>
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full text-left rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm flex items-center justify-between hover:border-white/20 transition-colors focus-visible:outline-none focus-visible:border-[#d4ff4f]/60">
            <span className="capitalize">{role}</span>
            <svg className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[200px]">
            {ROLES.map((r) => (
              <DropdownMenuItem
                key={r}
                onClick={() => setRole(r)}
                className="flex items-center justify-between"
              >
                <span className="capitalize">{r}</span>
                {role === r && (
                  <svg className="h-4 w-4 text-[--b-accent]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <button className="w-full rounded-xl bg-[--b-accent] px-3 py-2 text-sm font-bold text-[--b-accent-foreground]">Send invite</button>
      {done && <p role="status" className="text-xs text-[--b-success]">{done}</p>}
    </form>
  );
}

export default InviteFlow;
