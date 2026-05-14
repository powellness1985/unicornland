---
name: decision-log
description: Use this skill in any project to capture architectural decisions (ADRs in docs/decisions/) and session handoffs (in docs/handoffs/). At session start, scan recent ADRs and the latest handoff to ground in prior context. When a real decision is made during the session, propose an ADR. At the end of substantive sessions where real work shipped or a real decision was made, propose a handoff. Use the bootstrap workflow when a project does not yet have docs/decisions/ or docs/handoffs/. Always include the chat transcript UUID in handoffs. This is Chris's persistent memory across chat windows, machines, and tools.
---

# Decision Log Skill

This skill manages two artifacts:

- **ADRs (Architecture Decision Records)** in `docs/decisions/YYYY-MM-DD-slug.md` — one file per decision. Captures the *why* behind a choice.
- **Handoffs** in `docs/handoffs/YYYY-MM-DD-slug.md` — one file per substantive session. Captures where work left off.

## Read this first

If the project has `WORKING_WITH_CHRIS.md` at the root, that document is canonical for how to work with Chris (working style, pushback rules, voice/text preferences, capture principles, build workflow expectations). This skill defers to it. If anything in this skill conflicts with `WORKING_WITH_CHRIS.md`, the working doc wins.

This skill is narrow on purpose: it owns ADR and handoff mechanics, not working style.

## Project-agnostic by design

No assumptions about language, framework, or project type. Drop into any repo at `.claude/skills/decision-log/SKILL.md`. Cursor auto-discovers `.claude/skills/` as well as `.cursor/skills/`, so one location serves both tools.

If the project does not have `docs/decisions/` or `docs/handoffs/`, run the **Bootstrap workflow** below.

## At session start

Before proposing meaningful changes:

1. Read `WORKING_WITH_CHRIS.md` if it exists. That sets the operating mode for the session.
2. Check for `docs/decisions/` and `docs/handoffs/`. If either is missing, this is a fresh-bootstrap situation.
3. List `docs/handoffs/` and read the most recent file. That's where the last session ended.
4. List `docs/decisions/`. Read any ADR whose slug touches the current task. Skim others if relevant.
5. Use this to: avoid reopening settled debates; detect contradictions with prior decisions and surface them explicitly ("this would reverse `2026-04-15-sqlite-storage.md` — intentional?"); match conventions without re-asking.

Do not summarize the log back to Chris unless asked. Absorb it and behave accordingly.

## When to propose an ADR

Propose an ADR when:

- An architectural choice is made (module boundaries, data flow, storage, hosting)
- A tool or library is chosen and a different one rejected
- A scope decision is made (build X, defer Y, kill Z)
- A naming convention is set
- A tradeoff is explicitly weighed and resolved
- A guardrail or invariant is established
- A failure mode reveals something about the system worth remembering

Do NOT propose an ADR for: bug fixes that don't change architecture; code style preferences (those belong in rules/skills); one-off experiments that didn't change the system; restating something already recorded; routine implementation work.

## When to propose a handoff

At end of substantive sessions where:

- Code was written that touched the system shape
- A decision was made (one or more ADRs were proposed)
- An investigation produced findings worth preserving
- A bug was diagnosed even if not yet fixed
- The session ended mid-task and the next session needs context

Skip handoffs for pure Q&A or trivial edits.

## How to propose

Lightweight, voice-friendly, one-tap approval.

**For an ADR:**

> Worth an ADR? I'd draft `docs/decisions/2026-05-14-haiku-for-classifier.md`:
>
> [draft]
>
> Say "yes" to write, or edit.

**For a handoff:**

> Worth a handoff? I'd draft `docs/handoffs/2026-05-14-classifier-refactor.md` summarizing what we shipped, what's open, and the next move.

Approval words: "yes," "yep," "do it," "log it," "go," or similar one-word affirmation. Edits → redraft and offer again.

## ADR format

File: `docs/decisions/YYYY-MM-DD-slug.md`. Slug is short, kebab-case, describes the decision.

