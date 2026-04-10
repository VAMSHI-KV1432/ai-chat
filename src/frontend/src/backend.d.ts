import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type ConversationId = bigint;
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface ConversationPublic {
    id: ConversationId;
    title: string;
    sessionKey: SessionKey;
    messages: Array<Message>;
    createdAt: Timestamp;
}
export type SessionKey = string;
export interface Message {
    content: string;
    role: Role;
    timestamp: Timestamp;
}
export interface ConversationSummary {
    id: ConversationId;
    title: string;
    createdAt: Timestamp;
    messageCount: bigint;
}
export interface http_header {
    value: string;
    name: string;
}
export enum Role {
    user = "user",
    assistant = "assistant"
}
export interface backendInterface {
    createConversation(sessionKey: SessionKey, title: string): Promise<ConversationId>;
    deleteConversation(sessionKey: SessionKey, id: ConversationId): Promise<boolean>;
    getConversation(sessionKey: SessionKey, id: ConversationId): Promise<ConversationPublic | null>;
    listConversations(sessionKey: SessionKey): Promise<Array<ConversationSummary>>;
    renameConversation(sessionKey: SessionKey, id: ConversationId, newTitle: string): Promise<boolean>;
    sendMessage(sessionKey: SessionKey, conversationId: ConversationId, content: string): Promise<string>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
