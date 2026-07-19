"use client";

import { type Message } from "@/services/chat";
import { Bot, User } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""} animate-fade-up`}
      style={{ animationDelay: "0.05s" }}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-indigo-100 text-indigo-600"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {isUser ? <User size={15} /> : <Bot size={15} />}
      </div>
      <div
        className={`${
          isUser
            ? "rounded-2xl rounded-br-sm bg-indigo-600 text-white"
            : "rounded-2xl rounded-bl-sm border border-slate-200 bg-white text-slate-900"
        } max-w-[80%] px-4 py-2.5 text-sm leading-relaxed shadow-sm`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <p
          className={`mt-1 text-[10px] ${
            isUser ? "text-indigo-200" : "text-slate-400"
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
