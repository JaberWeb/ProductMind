"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { MessageCircle, Sparkles } from "lucide-react";
import { ContentGenerator } from "@/components/content-generator";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import {
  sendMessage,
  fetchConversations,
  fetchConversation,
  deleteConversation,
  type Message,
} from "@/services/chat";

type Tab = "chat" | "content";

export default function AIAssistantPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = (searchParams.get("tab") as Tab) || "chat";

  const switchTab = useCallback((t: Tab) => {
    router.replace(`/ai-assistant?tab=${t}`, { scroll: false });
  }, [router]);

  const { data: convData, refetch: refetchConvs, isPending: convLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
  });
  const conversations = convData?.conversations ?? [];

  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);

  const loadConversation = useCallback(async (id: string) => {
    setActiveId(id);
    setSending(false);
    try {
      const data = await fetchConversation(id);
      setMessages(data.conversation.messages);
    } catch {
      setMessages([]);
    }
  }, []);

  const handleNewChat = useCallback(() => {
    setActiveId(null);
    setMessages([]);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteConversation(id);
        if (activeId === id) {
          handleNewChat();
        }
        refetchConvs();
      } catch {
        /* ignore */
      }
    },
    [activeId, handleNewChat, refetchConvs]
  );

  const handleSend = useCallback(
    async (message: string) => {
      setSending(true);
      try {
        const data = await sendMessage(message, activeId || undefined);
        setActiveId(data.conversationId);
        const full = await fetchConversation(data.conversationId);
        setMessages(full.conversation.messages);
        refetchConvs();
      } catch {
        /* ignore */
      } finally {
        setSending(false);
      }
    },
    [activeId, refetchConvs]
  );

  const handleSelectPrompt = useCallback(
    (prompt: string) => {
      handleSend(prompt);
    },
    [handleSend]
  );

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          <button
            onClick={() => switchTab("chat")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              tab === "chat"
                ? "bg-indigo-100 text-indigo-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <MessageCircle size={16} />
            Chat
          </button>
          <button
            onClick={() => switchTab("content")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              tab === "content"
                ? "bg-indigo-100 text-indigo-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Sparkles size={16} />
            Content Generator
          </button>
        </div>
      </div>

      {tab === "chat" ? (
        <div className="flex flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <ChatSidebar
            conversations={conversations}
            activeId={activeId}
            onSelect={loadConversation}
            onDelete={handleDelete}
            onNewChat={handleNewChat}
            loading={convLoading}
          />
          <div className="flex flex-1 flex-col">
            <ChatMessages
              messages={messages}
              loading={sending}
              onSelectPrompt={handleSelectPrompt}
            />
            <ChatInput onSend={handleSend} disabled={sending} />
          </div>
        </div>
      ) : (
        <ContentGenerator />
      )}
    </div>
  );
}
