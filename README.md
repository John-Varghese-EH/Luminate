<div align="center">
  <img src="./assets/logo.webp" alt="Luminate Logo" width="120" height="120" />
  <h1>✨ Luminate</h1>
  <p><strong>Intelligence Designed To Evolve Your Learning.</strong></p>
  <p>Transform dense PDF lectures into interactive 3D flashcards and dynamic multiple-choice quizzes in seconds, powered by Gemini AI.</p>
</div>

<br />

<div align="center">
  <img src="https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Gemini_2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini" />
  <img src="https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Firebase_Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
</div>

<br />

Luminate is an enterprise-grade AI study companion designed to solve the active recall problem. By uploading any PDF lecture, slide deck, or reading material, Luminate utilizes the high-speed inference of **Google's Gemini 2.5 Flash** to extract core concepts and automatically generate beautiful, interactive study materials.

## 🚀 Features

- **⚡ Instant PDF Parsing**: Drag and drop any PDF. Luminate parses the text locally and securely streams it to the AI.
- **🧠 3D Interactive Flashcards**: Study with beautiful, physics-based 3D flashcards. They feature a full 180-degree flip animation, inner glow shadows, and a premium glassmorphism aesthetic.
- **🎯 Dynamic AI Quizzes**: Test your knowledge with multiple-choice questions. The quiz engine provides immediate color-coded feedback, scoring, and detailed explanations for every answer to reinforce learning.
- **💎 Award-Winning UI/UX**: Built with G2/G3 continuous curve radii, frosted glass backdrops, ambient neon light meshes, and buttery-smooth Tailwind v4 animations (shimmers, pulses, and reveal effects).
- **🔒 Secure Authentication**: Frictionless onboarding using Firebase Authentication (Google OAuth and Email/Password).
- **⏱️ One-Click Demo Mode**: Don't have a PDF handy? Click "Load Demo Topic" in the dashboard to instantly experience the UI with pre-generated Quantum Computing study materials!

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **AI Engine**: [Google Generative AI](https://ai.google.dev/) (Gemini 2.5 Flash)
- **Auth**: [Firebase Authentication](https://firebase.google.com/)
- **PDF Parsing**: `pdf-parse-fork`
- **Icons**: Font Awesome Pro

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- A Google Gemini API key (from [Google AI Studio](https://aistudio.google.com/))
- A Firebase project with Authentication enabled

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
   Create a `.env.local` file in the root directory and add your keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(Note: Firebase client configuration is currently hardcoded for the challenge environment in `lib/firebase.ts`, but you can replace it with your own config if deploying independently).*

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🧠 AI Architecture (Gemini 2.5 Flash)

Luminate leverages **Gemini 2.5 Flash** because it offers the perfect balance of massive context windows (for large PDFs) and extremely low-latency inference (for near-instant generation).

The backend pipeline (`app/api/generate/route.ts`):
1. **Extraction**: The raw PDF buffer is parsed into string text.
2. **Prompt Engineering**: The text is wrapped in a highly specific system prompt enforcing structured JSON output.
3. **Structured Generation**: We use `responseMimeType: "application/json"` and strict `responseSchema` definitions in the Gemini API call to guarantee the LLM returns exactly the interface our React components expect (Array of Flashcards + Array of Quiz Questions).

## 🎨 Design Philosophy

This project rejects generic templates. It was meticulously designed to feel like a premium, enterprise-level SaaS product:
- **Geometry**: Custom border-radii mapping to iOS-style squircle continuous curves.
- **Lighting**: `mix-blend-screen` ambient background meshes simulate a 3D environment.
- **Motion Physics**: Easing curves (`cubic-bezier(0.23, 1, 0.32, 1)`) are applied to flip, slide, and reveal animations to ensure physics-based, natural movement rather than linear snaps.

---
*Built for the AI Code Submission Challenge.*
