/**
 * @jest-environment node
 */

import { POST } from '@/app/api/generate/route';

// Mock pdf-parse-fork
jest.mock('pdf-parse-fork', () => {
  return jest.fn().mockResolvedValue({
    text: 'This is a long enough sample text to pass the minimum character check for PDF parsing validation in the generate API endpoint.',
  });
});

// Mock Google Generative AI
jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: jest.fn().mockResolvedValue({
          response: {
            text: () => JSON.stringify({
              flashcards: [
                { question: 'What is AI?', answer: 'Artificial Intelligence is the simulation of human intelligence by machines.' },
              ],
              quiz: [
                {
                  question: 'What does AI stand for?',
                  options: ['Artificial Intelligence', 'Automated Integration', 'Applied Informatics', 'Abstract Inference'],
                  correctAnswer: 'Artificial Intelligence',
                  explanation: 'AI stands for Artificial Intelligence.',
                },
              ],
            }),
          },
        }),
      }),
    })),
    SchemaType: {
      OBJECT: 'OBJECT',
      ARRAY: 'ARRAY',
      STRING: 'STRING',
    },
  };
});

describe('POST /api/generate', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, GEMINI_API_KEY: 'test-api-key' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return 400 when no file is provided', async () => {
    const formData = new FormData();
    const request = new Request('http://localhost/api/generate', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request as never);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('No file provided');
  });

  it('should return 400 when PDF has no readable text', async () => {
    const pdfParse = require('pdf-parse-fork');
    pdfParse.mockResolvedValueOnce({ text: 'short' });

    const file = new File(['fake-pdf'], 'test.pdf', { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('file', file);

    const request = new Request('http://localhost/api/generate', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request as never);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('No readable text');
  });

  it('should return 500 when API key is not configured', async () => {
    delete process.env.GEMINI_API_KEY;

    const file = new File(['fake-pdf-content'], 'test.pdf', { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('file', file);

    const request = new Request('http://localhost/api/generate', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request as never);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('API key not configured');
  });

  it('should successfully generate flashcards and quiz', async () => {
    const file = new File(['valid-pdf-content'], 'test.pdf', { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('file', file);

    const request = new Request('http://localhost/api/generate', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request as never);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.flashcards).toBeDefined();
    expect(data.flashcards).toHaveLength(1);
    expect(data.flashcards[0].question).toBe('What is AI?');
    expect(data.quiz).toBeDefined();
    expect(data.quiz).toHaveLength(1);
    expect(data.quiz[0].correctAnswer).toBe('Artificial Intelligence');
  });

  it('should return quiz with exactly 4 options per question', async () => {
    const file = new File(['valid-pdf-content'], 'test.pdf', { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('file', file);

    const request = new Request('http://localhost/api/generate', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request as never);
    const data = await response.json();

    data.quiz.forEach((q: { options: string[] }) => {
      expect(q.options).toHaveLength(4);
    });
  });
});
