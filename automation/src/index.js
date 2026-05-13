#!/usr/bin/env node

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const axios = require('axios');
const pdfParse = require('pdf-parse');

const { getPendingCourses, updateCoursePage } = require('./notion');
const { processCourseMaterial } = require('./claude');
const { markdownToNotionBlocks } = require('./markdown-to-notion');

const debug = process.env.DEBUG === 'true';

async function main() {
  console.log('\n📖 Course Learning Automation\n');

  // Check environment
  if (!process.env.NOTION_API_KEY || !process.env.ANTHROPIC_API_KEY) {
    console.error('❌ Missing environment variables. Please set NOTION_API_KEY and ANTHROPIC_API_KEY in .env');
    process.exit(1);
  }

  try {
    // Fetch pending courses
    console.log('Fetching pending courses from Notion...');
    const courses = await getPendingCourses();

    if (courses.length === 0) {
      console.log('✨ No pending courses. All set!');
      process.exit(0);
    }

    console.log(`\n📚 Found ${courses.length} pending course(s):\n`);
    courses.forEach((course, i) => {
      console.log(`${i + 1}. ${course.title} (${course.platform})`);
      if (course.instructor) console.log(`   Instructor: ${course.instructor}`);
      if (course.modules) console.log(`   Modules: ${course.modules}`);
    });

    // User selects course
    const { selectedIndex } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedIndex',
        message: '\nSelect a course to process:',
        choices: courses.map((c, i) => ({ name: c.title, value: i }))
      }
    ]);

    const selectedCourse = courses[selectedIndex];
    console.log(`\n✅ Selected: ${selectedCourse.title}\n`);

    // Collect context
    const { hasTranscript, hasExtra } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'hasTranscript',
        message: 'Do you have the course transcript ready (PDF)?',
        default: false
      },
      {
        type: 'confirm',
        name: 'hasExtra',
        message: 'Do you have extra context to upload (syllabus, notes, etc.)?',
        default: false
      }
    ]);

    let transcriptContent = '';
    let extraContent = '';

    // Load transcript
    if (hasTranscript) {
      const { transcriptPath } = await inquirer.prompt([
        {
          type: 'input',
          name: 'transcriptPath',
          message: 'Enter path to transcript PDF:',
          validate: (input) => fs.existsSync(input) ? true : 'File not found'
        }
      ]);

      console.log('\n📄 Reading transcript...');
      const pdfBuffer = fs.readFileSync(transcriptPath);
      const pdfData = await pdfParse(pdfBuffer);
      transcriptContent = pdfData.text.substring(0, 10000); // Limit to 10k chars
      console.log(`✅ Loaded ${pdfData.numpages} pages from PDF`);
    }

    // Load extra context
    if (hasExtra) {
      const { extraPath } = await inquirer.prompt([
        {
          type: 'input',
          name: 'extraPath',
          message: 'Enter path to extra context file (txt/md):',
          validate: (input) => fs.existsSync(input) ? true : 'File not found'
        }
      ]);

      console.log('\n📝 Reading extra context...');
      extraContent = fs.readFileSync(extraPath, 'utf-8').substring(0, 5000); // Limit to 5k chars
      console.log(`✅ Loaded extra context`);
    }

    // Fetch URL content if URL exists
    let urlContent = '';
    if (selectedCourse.url) {
      console.log('\n🔗 Fetching course URL...');
      try {
        const response = await axios.get(selectedCourse.url, { timeout: 5000 });
        // Extract basic text from HTML (very basic)
        urlContent = response.data.substring(0, 3000);
      } catch (error) {
        console.log('⚠️  Could not fetch URL (may be login-gated)');
      }
    }

    // Confirm before processing
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: '\n🚀 Ready to process? This will call Claude API.',
        default: true
      }
    ]);

    if (!confirm) {
      console.log('Cancelled.');
      process.exit(0);
    }

    // Call Claude API
    console.log('\n⏳ Processing course with Claude API...');
    const markdown = await processCourseMaterial(
      {
        title: selectedCourse.title,
        platform: selectedCourse.platform,
        instructor: selectedCourse.instructor,
        modules: selectedCourse.modules,
        url: selectedCourse.url
      },
      transcriptContent || urlContent,
      extraContent
    );

    // Convert Markdown to flat Notion blocks
    console.log('📦 Converting to Notion blocks...');
    const blocks = markdownToNotionBlocks(markdown);

    // Update Notion
    console.log('💾 Writing to Notion...');
    await updateCoursePage(selectedCourse.id, {
      blocks,
      properties: {
        Status: { status: { name: 'Done' } }
      }
    });

    console.log('\n✨ Done! Course notes added to Notion.');
    console.log(`📖 View in Notion: https://notion.so/${selectedCourse.id.replace(/-/g, '')}`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (debug) console.error(error);
    process.exit(1);
  }
}

main();
