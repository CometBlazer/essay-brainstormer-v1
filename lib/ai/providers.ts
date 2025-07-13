import { customProvider, wrapLanguageModel } from 'ai';
import { createVertex } from '@ai-sdk/google-vertex';
import { extractReasoningMiddleware } from 'ai';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';
import { isTestEnvironment } from '../constants';

// Create custom vertex instance with direct credentials
const vertex = createVertex({
  project: process.env.GOOGLE_VERTEX_PROJECT || 'snappi-v1',
  location: process.env.GOOGLE_VERTEX_LOCATION || 'us-central1',
  googleAuthOptions: {
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
  },
});

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': vertex('gemini-2.5-flash'),
        'chat-model-reasoning': wrapLanguageModel({
          model: vertex('gemini-2.5-pro'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': vertex('gemini-2.5-flash'),
        'artifact-model': vertex('gemini-2.5-flash'),
      },
      imageModels: {
        'small-model': vertex.image('imagen-3.0-fast-generate-001'),
      },
    });
