import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
// @ts-expect-error pdf-parse-fork lacks precise types
import pdf from "pdf-parse-fork";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const rawText = formData.get("text") as string | null;

    let extractedText = "";

    if (rawText && rawText.trim().length > 0) {
      extractedText = rawText.trim();
    } else if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      try {
        const pdfData = await pdf(buffer);
        extractedText = pdfData.text.trim();
      } catch (err) {
        console.error("DEVELOPMENT ERROR [PDF Parser]:", err);
        return NextResponse.json({ error: "Failed to parse PDF document." }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: "No file or text provided." }, { status: 400 });
    }

    if (!extractedText || extractedText.length < 50) {
      return NextResponse.json({ error: "Not enough readable text found. Please provide more content." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("DEVELOPMENT ERROR: GEMINI_API_KEY is not set in the environment.");
      return NextResponse.json({ error: "API key not configured." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            flashcards: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  question: { type: SchemaType.STRING },
                  answer: { type: SchemaType.STRING },
                },
                required: ["question", "answer"],
              },
            },
            quiz: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  question: { type: SchemaType.STRING },
                  options: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING },
                  },
                  correctAnswer: { type: SchemaType.STRING },
                  explanation: { type: SchemaType.STRING },
                },
                required: ["question", "options", "correctAnswer", "explanation"],
              },
            },
          },
          required: ["flashcards", "quiz"],
        },
      },
    });

    const prompt = `
      You are an expert educator. Generate 5-10 educational flashcards and a 5-question multiple choice quiz from the provided text.
      
      Quality Rules:
      - Questions must test deep conceptual understanding, not just rote memorization.
      - Answers/explanations must be concise, accurate, and highly educational.
      - Each quiz question must have exactly 4 plausible options, and one 'correctAnswer' exactly matching one of the options.
      - Target the most important learning objectives in the text.
      
      Text: ${extractedText.substring(0, 30000)} // Truncating to avoid massive token limits if PDF is huge
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse the strict JSON output
    const data = JSON.parse(responseText);

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Generate API Error:", error);
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
