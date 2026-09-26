# FILE-LOCKS.md — Buildora Subagent File Ownership Registry

> **RULE**: ONE FILE = ONE ACTIVE SUBAGENT OWNER at any time.
> Before any subagent modifies a file, check this registry.

---

## Active Locks

| File/Pattern | Owner Agent | Task ID | Since | Status |
|---|---|---|---|---|
| *(none — all worker locks released after validation)* | — | — | — | — |

## Lock Protocol

1. Before assigning work → check this file
2. Confirm target files are unlocked
3. Add lock entry with agent name + task ID
4. Agent performs changes
5. Agent runs validation
6. Release lock (mark RELEASED)
7. Write agent report to `.opencode/AGENT-REPORTS/`

## Lock History

*(will be populated as tasks complete)*
