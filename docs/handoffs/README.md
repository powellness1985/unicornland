# Handoffs

One file per substantive session. The bridge between chat windows, machines, and tools.

**File naming:** `YYYY-MM-DD-short-slug.md`

**Format:**
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
What's not done, what's broken, what's deferred.

## Next move
One sentence.

## Notes
(optional) Gotchas, surprises, dead ends.
```

**When to write one:** end of any session where real work shipped, a real decision was made, or an investigation produced findings worth preserving.

**See also:** `.claude/skills/decision-log/SKILL.md` for the full skill that manages this.
