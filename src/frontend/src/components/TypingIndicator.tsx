import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div
      data-ocid="typing-indicator"
      className="flex items-end gap-3 message-enter"
      aria-live="polite"
      aria-label="AI is typing"
    >
      <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
        <Bot size={14} className="text-primary" />
      </div>
      <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary/50 motion-safe:animate-bounce"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: "0.9s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
