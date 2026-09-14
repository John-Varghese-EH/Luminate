"use client";

import { useState } from "react";
type AIProvider = "gemini" | "openai" | "anthropic" | "openrouter" | "ollama" | "compatible";
interface AISettings { provider: AIProvider; apiKey?: string; model?: string; baseUrl?: string; }
const DEFAULT_MODELS: Record<AIProvider, string> = { gemini: "gemini-2.5-flash", openai: "gpt-4.1-mini", anthropic: "claude-sonnet-4-20250514", openrouter: "google/gemini-2.5-flash", ollama: "llama3.2", compatible: "" };

interface SettingsModalProps { isOpen: boolean; onClose: () => void; onSave: (settings: AISettings) => void; initialSettings: AISettings; }

const PROVIDERS: Array<{ id: AIProvider; label: string; detail: string }> = [
  { id: "gemini", label: "Google Gemini", detail: "Fast, structured study sets" },
  { id: "openai", label: "OpenAI", detail: "GPT models" },
  { id: "anthropic", label: "Anthropic", detail: "Claude models" },
  { id: "openrouter", label: "OpenRouter", detail: "One key, many models" },
  { id: "ollama", label: "Ollama (local)", detail: "Private models on your device" },
  { id: "compatible", label: "OpenAI-compatible", detail: "LM Studio, vLLM, or custom server" },
];

export default function SettingsModal({ isOpen, onClose, onSave, initialSettings }: SettingsModalProps) {
  const [settings, setSettings] = useState<AISettings>(initialSettings);
  const [showKey, setShowKey] = useState(false);
  if (!isOpen) return null;
  const local = settings.provider === "ollama";
  const needsUrl = settings.provider === "ollama" || settings.provider === "compatible";
  const defaultUrl = settings.provider === "ollama" ? "http://localhost:11434" : "http://localhost:1234/v1";

  return <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/55 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="ai-settings-title">
    <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/[0.08] rounded-[28px] w-full max-w-xl shadow-2xl relative overflow-hidden max-h-[calc(100dvh-1.5rem)] overflow-y-auto">
      <div className="sticky top-0 z-10 px-5 sm:px-7 py-5 bg-white/90 dark:bg-[#111113]/90 backdrop-blur-xl border-b border-gray-100 dark:border-white/[0.06] flex justify-between items-center">
        <div><h2 id="ai-settings-title" className="text-lg font-bold text-gray-900 dark:text-white">AI workspace</h2><p className="text-xs text-gray-500 dark:text-white/45 mt-0.5">Choose a model provider. Keys last only for this browser tab.</p></div>
        <button onClick={onClose} aria-label="Close AI settings" className="w-9 h-9 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-white/50"><i className="fa-solid fa-xmark" /></button>
      </div>
      <div className="p-5 sm:p-7 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PROVIDERS.map((provider) => <button key={provider.id} type="button" onClick={() => setSettings((current) => ({ ...current, provider: provider.id, model: current.provider === provider.id ? current.model : DEFAULT_MODELS[provider.id], baseUrl: provider.id === "ollama" ? "http://localhost:11434" : provider.id === "compatible" ? "http://localhost:1234/v1" : "" }))} className={`p-3.5 rounded-2xl text-left border transition-all ${settings.provider === provider.id ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-sm" : "border-gray-200 dark:border-white/[0.08] hover:border-blue-300 dark:hover:border-blue-500/40"}`}>
            <div className="flex justify-between items-center gap-2"><span className="font-semibold text-sm text-gray-900 dark:text-white">{provider.label}</span>{settings.provider === provider.id && <i className="fa-solid fa-check text-blue-500 text-xs" />}</div><span className="text-[11px] text-gray-500 dark:text-white/40 mt-1 block">{provider.detail}</span>
          </button>)}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block text-sm font-semibold text-gray-700 dark:text-white/75">Model<input value={settings.model || ""} onChange={(event) => setSettings({ ...settings, model: event.target.value })} placeholder={DEFAULT_MODELS[settings.provider]} className="mt-2 w-full rounded-xl px-3.5 py-3 bg-gray-50 dark:bg-black/25 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25" /></label>
          {needsUrl && <label className="block text-sm font-semibold text-gray-700 dark:text-white/75">Server URL<input value={settings.baseUrl || ""} onChange={(event) => setSettings({ ...settings, baseUrl: event.target.value })} placeholder={defaultUrl} className="mt-2 w-full rounded-xl px-3.5 py-3 bg-gray-50 dark:bg-black/25 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25" /></label>}
        </div>
        {!local && <label className="block text-sm font-semibold text-gray-700 dark:text-white/75">API key<div className="relative mt-2"><input value={settings.apiKey || ""} onChange={(event) => setSettings({ ...settings, apiKey: event.target.value })} type={showKey ? "text" : "password"} autoComplete="off" placeholder="Paste your key" className="w-full rounded-xl px-3.5 py-3 pr-11 bg-gray-50 dark:bg-black/25 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25" /><button type="button" onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" aria-label={showKey ? "Hide API key" : "Show API key"}><i className={`fa-solid ${showKey ? "fa-eye-slash" : "fa-eye"}`} /></button></div></label>}
        <p className="rounded-xl p-3 text-[11px] leading-relaxed bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-200/80 border border-amber-200/70 dark:border-amber-500/15"><i className="fa-solid fa-shield-halved mr-1.5" />Your key is kept only in this tab&apos;s session storage and is sent only with your AI request. Close the tab to remove it. Local servers must allow requests from this app.</p>
      </div>
      <div className="sticky bottom-0 px-5 sm:px-7 py-4 bg-white/90 dark:bg-[#111113]/90 backdrop-blur-xl border-t border-gray-100 dark:border-white/[0.06] flex justify-end gap-3"><button onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-gray-600 dark:text-white/65">Cancel</button><button onClick={() => { onSave({ ...settings, model: settings.model || DEFAULT_MODELS[settings.provider], baseUrl: settings.baseUrl?.trim() }); onClose(); }} className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20">Save AI setup</button></div>
    </div>
  </div>;
}
