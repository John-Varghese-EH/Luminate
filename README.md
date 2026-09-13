# Luminate

Transform dense lecture PDFs into structured study materials with AI-powered summaries, flashcards, and key terminology.

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with Firestore and Authentication enabled
- A Google Gemini API key (from Google AI Studio)

### Setup

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Copy the environment template and fill in your credentials:

```bash
cp .env.example .env.local
```

3. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Database**: Firebase Cloud Firestore
- **Auth**: Firebase Authentication
- **AI**: Google Gemini API
- **Icons**: lucide-react
