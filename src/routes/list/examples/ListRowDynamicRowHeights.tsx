import { cn } from "react-lib-tools";

// <begin>

import { type RowComponentProps } from "react-window";

type ChatMessage = {
  sender: string;
  text: string;
};

function RowComponent({
  index,
  messages,
  style
}: RowComponentProps<{
  messages: ChatMessage[];
}>) {
  const { sender, text } = messages[index];
  const isOutgoing = sender === "You";

  return (
    <div
      className={cn("flex flex-col px-2 py-1", {
        "items-end": isOutgoing,
        "items-start": !isOutgoing
      })}
      style={style}
    >
      <div className="text-xs opacity-50 px-1 pb-0.5">{sender}</div>
      <div
        className={cn("max-w-3/4 px-3 py-2 rounded-2xl", {
          "bg-sky-700 text-white rounded-br-sm": isOutgoing,
          "bg-white/10 rounded-bl-sm": !isOutgoing
        })}
      >
        {text}
      </div>
    </div>
  );
}

// <end>

export { RowComponent };
export type { ChatMessage };
