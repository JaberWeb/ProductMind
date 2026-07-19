# Step Plan 08 — AI Chat Assistant

## Goal

Build the AI chat assistant where users can ask questions about their uploaded store data, with conversation history and contextual answers.

## Depends on

- Step Plan 04 (AI data analysis pipeline)
- Gemini API key configured

## Backend tasks

- [ ] Create `src/routes/chat.ts` — POST `/api/chat/message`
- [ ] Accept: `message`, `conversationId` (optional — creates new if absent), `ownerId`
- [ ] Fetch user's items data summary for context
- [ ] Maintain conversation history in `conversations` collection:
  - `_id`, `ownerId`, `messages[]` (role, content, timestamp), `createdAt`, `updatedAt`
- [ ] Build system prompt with store data context + conversation history
- [ ] Send to Gemini, return response
- [ ] Save assistant response to conversation
- [ ] GET `/api/chat/conversations` — list user's conversations
- [ ] GET `/api/chat/conversations/:id` — get full conversation
- [ ] DELETE `/api/chat/conversations/:id` — delete conversation

## Frontend tasks

- [ ] Create `app/(protected)/ai-assistant/page.tsx` — redesigned as dual view: chat + content generator tabs (or separate page)
- [ ] Chat sidebar: list of past conversations with delete
- [ ] Chat area: message bubbles (user right, assistant left)
- [ ] Input bar: text input + send button
- [ ] Suggested follow-up prompts below assistant messages
- [ ] Loading state: typing indicator dots
- [ ] New chat button
- [ ] Auto-scroll to latest message
- [ ] Empty state: welcome message + suggested starter prompts

## Backend endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/chat/message` | Send message, get AI response |
| GET | `/api/chat/conversations` | List conversations |
| GET | `/api/chat/conversations/:id` | Get conversation detail |
| DELETE | `/api/chat/conversations/:id` | Delete conversation |

## Files to create (backend)
- `src/routes/chat.ts`

## Files to create (frontend)
- `components/chat/chat-sidebar.tsx`
- `components/chat/chat-messages.tsx`
- `components/chat/message-bubble.tsx`
- `components/chat/chat-input.tsx`
- `components/chat/suggested-prompts.tsx`
- `components/chat/typing-indicator.tsx`
- `services/chat.ts`

## Design
- Load `productmind-design` skill
- Chat sidebar: `w-72 border-r border-slate-200 bg-white`, conversation items with delete button
- User bubble: `rounded-2xl rounded-br-sm bg-indigo-600 text-white px-4 py-2.5 max-w-[80%] ml-auto`
- Assistant bubble: `rounded-2xl rounded-bl-sm border border-slate-200 bg-white text-slate-900 px-4 py-2.5 max-w-[80%]`
- Input bar: `border-t border-slate-200 p-4 bg-white`, input with `rounded-xl border border-slate-200`
- Typing indicator: three bouncing dots
- Suggested prompts: pill buttons `rounded-full border border-slate-200 text-sm px-3 py-1.5`

## Verify
- `npm run build` passes both sides
- New conversation: send message, get AI response with store data context
- Follow-up prompts appear
- Conversation history is saved and listable
- Old conversations can be resumed
- Delete removes conversation
