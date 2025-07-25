import {
  customProvider,
  wrapLanguageModel,
  extractReasoningMiddleware,
} from 'ai';
import { createVertex } from '@ai-sdk/google-vertex';
// import {
//   artifactModel,
//   chatModel,
//   reasoningModel,
//   titleModel,
// } from './models.test';
// import { isTestEnvironment } from '../constants';

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

export const myProvider = customProvider({
  languageModels: {
    'chat-model': vertex('gemini-2.5-pro'),
    'chat-model-reasoning': wrapLanguageModel({
      model: vertex('gemini-2.5-pro'),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
    'title-model': vertex('gemini-2.5-flash'),
    'artifact-model': vertex('gemini-2.5-pro'),
  },
  imageModels: {
    'small-model': vertex.image('imagen-3.0-fast-generate-001'),
  },
});
