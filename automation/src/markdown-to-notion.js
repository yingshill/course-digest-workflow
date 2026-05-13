function markdownToNotionBlocks(markdown) {
  const blocks = [];

  for (const line of markdown.split('\n')) {
    if (line.startsWith('## ')) {
      blocks.push(makeHeading2(line.slice(3).trim()));
    } else if (line.startsWith('### ')) {
      blocks.push(makeHeading3(line.slice(4).trim()));
    } else if (line.match(/^[\s]*[-*]\s/)) {
      blocks.push(makeBullet(line.replace(/^[\s]*[-*]\s/, '').trim()));
    } else if (line.match(/^[\s]*\d+\.\s/)) {
      blocks.push(makeNumbered(line.replace(/^[\s]*\d+\.\s/, '').trim()));
    } else if (line.trim() && line.trim() !== '---') {
      blocks.push(makeParagraph(line.trim()));
    }
  }

  return blocks;
}

function makeHeading2(content) {
  return { type: 'heading_2', heading_2: { rich_text: [text(content)] } };
}

function makeHeading3(content) {
  return { type: 'heading_3', heading_3: { rich_text: [text(content)] } };
}

function makeBullet(content) {
  return { type: 'bulleted_list_item', bulleted_list_item: { rich_text: [text(content)] } };
}

function makeNumbered(content) {
  return { type: 'numbered_list_item', numbered_list_item: { rich_text: [text(content)] } };
}

function makeParagraph(content) {
  return { type: 'paragraph', paragraph: { rich_text: [text(content)] } };
}

function text(content) {
  return { type: 'text', text: { content, link: null } };
}

module.exports = { markdownToNotionBlocks };
