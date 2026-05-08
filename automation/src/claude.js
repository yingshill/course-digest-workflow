const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const BRAIN_AGENT_INSTRUCTIONS = `You are the Brain Agent, an AI assistant specialized in processing course content and generating structured learning materials.

Your task: Process course metadata and content to generate comprehensive module notes with learning scaffolding.

**Output Requirements:**
- Generate module notes in Markdown format
- For each module: include summary, key concepts, rationale, concept connections, comprehension questions, and application prompts
- Use clear heading hierarchy (## for modules, ### for sections)
- Keep output structured and scannable

**Format:**
For each module, generate exactly this structure:
## Module N: [Module Title]
[Summary of module content]

### Key Concepts
- Concept 1
- Concept 2
- ...

### Rationale
Why this module matters in the course arc.

### Concept Connections
Links to related topics or prior modules.

### Comprehension Questions
1. Question about core concept?
2. Question testing understanding?
3. Additional verification question?

### Application Prompts
- How would you apply this concept?
- Real-world scenario to practice?

---
[Repeat for each module]

**Important:**
- Be concise but complete
- Tailor difficulty to course level
- Create questions that check understanding without spoiling reflection
- Application prompts should push from passive understanding to active use`;

async function processCourseMaterial(metadata, transcript = '', extraContext = '') {
  try {
    const userMessage = `Process this course and generate comprehensive module notes with learning scaffolding.

**Course Metadata:**
Title: ${metadata.title}
Platform: ${metadata.platform}
Instructor: ${metadata.instructor || 'Not provided'}
Total Modules: ${metadata.modules}
URL: ${metadata.url}

${transcript ? `**Course Transcript/Syllabus:**\n${transcript}\n\n` : ''}
${extraContext ? `**Extra Context from User:**\n${extraContext}\n\n` : ''}

Generate module notes in Markdown format, following the required structure for each module. If the transcript is thin, make reasonable inferences from the title, description, and platform structure.`;

    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 4096,
      system: BRAIN_AGENT_INSTRUCTIONS,
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ]
    });

    const markdown = response.content[0].text;

    if (process.env.DEBUG) {
      console.log('Claude API response (first 500 chars):', markdown.substring(0, 500));
      console.log('Input tokens:', response.usage.input_tokens);
      console.log('Output tokens:', response.usage.output_tokens);
      console.log('Cost estimate:', ((response.usage.input_tokens * 0.003 + response.usage.output_tokens * 0.015) / 1000).toFixed(4) + ' USD');
    }

    return markdown;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
}

module.exports = {
  processCourseMaterial
};
