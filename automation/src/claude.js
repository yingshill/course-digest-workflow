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
3. Question checking deeper understanding?
4. Additional verification question?
5. Edge case or application question?

### Application Prompts
- How would you apply this concept in a real project?
- Real-world scenario to practice?

---
[Repeat for each module]

**Important:**
- Be concise but complete
- Tailor difficulty to course level
- Create questions that check understanding without spoiling reflection
- Application prompts should push from passive understanding to active use
- If content is thin (login-gated or minimal URL), generate reasonable scaffolding from title/platform/instructor context and flag: "INCOMPLETE_SYLLABUS"`;

async function processCourseMaterial(metadata, transcript = '', extraContext = '') {
  try {
    const modulesLabel = metadata.modules > 0 ? metadata.modules : 'Unknown';
    const userMessage = `Process this course and generate comprehensive module notes with learning scaffolding.

**Course Metadata:**
Title: ${metadata.title}
Platform: ${metadata.platform}
Instructor: ${metadata.instructor || 'Not provided'}
Total Modules: ${modulesLabel}
URL: ${metadata.url}

${transcript ? `**Course Transcript/Syllabus:**\n${transcript}\n\n` : ''}
${extraContext ? `**Extra Context from User:**\n${extraContext}\n\n` : ''}

Generate module notes in Markdown format, following the required structure for each module. If the content is thin, make reasonable inferences and include "INCOMPLETE_SYLLABUS" on the last line.`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8096,
      system: BRAIN_AGENT_INSTRUCTIONS,
      messages: [{ role: 'user', content: userMessage }]
    });

    if (response.stop_reason === 'max_tokens') {
      console.warn('⚠️  Claude response was truncated (max_tokens reached). Output may be incomplete.');
    }

    if (!response.content[0] || response.content[0].type !== 'text') {
      throw new Error('Unexpected Claude API response format');
    }

    const markdown = response.content[0].text;

    if (process.env.DEBUG) {
      console.log('Claude API response (first 500 chars):', markdown.substring(0, 500));
      console.log('Input tokens:', response.usage.input_tokens);
      console.log('Output tokens:', response.usage.output_tokens);
      // claude-sonnet-4-6 pricing: $3/M input, $15/M output
      const cost = ((response.usage.input_tokens * 3 + response.usage.output_tokens * 15) / 1_000_000).toFixed(4);
      console.log('Cost estimate:', cost + ' USD (Sonnet 4.6 rates, May 2026)');
    }

    return markdown;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
}

module.exports = { processCourseMaterial };
