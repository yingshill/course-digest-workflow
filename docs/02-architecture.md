# §4 · Architecture

## Storage layer

- **New database: 📖 Course Digest** — 4th source DB in AI Command Center, following Pattern 1
- **Shared properties** (identical to other 3 source DBs): Title, URL, Date, Core Insight, Why It Matters, Category, Tags, Eval Metric, Action, Output, Status, Project (→ Projects DB), Topic Hub (two-way relation)
- **Course-specific properties:**
  - `Platform` — Select (Coursera, Udemy, YouTube, edX, Stanford Online, MIT OCW, Fast.ai, Other)
  - `Instructor` — Text
  - `Modules` — Number (total module count)
  - `Progress` — Number (modules completed)
  - `Transcript Ready` — Checkbox (auto-set by agent when enough content scraped; or manually set after pasting syllabus)
  - `Difficulty` — Select (Beginner / Intermediate / Advanced) — **course-only**
- **Templates:** Single modular template (📖 Course Notebook) with composable sections — "Add Module" pattern inserts toggle sections on demand. Self-scaling: works for 3-module tutorials and 30-module courses without a separate template.

## Agent layer

**Brain Agent** — extend existing (no new agent):

- Add 📖 Course Digest to read/write access
- Add `User Entry Auto-Fill` trigger on `page.created`
- **URL-first workflow:** On page creation, scrape the course URL via web access → extract title, description, syllabus/module list, instructor, difficulty. Auto-fill all properties + generate module notes with rationales. Set `Transcript Ready` automatically if enough content scraped.
- **Fallback:** If URL scrape is thin (login-gated platform), fill what's available and flag in page body: *"Syllabus incomplete — paste full outline for deeper module notes."* Human pastes outline → re-triggers full auto-fill.
- Topic Hub sync: same rules as other source DBs
- **Learning expert role:** Beyond auto-fill, provide learning scaffolding — concept connections across modules, comprehension questions, application prompts, spaced repetition cues. Connects to Creative Learning & Visualization Pipeline.

## Automation layer

- `page.created` trigger → auto-fill (same as Podcast Digest)
- No recurring trigger — courses are manually added

## Shared vocabulary

No new options needed. `Platform` is course-specific only (like `Source` on Podcast, `Language` on GitHub).

## Diagram

```mermaid
graph TD
    A["🧠 AI Daily Hits"] -->|relation| D["🗺️ Topic Hub"]
    B["📈 GitHub Daily Trending"] -->|relation| D
    C["🎙️ Podcast & Video Digest"] -->|relation| D
    NEW["📖 Course Digest"] -->|relation| D
    A -->|relation| P["📁 Project"]
    B -->|relation| P
    C -->|relation| P
    NEW -->|relation| P
    NEW -.->|"page.created → auto-fill"| BA["🤖 Brain Agent"]
    D -->|groups signals by topic| E["🏛️ AI Command Center"]
    style NEW fill:#cffafe,color:#164e63,stroke:#164e63
```

> 🛠️ **Build order:** Schema → views → Topic Hub relation → Projects relation → Templates → Brain Agent update → Shared vocabulary audit
