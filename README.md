# Dan by Haloway – Ethical AI College Essay Coach

**Dan is an ethical, conversational AI assistant that helps students brainstorm, organize, and refine authentic college essays, without writing them for students.**

🔗 [dan.haloway.co](https://dan.haloway.co)

---

## Overview

Dan is a human-centered AI coach built into the [Haloway college essay](https://haloway.co) platform. Unlike typical AI generators, Dan is grounded in academic integrity, offering structured guidance without generating full essay responses. Whether it’s the Common App personal statement or UC PIQs, Dan helps students develop and articulate their ideas while keeping the writing process entirely their own.

---

## Key Features

- **Prompt Recognition**  
  Automatically identifies essay types (e.g., UC PIQs, Common App) and adjusts coaching strategies.

- **Conversational Brainstorming**  
  Uses Socratic-style questioning to prompt self-reflection and help students uncover compelling personal stories.

- **Outline Assistance**  
  Guides students in organizing ideas into a structured, authentic essay outline.

- **Ethical Guardrails**  
  Never writes for the student—emphasizes originality, student ownership, and transparency.

- **Phase-Based Coaching**  
  Five-phase model:  
  `1. Prompt Analysis → 2. Idea Generation → 3. Outline Building → 4. Refining → 5. Polishing`

---

## Tech Stack

| Tech                   | Purpose                                                   |
|------------------------|-----------------------------------------------------------|
| **Next.js 14**         | App Router for routing, server functions, and performance |
| **Vercel AI SDK**      | Handles streaming and prompt handling with Gemini         |
| **chat-sdk Template**  | Provides foundational UI and backend structure for chat   |
| **Gemini API**         | Powers Dan's conversational coaching                      |
| **Neon + Postgres**    | Stores prompts, outlines, and session data                |
| **shadcn/ui + Tailwind CSS** | UI design and accessibility                        |

---

## Getting Started (Local Development)

Dan is based on the Vercel AI Chat-SDK Template. Follow these steps to run the app locally:

```bash
git clone https://github.com/CometBlazer/essay-brainstormer-v1.git
cd essay-brainstormer-v1
npm install
npm run dev
```

Make sure you make a copy of `.env.example` and set up your API keys.

## Challenges

- **Ethical AI Design**  
  Balancing usefulness with integrity—no essay writing, only coaching.

- **Prompt Engineering**  
  Carefully designed prompt templates to maximize reflection, not completion.
