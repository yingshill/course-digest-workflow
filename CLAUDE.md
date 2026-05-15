# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Course Learning Workflow** is a structured system for extracting maximum value from online courses by integrating them into the AI Command Center signal ecosystem. It addresses a core problem: courses are multi-module, sequential, skill-building content, yet without a workflow they're treated as one-off content (watch → forget).

**Status:** Phase 1 + 2 complete · L2 outcome validation pending

### Value Proposition

The workflow produces:
1. **Module-by-module progress tracking** — not just done/not done
2. **Forced reflection at each module** — adapted from Podcast Notebook pattern for cumulative learning
3. **Ecosystem integration** — course insights route to Topic Hub, feed into Projects, trigger Visualize/Share output pipeline
4. **Agent-assisted processing** — auto-fill from URLs/syllabi, concept maps, comprehension questions, application prompts

## Architecture

The system operates in three layers:

### Storage Layer
- **📖 Course Digest** — 4th source database in AI Command Center, follows **Pattern 1** (shared vocabulary + DB-specific properties)
- **19 properties:** 13 shared (identical across all 4 source DBs: Daily Hits, GitHub Trending, Podcast Digest, Course Digest) + 6 course-specific (Platform, Instructor, Modules, Progress, Difficulty, Goal)
- **Single modular template** (📖 Course Notebook) with composable "Add Module" sections—works for 3-module tutorials and 30-module courses

### Agent Layer
- **Brain Agent** (shared across all 4 source DBs, extended for Course Digest)
- **URL-first workflow:** On page creation, scrape course URL → extract title, description, syllabus/module list, instructor, difficulty → auto-fill all properties + generate module notes
- **Fallback:** If URL scrape is thin (login-gated), fill metadata only and flag for manual syllabus paste
- **Learning expert role:** Beyond auto-fill, provide scaffolding—concept connections, comprehension questions, application prompts
- **Constraint:** Brain Agent code/URL cannot be accessed from build environment—agent instruction updates must be applied manually by Yingshi

### Automation Layer
- `page.created` trigger on Course Digest → auto-fill (same pattern as Podcast Digest)
- `page.created` / property updates → Topic Hub reconciliation
- No recurring triggers—courses are manually added

### Critical Constraint: Shared Vocabulary
**Zero drift tolerance.** The following 6 properties MUST match exactly across all 4 source DBs:
- Category (options + colors)
- Tags (option list)  
- Eval Metric (options + colors)
- Action (options + colors)
- Output (two toggles: Visualize / Share)
- Status (groups, options, colors)

**Note:** L1 audit (S5 check) found and fixed 3 drift items in Course Digest. Pre-work for any schema changes must include a diff audit of all 4 source DBs.

## Directory Structure

```
├── README.md                          # Project overview + architecture diagram
├── CLAUDE.md                          # This file
├── AUTOMATION_SETUP.md                # Setup guide for automation CLI
├── docs/
│   ├── 01-problem-and-goal.md         # Problem statement, goal, success metrics (S1–S7)
│   ├── 02-architecture.md             # Storage/agent/automation layer design + build order
│   ├── 03-delegation.md               # AI vs. human task ownership matrix
│   ├── 04-constraints-risks.md        # C1–C4 constraints, R1–R6 risks + mitigations
│   ├── 05-roadmap.md                  # Phase 1/2 status (complete); L2 validation pending
│   ├── 06-open-questions.md           # Q1–Q8 unresolved questions
│   ├── 07-decision-log.md             # DL entries (decisions made + rationale)
│   ├── 08-retro.md                    # Retrospective entries (what went well, blockers)
│   ├── 09-next-actions.md             # Actionable next steps (L2 audit pending)
│   └── 10-resources.md                # External links (Notion brief, other DBs, etc.)
├── schema/
│   └── course-digest.md               # 19-property schema spec (shared + course-specific)
├── templates/
│   └── course-notebook.md             # Modular template spec (composable sections)
├── agents/
│   └── brain-agent.md                 # Agent extension spec (scrape logic, learning scaffolding)
└── automation/                        # Node.js CLI tool for Notion → Claude → Notion pipeline
    ├── src/
    │   ├── index.js                   # Main CLI (orchestration)
    │   ├── notion.js                  # Notion API client
    │   ├── claude.js                  # Claude API + Brain Agent instructions
    │   └── markdown-to-notion.js      # Markdown to Notion blocks converter
    ├── .env.example                   # Environment template
    ├── package.json                   # Dependencies + npm start script
    └── README.md                      # Quick reference
```

## Key Concepts

### Pattern 1 Architecture
All source databases (Daily Hits, GitHub Trending, Podcast Digest, Course Digest) follow Pattern 1:
- **Shared properties** (identical across all 4): enable aggregation in Topic Hub and shared output pipeline
- **DB-specific properties** (unique to each DB): capture source-native metadata (e.g., `Platform` for Course Digest, `Language` for GitHub, `Source` for Podcast)

**Why:** Allows centralized aggregation (Topic Hub groups by Category/Tags) and unified signal processing while preserving source semantics.

### Modular Template Design
The 📖 Course Notebook uses **opt-in toggle sections** (Add Module pattern). Why not a per-module page hierarchy?
- **Scales naturally:** 3-module tutorial fits in one page; 30-module course expands within the same template structure
- **Reduces cognitive overhead:** all course content in one navigable page
- **Supports cumulative reflection:** each module's reflection builds on prior context (unlike isolated per-module pages)

