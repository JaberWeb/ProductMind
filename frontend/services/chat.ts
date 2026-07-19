const PROXY = "/api/backend-proxy";

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Conversation {
  _id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface ConversationListItem {
  _id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
  messageCount: number;
}

export interface SendMessageResponse {
  response: string;
  conversationId: string;
  title: string;
}

export async function sendMessage(
  message: string,
  conversationId?: string
): Promise<SendMessageResponse> {
  const res = await fetch(`${PROXY}/chat/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, conversationId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Failed to send message");
  }
  return res.json();
}

export async function fetchConversations(): Promise<{
  conversations: ConversationListItem[];
}> {
  const res = await fetch(`${PROXY}/chat/conversations`, { method: "GET" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Failed to fetch conversations");
  }
  return res.json();
}

export async function fetchConversation(
  id: string
): Promise<{ conversation: Conversation }> {
  const res = await fetch(`${PROXY}/chat/conversations/${id}`, {
    method: "GET",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Failed to fetch conversation");
  }
  return res.json();
}

export async function deleteConversation(id: string): Promise<void> {
  const res = await fetch(`${PROXY}/chat/conversations/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Failed to delete conversation");
  }
}
