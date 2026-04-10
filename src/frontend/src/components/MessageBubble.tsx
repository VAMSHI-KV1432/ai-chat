import { Bot, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { Message } from "../types/chat";

interface MessageBubbleProps {
  message: Message;
  onRetry?: () => void;
  isError?: boolean;
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MessageBubble({
  message,
  onRetry,
  isError,
}: MessageBubbleProps) {
  const [showTime, setShowTime] = useState(false);
  const isUser = message.role === "user";

  return (
    <div
      data-ocid={`message-${message.role}`}
      className={`flex items-end gap-3 message-enter ${isUser ? "flex-row-reverse" : "flex-row"}`}
      onMouseEnter={() => setShowTime(true)}
      onMouseLeave={() => setShowTime(false)}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
          <Bot size={14} className="text-primary" />
        </div>
      )}

      <div
        className={`flex flex-col gap-1 max-w-[78%] ${isUser ? "items-end" : "items-start"}`}
      >
        <div
          className={`
            px-4 py-2.5 text-sm leading-relaxed
            ${
              isUser
                ? "bg-secondary text-secondary-foreground rounded-2xl rounded-br-sm"
                : isError
                  ? "bg-destructive/10 border border-destructive/30 text-foreground rounded-2xl rounded-bl-sm"
                  : "bg-card border border-border text-foreground rounded-2xl rounded-bl-sm"
            }
          `}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>

          {isError && onRetry && (
            <button
              type="button"
              data-ocid="retry-btn"
              onClick={onRetry}
              className="mt-2 flex items-center gap-1.5 text-xs text-destructive hover:text-destructive/80 transition-smooth"
              aria-label="Retry message"
            >
              <RotateCcw size={11} />
              Retry
            </button>
          )}
        </div>

        <span
          className={`text-[10px] text-muted-foreground/50 px-1 transition-smooth ${
            showTime ? "opacity-100" : "opacity-0"
          }`}
          aria-label={`Sent at ${formatTime(message.timestamp)}`}
        >
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
