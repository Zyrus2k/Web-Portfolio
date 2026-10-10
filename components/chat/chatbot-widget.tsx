"use client";

import { Fragment, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Bot, MessageCircle, Minus, Send, Trash2, X } from "lucide-react";
import { contactEmail, socialLinks } from "@/data/portfolio-profile";

type ChatRole = "user" | "assistant";
type ChatMode = "checking" | "demo" | "ai";
type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  isWelcome?: boolean;
};
type ChatTurn = { role: ChatRole; content: string };
type ChatApiResponse = { answer?: unknown; error?: unknown; mode?: unknown };

const welcomeText = "Hi there! 👋 I'm Zyrus AI, your virtual guide to Zyrus's portfolio. I can tell you about his background, technical skills, education, and projects. What would you like to know?";
const suggestedQuestions = [
  "Who is Zyrus?",
  "What projects has he built?",
  "What technologies does he use?",
  "Tell me about his capstone project.",
  "What is his educational background?",
  "How can I contact him?",
];
const allowedLinks = new Set([
  "/#work",
  "/case-study",
  "/#skills",
  "/#education",
  "/#contact",
  `mailto:${contactEmail}`,
  ...socialLinks.map((social) => social.href),
]);

function newMessage(role: ChatRole, text: string, isWelcome = false): ChatMessage {
  return { id: crypto.randomUUID(), role, text, isWelcome };
}