### URL-First Workflow
On page creation with a URL:
1. **Scrape** the course URL (web fetch)
2. **Extract** title, description, syllabus/modules, instructor, difficulty
3. **Auto-fill** matching schema properties
4. **Generate** module notes (summary, key concepts, rationale per module)
5. **Fallback:** If insufficient content (login-gated platforms), fill metadata + insert callout to paste syllabus manually

**Why:** Minimizes manual entry (URL provides most data) while gracefully handling access restrictions.

### Learning Expert Role
Three initial scaffolding types (L2 validates which add value):
1. **Concept connections** — explicit links across modules + to Topic Hub entries
2. **Comprehension questions** — 3–5 per module, check understanding without spoiling reflection
3. **Application prompts** — 1–2 per module, push from passive understanding to active use

**Deferred:** Spaced repetition cues until L2 outcome validation.

## Automation Setup

The `automation/` folder contains a Node.js CLI tool for the Notion → Claude → Notion pipeline.

**Purpose:** Process pending courses from Notion, generate comprehensive module notes + learning scaffolding using Claude API, and write results back to Notion.

**Trigger:** Manual (`npm start`) — human decides when to process. No auto-polling; cost-efficient.

**Workflow:**
1. User adds course to Notion with URL
2. Human runs `npm start` in `automation/` folder
3. CLI displays pending courses; user selects one
4. User optionally uploads transcript PDF or context files
5. CLI calls Claude API once (Markdown output)
6. Markdown converts to flat Notion blocks (headings + bullets, no toggles)
7. Results write back to Notion; Status set to Done

**Cost:** ~$0.06–0.15 per course (single Claude Sonnet 4.6 API call, varies by module count)

See `AUTOMATION_SETUP.md` for detailed setup instructions.

### Running the Automation

```bash
cd automation
npm start
```

Then follow the prompts. That's it.

### Code Structure

- `index.js` — Orchestration (fetch, prompt user, call API, write results)
- `notion.js` — Notion API client (query pending, update page)
- `claude.js` — Claude API call + Brain Agent instructions
- `markdown-to-notion.js` — Convert Markdown to flat Notion blocks

## Common Work Patterns

### Schema Updates
If modifying the Course Digest schema:
1. Update `schema/course-digest.md` with new properties
2. **Run shared vocabulary audit:** diff all 6 shared properties across all 4 source DBs (see `docs/04-constraints-risks.md` R3)
3. Update `docs/02-architecture.md` build order if adding new properties
4. Document the change in `docs/07-decision-log.md`

### Template Refinements
If modifying the 📖 Course Notebook template:
1. Update `templates/course-notebook.md` with new sections
2. Ensure modular sections remain opt-in (toggle-based, not mandatory)
3. Test the reflection workflow—each section should support cumulative learning

### Agent Instructions
The Brain Agent's Course Digest extension lives in `agents/brain-agent.md`. Updates include:
- URL scrape logic (per-platform handling)
- Module note generation structure
- Learning scaffolding prompts
- Trigger conditions (when to auto-fill, when to flag for manual input)

**Critical constraint:** These instructions cannot be applied via build automation—Yingshi applies them manually in the agent settings. Document proposed changes in `agents/brain-agent.md` with clear step-by-step logic blocks so Yingshi can encode them into the agent UI.

### Validation & Audits
- **L1 (process compliance, AI-led):** Schema completeness, template structure, relation wiring, shared vocabulary parity, documentation completeness
- **L2 (outcome validation, human-led):** Agent auto-fill testing (real course entries across 3 platform types), module note quality, scaffolding usefulness, reflection workflow

See `docs/01-problem-and-goal.md` for all 7 success metrics (S1–S7).

## Current Status & Next Actions

**Completed:**
- Phase 1: Storage layer (schema, views, relations, templates) ✅
- Phase 2: Refinements (Difficulty property, URL-first encoding, shared vocab audit) ✅  
- L1 audit (process compliance): ✅ Pass (S1–S5)

**Blocked/Pending:**
- L2 audit (outcome validation): ⏳ Pending—requires real course entry with URL

See `docs/09-next-actions.md` for specific action items and priority order.

## Delegation Matrix

Work ownership is defined in `docs/03-delegation.md`:
- **AI-led:** Schema design, property addition, template URL callouts, relations, audit execution, Workspace Database Design updates
- **Collaborative:** Template design (AI drafts, Yingshi refines), agent logic blocks (AI drafts, Yingshi encodes into agent UI)
- **Human-led:** Agent instruction updates (must be manual), L2 outcome validation (requires testing real courses)

## Architectural Decision-Making Principles

**Cost-efficiency is non-negotiable.** When evaluating architectural options:

1. **Always provide cost analysis** — Compare API calls, tokens, and infrastructure costs before recommending
2. **Select the lower-cost option** — Unless complexity introduces maintenance burden that outweighs savings
3. **Prefer single API calls over multiple round-trips** — One Claude API call with processed input beats 3 calls with raw input
4. **Offload "dumb work" to Node** — Scraping, parsing, file handling is free; only intelligence goes to Claude API
5. **Consider long-term scaling** — Cost per unit of work matters more than absolute cost
6. **Minimize automation overhead** — Manual triggers > auto-polling (only pay for work when human intends it)

Apply this in plan mode: Always include cost comparison and break-even analysis before recommending architecture.

## External Context

- **Parent project:** Creative Learning & Visualization Pipeline
- **Broader ecosystem:** AI Command Center (aggregates all 4 source DBs + Topic Hub)
- **Related patterns:** Podcast Notebook (reflection model), Brain Agent (agent logic), Workspace Database Design (master spec)

For full context on these external systems, see `docs/10-resources.md`.
