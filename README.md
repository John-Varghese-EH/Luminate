<div align="center">
  <img src="./public/assets/logo.svg" alt="Luminate Logo" width="160" height="160" />
  <h1 align="center">✨ Luminate</h1>
  <p align="center">
    <strong>Intelligence Designed To Evolve Your Learning.</strong>
  </p>
  <p align="center">
    An award-winning, premium active recall engine that transforms dense lectures into living, neural knowledge graphs in seconds.
  </p>
</div>

<br />

<div align="center">
  <img src="https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Gemini_2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini" />
  <img src="https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Firebase_Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
</div>

<br />

---

## ⚡ The Problem: Linear Learning is Dead

Traditional study methods—linear reading, passive highlighting, and manually organizing notes—are fundamentally broken. They fail to connect complex concepts, waste hours of time, and result in sub-optimal review timing that leads to memory decay.

## 🌟 The Solution: Luminate AI

**Luminate** is not just another flashcard app. It is an enterprise-grade AI study companion that acts as your personal Socratic tutor. By uploading any PDF lecture, slide deck, or reading material, Luminate utilizes the ultra-fast inference of **Google's Gemini 2.5 Flash** to extract core concepts, synthesize relationships, and automatically generate a premium, interactive curriculum.

---

## 🚀 Why Choose Luminate?

### 1. 🧠 Dynamic Knowledge Synthesis
Don't just extract text—understand context. Luminate builds a multi-dimensional map of your curriculum. Our **Synthesis Pipeline** breaks down dense PDFs into digestible, interconnected nodes of information before you even flip a card.

### 2. 💎 Award-Winning "Premium" Aesthetic
Built with an obsessive focus on UI/UX, combining the sleek minimalism of Apple with the raw, tech-forward creativity of Nothing.
- **Glassmorphism & Fluid Lighting:** Ambient neon meshes (`mix-blend-screen`) simulate a living 3D environment.
- **Physics-Based Motion:** Custom easing curves (`cubic-bezier(0.23, 1, 0.32, 1)`) drive buttery-smooth hover states, reveals, and 180-degree 3D card flips.
- **Continuous Curve Radii:** iOS-style squircles and mathematically perfect paddings.

### 3. 🎯 Socratic AI Tutor & Spaced Repetition
Test your knowledge with dynamic multiple-choice quizzes and interactive flashcards. Luminate provides immediate color-coded feedback, scoring, and detailed explanations for every answer—acting as a Socratic tutor that guides you to the truth without giving it away.

### 4. ⏱️ Frictionless Onboarding
A beautiful side-pane Auth Modal powered by Firebase gets users in instantly. No PDF handy? Click **"Load Demo Topic"** to instantly experience the dashboard with pre-generated Quantum Computing study materials!

---

## 🧠 AI Architecture (Powered by Gemini 2.5)

Luminate leverages **Gemini 2.5 Flash** because it offers the perfect intersection of **massive context windows** (capable of ingesting entire textbooks) and **extremely low-latency inference** (for near-instant UI generation).

**The Backend Pipeline:**
1. **Ingestion & Extraction:** The raw PDF buffer is parsed into string text on the server.
2. **Contextual Prompting:** The text is wrapped in a highly specific system prompt enforcing structured JSON output.
3. **Structured Generation:** We utilize `responseMimeType: "application/json"` and strict `responseSchema` definitions in the Gemini API call. This guarantees that the LLM returns exactly the data structures our React components expect (Array of Flashcards + Array of Quiz Questions) with zero parsing errors.

---

## 🛠️ Tech Stack & Engineering

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Using bleeding-edge `@theme` blocks and custom animations)
- **AI Engine**: [Google Generative AI](https://ai.google.dev/) (Gemini 2.5 Flash API)
- **Authentication**: [Firebase Auth](https://firebase.google.com/) (Google OAuth / Email)
- **PDF Parsing**: `pdf-parse-fork`
- **Icons**: Font Awesome Pro

---

## 📦 Run it Locally

Experience the future of learning on your own machine.

### Prerequisites
- Node.js 18+
- A Google Gemini API key (from [Google AI Studio](https://aistudio.google.com/))
- A Firebase project (Authentication enabled)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/Prompt-War-Android-Club.git
   cd Prompt-War-Android-Club
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(Note: Firebase client configuration is currently configured for the demo environment in `lib/firebase.ts`, but you can replace it with your own config if deploying independently).*

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

<div align="center">
  <h3>Ready to evolve?</h3>
  <p>Luminate was meticulously designed to stand out. We didn't just build an app; we built an experience.</p>
  <br/>
  <i>Built for the AI Code Submission Challenge.</i>
</div>
