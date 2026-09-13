import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array format." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("DEVELOPMENT ERROR: GEMINI_API_KEY is not set in the environment.");
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: "You are Luminate AI, a supportive and highly intelligent Socratic tutor. Your goal is to guide the student to the answer by asking thought-provoking questions, providing hints, and explaining concepts simply. Do NOT just give them the direct answer unless they are completely stuck. Use a warm, encouraging tone.",
    });

    // Format messages for Gemini SDK (model vs user)
    const formattedHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    const latestMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(latestMessage);
    const responseText = result.response.text();

    return NextResponse.json({ response: responseText });

  } catch (error: unknown) {
    console.error("DEVELOPMENT ERROR [Socratic Chat API]:", error);
    const msg = error instanceof Error ? error.message : "Internal server error connecting to AI.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
