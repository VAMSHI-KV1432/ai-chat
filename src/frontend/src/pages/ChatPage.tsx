import { useActor } from "@caffeineai/core-infrastructure";
import { Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createActor } from "../backend";
import { Layout } from "../components/Layout";
import { MessageBubble } from "../components/MessageBubble";
import { MessageInput } from "../components/MessageInput";
import { TypingIndicator } from "../components/TypingIndicator";
import { useChatHistory } from "../hooks/useChatHistory";
import type { Conversation } from "../types/chat";

const SESSION_KEY_STORAGE = "caffeine_session_key";
const SUGGESTIONS = [
  "Explain quantum computing in simple terms",
  "Write a short poem about the ocean at night",
  "Help me plan a 7-day trip to Japan",
  "Summarize the key ideas in stoic philosophy",
];

function getOrCreateSessionKey(): string {
  let key = localStorage.getItem(SESSION_KEY_STORAGE);
  if (!key) {
    key = `session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(SESSION_KEY_STORAGE, key);
  }
  return key;
}

export default function ChatPage() {
  const { actor, isFetching } = useActor(createActor);
  const {
    listConversations,
    getConversation,
    createConversation,
    deleteConversation,
    renameConversation,
    addMessage,
  } = useChatHistory();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMsgId, setErrorMsgId] = useState<string | null>(null);
  const [lastFailedText, setLastFailedText] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionKey = useRef<string>(getOrCreateSessionKey());

  const conversations = listConversations();
  const activeConversation: Conversation | undefined = activeId
    ? getConversation(activeId)
    : undefined;
  const messageCount = activeConversation?.messages.length ?? 0;

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally tracking count as stable primitive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageCount, isStreaming]);

  const handleNewConversation = useCallback(() => {
    setActiveId(null);
    setInput("");
    setErrorMsgId(null);
    setLastFailedText(null);
  }, []);

  const handleSelectConversation = useCallback((id: string) => {
    setActiveId(id);
    setErrorMsgId(null);
    setLastFailedText(null);
  }, []);

  const handleDeleteConversation = useCallback(
    (id: string) => {
      deleteConversation(id);
      if (activeId === id) setActiveId(null);
    },
    [deleteConversation, activeId],
  );

  const handleRenameConversation = useCallback(
    (id: string, title: string) => {
      renameConversation(id, title);
    },
    [renameConversation],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      setInput("");
      setErrorMsgId(null);
      setLastFailedText(null);

      let convId = activeId;
      if (!convId) {
        const conv = createConversation();
        convId = conv.id;
        setActiveId(convId);
      }

      addMessage(convId, "user", trimmed);
      setIsStreaming(true);

      try {
        let aiReply: string;

        if (actor && !isFetching) {
          // Call real backend — use numeric prefix of the local ID as conversation ID
          const backendConvId = BigInt(convId.split("-")[0]);
          aiReply = await actor.sendMessage(
            sessionKey.current,
            backendConvId,
            trimmed,
          );
        } else {
          // Graceful fallback while actor initializes
          await new Promise((r) => setTimeout(r, 900 + Math.random() * 400));
          aiReply =
            "Connecting to AI backend… Please wait a moment and try again.";
        }

        addMessage(convId, "assistant", aiReply);
        setErrorMsgId(null);
      } catch {
        const errMsg = addMessage(
          convId,
          "assistant",
          "Something went wrong reaching the AI. Please try again.",
        );
        setErrorMsgId(errMsg.id);
        setLastFailedText(trimmed);
      } finally {
        setIsStreaming(false);
      }
    },
    [activeId, isStreaming, createConversation, addMessage, actor, isFetching],
  );

  const handleRetry = useCallback(() => {
    if (!lastFailedText) return;
    setErrorMsgId(null);
    sendMessage(lastFailedText);
  }, [lastFailedText, sendMessage]);

  return (
    <Layout
      conversations={conversations}
      activeConversationId={activeId}
      onSelectConversation={handleSelectConversation}
      onNewConversation={handleNewConversation}
      onDeleteConversation={handleDeleteConversation}
      onRenameConversation={handleRenameConversation}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          {!activeConversation || activeConversation.messages.length === 0 ? (
            <div
              data-ocid="empty-state"
              className="flex flex-col items-center justify-center h-full px-4 py-12 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center mb-5">
                <Zap size={22} className="text-primary" />
              </div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                What can I help with?
              </h2>
              <p className="text-sm text-muted-foreground max-w-xs mb-8">
                Ask me anything — I'm here to help you think, write, and
                explore.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    data-ocid="suggestion-chip"
                    onClick={() => sendMessage(s)}
                    disabled={isStreaming}
                    className="text-left text-xs px-3 py-2.5 rounded-xl border border-border
                      bg-card text-muted-foreground hover:text-foreground hover:border-primary/40
                      hover:bg-muted transition-smooth line-clamp-2
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
              {activeConversation.messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isError={msg.id === errorMsgId}
                  onRetry={msg.id === errorMsgId ? handleRetry : undefined}
                />
              ))}
              {isStreaming && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <MessageInput
          value={input}
          onChange={setInput}
          onSend={sendMessage}
          isLoading={isStreaming}
          disabled={isFetching && !actor}
        />
      </div>
    </Layout>
  );
}
