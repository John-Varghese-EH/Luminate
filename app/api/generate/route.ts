import { NextRequest, NextResponse } from "next/server";
// @ts-expect-error pdf-parse-fork lacks precise types
import pdf from "pdf-parse-fork";
import { generateStudySet, settingsFromRequest } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const rawText = formData.get("text");
    let extractedText = typeof rawText === "string" ? rawText.trim() : "";

    if (!extractedText && file instanceof File) {
      if (file.size > 15 * 1024 * 1024) return NextResponse.json({ error: "Please choose a source smaller than 15 MB." }, { status: 400 });
      const isText = file.type.startsWith("text/") || /\.(txt|md)$/i.test(file.name);
      if (file.type !== "application/pdf" && !isText) return NextResponse.json({ error: "Please upload a PDF, TXT, or Markdown file." }, { status: 400 });
      extractedText = isText ? (await file.text()).trim() : (await pdf(Buffer.from(await file.arrayBuffer()))).text.trim();
    }
    if (extractedText.length < 50) return NextResponse.json({ error: "Add at least 50 readable characters to create a useful study set." }, { status: 400 });

    const studySet = await generateStudySet(settingsFromRequest(req), extractedText);
    return NextResponse.json({ ...studySet, extractedText });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to generate the study set.";
    console.error("Generate API Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
