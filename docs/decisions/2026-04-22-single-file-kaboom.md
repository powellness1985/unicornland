# 2026-04-22 — Single-file HTML + Kaboom.js

**Status:** Accepted

**Context:** Game for Waverly, designed via voice memos, also serves as a portfolio piece for a voice-to-product workflow. Need something fast to iterate, easy to deploy, runs on her iPad.

**Decision:** Single-file HTML game using Kaboom.js. Deploy at `unicornland.chrispowell.ai` via the same GitHub + Vercel pipeline as the main portfolio.

**Alternatives considered:**
- Unity / Godot — wildly over-scoped for a kid's web game
- Phaser — heavier than Kaboom, more setup
- Vanilla JS — Kaboom gives just enough abstraction (sprites, collisions, scenes) without ceremony

**Consequences:** Whole game in one file is easier to share, deploy, and let Claude Code edit holistically. Limits include performance ceiling if scope grows.

**Tags:** #architecture #tooling
