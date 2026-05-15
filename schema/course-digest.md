# 📖 Course Digest — database schema

**Type:** Source database #4 in AI Command Center.
**Pattern:** Pattern 1 (shared vocabulary + DB-specific properties).
**Total properties:** 19 (13 shared + 6 course-specific).

## Shared properties (identical across all 4 source DBs)

| # | Name | Type | Notes |
|---|---|---|---|
| 1 | Title | Title | Page name |
| 2 | URL | URL | Source URL of the course |
| 3 | Date | Date | When added |
| 4 | Core Insight | Text | One-line takeaway |
| 5 | Why It Matters | Text | Relevance / so-what |
| 6 | Category | Select | Shared vocabulary across all 4 source DBs |
| 7 | Tags | Multi-select | Topical tags |
| 8 | Eval Metric | Select | Quality of the entry |
| 9 | Action | Select | What to do next |
| 10 | Output | Select | Two-toggle: Visualize / Share |
| 11 | Status | Status | Workflow state (incl. Done group) |
| 12 | Project | Relation | → Projects DB (one-way) |
| 13 | Topic Hub | Relation | ↔ Topic Hub (two-way) |

## Course-specific properties

| # | Name | Type | Options / notes |
|---|---|---|---|
| 14 | Platform | Select | Coursera, Udemy, YouTube, edX, Stanford Online, MIT OCW, Fast.ai, Other |
| 15 | Instructor | Text | Free-form |
| 16 | Modules | Number | Total module count |
| 17 | Progress | Number | Modules *processed* (reflected on) — not modules watched |
| 18 | Difficulty | Select | Beginner / Intermediate / Advanced |
| 19 | Goal | Text | Why this course was added — what skill or outcome is expected. Set by human at entry; reviewed at course-level reflection. |

## Relations

- **Topic Hub (two-way):** A `📖 Course Digest` property exists on the Topic Hub data source — entries appear in Topic Hub aggregation views.
- **Projects (one-way):** Course → Projects only. Used to escalate course-derived insights into dedicated projects.
- **Self-relation (Parent Project):** Optional, for course → sub-course hierarchies.

## Views

- **Quick Scan** — table view, default sort by Date desc, with Title, Platform, Difficulty, Status, Progress, Instructor.

## Shared-vocabulary contract

The following 6 properties MUST match exactly across all 4 source DBs (AI Daily Hits, GitHub Daily Trending, Podcast & Video Digest, Course Digest):

- Category (options + colors)
- Tags (option list)
- Eval Metric (options + colors)
- Action (options + colors)
- Output (options + colors — exactly two toggles: Visualize / Share)
- Status (groups + options + colors)

> ✅ Course Digest shared vocabulary parity confirmed (L1 audit — 3 drift items found and fixed). Pre-existing drift in older DBs deferred to a separate System Audit (see §8 Q4).
