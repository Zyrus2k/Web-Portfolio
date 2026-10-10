import { assistantInstructions } from "@/lib/portfolio-knowledge";

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

type ChatResult =
  | { ok: true; answer: string }
  | { ok: false; reason: "not_configured" | "unavailable" };

type OpenAIResponse = {
  output_text?: unknown;
  output?: Array<{
    content?: Array<{ type?: string; text?: string }>;
  }>;
};

export async function generateChatReply(messages: ChatTurn[]): Promise<ChatResult> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return { ok: false, reason: "not_configured" };

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini",
        instructions: assistantInstructions,
        input: messages,
        max_output_tokens: 450,
        store: false,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(25_000),
    });

    if (!response.ok) return { ok: false, reason: "unavailable" };

    const result = (await response.json()) as OpenAIResponse;
    const outputText = typeof result.output_text === "string"
      ? result.output_text
      : result.output
        ?.flatMap((item) => item.content ?? [])
        .filter((item) => item.type === "output_text" && typeof item.text === "string")
        .map((item) => item.text)
        .join("\n");
    const answer = outputText?.trim();

    return answer ? { ok: true, answer } : { ok: false, reason: "unavailable" };
  } catch {
    return { ok: false, reason: "unavailable" };
  }
}
