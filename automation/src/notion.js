const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

async function getPendingCourses() {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Status',
        status: { does_not_equal: 'Done' }
      },
      sorts: [{ property: 'Date', direction: 'descending' }]
    });

    return response.results.map(page => ({
      id: page.id,
      title: page.properties.Title.title[0]?.plain_text || 'Untitled',
      url: page.properties.URL.url || null,
      platform: page.properties.Platform.select?.name || 'Unknown',
      instructor: page.properties.Instructor.rich_text[0]?.plain_text || null,
      modules: page.properties.Modules.number || 0,
      goal: page.properties.Goal?.rich_text[0]?.plain_text || null
    }));
  } catch (error) {
    console.error('Error fetching pending courses:', error);
    throw error;
  }
}

async function updateCoursePage(pageId, updates) {
  try {
    // Update page properties (status, transcript ready)
    await notion.pages.update({
      page_id: pageId,
      properties: updates.properties || {}
    });

    // Add content blocks if provided
    if (updates.blocks && updates.blocks.length > 0) {
      await notion.blocks.children.append({
        block_id: pageId,
        children: updates.blocks
      });
    }

    console.log(`✅ Updated course page ${pageId}`);
  } catch (error) {
    console.error('Error updating course page:', error);
    throw error;
  }
}

async function getPageContent(pageId) {
  try {
    const response = await notion.blocks.children.list({
      block_id: pageId
    });
    return response.results;
  } catch (error) {
    console.error('Error fetching page content:', error);
    throw error;
  }
}

module.exports = {
  notion,
  getPendingCourses,
  updateCoursePage,
  getPageContent
};
