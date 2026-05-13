# 📖 Course Notebook — template spec

**Pattern:** Single modular template (replaces the original two-template design). Composable "Add Module" toggle sections insert on demand. Self-scaling from 3-module tutorials to 30-module courses.

## Layered authorship

The template separates AI-generated and human-authored content explicitly so reflection isn't crowded out by auto-fill.

- **🤖 AI layer** — auto-filled by Brain Agent on `page.created`:
  - Course Overview
  - Concept Map
  - Module Notes (per module): summary, key concepts, rationale
  - Connects To (links to other Topic Hub entries)
  - Learning expert scaffolding: concept connections, comprehension Qs, application prompts
- **✍️ Human layer** — author-only:
  - 5-part Your Reflection (per module + course-level)
  - Decisions / actions to take

## Section outline

```
📖 Course Notebook
├── 🧭 Source Metadata (URL, Platform, Instructor, Difficulty, Modules, Progress)
├── 📝 Syllabus zone
│   └── (auto-filled from URL scrape; manual paste fallback if login-gated)
├── 🌐 Course Overview (AI)
├── 🗺️ Concept Map (AI — mermaid diagram)
├── 📚 Module Notes (modular — "Add Module" toggle pattern)
│   ├── Module N — title
│   │   ├── 🤖 AI: summary, key concepts, rationale
│   │   ├── 🧠 Learning expert scaffolding
│   │   │   ├── Concept connections
│   │   │   ├── Comprehension Qs
│   │   │   └── Application prompts
│   │   └── ✍️ Your Reflection (5-part)
│   │       ├── 1. What surprised you?
│   │       ├── 2. What connects to prior modules?
│   │       ├── 3. Where would you apply this?
│   │       ├── 4. What do you still not understand?
│   │       └── 5. One sentence summary
│   └── (repeat per module)
├── 🔗 Connects To (AI — links to other Topic Hub entries)
└── ✨ Course-level Reflection (✍️ Your Reflection — 5-part, cumulative)
```

## URL-first workflow

On page creation, Brain Agent:

1. Reads the `URL` property
2. Scrapes the course page (web access)
3. Extracts: title, description, syllabus / module list, instructor, difficulty
4. Auto-fills properties + generates module notes with rationales

### Fallback (login-gated platforms)

If the URL scrape is thin, the agent fills what's available and inserts a callout in the page body:

> ⚠️ Syllabus incomplete — paste full outline for deeper module notes.

When the user pastes the outline, the agent re-triggers full auto-fill.

## Reflection-first principle

The AI layer is *scaffolding*, not the deliverable. The human layer (Your Reflection) is what produces durable learning. Templates must always preserve clear visual separation between the two layers — AI content must never crowd out the reflection prompts.
