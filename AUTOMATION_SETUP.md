# Automation Setup Guide

This guide walks through setting up the course learning automation pipeline.

## Architecture Overview

```
Notion (read/write)
    ↓
CLI Tool (manual trigger)
    ├─ Fetch pending courses
    ├─ User selects course
    ├─ User uploads transcript/context (optional)
    ├─ Call Claude API (single call)
    ├─ Convert Markdown → Notion blocks
    └─ Write results back to Notion
```

**Cost:** ~$0.06–0.15 per course (single Claude API call, Sonnet 4.6 pricing — varies by module count)

**Trigger:** Manual (`npm start`) — human decides when to process

## Prerequisites

1. **Notion setup:**
   - Free/Pro tier is sufficient (no Business tier needed)
   - Course Digest database with these properties:
     - `Title` (text)
     - `URL` (URL)
     - `Platform` (select)
     - `Instructor` (text)
     - `Modules` (number)
     - `Goal` (text) — optional but recommended
     - `Status` (status)

2. **Notion integration:**
   - Go to https://www.notion.com/my-integrations
   - Click "Create new integration"
   - Name it "Course Learning Automation"
   - Copy the API key
   - Share your Course Digest database with the integration (click "..." → "Add connection")

3. **Anthropic API key:**
   - Go to https://console.anthropic.com/account/keys
   - Create a new API key
   - Keep it secure

## Installation

```bash
cd automation
npm install
```

## Configuration

1. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` and add:**
   ```
   NOTION_API_KEY=your_notion_api_key
   NOTION_DATABASE_ID=your_database_id_from_notion_url
   ANTHROPIC_API_KEY=your_anthropic_key
   DEBUG=false
   ```

   To get `NOTION_DATABASE_ID` (the data source ID, not the view URL ID):
   - Open your Course Digest database in Notion
   - The view URL contains a view ID, not the data source ID
   - Use the Notion API search or check with the CLI: the data source ID is the one returned under `data_sources[].id` when retrieving the database

## Usage

```bash
npm start
```

**Workflow:**
1. Tool fetches all non-Done courses from the database
2. You select which course to process
3. Tool asks:
   - "Do you have transcript PDF?" → optionally upload PDF
   - "Do you have extra context?" → optionally upload text file
4. Tool fetches the course URL (if available)
5. Tool calls Claude API to generate module notes + scaffolding
6. Results write back to Notion as flat blocks (headings + bullets)
7. Status set to Done

## First Test

**Prepare:**
1. Add 1 course to Notion with URL set
2. Set `Status` to anything other than Done (e.g. "Not started")

**Run:**
```bash
npm start
```

**Verify:**
- Course notes appear in the Notion page as flat headings + bullets
- Status flips to Done

## Debug

Enable verbose logging:
```bash
DEBUG=true npm start
```

This shows:
- Token counts from Claude API
- Cost estimates per call
- API response (first 500 chars)

## Troubleshooting

**"Missing environment variables"**
- Check `.env` file exists and has all 3 keys
- Verify keys are not wrapped in quotes

**"Notion API error: unauthorized"**
- Verify API key is correct
- Verify the integration is shared with your Course Digest database
- Go to database → "..." → "Add connection" and select your integration

**"Claude API error: unauthorized"**
- Verify `ANTHROPIC_API_KEY` is correct
- Check your API quota at https://console.anthropic.com/account/billing

**"File not found"**
- Use absolute paths when uploading transcript/context
- Verify file exists before starting the tool

## Cost Estimation

Per course (Sonnet 4.6 — $3/M input, $15/M output):
- **Input tokens:** ~5,000–8,000 (metadata + transcript/URL content + context)
- **Output tokens:** ~3,000–8,000 (module notes + scaffolding, up to 8,096 max)
- **Total cost:** ~$0.06–0.15 depending on module count

Monthly estimate (10 courses):
- API cost: ~$0.60–1.50
- Notion API: free (included in automation calls)

## File Structure

```
automation/
├── src/
│   ├── index.js              # Main CLI (orchestration)
│   ├── notion.js             # Notion API client
│   ├── claude.js             # Claude API + Brain Agent instructions
│   └── markdown-to-notion.js # Markdown to Notion blocks converter
├── .env.example              # Environment template
├── .env                       # Your actual keys (gitignored)
├── package.json              # Dependencies + scripts
└── README.md                 # Quick reference
```

## Support

For issues:
1. Check `AUTOMATION_SETUP.md` (this file)
2. Run with `DEBUG=true` to see detailed logs
3. Verify Notion API access independently (e.g., with Postman)
4. Check Claude API status at https://status.anthropic.com
