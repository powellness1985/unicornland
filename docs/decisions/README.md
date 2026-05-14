# Decisions (ADRs)

One file per architectural decision. Append-only — never edit past entries except to flip the Status field on a reversal.

**File naming:** `YYYY-MM-DD-short-slug.md`

**Format:**
```markdown
# YYYY-MM-DD — Title (≤ 10 words)

**Status:** Accepted | Superseded by [link] | Reversed by [link]

**Context:** What was the situation.

**Decision:** What was chosen.

**Alternatives considered:**
- Option A — why it lost
- Option B — why it lost

**Consequences:** What this commits us to.

**Open questions:** (optional)

**Related:** (optional) Links to other ADRs or handoffs.

**Tags:** #architecture | #tooling | #scope | #naming | #guardrail | #cost
```

**What goes here:** architecture choices, tool picks, scope decisions, naming conventions, weighed tradeoffs, guardrails set.

**What does NOT go here:** secrets, PII, full chat transcripts, code style preferences, routine bug fixes, internal employer details.

**See also:** `.claude/skills/decision-log/SKILL.md` for the full skill that manages this.
