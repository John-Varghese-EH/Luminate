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

    const customApiKey = req.headers.get("x-gemini-api-key");
    const apiKey = customApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("DEVELOPMENT ERROR: GEMINI_API_KEY is not set in the environment and no custom key provided.");
      return NextResponse.json({ error: "API key not configured. Please add one in Settings." }, { status: 401 });
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
            podcastScript: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  speaker: { type: SchemaType.STRING },
                  text: { type: SchemaType.STRING },
                },
                required: ["speaker", "text"],
              },
            },
          },
          required: ["flashcards", "quiz", "podcastScript"],
        },
      },
    });

    const prompt = `
      You are an expert educator and podcast producer. Generate three things from the provided text:
      1. 5-10 educational flashcards.
      2. A 5-question multiple choice quiz.
      3. A conversational "Podcast Script" (Audio Overview) between Host 1 and Host 2 discussing the material.

      Quality Rules:
      - Quiz questions must test deep conceptual understanding.
      - The podcast script should be engaging, conversational, and accurately reflect the core concepts in the text. Host 1 is usually the main guide, and Host 2 asks insightful questions or provides analogies.
      
      Text: ${extractedText.substring(0, 30000)} // Truncating to avoid massive token limits if PDF is huge
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse the strict JSON output
    const data = JSON.parse(responseText);

    return NextResponse.json({
      ...data,
      extractedText, // Send extracted text back for grounding
    });
  } catch (error: unknown) {
    console.error("Generate API Error:", error);
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
