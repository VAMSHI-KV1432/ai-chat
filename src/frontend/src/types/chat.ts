export type Role = "user" | "assistant";

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface ConversationSummary {
  id: string;
  title: string;
  createdAt: number;
  messageCount: number;
}
