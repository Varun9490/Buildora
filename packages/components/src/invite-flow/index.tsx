"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

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
        <select
          id="invite-role"
          value={role}
          onChange={(e) => setRole(e.target.value as (typeof ROLES)[number])}
          className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
        >
          {ROLES.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>
      <button className="w-full rounded-xl bg-[#d4ff4f] px-3 py-2 text-sm font-bold text-black">Send invite</button>
      {done && <p role="status" className="text-xs text-[#4fe08a]">{done}</p>}
    </form>
  );
}

export default InviteFlow;
