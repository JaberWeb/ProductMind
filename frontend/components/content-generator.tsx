"use client";

import { useEffect, useState, useCallback } from "react";
import { Sparkles, Bot } from "lucide-react";
import { ItemSelector } from "./item-selector";
import { ContentOutput } from "./content-output";
import { ContentHistory } from "./content-history";
import {
  fetchItems,
  generateContent,
  saveContent,
  fetchItemContent,
  type Item,
  type ContentType,
  type Length,
  type Tone,
} from "@/services/content";

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: "title", label: "Title" },
  { value: "description", label: "Description" },
  { value: "short_description", label: "Short Desc" },
  { value: "seo", label: "SEO" },
  { value: "social", label: "Social" },
];

const LENGTHS: { value: Length; label: string }[] = [
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" },
];

const TONES: { value: Tone; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "persuasive", label: "Persuasive" },
];

export function ContentGenerator() {
  const [items, setItems] = useState<Item[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [contentType, setContentType] = useState<ContentType>("title");
  const [length, setLength] = useState<Length>("medium");
  const [tone, setTone] = useState<Tone>("professional");
  const [result, setResult] = useState<string | null>(null);
  const [resultMeta, setResultMeta] = useState<{ contentType: string } | null>(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<Array<{ type: string; content: string; createdAt: string }>>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchItems()
      .then((data) => setItems(data.items))
      .catch(() => {})
      .finally(() => setItemsLoading(false));
  }, []);

  const loadHistory = useCallback(async (itemId: string) => {
    if (!itemId) {
      setHistory([]);
      return;
    }
    setHistoryLoading(true);
    try {
      const data = await fetchItemContent(itemId);
      setHistory(data.generatedContent?.history || []);
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    setResult(null);
    setResultMeta(null);
    setError(null);
    loadHistory(selectedItemId);
  }, [selectedItemId, loadHistory]);

  const handleGenerate = async (isRegenerate = false) => {
    if (!selectedItemId) return;

    setGenerating(true);
    setError(null);
    if (!isRegenerate) {
      setResult(null);
      setResultMeta(null);
    }

    try {
      const data = await generateContent({
        itemId: selectedItemId,
        contentType,
        length,
        tone,
      });
      setResult(data.content);
      setResultMeta({ contentType: data.contentType });
    } catch (err: any) {
      setError(err.message || "Failed to generate content");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!selectedItemId || !result) return;

    setSaving(true);
    setError(null);

    try {
      await saveContent(selectedItemId, contentType, result);
      await loadHistory(selectedItemId);
    } catch (err: any) {
      setError(err.message || "Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  const canGenerate = selectedItemId && !generating;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
          <Bot className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">AI Content Generator</h1>
          <p className="text-sm text-slate-500">Generate product titles, descriptions, SEO copy, and social posts.</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-slate-700">Select Product</label>
          <ItemSelector
            items={items}
            selectedId={selectedItemId}
            onSelect={setSelectedItemId}
            loading={itemsLoading}
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-slate-700">Content Type</label>
          <div className="flex flex-wrap gap-2">
            {CONTENT_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setContentType(t.value)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  contentType === t.value
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Length</label>
            <div className="flex gap-2">
              {LENGTHS.map((l) => (
                <button
                  key={l.value}
                  onClick={() => setLength(l.value)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    length === l.value
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Tone</label>
            <div className="flex gap-2">
              {TONES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTone(t.value)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    tone === t.value
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => handleGenerate(false)}
          disabled={!canGenerate}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles size={18} />
          {generating ? "Generating..." : "Generate"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {result && resultMeta && (
        <ContentOutput
          content={result}
          contentType={resultMeta.contentType}
          onRegenerate={() => handleGenerate(true)}
          onSave={handleSave}
          saving={saving}
          generating={generating}
        />
      )}

      {generating && !result && (
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-12">
          <div className="flex flex-col items-center gap-3 text-sm text-slate-500">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
            Generating content...
          </div>
        </div>
      )}

      <ContentHistory history={history} loading={historyLoading} />
    </div>
  );
}
