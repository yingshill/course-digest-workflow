/**
 * Convert Markdown module notes to Notion blocks.
 *
 * Structure: one toggle block per module, containing heading_3 sections
 * and content (bullets, numbered lists, paragraphs) as flat children.
 *
 * Notion API allows one level of nesting in a single blocks.children.append
 * call. Section toggles inside module toggles would require separate API
 * calls per module, so sections use heading_3 instead — simpler and cheaper.
 */

function markdownToNotionBlocks(markdown) {
  const lines = markdown.split('\n');
  const blocks = [];
  let currentModule = null;
  let currentChildren = [];

  const flushModule = () => {
    if (currentModule !== null) {
      blocks.push(makeToggle(currentModule, currentChildren));
      currentChildren = [];
    }
  };

  for (const line of lines) {
    if (line.startsWith('## ')) {
      flushModule();
      currentModule = line.slice(3).trim();
    } else if (currentModule === null) {
      // Content before first module heading — add as top-level paragraph
      if (line.trim() && line.trim() !== '---') {
        blocks.push(makeParagraph(line.trim()));
      }
    } else if (line.startsWith('### ')) {
      currentChildren.push(makeHeading3(line.slice(4).trim()));
    } else if (line.trim() === '---' || line.trim() === '') {
      // skip separators and blank lines
    } else if (line.match(/^[\s]*[-*]\s/)) {
      currentChildren.push(makeBullet(line.replace(/^[\s]*[-*]\s/, '').trim()));
    } else if (line.match(/^[\s]*\d+\.\s/)) {
      currentChildren.push(makeNumbered(line.replace(/^[\s]*\d+\.\s/, '').trim()));
    } else {
      currentChildren.push(makeParagraph(line.trim()));
    }
  }

  flushModule();
  return blocks;
}

// --- Block builders ---

function makeToggle(title, children) {
  return {
    object: 'block',
    type: 'toggle',
    toggle: { rich_text: [text(title)] },
    children: children.map(c => ({ ...c, object: 'block' }))
  };
}

function makeHeading3(content) {
  return {
    type: 'heading_3',
    heading_3: { rich_text: [text(content)] }
  };
}

function makeBullet(content) {
  return {
    type: 'bulleted_list_item',
    bulleted_list_item: { rich_text: [text(content)] }
  };
}

function makeNumbered(content) {
  return {
    type: 'numbered_list_item',
    numbered_list_item: { rich_text: [text(content)] }
  };
}

function makeParagraph(content) {
  return {
    type: 'paragraph',
    paragraph: { rich_text: [text(content)] }
  };
}

function text(content) {
  return { type: 'text', text: { content, link: null } };
}

module.exports = { markdownToNotionBlocks };
