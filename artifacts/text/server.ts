import { smoothStream, streamText } from 'ai';
import { myProvider } from '@/lib/ai/providers';
import { createDocumentHandler } from '@/lib/artifacts/server';
import { updateDocumentPrompt } from '@/lib/ai/prompts';

export const textDocumentHandler = createDocumentHandler<'text'>({
  kind: 'text',
  onCreateDocument: async ({ title, dataStream }) => {
    let draftContent = '';

    // Check if this is an essay coaching workspace
    const essayKeywords = [
      'essay workspace',
      'essay review',
      'essay blueprint',
      'essay development',
      'essay brainstorm',
      'essay outline',
      'essay draft',
      'essay feedback',
      'college essay',
      'personal statement',
      'supplemental essay',
      'application essay',
      'uc piq',
      'common app',
      'why us',
      'why you',
      'academic interest',
    ];

    const isEssayWorkspace = essayKeywords.some((keyword) =>
      title.toLowerCase().includes(keyword),
    );

    const systemPrompt = isEssayWorkspace
      ? 'Create a clean, minimal document workspace for college essay development. Start with basic structure: a main content section for the developing essay outline/ideas, and a notes section at the bottom if needed. Do not write an essay or provide advice - just create the workspace structure.'
      : 'Write about the given topic. Markdown is supported. Use headings wherever appropriate.';

    const { fullStream } = streamText({
      model: myProvider.languageModel('artifact-model'),
      system: systemPrompt,
      experimental_transform: smoothStream({ chunking: 'word' }),
      prompt: isEssayWorkspace
        ? `Create a document structure titled "${title}" with sections for essay development content and notes.`
        : title,
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === 'text-delta') {
        const { textDelta } = delta;

        draftContent += textDelta;

        dataStream.writeData({
          type: 'text-delta',
          content: textDelta,
        });
      }
    }

    return draftContent;
  },
  onUpdateDocument: async ({ document, description, dataStream }) => {
    let draftContent = '';

    const { fullStream } = streamText({
      model: myProvider.languageModel('artifact-model'),
      system: updateDocumentPrompt(document.content, 'text'),
      experimental_transform: smoothStream({ chunking: 'word' }),
      prompt: description,
      experimental_providerMetadata: {
        openai: {
          prediction: {
            type: 'content',
            content: document.content,
          },
        },
      },
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === 'text-delta') {
        const { textDelta } = delta;

        draftContent += textDelta;
        dataStream.writeData({
          type: 'text-delta',
          content: textDelta,
        });
      }
    }

    return draftContent;
  },
});
