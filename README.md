<div align="center">
  <img src="./public/assets/logo.svg" alt="Luminate Logo" width="160" height="160" />
  <h1 align="center">Luminate</h1>
  <p align="center">
    <strong>Intelligence designed to evolve your learning.</strong>
  </p>
  <p align="center">
    <a href="https://luminate-j0x.firebaseapp.com/"><strong>Live Deployment (HTTPS)</strong></a>
  </p>
</div>

***

## The Vision

Traditional study methods like linear reading, passive highlighting, and manually organizing notes are fundamentally broken. They fail to connect complex concepts, waste hours of time, and result in sub-optimal review timing that leads to memory decay.

Luminate was engineered to transform passive learning and linear consumption into an engaging, multi-modal, and highly retained educational experience. By treating human knowledge absorption as an optimization problem, Luminate accelerates mastery and long-term retention.

## Key Features

Luminate leverages multimodal AI generation to convert static text into a dynamic, interactive curriculum:

* **Automated Extraction:** Instantly ingest heavy PDF documents and plain text into the platform.
* **Multi-Modal Generation:** Automatically generate Spaced Repetition Flashcards, Socratic Quizzes, interactive Knowledge Graphs, conversational Podcasts, and dynamic Slide Presentations from your materials.
* **Socratic AI Feedback:** Luminate's active-recall evaluation engine does not just grade tests, it provides context-aware feedback explaining why an answer is correct or incorrect, acting as a personal tutor.
* **Focus and Flow:** Built-in Pomodoro timers and Quick Note scratchpads keep you in the zone while you absorb complex information.

## Enterprise-Grade Architecture

Luminate is built on a modern, robust, and scalable tech stack:

* **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS v4, Framer Motion for premium fluid micro-interactions.
* **Backend:** Next.js Route Handlers (Serverless API).
* **AI Engine:** Google Gemini 2.5 Flash via `@google/generative-ai` for lightning-fast multimodal intelligence.
* **Database and Auth:** Firebase (Secure HTTP-only OAuth via Google).
* **Performance:** Strict static typing (TypeScript), dynamic component loading, edge caching, and optimized Largest Contentful Paint (LCP).
* **Testing:** Jest and React Testing Library ensuring robust reliability.
* **Security:** Strict CSP headers, comprehensive CORS policies, input validation, and secure credential handling.

## Quick Start

To run Luminate locally and explore the source code:

```bash
# 1. Clone the repository
git clone https://github.com/your-username/Prompt-War-Android-Club.git
cd Prompt-War-Android-Club

# 2. Install dependencies
npm install

# 3. Configure Environment Variables
# Create a .env.local file in the root directory
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env.local

# 4. Start the Development Server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Testing Pipeline

Luminate maintains high code quality standards backed by automated CI/CD.

```bash
# Run the test suite
npm run test

# Run static analysis and linting
npm run lint

# Build for production
npm run build
```

## API Integration

All backend endpoints are fully documented via the OpenAPI 3.0 specification. 
Refer to `swagger.yaml` in the repository root for endpoint schemas, request parameters, and authentication payloads.
