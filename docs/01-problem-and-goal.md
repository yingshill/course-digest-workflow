# §1–§3 · Problem, Goal, Anti-Goals

## §1 Problem statement & opportunity

> ⚠️ **Problem.** Online courses are consumed but lack a structured workflow to extract maximum value. Courses are **multi-module, sequential, and skill-building** — yet without a system, they get treated the same as one-off content (watch → forget). Courses become bookmarks, not capabilities.

**Opportunity.** A course learning workflow plugged into the AI Command Center signal ecosystem enables:

1. **Structured progress tracking** — module-by-module, not just "done/not done"
2. **Forced reflection at each module** — the same "Your Reflection" pattern proven in Podcast Notebook, adapted for cumulative learning (each module builds on prior ones)
3. **Ecosystem integration** — course insights route to Topic Hub, feed into Projects via relation, and trigger `🎨 Visualize` / `📣 Project` output pipeline when insights are worth sharing
4. **Agent-assisted processing** — auto-fill from course descriptions/syllabi, concept maps, connection drafting — same pattern as Podcast Digest's transcript auto-fill

## §2 Goal & success metrics

**Primary goal.** Build a course learning workflow in the AI Command Center that transforms passive course consumption into structured, reflective, and ecosystem-integrated learning — measured by completion *quality*, not just completion rate.

### Success metrics

| ID | Layer | Metric | Pass/Fail |
|---|---|---|---|
| S1 | Storage | New database schema created with all required properties (shared vocabulary + course-specific) — zero missing columns vs. design spec | Schema matches spec |
| S2 | Storage | Single modular template with composable "Add Module" sections — follows Podcast Notebook reflection pattern adapted for cumulative learning | Template functional, modular, reflection-complete |
| S3 | Storage | Two-way relation to Topic Hub operational — course entries appear in Topic Hub aggregation | Relation works both directions |
| S4 | Agent | Brain Agent instructions updated to include course DB in read/write access and auto-fill logic | Agent can auto-fill a new course entry |
| S5 | Agent | Shared vocabulary updated across all 4 source DBs simultaneously — zero drift | All 4 DBs have identical shared property options |
| S6 | Agent | URL scrape produces usable module notes for ≥ 2 of 3 platform types (open/MIT OCW, YouTube, login-gated/Coursera) | Module notes generated from URL alone for 2+ platform types |
| S7 | Agent | Learning expert scaffolding rated useful in L2 — at least 2 of 3 types (concept connections, comprehension Qs, application prompts) add value | 2+ scaffolding types rated useful |

> ⏱️ **Timeline.** Single session for schema + templates + relations. Agent instruction update may be follow-up.

### Audit integration

> 🔍 **L1 — Process compliance (AI-led):**
> - S1: Schema matches design spec — all 19 properties present (shared vocab + course-specific + Difficulty), zero missing columns
> - S2: Template contains all required sections (Syllabus zone, Course Overview, Concept Map, Module Notes with AI/human layers, 5-part Reflection, Connects To, Source Metadata)
> - S3: Topic Hub two-way relation operational — verify `📖 Course Digest` property exists on Topic Hub data source
> - S5: Shared vocabulary parity — Course Digest options match design doc spec for all 6 shared properties
> - Protocol 0: Workspace Database Design doc updated, Instance Health Tracker row created, Decision Log entries written
> - Brief completeness: All 12 sections substantive, §8 questions dispositioned, §7 roadmap has Status column per phase

> 🧪 **L2 — Outcome validation (Human-led):**
> - S4: Brain Agent auto-fill fires on page creation — create a real course entry, verify properties populate
> - S6: URL-first scrape test — try 3 platform types (open e.g. MIT OCW, YouTube, login-gated e.g. Coursera). Pass: usable module notes from URL alone for ≥ 2 of 3
> - S7: Learning expert scaffolding test — after module notes generate, rate each type. Pass: ≥ 2 of 3 rated useful
> - Topic Hub sync: course entry appears in correct Topic Hub rows based on Category/Tags
> - Reflection workflow: complete the 5-part ✏️ Your Reflection for one real course

## §3 Anti-goals

- **Not replacing the course platform** — no video hosting, quizzes, or certificates
- **Not building a generic LMS** — this is a *personal knowledge extraction* workflow
- **Not an archive of bookmarks** — only courses actively being learned from (same "signal, not archive" principle as AI Daily Hits)