```markdown
# YYYY-MM-DD — Title (≤ 10 words)

**Status:** Accepted | Superseded by [link] | Reversed by [link]

**Context:** 1–3 sentences. The situation that forced the decision.

**Decision:** 1–2 sentences. The choice made, stated plainly.

**Alternatives considered:**
- Option A — why it lost
- Option B — why it lost

**Consequences:** 1–3 sentences. What this commits us to.

**Open questions:** (optional)

**Related:** (optional) Links to other ADRs or handoffs.

**Tags:** #architecture | #tooling | #scope | #naming | #guardrail | #cost
```

## Handoff format

File: `docs/handoffs/YYYY-MM-DD-slug.md`.

```markdown
# YYYY-MM-DD — Title

**Transcript UUID:** `<uuid>` (from claude.ai/chat/<uuid> or Cursor transcript ID)
**Tool:** Claude Code | Cursor | Claude.ai web | Claude.ai mobile
**Machine:** Mac Studio | MacBook | Work laptop | Cloud

## What we did

2–6 sentences.

## Decisions made

Links to any ADRs created this session.

## What's open

What's not done, what's broken, what's deferred. Include enough context that the next session can pick up without reading the chat.

## Next move

One sentence.

## Notes

(optional) Gotchas, surprises, dead ends.
```

## Bootstrap workflow

When `docs/decisions/` or `docs/handoffs/` is missing:

1. Tell Chris: "This project doesn't have decision tracking yet. I'll set it up. 30 seconds."
2. Create `docs/decisions/` and `docs/handoffs/`.
3. Drop the READMEs and the `0000-00-00-template.md` files in each.
4. Don't modify `.gitignore`. The decision and handoff folders ARE meant to be committed.
5. Offer to create a first ADR if a prior decision can be reconstructed from the codebase or from Chris's memory.

## Formatting rules

- Date: `YYYY-MM-DD` (ISO, sortable)
- Prose, not bullet soup. Only "Alternatives considered" and short lists are bulleted.
- No em dashes. Commas, parentheses, or two sentences.
- Keep entries short. If an ADR is long, it's probably several decisions — split.
- ADRs are append-only. Never edit past entries except to flip the Status field on a reversal.

## Reversal pattern

Original ADR (one allowed edit, Status field only):
```
**Status:** Reversed by `docs/decisions/2026-08-12-postgres-for-dadops.md`
```

New ADR:
```markdown
# 2026-08-12 — Migrated DadOps storage from SQLite to Postgres

**Status:** Accepted. Reverses `docs/decisions/2026-04-15-sqlite-storage.md`.

**Context:** [why the original decision no longer holds]
[rest as normal]
```

## Cross-project linking

Reference another project's decision by `[project]:[slug]`:

> Aligns with `chrispowell-ai:2026-03-15-react-vite-vercel`.

## What NEVER goes in ADRs or handoffs

- Secrets, API keys, OAuth tokens, passwords
- Full names of people outside the family unless already public
- Internal employer details (product names, colleague names, ticket IDs, compensation, FY references)
- PII of any kind (account IDs, emails, phone numbers)
- Full chat transcripts (the *decisions* and *handoffs* are durable; the chat is scratch, and the UUID points back if needed)

For work decisions, sanitize before writing. Replace specifics with categories.

## Cloud access

Decision logs sync to GitHub via the project repo. To read from a cloud Claude session, paste the raw GitHub URL:

`https://raw.githubusercontent.com/powellness1985/<repo>/main/docs/decisions/<file>.md`

Or use the GitHub connector if enabled.

## Why this exists

Chris archives chats to keep his workspace clean, but loses the *why* behind decisions when he does. The decision log is the durable layer underneath the disposable chat layer. The handoff log is the bridge across sessions. Together they replace "where were we?" with a 60-second read.

If a decision is worth remembering in three months, write an ADR. If a session is worth resuming, write a handoff. If neither, skip — the discipline is in not bloating the log with noise.
