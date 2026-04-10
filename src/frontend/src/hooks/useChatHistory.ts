import { useCallback, useEffect, useState } from "react";
import type {
  Conversation,
  ConversationSummary,
  Message,
  Role,
} from "../types/chat";

const STORAGE_KEY = "caffeine_chat_history";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Conversation[]) : [];
  } catch {
    return [];
  }
}

function saveConversations(conversations: Conversation[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

export function useChatHistory() {
  const [conversations, setConversations] =
    useState<Conversation[]>(loadConversations);

  const persist = useCallback((updated: Conversation[]) => {
    setConversations(updated);
    saveConversations(updated);
  }, []);

  // Sync from storage when another tab changes it
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setConversations(loadConversations());
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const listConversations = useCallback((): ConversationSummary[] => {
    return conversations
      .map((c) => ({
        id: c.id,
        title: c.title,
        createdAt: c.createdAt,
        messageCount: c.messages.length,
      }))
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [conversations]);

  const getConversation = useCallback(
    (id: string): Conversation | undefined => {
      return conversations.find((c) => c.id === id);
    },
    [conversations],
  );

  const createConversation = useCallback(
    (title = "New chat"): Conversation => {
      const now = Date.now();
      const conv: Conversation = {
        id: generateId(),
        title,
        messages: [],
        createdAt: now,
        updatedAt: now,
      };
      persist([conv, ...conversations]);
      return conv;
    },
    [conversations, persist],
  );

  const deleteConversation = useCallback(
    (id: string): void => {
      persist(conversations.filter((c) => c.id !== id));
    },
    [conversations, persist],
  );

  const renameConversation = useCallback(
    (id: string, title: string): void => {
      persist(
        conversations.map((c) =>
          c.id === id ? { ...c, title, updatedAt: Date.now() } : c,
        ),
      );
    },
    [conversations, persist],
  );

  const addMessage = useCallback(
    (conversationId: string, role: Role, content: string): Message => {
      const message: Message = {
        id: generateId(),
        role,
        content,
        timestamp: Date.now(),
      };
      persist(
        conversations.map((c) => {
          if (c.id !== conversationId) return c;
          const messages = [...c.messages, message];
          // Auto-title from first user message
          const title =
            c.messages.length === 0 && role === "user"
              ? content.slice(0, 60) + (content.length > 60 ? "…" : "")
              : c.title;
          return { ...c, messages, title, updatedAt: Date.now() };
        }),
      );
      return message;
    },
    [conversations, persist],
  );

  return {
    conversations,
    listConversations,
    getConversation,
    createConversation,
    deleteConversation,
    renameConversation,
    addMessage,
  };
}
