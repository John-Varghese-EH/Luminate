"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function EssayFeedback() {
  const [essay, setEssay] = useState("");
  const [isGrading, setIsGrading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGrade = async () => {
    if (!essay.trim()) return;
    setIsGrading(true);
    setFeedback(null);
    setError(null);

    try {
      const apiKey = localStorage.getItem("gemini_api_key") || "";
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "x-gemini-api-key": apiKey } : {})
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `You are an expert academic writing coach. Analyze the following essay/notes and provide detailed, structured feedback using Markdown. Include:

## 📊 Overall Score
Give a score out of 10 with a brief justification.

## ✅ Strengths
List what the essay does well.

## ⚠️ Areas for Improvement
List specific weaknesses with suggestions.

## 🔍 Missing Concepts
Identify any important concepts or arguments that are absent.

## ✍️ Writing Quality
Comment on grammar, clarity, structure, and flow.

## 💡 Suggestions
Provide 3 actionable next steps to improve this work.

---

Here is the text to analyze:

${essay}`
            }
          ]
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to grade essay");

      setFeedback(data.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <div className="bg-white/90 dark:bg-gradient-to-b dark:from-[#18181b]/90 dark:to-[#09090b]/90 backdrop-blur-2xl border border-gray-200/50 dark:border-white/10 rounded-[32px] p-6 sm:p-8 md:p-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] shadow-lg dark:shadow-[0_0_80px_-20px_rgba(168,85,247,0.15)] transition-colors relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 blur-[120px] opacity-5 dark:opacity-10 rounded-full pointer-events-none"></div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 flex items-center justify-center">
          <i className="fa-solid fa-feather text-purple-500"></i>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Essay & Notes Feedback</h3>
          <p className="text-[12px] text-gray-500 dark:text-white/40">AI-powered structural analysis, grading, and improvement suggestions</p>
        </div>
      </div>

      <textarea
        id="essay-feedback-input"
        name="essay-text"
        value={essay}
        onChange={(e) => setEssay(e.target.value)}
        placeholder="Paste your essay, study notes, or written assignment here..."
        className="w-full h-48 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-2 border-gray-200 dark:border-white/10 rounded-[24px] p-4 text-gray-900 dark:text-white text-[14px] focus:outline-none focus:border-purple-400 dark:focus:border-purple-500/50 focus:shadow-[0_0_30px_-10px_rgba(168,85,247,0.2)] resize-none mt-4 mb-4 transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-white/30"
      />

      <div className="flex items-center justify-between">
        <span className="text-[11px] text-gray-400 dark:text-white/30 font-medium">
          {essay.length > 0 ? `${essay.split(/\s+/).filter(Boolean).length} words` : 'No text entered'}
        </span>
        <button
          onClick={handleGrade}
          disabled={isGrading || !essay.trim()}
          className="px-6 sm:px-8 py-2.5 sm:py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-40 disabled:hover:from-purple-500 disabled:hover:to-pink-500 text-white rounded-[16px] font-bold text-sm transition-all duration-300 active:scale-[0.97] flex items-center gap-2 shadow-[0_8px_20px_-6px_rgba(168,85,247,0.5)] hover:-translate-y-0.5"
        >
          {isGrading ? (
            <>
              <i className="fa-solid fa-spinner animate-spin text-xs"></i> Analyzing...
            </>
          ) : (
            <>
              <i className="fa-solid fa-wand-magic-sparkles text-xs"></i> Get Feedback
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
          <i className="fa-solid fa-circle-exclamation mr-2"></i>
          {error}
        </div>
      )}

      {feedback && (
        <div className="mt-8 p-6 rounded-2xl bg-gray-50 dark:bg-[#18181b] border border-gray-200 dark:border-white/[0.06] transition-colors">
          <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-chart-line text-purple-500"></i>
            AI Analysis
          </h4>
          <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-a:text-blue-500 prose-strong:text-gray-900 dark:prose-strong:text-white">
            <ReactMarkdown>{feedback}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
