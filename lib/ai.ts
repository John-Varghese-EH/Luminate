import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import type { NextRequest } from "next/server";

export type AIProvider = "gemini" | "openai" | "anthropic" | "openrouter" | "ollama" | "compatible";

export interface AISettings {
  provider: AIProvider;
  apiKey?: string;
  model?: string;
  baseUrl?: string;
}

export const DEFAULT_MODELS: Record<AIProvider, string> = {
  gemini: "gemini-2.5-flash",
  openai: "gpt-4.1-mini",
  anthropic: "claude-sonnet-4-20250514",
  openrouter: "google/gemini-2.5-flash",
  ollama: "llama3.2",
  compatible: "",
};

export function settingsFromRequest(req: NextRequest): AISettings {
  const provider = (req.headers.get("x-luminate-provider") || "gemini") as AIProvider;
  const supported = Object.keys(DEFAULT_MODELS).includes(provider) ? provider : "gemini";
  return {
    provider: supported,
    apiKey: req.headers.get("x-luminate-api-key") || undefined,
    model: req.headers.get("x-luminate-model") || undefined,
    baseUrl: req.headers.get("x-luminate-base-url") || undefined,
  };
}

function cleanBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/$/, "");
}

function safeBaseUrl(baseUrl: string, allowLocal = false) {
  let url: URL;
  try { url = new URL(baseUrl); } catch { throw new Error("Enter a valid AI provider URL."); }
  if (url.username || url.password || url.hash) throw new Error("AI provider URLs cannot include credentials or fragments.");
  const localhost = ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  if (localhost && allowLocal && (url.protocol === "http:" || url.protocol === "https:")) return cleanBaseUrl(url.toString());
  if (url.protocol !== "https:") throw new Error("Use HTTPS for remote AI providers. Only local models may use HTTP.");
  if (/^(10\.|127\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(url.hostname)) throw new Error("Private network provider URLs are not allowed.");
  return cleanBaseUrl(url.toString());
}

function contentFromOpenAI(data: unknown) {
  const value = data as { choices?: Array<{ message?: { content?: string } }> };
  return value.choices?.[0]?.message?.content || "";
}

function parseJson(text: string) {
  const unwrapped = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  return JSON.parse(unwrapped);
}

async function responseOrThrow(response: Response) {
  if (response.ok) return response.json();
  const detail = await response.text();
  throw new Error(detail || `AI provider returned ${response.status}`);
}

export async function complete(settings: AISettings, system: string, messages: Array<{ role: "user" | "ai"; content: string }>) {
  const model = settings.model || DEFAULT_MODELS[settings.provider];
  const apiKey = settings.apiKey || (settings.provider === "gemini" ? process.env.GEMINI_API_KEY : undefined);
  if (!apiKey && settings.provider !== "ollama") throw new Error("Add an API key in AI settings before generating study material.");

  if (settings.provider === "gemini") {
    const client = new GoogleGenerativeAI(apiKey!);
    const gemini = client.getGenerativeModel({ model, systemInstruction: system });
    let history = messages.slice(0, -1).map((message) => ({ role: message.role === "ai" ? "model" : "user", parts: [{ text: message.content }] }));
    if (history.length > 0 && history[0].role === "model") {
      history = [{ role: "user", parts: [{ text: "Hello." }] }, ...history];
    }
    const result = await gemini.startChat({ history }).sendMessage(messages.at(-1)?.content || "");
    return result.response.text();
  }

  if (settings.provider === "anthropic") {
    const response = await fetch(`${safeBaseUrl(settings.baseUrl || "https://api.anthropic.com")}/v1/messages`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": apiKey!, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model, max_tokens: 4096, system, messages: messages.map((message) => ({ role: message.role === "ai" ? "assistant" : "user", content: message.content })) }),
    });
    const data = await responseOrThrow(response) as { content?: Array<{ text?: string }> };
    return data.content?.map((part) => part.text || "").join("") || "";
  }

  if (settings.provider === "ollama") {
    const response = await fetch(`${safeBaseUrl(settings.baseUrl || "http://localhost:11434", true)}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ model, stream: false, messages: [{ role: "system", content: system }, ...messages.map((message) => ({ role: message.role === "ai" ? "assistant" : "user", content: message.content }))] }),
    });
    const data = await responseOrThrow(response) as { message?: { content?: string } };
    return data.message?.content || "";
  }

  const baseUrl = settings.baseUrl || (settings.provider === "openrouter" ? "https://openrouter.ai/api/v1" : settings.provider === "openai" ? "https://api.openai.com/v1" : "");
  if (!baseUrl) throw new Error("Add the base URL for your OpenAI-compatible provider.");
  const response = await fetch(`${safeBaseUrl(baseUrl, settings.provider === "compatible")}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${apiKey!}` },
    body: JSON.stringify({ model, temperature: 0.3, messages: [{ role: "system", content: system }, ...messages.map((message) => ({ role: message.role === "ai" ? "assistant" : "user", content: message.content }))] }),
  });
  const text = contentFromOpenAI(await responseOrThrow(response));
  if (!text) throw new Error("The AI provider returned an empty response.");
  return text;
}

export async function generateStudySet(settings: AISettings, text: string) {
  const system = "You are Luminate, an expert study coach. Return only valid JSON: {flashcards:[{question,answer}],quiz:[{question,options,correctAnswer,explanation}],podcastScript:[{speaker,text}]}. Use 6-10 precise flashcards, five four-option questions, and a concise two-host overview. Never use markdown fences.";
  if (settings.provider === "gemini") {
    const apiKey = settings.apiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Add an API key in AI settings before generating study material.");
    const model = settings.model || DEFAULT_MODELS.gemini;
    const client = new GoogleGenerativeAI(apiKey);
    const result = await client.getGenerativeModel({ model, generationConfig: { responseMimeType: "application/json", responseSchema: { type: SchemaType.OBJECT, properties: { flashcards: { type: SchemaType.ARRAY, items: { type: SchemaType.OBJECT, properties: { question: { type: SchemaType.STRING }, answer: { type: SchemaType.STRING } }, required: ["question", "answer"] } }, quiz: { type: SchemaType.ARRAY, items: { type: SchemaType.OBJECT, properties: { question: { type: SchemaType.STRING }, options: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }, correctAnswer: { type: SchemaType.STRING }, explanation: { type: SchemaType.STRING } }, required: ["question", "options", "correctAnswer", "explanation"] } }, podcastScript: { type: SchemaType.ARRAY, items: { type: SchemaType.OBJECT, properties: { speaker: { type: SchemaType.STRING }, text: { type: SchemaType.STRING } }, required: ["speaker", "text"] } } }, required: ["flashcards", "quiz", "podcastScript"] } } }).generateContent(`${system}\n\nStudy source:\n${text.slice(0, 30000)}`);
    return parseJson(result.response.text());
  }
  return parseJson(await complete(settings, system, [{ role: "user", content: `Study source:\n${text.slice(0, 30000)}` }]));
}

/**
 * Configuration schema for presentation slide styles.
 */
export interface StyleConfig {
  id: string;
  name: string;
  description?: string;
  design_system?: {
    global_style?: {
      theme?: string;
    };
  };
  slide_layout_templates?: Array<{ type: string; usage: string }>;
}

/**
 * Generates structured presentation slides using the Gemini 2.5 Flash model.
 * Enforces output to match the allowed layouts defined in the provided style.
 * 
 * @param {AISettings} settings - The user's AI API configuration.
 * @param {string} text - The source document content.
 * @param {StyleConfig} styleDef - The visual style constraints for the presentation.
 * @returns {Promise<any>} A JSON object containing an array of generated slides.
 * @throws {Error} Throws an error if the generation or parsing fails.
 */
export async function generatePresentation(settings: AISettings, text: string, styleDef: StyleConfig) {
  const layoutsList = styleDef.slide_layout_templates?.map((l: { type: string; usage: string }) => `- ${l.type}: ${l.usage}`).join('\n') || '';
  
  const system = `You are a professional presentation designer and copywriter. Generate a presentation based on the provided text, strictly following the selected visual style.
  
Style constraints:
Theme: ${styleDef.design_system?.global_style?.theme || 'Professional'}
Allowed Layout Types:
${layoutsList}

Return ONLY valid JSON with this schema:
{
  "slides": [
    {
      "layoutType": "exact string matching one of the Allowed Layout Types",
      "title": "Slide Title",
      "content": ["bullet point 1", "bullet point 2"],
      "speakerNotes": "Brief notes for the presenter"
    }
  ]
}
Ensure the presentation has between 5 and 10 slides, capturing the key essence of the source material. Never use markdown fences for the output.`;

  if (settings.provider === "gemini") {
    const apiKey = settings.apiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Add an API key in AI settings before generating presentations.");
    const model = settings.model || DEFAULT_MODELS.gemini;
    const client = new GoogleGenerativeAI(apiKey);
    
    const result = await client.getGenerativeModel({
      model,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            slides: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  layoutType: { type: SchemaType.STRING },
                  title: { type: SchemaType.STRING },
                  content: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                  speakerNotes: { type: SchemaType.STRING }
                },
                required: ["layoutType", "title", "content", "speakerNotes"]
              }
            }
          },
          required: ["slides"]
        }
      }
    }).generateContent(`${system}\n\nStudy source:\n${text.slice(0, 30000)}`);
    
    return parseJson(result.response.text());
  }
  
  return parseJson(await complete(settings, system, [{ role: "user", content: `Study source:\n${text.slice(0, 30000)}` }]));
}