function renderSafeLinks(text: string): ReactNode[] {
  const content: ReactNode[] = [];
  const markdownLink = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let lastIndex = 0;

  for (const match of text.matchAll(markdownLink)) {
    const fullMatch = match[0];
    const label = match[1];
    const href = match[2];
    const matchIndex = match.index ?? 0;
    content.push(text.slice(lastIndex, matchIndex));

    if (allowedLinks.has(href)) {
      const external = href.startsWith("https://");
      content.push(<a key={`${matchIndex}-${href}`} href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>{label}</a>);
    } else {
      content.push(fullMatch);
    }
    lastIndex = matchIndex + fullMatch.length;
  }

  content.push(text.slice(lastIndex));
  return content;
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<ChatMode>("checking");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [newMessage("assistant", welcomeText, true)]);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  const panelWasVisible = useRef(false);
  const showSuggestions = messages.length === 1 && messages[0].isWelcome;
  const showPanel = open && !minimized;

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/chat", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Chat status unavailable");
        return await response.json() as ChatApiResponse;
      })
      .then((result) => setMode(result.mode === "ai" ? "ai" : "demo"))
      .catch(() => {
        if (!controller.signal.aborted) setMode("demo");
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!showPanel) {
      if (panelWasVisible.current) {
        panelWasVisible.current = false;
        launcherRef.current?.focus();
      }
      return;
    }
    const wasPanelVisible = panelWasVisible.current;
    if (!wasPanelVisible) inputRef.current?.focus();
    panelWasVisible.current = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    conversationRef.current?.scrollTo({
      top: conversationRef.current.scrollHeight,
      behavior: reducedMotion || !wasPanelVisible ? "auto" : "smooth",
    });
  }, [showPanel, messages, pending]);

  useEffect(() => {
    if (!open || minimized) return;
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setMinimized(false);
      }
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, minimized]);

  function clearConversation() {
    if (pending) return;
    setMessages([newMessage("assistant", welcomeText, true)]);
    setDraft("");
    setError("");
  }

  async function sendMessage(rawText: string) {
    const question = rawText.trim();
    if (!question || pending) return;
    if (question.length > 1_200) {
      setError("Please keep messages to 1,200 characters or fewer.");
      return;
    }

    const userMessage = newMessage("user", question);
    const priorTurns: ChatTurn[] = messages
      .filter((message) => !message.isWelcome)
      .slice(-10)
      .map(({ role, text }) => ({ role, content: text }));
    const turns = [...priorTurns, { role: "user" as const, content: question }].slice(-12);

    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setError("");
    setPending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: turns }),
      });
      const result = (await response.json()) as ChatApiResponse;
      if (result.mode === "ai" || result.mode === "demo") setMode(result.mode);
      if (!response.ok) {
        const errorMessage = typeof result.error === "string" ? result.error : "The assistant couldn't respond. Please try again later.";
        setError(errorMessage);
        return;
      }
      if (typeof result.answer !== "string" || !result.answer.trim()) {
        setError("The assistant returned an empty reply, so your message could not be answered. Please try again.");
        return;
      }
      setMessages((current) => [...current, newMessage("assistant", result.answer as string)]);
    } catch {
      setError("Zyrus AI couldn't connect, so it couldn't answer your message. Please try again later.");
    } finally {
      setPending(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(draft);
  }

  return <div className="chat-widget">
    {showPanel && <section className="chat-panel" role="dialog" aria-labelledby="chat-title" aria-modal="false">
      <header className="chat-header">
        <div className="chat-header-identity">
          <span className="chat-avatar" aria-hidden="true"><Bot size={19} /></span>
          <div className="chat-heading-copy">
            <h2 id="chat-title">Zyrus AI</h2>
            <p>Your guide to my portfolio</p>
            <span className="chat-knowledge-status"><span aria-hidden="true" />{mode === "demo" ? "Demo mode · portfolio-only answers" : mode === "ai" ? "AI mode · generated replies" : "Checking chat setup"}</span>
          </div>
        </div>
        <div className="chat-header-actions">
          <button className="chat-icon-button" type="button" onClick={() => setMinimized(true)} aria-label="Minimize chat" title="Minimize chat"><Minus size={17} /></button>
          <button className="chat-icon-button" type="button" onClick={() => { setOpen(false); setMinimized(false); }} aria-label="Close chat" title="Close chat"><X size={18} /></button>
        </div>
        <button className="chat-clear-button" type="button" onClick={clearConversation} disabled={pending} aria-label="Clear conversation" title="Clear conversation"><Trash2 size={14} /><span>Clear</span></button>
      </header>

      <div className="chat-conversation" ref={conversationRef} aria-live="polite" aria-relevant="additions text" aria-busy={pending}>
        {messages.map((message) => <article className={`chat-message chat-message-${message.role}`} key={message.id}>
          <span className="chat-message-label">{message.role === "assistant" ? "Zyrus AI" : "You"}</span>
          <p>{renderSafeLinks(message.text).map((part, index) => typeof part === "string" ? <Fragment key={index}>{part}</Fragment> : part)}</p>
        </article>)}
        {showSuggestions && <div className="chat-suggestions" aria-label="Suggested questions">
          <span className="chat-suggestions-label">Try asking</span>
          {suggestedQuestions.map((question) => <button type="button" key={question} onClick={() => void sendMessage(question)}>{question}</button>)}
        </div>}
        {pending && <div className="chat-typing" role="status" aria-label="Zyrus AI is generating a response"><span>Zyrus AI is thinking</span><i /><i /><i /></div>}
        <div className="chat-scroll-anchor" />
      </div>

      {error && <p className="chat-error" role="alert">{error}</p>}
      <form className="chat-input-row" onSubmit={submit}>
        <label className="chat-sr-only" htmlFor="chat-message-input">Message Zyrus AI</label>
        <input
          id="chat-message-input"
          ref={inputRef}
          value={draft}
          onChange={(event) => { setDraft(event.target.value); if (error) setError(""); }}
          placeholder="Ask about my work..."
          maxLength={1_200}
          autoComplete="off"
          disabled={pending}
        />
        <button type="submit" disabled={pending || !draft.trim()} aria-label="Send message" title="Send message"><Send size={17} /></button>
      </form>
      <p className="chat-footer-note">{mode === "demo" ? "Demo mode: replies use portfolio facts only. Add OPENAI_API_KEY for AI-generated answers." : mode === "ai" ? "AI-generated replies are grounded in information from this portfolio." : "Replies are based on information provided in this portfolio."}</p>
    </section>}

    {!showPanel && <div className="chat-launcher-wrap">
      <span className="chat-tooltip" role="tooltip">Chat with Zyrus AI</span>
      <button
        className="chat-launcher"
        ref={launcherRef}
        type="button"
        onClick={() => { setOpen(true); setMinimized(false); }}
        aria-label="Chat with Zyrus AI"
        aria-haspopup="dialog"
        aria-expanded={showPanel}
        title="Chat with Zyrus AI"
      ><MessageCircle size={23} /></button>
    </div>}
  </div>;
}
