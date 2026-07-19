const BASE = "https://api.groq.com/openai/v1";

async function groqRequest(
  messages: Array<{ role: string; content: string }>,
  opts?: { json?: boolean; model?: string; maxTokens?: number }
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is missing");

  const body: any = {
    model: opts?.model || "llama-3.3-70b-versatile",
    messages,
    max_tokens: opts?.maxTokens ?? 4096,
  };

  if (opts?.json) {
    body.response_format = { type: "json_object" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch(`${BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Groq API error (${res.status}): ${err}`);
    }

    const data: any = await res.json();
    return data.choices[0].message.content;
  } finally {
    clearTimeout(timeout);
  }
}

export async function callLLM(
  system: string,
  user: string,
  opts?: { json?: boolean; model?: string; maxTokens?: number }
): Promise<string> {
  return groqRequest(
    [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    opts
  );
}

export async function callLLMChat(
  messages: Array<{ role: string; content: string }>,
  opts?: { json?: boolean; model?: string; maxTokens?: number }
): Promise<string> {
  return groqRequest(messages, opts);
}
