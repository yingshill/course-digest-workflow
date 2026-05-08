# 🤖 Brain Agent — Course Digest extension

The Brain Agent is shared across all 4 source DBs. This document captures the Course Digest–specific extensions to its instructions.

> **Update mechanism:** Yingshi applies these instructions manually in the agent settings. The build environment cannot load the agent URL.

## Access

- Add `📖 Course Digest` to the agent's read/write data source list.
- Trigger: `page.created` on Course Digest data source.

## Source-specific logic block

```
WHEN: page.created on Course Digest
IF: URL property is set
  THEN:
    1. Scrape the URL (web fetch).
    2. Extract: title, description, syllabus / module list, instructor, difficulty, total modules.
    3. Auto-fill matching properties.
    4. Generate module notes (per module) in the body:
       - Summary
       - Key concepts
       - Rationale (why this module matters in the arc)
    5. Generate "Connects To" links by querying Topic Hub for related entries (Category + Tags overlap).
    6. Generate learning expert scaffolding (per module):
       - Concept connections (across modules + across Topic Hub)
       - Comprehension Qs (3–5)
       - Application prompts (1–2)
    7. Set Transcript Ready = true IF scrape produced ≥ 1 module worth of structured content.
  ELSE:
    Fill metadata only. Insert callout: "Syllabus incomplete — paste full outline for deeper module notes."
ELSE (URL not set):
  Skip. Wait for next page edit.
```

## Topic Hub sync rules (shared)

Same rules as the other source DBs — on page create / property update, reconcile the Topic Hub two-way relation based on `Category` and `Tags`.

## Learning expert role

Beyond auto-fill, the agent provides learning scaffolding. This is what shifts the value proposition from "signal capture for courses" to "AI-assisted learning optimization."

**Initial scaffolding types (3):**

1. **Concept connections** — surfaces explicit links across modules and to other Topic Hub entries
2. **Comprehension questions** — checks understanding without spoiling reflection
3. **Application prompts** — pushes from passive understanding to active use

**Spaced repetition cues** are deferred until L2 validates which of the initial three add value.

## Validation gates

- **L1 (process compliance):** Agent has Course Digest access; trigger is wired; instruction block contains all 7 steps.
- **L2 (outcome validation):** Yingshi creates a real course entry with URL across 3 platform types (open, YouTube, login-gated). Pass criteria:
  - S6: ≥ 2 of 3 platform types produce usable module notes from URL alone
  - S7: ≥ 2 of 3 scaffolding types rated useful
