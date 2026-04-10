import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Check, MessageSquare, Pencil, Plus, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ConversationSummary } from "../types/chat";

interface SidebarProps {
  conversations: ConversationSummary[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, title: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

interface ConversationItemProps {
  conv: ConversationSummary;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}

function ConversationItem({
  conv,
  isActive,
  onSelect,
  onDelete,
  onRename,
}: ConversationItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(conv.title);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const startEdit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setEditValue(conv.title);
      setIsEditing(true);
    },
    [conv.title],
  );

  const confirmRename = useCallback(() => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== conv.title) {
      onRename(conv.id, trimmed);
    }
    setIsEditing(false);
  }, [editValue, conv.id, conv.title, onRename]);

  const cancelEdit = useCallback(() => {
    setEditValue(conv.title);
    setIsEditing(false);
  }, [conv.title]);

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") confirmRename();
      if (e.key === "Escape") cancelEdit();
    },
    [confirmRename, cancelEdit],
  );

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    onDelete(conv.id);
    setShowDeleteDialog(false);
  }, [onDelete, conv.id]);

  return (
    <>
      <button
        type="button"
        data-ocid={`conv-item-${conv.id}`}
        className={`
          group relative w-full flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
          transition-smooth text-sm text-left
          ${
            isActive
              ? "bg-primary/10 border border-primary/25 text-foreground"
              : "border border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          }
        `}
        onClick={() => !isEditing && onSelect(conv.id)}
        aria-current={isActive ? "true" : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <MessageSquare
          size={13}
          className={`shrink-0 transition-smooth ${isActive ? "text-primary" : "opacity-50"}`}
        />

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              ref={inputRef}
              data-ocid={`rename-input-${conv.id}`}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              onBlur={confirmRename}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-transparent text-xs text-foreground outline-none border-b border-primary/60 pb-0.5 font-body"
              aria-label="Rename conversation"
            />
          ) : (
            <p
              className={`truncate font-body text-xs leading-snug ${isActive ? "text-foreground font-medium" : ""}`}
            >
              {conv.title}
            </p>
          )}
          <div className="flex items-center gap-1.5 mt-0.5">
            <p className="text-[10px] text-muted-foreground/50">
              {timeAgo(conv.createdAt)}
            </p>
            {conv.messageCount > 0 && (
              <span className="text-[10px] text-muted-foreground/40">
                · {conv.messageCount} {conv.messageCount === 1 ? "msg" : "msgs"}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons — visible on hover or editing */}
        {(isHovered || isActive) && !isEditing && (
          <div
            className="flex items-center gap-0.5 shrink-0"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            aria-label="Conversation actions"
          >
            <button
              type="button"
              data-ocid={`rename-btn-${conv.id}`}
              onClick={startEdit}
              aria-label="Rename conversation"
              className="p-1 rounded text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-smooth"
            >
              <Pencil size={11} />
            </button>
            <button
              type="button"
              data-ocid={`delete-btn-${conv.id}`}
              onClick={handleDeleteClick}
              aria-label="Delete conversation"
              className="p-1 rounded text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-smooth"
            >
              <Trash2 size={11} />
            </button>
          </div>
        )}

        {/* Editing confirm/cancel */}
        {isEditing && (
          <div
            className="flex items-center gap-0.5 shrink-0"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              data-ocid={`rename-confirm-${conv.id}`}
              onClick={confirmRename}
              aria-label="Confirm rename"
              className="p-1 rounded text-primary hover:bg-primary/10 transition-smooth"
            >
              <Check size={11} />
            </button>
            <button
              type="button"
              data-ocid={`rename-cancel-${conv.id}`}
              onClick={(e) => {
                e.stopPropagation();
                cancelEdit();
              }}
              aria-label="Cancel rename"
              className="p-1 rounded text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-smooth"
            >
              <X size={11} />
            </button>
          </div>
        )}
      </button>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent
          className="border-border bg-popover text-foreground"
          data-ocid={`delete-dialog-${conv.id}`}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-foreground">
              Delete conversation?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              "{conv.title}" will be permanently deleted. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              data-ocid={`delete-cancel-${conv.id}`}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid={`delete-confirm-${conv.id}`}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function Sidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-background/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          role="button"
          tabIndex={-1}
          aria-label="Close sidebar"
        />
      )}

      <aside
        data-ocid="sidebar-nav"
        className={`
          fixed inset-y-0 left-0 z-30 flex flex-col w-64 border-r border-border
          bg-sidebar transition-smooth
          md:relative md:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden md:border-r-0"}
        `}
        aria-label="Conversations sidebar"
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-3 py-3 border-b border-border shrink-0">
          <span className="font-display text-sm font-semibold text-foreground tracking-wide">
            Caffeine AI
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              data-ocid="new-chat-btn"
              onClick={onNewConversation}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
              aria-label="New chat"
            >
              <Plus size={15} />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth md:hidden"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Section label */}
        {conversations.length > 0 && (
          <div className="px-3 pt-3 pb-1">
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/40">
              Recent
            </p>
          </div>
        )}

        {/* Conversation list */}
        <nav className="flex-1 overflow-y-auto py-1 px-2 space-y-0.5">
          {conversations.length === 0 ? (
            <div
              data-ocid="sidebar-empty-state"
              className="flex flex-col items-center justify-center px-3 py-10 text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-muted/60 border border-border flex items-center justify-center mb-3">
                <MessageSquare size={18} className="text-muted-foreground/40" />
              </div>
              <p className="text-xs font-medium text-muted-foreground mb-1">
                No conversations yet
              </p>
              <p className="text-[10px] text-muted-foreground/50 leading-relaxed">
                Start a new chat to begin your first conversation
              </p>
              <button
                type="button"
                data-ocid="sidebar-new-chat-cta"
                onClick={onNewConversation}
                className="mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                  bg-primary/10 border border-primary/25 text-primary hover:bg-primary/20 transition-smooth"
              >
                <Plus size={12} />
                New chat
              </button>
            </div>
          ) : (
            conversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conv={conv}
                isActive={activeConversationId === conv.id}
                onSelect={onSelectConversation}
                onDelete={onDeleteConversation}
                onRename={onRenameConversation}
              />
            ))
          )}
        </nav>

        {/* Sidebar footer */}
        <div className="px-3 py-3 border-t border-border shrink-0">
          <p className="text-[10px] text-muted-foreground/40 text-center">
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-smooth"
            >
              Built with caffeine.ai
            </a>
          </p>
        </div>
      </aside>
    </>
  );
}
