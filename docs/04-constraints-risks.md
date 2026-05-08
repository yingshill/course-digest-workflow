# §6 · Constraints & risks

## Constraints

- **C1.** Must follow shared vocabulary rules — zero drift across all 4 source DBs — ⚠️ Hit (L1 S5: 3 shared vocab drift findings in Course Digest — see [Next Actions](09-next-actions.md))
- **C2.** Course Digest must follow Pattern 1 architecture — no custom patterns that break aggregation — ✅ Managed
- **C3.** Brainstorm cannot load the Brain Agent — all agent instruction changes require Yingshi to apply manually — ✅ Managed
- **C4.** URL scraping depends on platform accessibility — login-gated content (Coursera, Udemy) may return thin results — ✅ Managed (two-tier fallback designed)

## Risks

| Risk | Likelihood | Impact | Mitigation | Status |
|---|---|---|---|---|
| **R1.** Template bloat — modular sections accumulate unused structure | Low | Low | Sections are opt-in toggles added on demand — unused modules never appear | Not triggered |
| **R2.** Module-level tracking doesn't scale for 50+ module courses | Low | Low | Progress is a simple number, not per-module pages | Not triggered |
| **R3.** Shared vocabulary audit misses an option in one DB | Low | High | Run SQL diff across all 4 source DBs as final build step | Triggered — unmitigated (L1 S5 found 3 drift items in Course Digest despite prior audit declaring clean) |
| **R4.** URL scrape returns insufficient content for meaningful module notes | Medium | Medium | Two-tier fallback: thin scrape fills metadata only + flags for manual paste; full scrape generates complete module notes. Agent must clearly communicate which tier was achieved. | Not triggered (L2 pending) |
| **R5.** Learning expert role adds noise instead of value | Medium | Low | Start with 3 scaffolding types only (concept connections, comprehension Qs, application prompts). Expand after L2 validates which ones help. | Not triggered (L2 pending) |
| **R6.** Brain Agent tooling gap — Brainstorm can't verify agent changes were applied correctly | Low | Medium | L2 audit explicitly tests auto-fill trigger. If it doesn't fire, agent config is the first diagnostic. | Not triggered (L2 pending) |
