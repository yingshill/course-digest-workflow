#!/usr/bin/env node

/**
 * One-time schema migration for Course Digest database.
 *
 * Changes:
 *   ADD    Goal          (rich_text) — why this course was added
 *   REMOVE Transcript Ready (checkbox) — replaced by Status tracking
 *
 * WARNING: Removing a Notion property deletes its data on all existing pages.
 * Run this only after confirming no Transcript Ready data needs to be kept.
 *
 * Usage:
 *   NOTION_API_KEY=... NOTION_DATABASE_ID=... node migrate-schema.js
 *   — or —
 *   cp .env.example .env && node -r dotenv/config migrate-schema.js
 */

require('dotenv').config();
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

async function main() {
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
    console.error('❌ Missing NOTION_API_KEY or NOTION_DATABASE_ID');
    process.exit(1);
  }

  console.log('\n📖 Course Digest — schema migration\n');

  // Fetch current schema
  const db = await notion.databases.retrieve({ database_id: databaseId });
  const existing = Object.keys(db.properties);
  console.log(`Current properties (${existing.length}):\n  ${existing.join(', ')}\n`);

  const hasGoal = existing.includes('Goal');
  const hasTranscriptReady = existing.includes('Transcript Ready');

  if (hasGoal && !hasTranscriptReady) {
    console.log('✅ Already up to date. Nothing to do.');
    return;
  }

  const updates = {};

  if (!hasGoal) {
    updates['Goal'] = { rich_text: {} };
    console.log('+ Adding: Goal (text)');
  }

  if (hasTranscriptReady) {
    updates['Transcript Ready'] = null;
    console.log('- Removing: Transcript Ready (checkbox)');
    console.log('  ⚠️  This will delete Transcript Ready data on all existing pages.');
  }

  const { default: readline } = await import('readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise(resolve => rl.question('\nProceed? (y/N) ', resolve));
  rl.close();

  if (answer.toLowerCase() !== 'y') {
    console.log('Cancelled.');
    return;
  }

  await notion.databases.update({
    database_id: databaseId,
    properties: updates
  });

  console.log('\n✅ Migration complete.');

  // Verify
  const updated = await notion.databases.retrieve({ database_id: databaseId });
  const final = Object.keys(updated.properties);
  console.log(`Updated properties (${final.length}):\n  ${final.join(', ')}`);
}

main().catch(err => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
