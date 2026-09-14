import { NextRequest, NextResponse } from "next/server";
import { complete, settingsFromRequest } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { messages, documentContext } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 30 || !messages.every((message) => (message.role === "user" || message.role === "ai") && typeof message.content === "string" && message.content.length <= 20_000)) {
      return NextResponse.json({ error: "Provide a valid conversation." }, { status: 400 });
    }
    const context = typeof documentContext === "string" ? `\n\nGround your help in this study source when relevant:\n${documentContext.slice(0, 30000)}` : "";
    const system = `You are Luminate, a warm Socratic study companion. Help students think: ask a useful question or give a small hint before revealing an answer, unless they explicitly request a direct answer. Be concise, accurate, and use Markdown sparingly.${context}`;
    const response = await complete(settingsFromRequest(req), system, messages);
    return NextResponse.json({ response });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to contact the AI provider.";
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
