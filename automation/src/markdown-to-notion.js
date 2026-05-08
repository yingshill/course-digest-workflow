/**
 * Convert Markdown module notes to Notion toggle blocks
 * Structure: Module heading → toggle block with nested content
 */

function markdownToNotionBlocks(markdown) {
  const lines = markdown.split('\n');
  const blocks = [];
  let currentModule = null;
  let currentSection = null;
  let sectionContent = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Module heading (## Module N: Title)
    if (line.startsWith('## ')) {
      if (currentModule) {
        blocks.push(createModuleToggle(currentModule.title, currentModule.children));
      }

      currentModule = {
        title: line.replace('## ', '').trim(),
        children: []
      };
      currentSection = null;
      sectionContent = [];
    }
    // Section heading (### Section Title)
    else if (line.startsWith('### ')) {
      if (sectionContent.length > 0 && currentSection) {
        currentModule.children.push(createSectionBlock(currentSection, sectionContent));
        sectionContent = [];
      }

      currentSection = line.replace('### ', '').trim();
    }
    // Separator (---)
    else if (line.trim() === '---' || line.trim() === '') {
      continue;
    }
    // Regular content
    else if (line.trim()) {
      sectionContent.push(line);
    }
  }

  // Flush remaining content
  if (sectionContent.length > 0 && currentSection && currentModule) {
    currentModule.children.push(createSectionBlock(currentSection, sectionContent));
  }
  if (currentModule) {
    blocks.push(createModuleToggle(currentModule.title, currentModule.children));
  }

  return blocks;
}

function createModuleToggle(title, children) {
  return {
    object: 'block',
    type: 'toggle',
    toggle: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: title,
            link: null
          }
        }
      ]
    },
    children: children.map(child => ({ ...child, object: 'block' }))
  };
}

function createSectionBlock(sectionTitle, content) {
  const blocks = [
    {
      type: 'heading_3',
      heading_3: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: sectionTitle,
              link: null
            }
          }
        ]
      }
    }
  ];

  // Parse content lines (handle lists, text, etc.)
  let currentList = null;

  for (const line of content) {
    // Bullet list item (- or *)
    if (line.match(/^[\s]*[-*]\s/)) {
      const itemText = line.replace(/^[\s]*[-*]\s/, '').trim();
      const listItem = {
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: itemText,
                link: null
              }
            }
          ]
        }
      };
      blocks.push(listItem);
    }
    // Numbered list item (1. 2. etc.)
    else if (line.match(/^[\s]*\d+\.\s/)) {
      const itemText = line.replace(/^[\s]*\d+\.\s/, '').trim();
      const listItem = {
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: itemText,
                link: null
              }
            }
          ]
        }
      };
      blocks.push(listItem);
    }
    // Regular paragraph
    else {
      blocks.push({
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: line.trim(),
                link: null
              }
            }
          ]
        }
      });
    }
  }

  return {
    type: 'toggle',
    toggle: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: sectionTitle,
            link: null
          }
        }
      ]
    },
    children: blocks
  };
}

module.exports = {
  markdownToNotionBlocks
};
