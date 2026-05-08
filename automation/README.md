# Course Learning Automation

CLI tool for processing pending courses from Notion and generating comprehensive learning materials using Claude API.

## Setup

1. **Clone environment variables:**
   ```bash
   cp .env.example .env
   ```

2. **Add your API keys to `.env`:**
   - `NOTION_API_KEY`: Get from https://www.notion.com/my-integrations
   - `NOTION_DATABASE_ID`: The ID of your Course Digest database
   - `ANTHROPIC_API_KEY`: Get from https://console.anthropic.com

3. **Create a Notion integration:**
   - Go to https://www.notion.com/my-integrations
   - Create a new integration
   - Copy the API key to `.env`
   - Share your Course Digest database with the integration

## Usage

```bash
npm start
```

The tool will:
1. Fetch all pending courses (where `Transcript Ready` = false)
2. Display them and ask you to pick one
3. Ask if you have a transcript PDF or extra context
4. Call Claude API to generate module notes + learning scaffolding
5. Write results back to Notion
6. Mark the course as processed

## Workflow

**Trigger:** Manual (human runs `npm start`)

**Process:**
- User picks a pending course
- Optionally uploads transcript PDF or context files
- AI processes with Claude API (Markdown output)
- Markdown converts to Notion toggle blocks
- Results written back to Notion page

**Cost:** ~$0.10 per course (single Claude API call)

## Environment Variables

- `NOTION_API_KEY` — Notion integration secret token
- `NOTION_DATABASE_ID` — Course Digest database ID
- `ANTHROPIC_API_KEY` — Anthropic API key for Claude
- `DEBUG` — Set to "true" for verbose logging (shows token counts, cost estimates)

## Architecture

```
index.js (CLI orchestration)
  ├─ notion.js (read pending, write results)
  ├─ claude.js (call Claude API with Brain Agent instructions)
  └─ markdown-to-notion.js (convert output to Notion blocks)
```

## Limitations

- URL fetching may fail on login-gated platforms (fallback: user provides transcript)
- PDF parsing is basic (text extraction only)
- Notion toggle block nesting has limits (very deep nesting may not render)

## Next Steps

After testing with 1–2 real courses:
- Move to scheduled execution (Claude Code `/schedule` or local cron)
- Add error recovery and retry logic
- Implement batch processing for multiple courses
