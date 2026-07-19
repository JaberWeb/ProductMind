"use client";

import { type ConversationListItem } from "@/services/chat";
import { MessageSquare, Plus, Trash2 } from "lucide-react";

interface ChatSidebarProps {
  conversations: ConversationListItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNewChat: () => void;
  loading: boolean;
}

export function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onDelete,
  onNewChat,
  loading,
}: ChatSidebarProps) {
  return (
    <div className="flex w-72 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-4">
        <button
          onClick={onNewChat}
          className="flex w-full items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700"
        >
          <Plus size={18} />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="space-y-2 p-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-12 animate-shimmer rounded-lg"
              />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-slate-400">
            <MessageSquare
              size={32}
              className="mx-auto mb-2 text-slate-200"
            />
            No conversations yet
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conv) => (
              <div
                key={conv._id}
                className={`group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  activeId === conv._id
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
                onClick={() => onSelect(conv._id)}
              >
                <MessageSquare size={15} className="shrink-0" />
                <span className="flex-1 truncate">{conv.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(conv._id);
                  }}
                  className="shrink-0 rounded-md p-1 text-slate-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
