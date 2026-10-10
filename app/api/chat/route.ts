import { generateChatReply, type ChatTurn } from "@/lib/chat-provider";
import { generateDemoReply } from "@/lib/demo-chat";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 12_000;
const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 1_200;
const MAX_HISTORY_LENGTH = 7_000;
const RATE_LIMIT = 8;
const RATE_WINDOW_MS = 10 * 60 * 1_000;

const requestsByIp = new Map<string, { count: number; resetAt: number }>();

export async function GET() {
  return jsonResponse({ mode: process.env.OPENAI_API_KEY?.trim() ? "ai" : "demo" }, 200);
}

function jsonResponse(body: object, status: number, headers?: HeadersInit) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

async function readLimitedBody(request: Request): Promise<string | null> {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) return null;
  if (!request.body) return "";

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(body);
}

function takeRateLimitSlot(request: Request): { allowed: boolean; retryAfter: number } {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = request.headers.get("x-real-ip") || forwardedFor || "unknown";
  const now = Date.now();
  for (const [key, value] of requestsByIp) {
    if (value.resetAt <= now) requestsByIp.delete(key);
  }
  const entry = requestsByIp.get(ip);

  if (!entry || entry.resetAt <= now) {
    if (requestsByIp.size >= 1_000) {
      const oldestIp = requestsByIp.keys().next().value;
      if (oldestIp) requestsByIp.delete(oldestIp);
    }
    requestsByIp.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }
  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1_000)) };
  }

  entry.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export async function POST(request: Request) {
  let rawBody: string | null;
  try {
    rawBody = await readLimitedBody(request);
  } catch {
    return jsonResponse({ error: "The request could not be read. Please try again." }, 400);
  }
  if (rawBody === null) {
    return jsonResponse({ error: "That message is too large. Please shorten it and try again." }, 413);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ error: "The chat request was invalid. Please try again." }, 400);
  }

  if (!parsed || typeof parsed !== "object" || !("messages" in parsed) || !Array.isArray(parsed.messages)) {
    return jsonResponse({ error: "The chat request was invalid. Please try again." }, 400);
  }
  if (parsed.messages.length === 0 || parsed.messages.length > MAX_MESSAGES) {
    return jsonResponse({ error: "Please start a new conversation and try again." }, 400);
  }

  const messages: ChatTurn[] = [];
  let totalCharacters = 0;
  for (const item of parsed.messages) {
    if (!item || typeof item !== "object" || !("role" in item) || !("content" in item)) {
      return jsonResponse({ error: "The chat request was invalid. Please try again." }, 400);
    }
    if ((item.role !== "user" && item.role !== "assistant") || typeof item.content !== "string") {
      return jsonResponse({ error: "The chat request was invalid. Please try again." }, 400);
    }

    const content = item.content.trim();
    if (!content || content.length > MAX_MESSAGE_LENGTH) {
      return jsonResponse({ error: "Messages must be between 1 and 1,200 characters." }, 400);
    }
    totalCharacters += content.length;
    if (totalCharacters > MAX_HISTORY_LENGTH) {
      return jsonResponse({ error: "This conversation is too long. Please start a new one." }, 400);
    }
    messages.push({ role: item.role, content });
  }

  if (messages[messages.length - 1].role !== "user") {
    return jsonResponse({ error: "Send a message to continue the conversation." }, 400);
  }

  const rateLimit = takeRateLimitSlot(request);
  if (!rateLimit.allowed) {
    return jsonResponse(
      { error: "You have sent several messages in a short time. Please wait a moment and try again." },
      429,
      { "Retry-After": String(rateLimit.retryAfter) },
    );
  }

  const result = await generateChatReply(messages);
  if (!result.ok) {
    if (result.reason === "not_configured") {
      const question = messages[messages.length - 1].content;
      return jsonResponse({ answer: generateDemoReply(question), mode: "demo" }, 200);
    }
    return jsonResponse({ error: "Zyrus AI could not connect just now, so it could not answer. Please try again shortly." }, 502);
  }

  return jsonResponse({ answer: result.answer, mode: "ai" }, 200);
}
