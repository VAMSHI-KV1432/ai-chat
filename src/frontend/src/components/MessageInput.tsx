import { ArrowUp, Loader2 } from "lucide-react";
import { useCallback, useRef } from "react";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (text: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function MessageInput({
  value,
  onChange,
  onSend,
  isLoading,
  disabled,
}: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
      e.target.style.height = "auto";
      e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
    },
    [onChange],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!value.trim() || isLoading || disabled) return;
      onSend(value);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    },
    [value, isLoading, disabled, onSend],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!value.trim() || isLoading || disabled) return;
        onSend(value);
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      }
    },
    [value, isLoading, disabled, onSend],
  );

  const canSend = value.trim().length > 0 && !isLoading && !disabled;

  return (
    <div className="shrink-0 border-t border-border bg-background px-4 py-3">
      <form
        data-ocid="chat-form"
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto flex items-end gap-2 bg-card border border-border rounded-2xl px-4 py-2 focus-within:border-primary/50 transition-smooth"
      >
        <textarea
          ref={textareaRef}
          data-ocid="chat-input"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything…"
          rows={1}
          disabled={disabled}
          className="flex-1 min-w-0 resize-none bg-transparent text-sm text-foreground
            placeholder:text-muted-foreground/50 focus:outline-none leading-relaxed
            py-1.5 max-h-40 disabled:opacity-50"
          aria-label="Message input"
        />
        <button
          type="submit"
          data-ocid="send-btn"
          disabled={!canSend}
          className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center
            bg-primary text-primary-foreground
            disabled:opacity-40 disabled:cursor-not-allowed
            hover:bg-primary/90 transition-smooth mb-0.5"
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <ArrowUp size={14} strokeWidth={2.5} />
          )}
        </button>
      </form>
      <p className="text-center text-[10px] text-muted-foreground/40 mt-2">
        Press <kbd className="font-mono">Enter</kbd> to send ·{" "}
        <kbd className="font-mono">Shift+Enter</kbd> for new line
      </p>
    </div>
  );
}
