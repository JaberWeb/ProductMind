"use client";

import { useEffect, useRef } from "react";
import { type Message } from "@/services/chat";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";
import { SuggestedPrompts } from "./suggested-prompts";
import { Bot } from "lucide-react";

interface ChatMessagesProps {
  messages: Message[];
  loading: boolean;
  onSelectPrompt: (prompt: string) => void;
}

export function ChatMessages({
  messages,
  loading,
  onSelectPrompt,
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-lg shadow-indigo-200">
          <Bot className="h-8 w-8 text-white" />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-slate-900">
          How can I help you today?
        </h2>
        <p className="mb-8 max-w-md text-center text-sm text-slate-500">
          Ask me anything about your store data — products, sales, categories,
          or trends.
        </p>
        <SuggestedPrompts onSelect={onSelectPrompt} />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6">
      <div className="mx-auto max-w-3xl space-y-4">
        {messages.map((msg, i) => (
          <MessageBubble key={`${msg.timestamp}-${i}`} message={msg} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />

        {!loading && messages[messages.length - 1]?.role === "assistant" && (
          <div className="pt-2">
            <p className="mb-2 text-xs font-medium text-slate-400">
              Follow-up questions
            </p>
            <SuggestedPrompts onSelect={onSelectPrompt} />
          </div>
        )}
      </div>
    </div>
  );
}
