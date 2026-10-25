import { cn } from "react-lib-tools";

// <begin>

import { type RowComponentProps } from "react-window";

type ChatMessage = {
  sender: string;
  text: string;
};

type RowProps = {
  messages: ChatMessage[];
  typing: string[];
};

function RowComponent({
  index,
  messages,
  style,
  typing
}: RowComponentProps<RowProps>) {
  const isTypingIndicator = index >= messages.length;
  const sender = getSender(index, { messages, typing });
  const isOutgoing = sender === "You";

  // Consecutive rows from the same person share a single label
  const showSender =
    !isOutgoing &&
    (index === 0 || getSender(index - 1, { messages, typing }) !== sender);

  return (
    <div
      className={cn("flex flex-col px-2 py-0.5", {
        "items-end": isOutgoing,
        "items-start": !isOutgoing,
        "pt-2": showSender
      })}
      style={style}
    >
      {showSender && (
        <div className="text-xs opacity-50 px-1 pb-0.5">{sender}</div>
      )}
      <div
        className={cn("max-w-3/4 px-3 py-2 rounded-2xl", {
          "bg-sky-700 text-white rounded-br-sm": isOutgoing,
          "bg-white/10 rounded-bl-sm": !isOutgoing
        })}
      >
        {isTypingIndicator ? <TypingIndicator /> : messages[index].text}
      </div>
    </div>
  );
}

function getSender(index: number, { messages, typing }: RowProps) {
  return index < messages.length
    ? messages[index].sender
    : typing[index - messages.length];
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 h-6" aria-label="Typing">
      {[0, 150, 300].map((delay) => (
        <div
          className="size-2 rounded-full bg-current opacity-60 animate-bounce"
          key={delay}
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}

// <end>

export { RowComponent };
export type { ChatMessage };
