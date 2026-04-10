import { MessageSquare, PenSquare } from "lucide-react";
import { useState } from "react";
import type { ConversationSummary } from "../types/chat";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  conversations: ConversationSummary[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, title: string) => void;
  children: React.ReactNode;
}

export function Layout({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
  children,
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activeConv = conversations.find((c) => c.id === activeConversationId);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={onSelectConversation}
        onNewConversation={onNewConversation}
        onDeleteConversation={onDeleteConversation}
        onRenameConversation={onRenameConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 h-screen">
        {/* Top bar */}
        <header
          data-ocid="main-header"
          className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card shrink-0"
        >
          <button
            type="button"
            data-ocid="toggle-sidebar-btn"
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
            aria-label="Toggle sidebar"
          >
            <MessageSquare size={18} />
          </button>
          <h1 className="font-display text-sm font-semibold text-foreground tracking-wide truncate">
            {activeConv ? activeConv.title : "Chat"}
          </h1>
          <div className="flex-1" />
          <button
            type="button"
            data-ocid="new-chat-header-btn"
            onClick={onNewConversation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
              bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth"
          >
            <PenSquare size={13} />
            New chat
          </button>
        </header>

        {/* Chat area */}
        <main className="flex-1 min-h-0 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
